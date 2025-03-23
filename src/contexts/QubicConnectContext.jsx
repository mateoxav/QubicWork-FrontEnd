// contexts/QubicConnectContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { QubicHelper } from '@qubic-lib/qubic-ts-library/dist/qubicHelper';
import Crypto, { SIGNATURE_LENGTH } from '@qubic-lib/qubic-ts-library/dist/crypto';
import { QubicTransaction } from '@qubic-lib/qubic-ts-library/dist/qubic-types/QubicTransaction';
import { toast } from 'react-hot-toast';            // para notificaciones
import { useConfig } from './ConfigContext';
import { WalletConnectProvider } from "./WalletConnectContext";
import { MetaMaskProvider, defaultSnapOrigin } from './MetamaskContext';

const QubicConnectContext = createContext(null);

export function QubicConnectProvider({ children }) {
  const [connected, setConnected] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [showConnectModal, setShowConnectModal] = useState(false);

  const { httpEndpoint } = useConfig();
  const wcCtx = useWalletConnectContext();  // contexto de WalletConnect

  const qHelper = new QubicHelper();        // helper de la librería Qubic

  // Al cargar, intentar restaurar una conexión guardada
  useEffect(() => {
    const saved = localStorage.getItem('wallet');
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      setWallet(parsed);
      setConnected(true);
    } catch {
      // Por retrocompatibilidad: si solo se guardó una seed en texto plano
      connect({ connectType: 'privateKey', privateKey: saved });
    }
  }, []);

  // Convierte un Uint8Array en base64 (utilidad interna)
  const uint8ArrayToBase64 = (arr) => {
    const binaryString = String.fromCharCode(...arr);
    return btoa(binaryString);
  };

  // Enviar transacción firmada al nodo HTTP configurado
  const broadcastTx = async (tx) => {
    if (!httpEndpoint) throw new Error('No hay endpoint HTTP configurado');
    const url = `${httpEndpoint}/v1/broadcast-transaction`;
    const body = { encodedTransaction: uint8ArrayToBase64(tx) };
    const res = await fetch(url, { method: 'POST', body: JSON.stringify(body) });
    if (!res.ok) throw new Error(`Error HTTP al enviar TX: ${res.status}`);
    return res.json();  // respuesta del nodo
  };

  // Obtener el tick actual del ledger (para construir transacciones)
  const getTick = async () => {
    const res = await fetch(`${httpEndpoint}/v1/tick-info`);
    const data = await res.json();
    const tick = data?.tickInfo?.tick;
    if (!tick) {
      console.warn('getTick: respuesta inválida');
      return 0;
    }
    return tick;
  };

  // Conectar wallet (guardar en estado y localStorage)
  const connect = (walletInfo) => {
    localStorage.setItem('wallet', JSON.stringify(walletInfo));
    setWallet(walletInfo);
    setConnected(true);
  };

  // Desconectar wallet
  const disconnect = () => {
    localStorage.removeItem('wallet');
    setWallet(null);
    setConnected(false);
    wcCtx.disconnect();  // Finalizar sesión de WalletConnect si existe
  };

  // Mostrar/ocultar modal de conexión
  const toggleConnectModal = () => {
    setShowConnectModal((prev) => !prev);
  };

  // Firmar transacción Qubic según el tipo de conexión actual
  const signTransaction = async (tx) => {
    if (!wallet || !wallet.connectType) {
      throw new Error("No hay wallet conectada para firmar.");
    }
    // Asegurarse de tener el formato Uint8Array correcto de la transacción
    let processedTx;
    if (tx instanceof QubicTransaction) {
      // Si es una transacción "sin construir", construirla con la clave privada (si la tenemos)
      processedTx = await tx.build(wallet.privateKey ?? "0".repeat(55));
    } else {
      // Si ya es Uint8Array
      processedTx = tx;
    }

    switch (wallet.connectType) {
      case "privateKey":
      case "vaultFile": {
        // Firma local con la clave privada usando SchnorrQ (lib Crypto de Qubic)
        const qCrypto = await Crypto;
        const idPackage = await qHelper.createIdPackage(wallet.privateKey);
        const digest = new Uint8Array(qHelper.DIGEST_LENGTH);
        const toSign = processedTx.slice(0, processedTx.length - SIGNATURE_LENGTH);
        qCrypto.K12(toSign, digest, qHelper.DIGEST_LENGTH);
        const signature = qCrypto.schnorrq.sign(idPackage.privateKey, idPackage.publicKey, digest);
        processedTx.set(signature, processedTx.length - SIGNATURE_LENGTH);
        return processedTx;
      }
      case "mmSnap": {
        // Firma a través del Snap de MetaMask (llamada a método del snap)
        const base64Tx = btoa(String.fromCharCode(...processedTx));
        const offset = processedTx.length - SIGNATURE_LENGTH;
        const signedResult = await window.ethereum.request({
          method: "wallet_invokeSnap",
          params: {
            snapId: defaultSnapOrigin,
            request: {
              method: "signTransaction",
              params: { base64Tx, accountIdx: 0, offset },
            },
          },
        });
        // Reemplazar la porción de firma dentro de processedTx con la firma recibida
        const binary = atob(signedResult.signedTx);
        const signature = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          signature[i] = binary.charCodeAt(i);
        }
        processedTx.set(signature, offset);
        return processedTx;
      }
      case "walletconnect": {
        // Firma mediante WalletConnect (solicitando a la Qubic Wallet móvil)
        toast("Por favor, firma la transacción en tu Qubic Wallet 🔑");
        // Decodificar la transacción para extraer datos legibles
        const decodedTx = qHelper.decodeUint8ArrayTx(processedTx);
        const [from, to] = await Promise.all([
          qHelper.getIdentity(decodedTx.sourcePublicKey.getIdentity()),
          qHelper.getIdentity(decodedTx.destinationPublicKey.getIdentity())
        ]);
        const payloadBase64 = decodedTx.payload 
          ? uint8ArrayToBase64(decodedTx.payload.getPackageData()) 
          : null;
        // Solicitar firma vía WalletConnect context
        const wcResult = await wcCtx.signTransaction({
          from,
          to,
          amount: Number(decodedTx.amount.getNumber()),
          tick: decodedTx.tick,
          inputType: decodedTx.inputType,
          payload: payloadBase64 === "" ? null : payloadBase64
        });
        // La wallet devuelve la transacción firmada en base64; convertir a Uint8Array
        return new Uint8Array(atob(wcResult.signedTransaction).split('').map(c => c.charCodeAt(0)));
      }
      default:
        throw new Error(`Tipo de conexión no soportado: ${wallet.connectType}`);
    }
  };

  return (
    <QubicConnectContext.Provider value={{
      wallet, connected, showConnectModal,
      connect, disconnect, toggleConnectModal,
      signTransaction, getTick, broadcastTx
    }}>
      {children}
    </QubicConnectContext.Provider>
  );
}

// Hook para consumir el contexto Qubic
export const useQubicConnect = () => useContext(QubicConnectContext);

// Combinación de providers de MetaMask + WalletConnect + QubicConnect
export function QubicConnectCombinedProvider({ children }) {
  return (
    <MetaMaskProvider>
      <WalletConnectProvider>
        <QubicConnectProvider>{children}</QubicConnectProvider>
      </WalletConnectProvider>
    </MetaMaskProvider>
  );
}
