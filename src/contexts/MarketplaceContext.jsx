// src/contexts/MarketplaceContext.jsx
import React, { createContext, useContext, useReducer, useState, useEffect } from 'react'
import {
	buildCreateAgreementTx,
	buildAcceptAgreementTx,
	buildMakePaymentTx,
	buildConfirmDeliveryTx,
	queryAgreementDetails
} from '../components/api/MarketplaceApi'
import { QubicHelper } from '@qubic-lib/qubic-ts-library/dist/qubicHelper'
import { TICK_OFFSET, useConfig } from './ConfigContext'
import { useQubicConnect } from './QubicConnectContext'

const MarketplaceContext = createContext()

const initialState = {
	agreementDetails: null,
	loading: false,
	error: null,
}

function marketplaceReducer(state, action) {
	switch (action.type) {
		case 'SET_AGREEMENT_DETAILS':
			return { ...state, agreementDetails: action.payload }
		case 'SET_LOADING':
			return { ...state, loading: action.payload }
		case 'SET_ERROR':
			return { ...state, error: action.payload }
		default:
			return state
	}
}

export const MarketplaceProvider = ({ children }) => {
	const [state, dispatch] = useReducer(marketplaceReducer, initialState)
	const { httpEndpoint } = useConfig()
	const { wallet, connected, getTick, broadcastTx, signTransaction } = useQubicConnect()
	const [qHelper] = useState(() => new QubicHelper())
	const [walletPublicIdentity, setWalletPublicIdentity] = useState('')

	// Initialize wallet identity (similar al HM25Context)
	useEffect(() => {
		if (!wallet) {
			setWalletPublicIdentity('')
			return
		}
		if (wallet.connectType === 'walletconnect' || wallet.connectType === 'mmSnap') {
			if (wallet.publicKey) {
				setWalletPublicIdentity(wallet.publicKey)
			}
			return
		}
		const initIdentity = async () => {
			try {
				const idPackage = await qHelper.createIdPackage(wallet.privateKey || wallet)
				const identity = await qHelper.getIdentity(idPackage.publicKey)
				if (identity) {
					setWalletPublicIdentity(identity)
				}
			} catch (err) {
				console.error('Error initializing identity:', err)
			}
		}
		initIdentity()
	}, [wallet, qHelper])

	// Function to create an agreement (initializes the contract)
	const createAgreement = async (buyer, seller, amount, description, deadline) => {
		if (!connected || !wallet) return
		try {
			dispatch({ type: 'SET_LOADING', payload: true })
			const tick = await getTick()
			const unsignedTx = await buildCreateAgreementTx(
				qHelper,
				qHelper.getIdentityBytes(walletPublicIdentity),
				buyer,
				seller,
				amount,
				description,
				deadline,
				tick
			)
			const finalTx = await signTransaction(unsignedTx)
			const broadcastRes = await broadcastTx(finalTx)
			console.log('CreateAgreement TX result:', broadcastRes)
			return { targetTick: tick + TICK_OFFSET, txResult: broadcastRes }
		} catch (err) {
			console.error(err)
			dispatch({ type: 'SET_ERROR', payload: 'Failed to create agreement' })
			throw err
		} finally {
			dispatch({ type: 'SET_LOADING', payload: false })
		}
	}

	const acceptAgreement = async (agreementId) => {
		if (!connected || !wallet) return
		try {
			dispatch({ type: 'SET_LOADING', payload: true })
			const tick = await getTick()
			const unsignedTx = await buildAcceptAgreementTx(qHelper, qHelper.getIdentityBytes(walletPublicIdentity), agreementId, tick)
			const finalTx = await signTransaction(unsignedTx)
			const broadcastRes = await broadcastTx(finalTx)
			console.log('AcceptAgreement TX result:', broadcastRes)
			return { targetTick: tick + TICK_OFFSET, txResult: broadcastRes }
		} catch (err) {
			console.error(err)
			dispatch({ type: 'SET_ERROR', payload: 'Failed to accept agreement' })
			throw err
		} finally {
			dispatch({ type: 'SET_LOADING', payload: false })
		}
	}

	const makePayment = async (agreementId, paymentAmount) => {
		if (!connected || !wallet) return
		try {
			dispatch({ type: 'SET_LOADING', payload: true })
			const tick = await getTick()
			const unsignedTx = await buildMakePaymentTx(qHelper, qHelper.getIdentityBytes(walletPublicIdentity), agreementId, tick, paymentAmount)
			const finalTx = await signTransaction(unsignedTx)
			const broadcastRes = await broadcastTx(finalTx)
			console.log('MakePayment TX result:', broadcastRes)
			return { targetTick: tick + TICK_OFFSET, txResult: broadcastRes }
		} catch (err) {
			console.error(err)
			dispatch({ type: 'SET_ERROR', payload: 'Failed to make payment' })
			throw err
		} finally {
			dispatch({ type: 'SET_LOADING', payload: false })
		}
	}

	const confirmDelivery = async (agreementId) => {
		if (!connected || !wallet) return
		try {
			dispatch({ type: 'SET_LOADING', payload: true })
			const tick = await getTick()
			const unsignedTx = await buildConfirmDeliveryTx(qHelper, qHelper.getIdentityBytes(walletPublicIdentity), agreementId, tick)
			const finalTx = await signTransaction(unsignedTx)
			const broadcastRes = await broadcastTx(finalTx)
			console.log('ConfirmDelivery TX result:', broadcastRes)
			return { targetTick: tick + TICK_OFFSET, txResult: broadcastRes }
		} catch (err) {
			console.error(err)
			dispatch({ type: 'SET_ERROR', payload: 'Failed to confirm delivery' })
			throw err
		} finally {
			dispatch({ type: 'SET_LOADING', payload: false })
		}
	}

	const getAgreementDetails = async (agreementId) => {
		try {
			dispatch({ type: 'SET_LOADING', payload: true })
			const details = await queryAgreementDetails(httpEndpoint, agreementId)
			dispatch({ type: 'SET_AGREEMENT_DETAILS', payload: details })
			return details
		} catch (err) {
			console.error(err)
			dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch agreement details' })
			throw err
		} finally {
			dispatch({ type: 'SET_LOADING', payload: false })
		}
	}

	return (
		<MarketplaceContext.Provider value={{ state, createAgreement, acceptAgreement, makePayment, confirmDelivery, getAgreementDetails }}>
			{children}
		</MarketplaceContext.Provider>
	)
}

export const useMarketplace = () => useContext(MarketplaceContext)