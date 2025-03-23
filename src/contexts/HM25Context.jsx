import React, { createContext, useContext, useState, useEffect, useReducer } from 'react';
import { QubicHelper } from '@qubic-lib/qubic-ts-library/dist/qubicHelper';
import { useConfig, TICK_OFFSET } from './ConfigContext';
import { useQubicConnect } from './QubicConnectContext';
import { fetchHM25Stats, buildEchoTx, buildBurnTx } from '../components/api/HM25Api';


const HM25Context = createContext();

const initialState = {
  stats: { numberOfEchoCalls: 0n, numberOfBurnCalls: 0n },
  loading: false,
  error: null,
};

function hm25Reducer(state, action) {
  switch (action.type) {
    case 'SET_STATS': return { ...state, stats: action.payload };
    case 'SET_LOADING': return { ...state, loading: action.payload };
    case 'SET_ERROR': return { ...state, error: action.payload };
    default: return state;
  }
}

export const HM25Provider = ({ children }) => {
  const [state, dispatch] = useReducer(hm25Reducer, initialState);
  const { httpEndpoint } = useConfig();
  const { wallet, connected, getTick, broadcastTx, signTransaction } = useQubicConnect();
  const [qHelper] = useState(() => new QubicHelper());
  const [balance, setBalance] = useState(null);
  const [walletPublicIdentity, setWalletPublicIdentity] = useState('');

  useEffect(() => {
    const initIdentityAndBalance = async () => {
      if (!wallet) {
        setWalletPublicIdentity('');
        setBalance(null);
        return;
      }

      if (wallet.connectType === 'walletconnect' || wallet.connectType === 'mmSnap') {
        if (wallet.publicKey) {
          setWalletPublicIdentity(wallet.publicKey);
          fetchBalance(wallet.publicKey);
        }
        return;
      }

      try {
        const idPackage = await qHelper.createIdPackage(wallet.privateKey || wallet);
        const identity = await qHelper.getIdentity(idPackage.publicKey);
        if (identity) {
          setWalletPublicIdentity(identity);
          fetchBalance(identity);
        }
      } catch (err) {
        console.error('Error derivando identidad pública:', err);
      }
    };

    initIdentityAndBalance();
  }, [wallet, qHelper]);

  useEffect(() => {
    if (!walletPublicIdentity) return;
    const intervalId = setInterval(() => fetchBalance(walletPublicIdentity), 300000);
    return () => clearInterval(intervalId);
  }, [walletPublicIdentity]);

  const fetchBalance = async (publicId) => {
    if (!httpEndpoint || !publicId) return;
    try {
      const res = await fetch(`${httpEndpoint}/v1/balances/${publicId}`, {
        headers: { accept: 'application/json' },
      });
      const data = await res.json();
      setBalance(data.balance.balance);
    } catch (error) {
      console.error('Error obteniendo balance:', error);
      dispatch({ type: 'SET_ERROR', payload: 'No se pudo obtener el balance' });
    }
  };

  const echo = async (amount) => {
    if (!connected || !wallet) return;
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const tick = await getTick();
      const unsignedTx = await buildEchoTx(qHelper, qHelper.getIdentityBytes(walletPublicIdentity), tick, amount);
      const finalTx = await signTransaction(unsignedTx);
      const result = await broadcastTx(finalTx);
      console.log('Echo TX result:', result);
      return { targetTick: tick + TICK_OFFSET, txResult: result };
    } catch (err) {
      console.error('Error en echo:', err);
      dispatch({ type: 'SET_ERROR', payload: 'Error al hacer echo de monedas' });
      throw err;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const burn = async (amount) => {
    if (!connected || !wallet) return;
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const tick = await getTick();
      const unsignedTx = await buildBurnTx(qHelper, qHelper.getIdentityBytes(walletPublicIdentity), tick, amount);
      const finalTx = await signTransaction(unsignedTx);
      const result = await broadcastTx(finalTx);
      console.log('Burn TX result:', result);
      return { targetTick: tick + TICK_OFFSET, txResult: result };
    } catch (err) {
      console.error('Error en burn:', err);
      dispatch({ type: 'SET_ERROR', payload: 'Error al quemar monedas' });
      throw err;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <HM25Context.Provider
      value={{
        state,
        balance,
        walletPublicIdentity,
        fetchBalance,
        echo,
        burn,
        loading: state.loading,
        error: state.error,
      }}
    >
      {children}
    </HM25Context.Provider>
  );
};

export const useHM25 = () => useContext(HM25Context);
