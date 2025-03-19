import React, { createContext, useContext, useEffect, useReducer, useState } from 'react'
import { fetchHM25Stats, buildEchoTx, buildBurnTx } from '../components/api/HM25Api'
import { QubicHelper } from '@qubic-lib/qubic-ts-library/dist/qubicHelper'
import { TICK_OFFSET, useConfig } from './ConfigContext'
import { useQubicConnect } from './QubicConnectContext'

const HM25Context = createContext()

const initialState = {
    stats: { numberOfEchoCalls: 0n, numberOfBurnCalls: 0n },
    loading: false,
    error: null,
}

function hm25Reducer(state, action) {
    switch (action.type) {
        case 'SET_STATS':
            return { ...state, stats: action.payload }
        case 'SET_LOADING':
            return { ...state, loading: action.payload }
        case 'SET_ERROR':
            return { ...state, error: action.payload }
        default:
            return state
    }
}

export const HM25Provider = ({ children }) => {
    const [state, dispatch] = useReducer(hm25Reducer, initialState)
    const { httpEndpoint } = useConfig()
    const { wallet, connected, getTick, broadcastTx, signTransaction } = useQubicConnect()
    const [qHelper] = useState(() => new QubicHelper())
    const [balance, setBalance] = useState(null)
    const [walletPublicIdentity, setWalletPublicIdentity] = useState('')

    useEffect(() => {
        if (!httpEndpoint) return
        const fetchStats = async () => {
            try {
                dispatch({ type: 'SET_LOADING', payload: true })
                const stats = await fetchHM25Stats(httpEndpoint)
                dispatch({ type: 'SET_STATS', payload: stats })
            } catch (err) {
                console.error(err)
                dispatch({ type: 'SET_ERROR', payload: 'Failed to load stats' })
            } finally {
                dispatch({ type: 'SET_LOADING', payload: false })
            }
        }
        fetchStats() // Fetch immediately on mount or httpEndpoint change
        const intervalId = setInterval(fetchStats, 5000) // Fetch every 5 seconds
        return () => clearInterval(intervalId) // Cleanup interval on unmount or httpEndpoint change
    }, [httpEndpoint])

    useEffect(() => {
        const initIdentityAndBalance = async () => {
            if (!wallet) {
                setWalletPublicIdentity('')
                setBalance(null)
                return
            }
            if (wallet.connectType === 'walletconnect' || wallet.connectType === 'mmSnap') {
                if (wallet.publicKey) {
                    setWalletPublicIdentity(wallet.publicKey)
                    fetchBalance(wallet.publicKey)
                }
                return
            }
            try {
                const idPackage = await qHelper.createIdPackage(wallet.privateKey || wallet)
                const identity = await qHelper.getIdentity(idPackage.publicKey)
                if (identity) {
                    setWalletPublicIdentity(identity)
                    fetchBalance(identity)
                }
            } catch (err) {
                console.error('Error initializing identity:', err)
            }
        }
        initIdentityAndBalance()
    }, [wallet])

    useEffect(() => {
        let intervalId
        if (walletPublicIdentity) {
            intervalId = setInterval(() => fetchBalance(walletPublicIdentity), 300000) // 5 minutes
        }
        return () => clearInterval(intervalId)
    }, [walletPublicIdentity])

    const fetchBalance = async (publicId) => {
        if (!httpEndpoint || !publicId) return
        try {
            const response = await fetch(`${httpEndpoint}/v1/balances/${publicId}`, {
                headers: { accept: 'application/json' },
            })
            const data = await response.json()
            setBalance(data.balance.balance)
        } catch (error) {
            console.error('Error fetching balance:', error)
            dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch balance' })
        }
    }

    const echo = async (amount) => {
        if (!connected || !wallet) return
        try {
            dispatch({ type: 'SET_LOADING', payload: true })
            const tick = await getTick()
            const unsignedTx = await buildEchoTx(qHelper, qHelper.getIdentityBytes(walletPublicIdentity), tick, amount)
            const finalTx = await signTransaction(unsignedTx)
            const broadcastRes = await broadcastTx(finalTx)
            console.log('Echo TX result:', broadcastRes)
            return { targetTick: tick + TICK_OFFSET, txResult: broadcastRes }
        } catch (err) {
            console.error(err)
            dispatch({ type: 'SET_ERROR', payload: 'Failed to echo coins' })
            throw err
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false })
        }
    }

    const burn = async (amount) => {
        if (!connected || !wallet) return
        try {
            dispatch({ type: 'SET_LOADING', payload: true })
            const tick = await getTick()
            const unsignedTx = await buildBurnTx(qHelper, qHelper.getIdentityBytes(walletPublicIdentity), tick, amount)
            const finalTx = await signTransaction(unsignedTx)
            const broadcastRes = await broadcastTx(finalTx)
            console.log('Burn TX result:', broadcastRes)
            return { targetTick: tick + TICK_OFFSET, txResult: broadcastRes }
        } catch (err) {
            console.error(err)
            dispatch({ type: 'SET_ERROR', payload: 'Failed to burn coins' })
            throw err
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false })
        }
    }

    return (
        <HM25Context.Provider value={{ state, echo, burn, balance, walletPublicIdentity, fetchBalance }}>
            {children}
        </HM25Context.Provider>
    )
}

export const useHM25 = () => useContext(HM25Context)
