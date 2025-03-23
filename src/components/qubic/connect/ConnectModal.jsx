import React, { useContext, useState } from "react"
import { QubicVault } from "@qubic-lib/qubic-ts-vault-library"
import Card from "../ui/Card"
import QubicConnectLogo from "../../../assets/qubic-connect.svg"
import CloseIcon from "../../../assets/close.svg"
import metamaskIcon from "../../../assets/metamask.svg"
import walletConnectIcon from "../../../assets/wallet-connect.svg"
import QRCode from "qrcode"
import { useQubicConnect } from "../../../contexts/QubicConnectContext"
import { useHM25 } from "../../../contexts/HM25Context"
import { truncateMiddle } from "../util"
import { useWalletConnectContext } from "../../../contexts/WalletConnectContext"
import { MetaMaskContext, MetamaskActions } from "../../../contexts/MetamaskContext"
import { useConfig } from "../../../contexts/ConfigContext"

const ConnectModal = ({ open, onClose }) => {
  const { connected, connect, disconnect } = useQubicConnect()
  const { walletPublicIdentity } = useHM25()
  const [mmState, mmDispatch, { connectSnap, getSnap }] = useContext(MetaMaskContext)
  const { connect: wcConnect, isConnected: wcIsConnected, requestAccounts, disconnect: wcDisconnect } = useWalletConnectContext()
  const { connectedToCustomServer, resetEndpoints, updateEndpoints } = useConfig()

  const [selectedMode, setSelectedMode] = useState("none")
  const [copied, setCopied] = useState(false)
  const [privateSeed, setPrivateSeed] = useState("")
  const [errorMsgSeed, setErrorMsgSeed] = useState("")
  const [vaultFile, setVaultFile] = useState(null)
  const [vaultPassword, setVaultPassword] = useState("")
  const [errorMsgVault, setErrorMsgVault] = useState("")
  const [wcUri, setWcUri] = useState("")
  const [wcQrCode, setWcQrCode] = useState("")
  const [httpEndpointInput, setHttpEndpointInput] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [vault] = useState(new QubicVault())

  const handleSeedChange = (value) => {
    setPrivateSeed(value)
    if (value.length !== 55) {
      setErrorMsgSeed("La seed debe tener 55 caracteres.")
    } else if (/[^a-z]/.test(value)) {
      setErrorMsgSeed("Solo se permiten letras minúsculas a-z.")
    } else {
      setErrorMsgSeed("")
    }
  }

  const connectPrivateSeed = () => {
    if (!errorMsgSeed && privateSeed.length === 55) {
      connect({ connectType: "privateKey", publicKey: "TEMP", privateKey: privateSeed })
      onClose()
    }
  }

  const handleVaultFileChange = (e) => {
    setVaultFile(e.target.files?.[0] || null)
  }

  const connectVaultFile = () => {
    if (!vaultFile || !vaultPassword) {
      setErrorMsgVault("Falta archivo o contraseña.")
      return
    }
    const fileReader = new FileReader()
    fileReader.onload = async () => {
      try {
        await vault.importAndUnlock(true, vaultPassword, null, vaultFile)
        const seeds = vault.getSeeds().filter(acc => !acc.isOnlyWatch)
        if (seeds.length === 0) {
          setErrorMsgVault("No hay seeds válidas.")
          return
        }
        const pkSeed = await vault.revealSeed(seeds[0].publicId)
        connect({ connectType: "vaultFile", publicKey: seeds[0].publicId, privateKey: pkSeed })
        onClose()
      } catch (err) {
        console.error(err)
        setErrorMsgVault("No se pudo desbloquear la bóveda.")
      }
    }
    fileReader.readAsArrayBuffer(vaultFile)
  }

  const connectMetamask = async () => {
    try {
      await connectSnap()
      const snap = await getSnap()
      mmDispatch({ type: MetamaskActions.SetInstalled, payload: snap })
      const pubId = await window.ethereum.request({
        method: "wallet_invokeSnap",
        params: {
          snapId: snap.id,
          request: {
            method: "getPublicId",
            params: { accountIdx: 0, confirm: true },
          },
        },
      })
      connect({ connectType: "mmSnap", publicKey: pubId })
      onClose()
    } catch (err) {
      console.error("MetaMask Snap error:", err)
      mmDispatch({ type: MetamaskActions.SetError, payload: err })
    }
  }

  const startWalletConnect = async () => {
    try {
      const { uri, approval } = await wcConnect()
      if (uri) {
        setWcUri(uri)
        const qrData = await QRCode.toDataURL(uri)
        setWcQrCode(qrData)
        await approval()
      }
    } catch (err) {
      console.error("WalletConnect error:", err)
    }
  }

  const connectWalletConnect = async () => {
    try {
      const accounts = await requestAccounts()
      if (!accounts.length) return
      connect({ connectType: "walletconnect", publicKey: accounts[0].address })
      onClose()
    } catch (err) {
      console.error(err)
    }
  }

  const connectCustomServer = () => {
    try {
      new URL(httpEndpointInput)
      updateEndpoints(httpEndpointInput)
      onClose()
      window.location.reload()
    } catch {
      setErrorMsg("URL inválida")
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <Card className="relative p-6 w-full max-w-md m-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <img src={QubicConnectLogo} alt="Qubic Connect" className="h-6" />
          <img src={CloseIcon} alt="Cerrar" className="w-5 h-5 cursor-pointer" onClick={onClose} />
        </div>

        {selectedMode === "none" && (
          <div className="space-y-4 text-white">
            {connected ? (
              <>
                <p className="text-sm">Conectado como:</p>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">{truncateMiddle(walletPublicIdentity, 40)}</span>
                  <button onClick={() => {
                    navigator.clipboard.writeText(walletPublicIdentity)
                    setCopied(true)
                    setTimeout(() => setCopied(false), 3000)
                  }}>
                    {copied ? "✔ Copiado" : "📋 Copiar"}
                  </button>
                </div>
                <button className="bg-red-500 p-2 rounded w-full" onClick={() => { disconnect(); onClose() }}>Bloquear Wallet</button>
              </>
            ) : (
              <>
                <button className="bg-yellow-300 text-black p-3 rounded w-full flex items-center gap-2" onClick={() => setSelectedMode("metamask")}> <img src={metamaskIcon} className="h-5" /> MetaMask Snap </button>
                <button className="bg-blue-500 p-3 rounded w-full flex items-center gap-2" onClick={() => { setSelectedMode("walletconnect"); startWalletConnect(); }}> <img src={walletConnectIcon} className="h-5" /> WalletConnect </button>
                <div className="text-xs text-gray-400 my-2 text-center">Otras opciones (avanzado)</div>
                <button className="bg-gray-700 p-2 rounded w-full" onClick={() => setSelectedMode("private-seed")}>Seed Privada</button>
                <button className="bg-gray-700 p-2 rounded w-full" onClick={() => setSelectedMode("vault-file")}>Archivo de Bóveda</button>
                <button className="bg-gray-700 p-2 rounded w-full" onClick={() => setSelectedMode("server-config")}>Configurar Servidor</button>
              </>
            )}
          </div>
        )}

        {selectedMode === "private-seed" && (
          <div className="space-y-4 text-white">
            <input className="w-full p-2 bg-gray-800 rounded" placeholder="Seed privada (55 caracteres)" value={privateSeed} onChange={(e) => handleSeedChange(e.target.value)} />
            {errorMsgSeed && <p className="text-red-400 text-sm">{errorMsgSeed}</p>}
            <div className="flex gap-4">
              <button className="flex-1 bg-gray-600 p-2 rounded" onClick={() => setSelectedMode("none")}>Cancelar</button>
              <button className="flex-1 bg-green-500 p-2 rounded" onClick={connectPrivateSeed} disabled={!!errorMsgSeed}>Desbloquear</button>
            </div>
          </div>
        )}

        {selectedMode === "vault-file" && (
          <div className="space-y-4 text-white">
            <input type="file" onChange={handleVaultFileChange} className="w-full" />
            <input type="password" placeholder="Contraseña" className="w-full p-2 bg-gray-800 rounded" value={vaultPassword} onChange={(e) => setVaultPassword(e.target.value)} />
            {errorMsgVault && <p className="text-red-400 text-sm">{errorMsgVault}</p>}
            <div className="flex gap-4">
              <button className="flex-1 bg-gray-600 p-2 rounded" onClick={() => setSelectedMode("none")}>Cancelar</button>
              <button className="flex-1 bg-green-500 p-2 rounded" onClick={connectVaultFile}>Desbloquear</button>
            </div>
          </div>
        )}

        {selectedMode === "metamask" && (
          <div className="space-y-4 text-white">
            <p>Conectar usando MetaMask Snap</p>
            <button className="w-full bg-yellow-400 text-black p-2 rounded" onClick={connectMetamask}>Conectar</button>
            <button className="w-full mt-2 bg-gray-600 p-2 rounded" onClick={() => setSelectedMode("none")}>Cancelar</button>
          </div>
        )}

        {selectedMode === "walletconnect" && (
          <div className="space-y-4 text-white">
            {wcQrCode && <img src={wcQrCode} alt="QR Code" className="mx-auto" />}
            {wcIsConnected && <button className="w-full bg-green-500 p-2 rounded" onClick={connectWalletConnect}>Continuar</button>}
            <button className="w-full mt-2 bg-gray-600 p-2 rounded" onClick={() => setSelectedMode("none")}>Cancelar</button>
          </div>
        )}

        {selectedMode === "server-config" && (
          <div className="space-y-4 text-white">
            {connectedToCustomServer ? (
              <button className="w-full bg-red-500 p-2 rounded" onClick={() => { resetEndpoints(); onClose(); window.location.reload(); }}>Desconectar servidor personalizado</button>
            ) : (
              <>
                <input className="w-full p-2 bg-gray-800 rounded" placeholder="http://mi-servidor:puerto" value={httpEndpointInput} onChange={(e) => setHttpEndpointInput(e.target.value)} />
                {errorMsg && <p className="text-red-400 text-sm">{errorMsg}</p>}
                <div className="flex gap-4">
                  <button className="flex-1 bg-gray-600 p-2 rounded" onClick={() => setSelectedMode("none")}>Cancelar</button>
                  <button className="flex-1 bg-green-500 p-2 rounded" onClick={connectCustomServer}>Conectar</button>
                </div>
              </>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}

export default ConnectModal