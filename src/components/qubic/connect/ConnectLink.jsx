import React from "react"
import lock from "../../../assets/lock.svg"
import unlocked from "../../../assets/unlocked.svg"
import ConnectModal from "./ConnectModal"
import {useQubicConnect} from "../../../contexts/QubicConnectContext"
import {useHM25} from "../../../contexts/HM25Context"
import {formatQubicAmount} from "../util"

const ConnectLink = () => {
    const {connected, showConnectModal, toggleConnectModal} = useQubicConnect()
    const {balance, fetchBalance, walletPublicIdentity} = useHM25()

    const handleBalanceClick = async (e) => {
        e.stopPropagation()
        if (walletPublicIdentity) {
            await fetchBalance(walletPublicIdentity)
        }
    }

    return (
        <>
            <div
                className="absolute right-12 sm:right-12 flex gap-2 items-center cursor-pointer"
                onClick={() => toggleConnectModal()}
            >
                {connected ? (
                    <>
                        {/* Desktop View */}
                        <div className="hidden md:block">
                            <div className="flex items-center gap-2 text-white">
                                <img src={lock} alt="Lock icon" className="w-5 h-5"/>
                                <span className="font-space text-[16px]">Lock Wallet</span>
                            </div>
                            {balance != null && (
                                <div
                                    className="text-white mt-1 text-sm cursor-pointer"
                                    onClick={handleBalanceClick}
                                    title="Click to refresh balance"
                                >
                                    Balance: {formatQubicAmount(balance)} QUBIC
                                </div>
                            )}
                        </div>

                        {/* Mobile View */}
                        <div className="md:hidden">
                            <img src={lock} alt="locked"/>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Desktop View */}
                        <span className="hidden md:block font-space text-[16px] text-white">
                            Unlock Wallet
                        </span>

                        {/* Mobile View */}
                        <img src={unlocked} alt="unlocked"/>
                    </>
                )}
            </div>

            <ConnectModal
                open={showConnectModal}
                onClose={() => toggleConnectModal()}
            />
        </>
    )
}

export default ConnectLink
