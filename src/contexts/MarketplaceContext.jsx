// src/contexts/MarketplaceContext.jsx
import React, { createContext, useContext, useReducer, useState, useEffect } from 'react';
import { useQubicConnect } from './QubicConnectContext';
import { useConfig } from './ConfigContext'; // Asegúrate de que esta ruta sea correcta
import QubicHelper from '../utils/QubicHelper'; // Asegúrate de que esta ruta sea correcta
import { buildCreateAgreementTx } from '../utils/transactionBuilders'; // Asegúrate de que esta ruta sea correcta

const MarketplaceContext = createContext();

const initialState = {
    agreementDetails: null,
    loading: false,
    error: null,
};

function marketplaceReducer(state, action) {
    switch (action.type) {
        case 'SET_AGREEMENT_DETAILS':
            return { ...state, agreementDetails: action.payload };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        default:
            return state;
    }
}

export const MarketplaceProvider = ({ children }) => {
    const [state, dispatch] = useReducer(marketplaceReducer, initialState);
    const { httpEndpoint } = useConfig();
    const { wallet, connected, getTick, broadcastTx, signTransaction } = useQubicConnect();
    const [qHelper] = useState(() => new QubicHelper());
    const [walletPublicIdentity, setWalletPublicIdentity] = useState('');

    // Initialize wallet identity (similar al HM25Context)
    useEffect(() => {
        if (!wallet) {
            setWalletPublicIdentity('');
            return;
        }
        
        // Simplificado para evitar errores
        if (wallet.publicKey) {
            setWalletPublicIdentity(wallet.publicKey);
        }
        
    }, [wallet, qHelper]);

    // Function to create an agreement (initializes the contract)
    const createAgreement = async (buyer, seller, amount, description, deadline) => {
        if (!connected || !wallet) {
            throw new Error("Wallet not connected");
        }
        
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            
            console.log("Creating agreement with parameters:", { buyer, seller, amount, description, deadline });
            
            // Obtener el tick actual
            const tick = await getTick();
            console.log("Current tick:", tick);
            
            // Crear la transacción no firmada (función buildCreateAgreementTx debe existir en tus utilidades)
            // Si no existe, habría que implementarla o usar una alternativa
            const unsignedTx = {
                type: "createAgreement",
                buyer,
                seller,
                amount,
                description,
                deadline,
                tick
            };
            
            console.log("Unsigned transaction created:", unsignedTx);
            
            // Simular firma (esto se debe adaptar según tu implementación real)
            console.log("Signing transaction...");
            const finalTx = unsignedTx; // En tu caso, aquí iría await signTransaction(unsignedTx)
            
            console.log("Transaction signed, broadcasting...");
            // Simular broadcast (adaptar según implementación real)
            // const broadcastRes = await broadcastTx(finalTx);
            
            // Simular resultado exitoso para que la UI funcione
            return {
                success: true,
                txResult: {
                    id: "mock-tx-" + Date.now(),
                    status: "PENDING"
                },
                targetTick: tick + 10 // Simular tick objetivo
            };
            
        } catch (err) {
            console.error("Error creating agreement:", err);
            dispatch({ type: 'SET_ERROR', payload: err.message });
            throw err;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    // Versiones simplificadas de otras funciones para que no den error
    const acceptAgreement = async (agreementId) => {
        console.log("Accepting agreement:", agreementId);
        return { success: true };
    };

    const makePayment = async (agreementId, paymentAmount) => {
        console.log("Making payment for agreement:", agreementId, "Amount:", paymentAmount);
        return { success: true };
    };

    const confirmDelivery = async (agreementId) => {
        console.log("Confirming delivery for agreement:", agreementId);
        return { success: true };
    };

    const getAgreementDetails = async (agreementId) => {
        console.log("Getting details for agreement:", agreementId);
        return { status: "ACTIVE", amount: 100 };
    };

    return (
        <MarketplaceContext.Provider 
            value={{ 
                state, 
                createAgreement, 
                acceptAgreement, 
                makePayment, 
                confirmDelivery, 
                getAgreementDetails 
            }}
        >
            {children}
        </MarketplaceContext.Provider>
    );
};

export const useMarketplace = () => {
    const context = useContext(MarketplaceContext);
    if (!context) {
        throw new Error('useMarketplace must be used within a MarketplaceProvider');
    }
    return context;
};