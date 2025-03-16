import { useEffect, useState } from 'react'
import Card from '../ui/Card'
import { useQubicConnect } from '../../../contexts/QubicConnectContext'
import { useHM25 } from '../../../contexts/HM25Context'
import { TICK_OFFSET } from '../../../contexts/ConfigContext'

const ConfirmTxModal = ({ tx, open, onClose, onConfirm, onTransactionComplete }) => {
    const { getTick } = useQubicConnect()
    const [confirmedTx, setConfirmedTx] = useState(null)
    const [initialTick, setInitialTick] = useState(null)
    const [tick, setTick] = useState(null)
    const { balance, fetchBalance, walletPublicIdentity } = useHM25()

    const refetchInterval = 3000

    useEffect(() => {
        if (open && walletPublicIdentity) {
            fetchBalance(walletPublicIdentity)
        }
    }, [open, walletPublicIdentity])

    useEffect(() => {
        let intervalId
        const fetchTick = async () => {
            const t = await getTick()
            setTick(t)
        }
        if (confirmedTx) {
            fetchTick()
            intervalId = setInterval(fetchTick, refetchInterval)
        }
        return () => clearInterval(intervalId)
    }, [confirmedTx])

    useEffect(() => {
        if (tick !== null && confirmedTx !== null && initialTick !== null) {
            const targetTick = confirmedTx.targetTick
            const normalizedTick = ((tick - initialTick) / (targetTick - initialTick)) * 100
            const widthPercentage = Math.min(Math.max(normalizedTick, 0), 100)
            if (widthPercentage >= 100) {
                onTransactionComplete()
                onClose()
            }
        }
    }, [tick, confirmedTx, initialTick])

    const startTickFetchInterval = async (cTx) => {
        cTx.targetTick = cTx.targetTick + TICK_OFFSET
        const initialTickValue = await getTick()
        setInitialTick(initialTickValue)
        setConfirmedTx(cTx)
    }

    const hasSufficientBalance = balance !== null && Number(balance) >= Number(tx.amount)

    return (
        <>
            {open && (
                <div
                    className="w-full p-5 h-full fixed top-0 left-0 overflow-x-hidden overflow-y-auto z-50 bg-smoke-light flex"
                    onClick={onClose}
                >
                    <Card className="relative p-8 w-full max-w-md m-auto flex-col flex" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center">
                            <div className="text-2xl text-white">HM25 <span className="text-primary-40">Transaction</span></div>
                            <button onClick={onClose} className="text-2xl text-white">X</button>
                        </div>
                        <div className="flex flex-col gap-4 mt-4">
                            {confirmedTx && (
                                <>
                                    <p className="text-white">Current Tick: {tick} / {confirmedTx.targetTick}</p>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                        <div
                                            className="bg-blue-600 h-2.5 rounded-full"
                                            style={{
                                                width: tick
                                                    ? `${Math.min(Math.max(((tick - initialTick) / (confirmedTx.targetTick - initialTick)) * 100, 0), 100)}%`
                                                    : '0%',
                                            }}
                                        ></div>
                                    </div>
                                </>
                            )}
                            {!hasSufficientBalance && (
                                <p className="text-red-500">Insufficient balance to complete this transaction.</p>
                            )}
                            {!confirmedTx && (
                                <>
                                    <p className="text-white">Action: {tx.title}</p>
                                    <p className="text-white">Amount: {tx.amount} QUBIC</p>
                                    <button
                                        className="bg-primary-40 p-4 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed text-black"
                                        onClick={async () => {
                                            const confirmed = await onConfirm()
                                            startTickFetchInterval(confirmed)
                                        }}
                                        disabled={!hasSufficientBalance}
                                    >
                                        Confirm
                                    </button>
                                </>
                            )}
                            <button className="bg-gray-50 p-4 rounded-lg" onClick={onClose}>
                                Close
                            </button>
                        </div>
                    </Card>
                </div>
            )}
        </>
    )
}

export default ConfirmTxModal
