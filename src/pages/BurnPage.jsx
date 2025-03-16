import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQubicConnect } from '../contexts/QubicConnectContext'
import { useHM25 } from '../contexts/HM25Context'
import FormHead from '../components/qubic/ui/FormHead'
import InputNumbers from '../components/qubic/ui/InputNumbers'
import ConfirmTxModal from '../components/qubic/connect/ConfirmTxModal'

function BurnPage() {
    const navigate = useNavigate()
    const { connected, toggleConnectModal } = useQubicConnect()
    const { burn, balance } = useHM25()
    const amountRef = useRef()
    const [amount, setAmount] = useState('')
    const [showConfirmModal, setShowConfirmModal] = useState(false)

    if (!connected) {
        return (
            <div className="mt-20 text-center text-white">
                Please connect your wallet.
                <button
                    onClick={toggleConnectModal}
                    className="bg-primary-40 text-black px-4 py-2 rounded ml-2"
                >
                    Unlock Wallet
                </button>
            </div>
        )
    }

    const handleValidate = () => amountRef.current.validate()
    const handleSubmit = async () => {
        if (!handleValidate()) return
        setShowConfirmModal(true)
    }
    const confirmBurn = async () => await burn(amount)
    const handleTransactionComplete = () => {
        setShowConfirmModal(false)
        navigate('/')
    }

    return (
        <div className="max-w-md mx-auto mt-[90px] text-white">
            <FormHead title="Burn Coins" onBack={() => navigate('/')} />
            <div className="space-y-4">
                <InputNumbers
                    id="burnAmount"
                    ref={amountRef}
                    labelComponent={<span className="text-white">Amount to Burn</span>}
                    minLimit={1}
                    onChange={setAmount}
                    placeholder="0"
                />
                <button
                    className="bg-primary-40 text-black w-full p-3 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
                    onClick={handleSubmit}
                    disabled={balance <= 0 || Number(amount) > Number(balance)}
                    title={balance <= 0 ? 'Insufficient balance.' : Number(amount) > Number(balance) ? 'Amount exceeds balance.' : ''}
                >
                    Burn
                </button>
            </div>
            <ConfirmTxModal
                open={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                tx={{ title: 'Burn Coins', amount }}
                onConfirm={confirmBurn}
                onTransactionComplete={handleTransactionComplete}
            />
        </div>
    )
}

export default BurnPage
