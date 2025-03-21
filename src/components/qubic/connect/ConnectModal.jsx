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
    const [selectedMode, setSelectedMode] = useState("none")

    // For the private-seed approach
    const [privateSeed, setPrivateSeed] = useState("")
    const [errorMsgSeed, setErrorMsgSeed] = useState("")

    // For the vault file approach
    const [vault] = useState(new QubicVault())
    const [vaultFile, setVaultFile] = useState(null)
    const [vaultPassword, setVaultPassword] = useState("")
    const [errorMsgVault, setErrorMsgVault] = useState("")
    const { connect, disconnect, connected } = useQubicConnect()
    const { walletPublicIdentity } = useHM25()
    const [copied, setCopied] = useState(false)

    // MetaMask
    const [mmState, mmDispatch, { connectSnap, getSnap }] = useContext(MetaMaskContext)

    // For wallet connect
    const { connect: wcConnect, isConnected: wcIsConnected, requestAccounts, disconnect: wcDisconnect } = useWalletConnectContext()
    const [wcUri, setWcUri] = useState("")
    const [wcQrCode, setWcQrCode] = useState("")
    const [wcIsConnecting, setWcIsConnecting] = useState(false)

    // Server configuration states
    const { httpEndpoint, connectedToCustomServer, resetEndpoints, updateEndpoints } = useConfig()
    const [httpEndpointInput, setHttpEndpointInput] = useState("")
    const [errorMsg, setErrorMsg] = useState("")

    // ---- Private Seed Approaches ----
    const handleSeedChange = (seed) => {
        setPrivateSeed(seed)
        if (seed.length !== 55) {
            setErrorMsgSeed("Seed must be 55 characters long")
        } else if (seed.match(/[^a-z]/)) {
            setErrorMsgSeed("Seed must contain only lowercase letters (a-z)")
        } else {
            setErrorMsgSeed("")
        }
    }

    const connectPrivateSeed = () => {
        if (!errorMsgSeed && privateSeed.length === 55) {
            connect({
                connectType: "privateKey",
                publicKey: "TEMPORARY_UNKNOWN",
                privateKey: privateSeed,
            })
            closeModal()
        }
    }

    // ---- Vault File Approaches ----
    const handleVaultFileChange = (event) => {
        setVaultFile(event.target.files?.[0] || null)
    }

    const connectVaultFile = () => {
        if (!vaultFile || !vaultPassword) {
            setErrorMsgVault("Please select a vault file and enter a password.")
            return
        }
        const fileReader = new FileReader()
        fileReader.onload = async () => {
            try {
                // Import & unlock the vault
                await vault.importAndUnlock(
                    true,
                    vaultPassword,
                    null,
                    vaultFile
                )
                const seeds = vault.getSeeds().filter((acc) => !acc.isOnlyWatch)
                if (seeds.length === 0) {
                    setErrorMsgVault("No valid seeds found in vault (only watch-only?).")
                    return
                }
                // Connect with the first seed
                const pkSeed = await vault.revealSeed(seeds[0].publicId)
                connect({
                    connectType: "vaultFile",
                    publicKey: seeds[0].publicId,
                    privateKey: pkSeed,
                })
                setSelectedVaultFileState()
                closeModal()
            } catch (err) {
                console.error("Error unlocking vault:", err)
                setErrorMsgVault("Failed to unlock the vault. Check your password or file.")
            }
        }
        fileReader.onerror = (err) => {
            console.error("Error reading file:", err)
            setErrorMsgVault("File reading error, please try again")
        }
        fileReader.readAsArrayBuffer(vaultFile)
    }

    const setSelectedVaultFileState = () => {
        setVaultFile(null)
        setVaultPassword("")
        setErrorMsgVault("")
        setSelectedMode("none")
    }

    const closeModal = () => {
        setSelectedMode("none")
        setErrorMsgSeed("")
        setErrorMsgVault("")
        setWcUri("")
        setWcQrCode("")
        setWcIsConnecting(false)
        onClose()
    }

    const handleCopyClick = () => {
        if (walletPublicIdentity) {
            console.log('Current wallet publicl identity: ',walletPublicIdentity)
            navigator.clipboard.writeText(walletPublicIdentity)
            setCopied(true)
            setTimeout(() => setCopied(false), 5000)
        }
    }

    // ---- MetaMask Snap Approach ----
    const connectMetamask = async (accountIdx = 0, confirm = false) => {
        // This triggers Snap install

        try {
            await connectSnap()
            const installedSnap = await getSnap()
            mmDispatch({ type: MetamaskActions.SetInstalled, payload: installedSnap })
            // Now get public ID from the snap
            const pubId = await window.ethereum.request({
                method: "wallet_invokeSnap",
                params: {
                    snapId: installedSnap?.id,
                    request: {
                        method: "getPublicId",
                        params: { accountIdx, confirm },
                    },
                },
            })
            connect({
                connectType: "mmSnap",
                publicKey: pubId,
            })
            closeModal()
        } catch (err) {
            console.error("Failed to connect metamask snap:", err)
            mmDispatch({ type: MetamaskActions.SetError, payload: err })
        }
    }

    // ---- WalletConnect Approach ----
    const startWalletConnect = async () => {
        setWcIsConnecting(true)
        try {
            const { uri, approval } = await wcConnect()
            if (uri) {
                console.log(uri)
                setWcUri(uri)
                try {
                    const qrData = await QRCode.toDataURL(uri)
                    setWcQrCode(qrData)
                } catch (qrErr) {
                    console.error("Failed to generate QR code:", qrErr)
                }
            } else {
                console.warn("[WC] No new URI returned. Possibly existing session")
            }
            setWcIsConnecting(false)
            await approval()
        } catch (err) {
            console.error("Failed walletconnect flow:", err)
            setWcIsConnecting(false)
        }
    }

    const connectWalletConnect = async () => {
        try {
            const accounts = await requestAccounts()
            if (!accounts || accounts.length === 0) {
                console.error("No accounts found from Qubic wallet")
                return
            }
            connect({
                connectType: "walletconnect",
                publicKey: accounts[0].address,
            })
            closeModal()
        } catch (err) {
            console.error("WC connect error:", err)
        }
    }

    return (
        <>
            {open && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                    onClick={closeModal}
                >
                    <Card
                        className="relative p-6 w-full max-w-md m-auto flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header with close button */}
                        <div className="flex justify-between items-center mb-4">
                            <img src={QubicConnectLogo} alt="Qubic Connect" className="h-6" />
                            <img src={CloseIcon} alt="Close" className="w-5 h-5 cursor-pointer" onClick={closeModal} />
                        </div>

                        {/* MAIN MODAL CONTENT */}
                        {selectedMode === "none" && (
                            <div className="space-y-4 text-white">
                                {connected && (
                                    <div className="space-y-4">
                                        <p className="font-bold">Connected as:</p>
                                        <div className="flex items-center space-x-2">
                                            <span className="font-mono">{truncateMiddle(walletPublicIdentity, 40)}</span>
                                            <button
                                                onClick={handleCopyClick}
                                                className="p-1 hover:bg-gray-600 rounded"
                                                title="Copy full address"
                                            >
                                                {copied ? (
                                            // check icon
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-5 w-5 text-green-400"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M16.707 5.293a1 1 0 010 1.414l-7.39 7.39a1 1 0 01-1.414 0l-3.29-3.29a1 1 0 011.414-1.414l2.583 2.583 6.683-6.683a1 1 0 011.414 0z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                ) : (
                                            // copy icon
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        width="1em"
                                                        height="1em"
                                                    >
                                                        <path
                                                            fill="currentColor"
                                                            d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2m0 16H8V7h11z"
                                                        />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                        <button
                                            className="bg-primary-40 text-black p-4 rounded-lg w-full"
                                        onClick={() => {
                                            disconnect()
                                            closeModal()
                                        }}
                                        >
                                            Lock Wallet
                                        </button>
                                    </div>
                                )}
                                {!connected && (
                                    <>
                                        <button
                                            className="bg-primary-40 text-black p-3 rounded-lg w-full flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                            onClick={() => setSelectedMode("metamask")}
                                        >
                                            <img src={metamaskIcon} alt="Metamask Icon" className="h-6 w-6" />
                                            Connect with MetaMask
                                        </button>
                                        <button
                                            className="bg-primary-40 text-black p-3 rounded-lg w-full flex items-center gap-2"
                                            onClick={() => {
                                                setSelectedMode("walletconnect")
                                                startWalletConnect()
                                            }}
                                        >
                                            <img src={walletConnectIcon} alt="WalletConnect Icon" className="h-6 w-6" />
                                            Connect with WalletConnect
                                        </button>
                                        <div className="my-4 flex w-full items-center justify-center">
                                            <div className="flex-grow border-t border-gray-500"></div>
                                            <span className="px-4 text-sm text-gray-300">OR ⚠️ DANGER ⚠️</span>
                                            <div className="flex-grow border-t border-gray-500"></div>
                                        </div>
                                        <button
                                            className="bg-primary-40 text-black p-3 rounded-lg w-full"
                                            onClick={() => setSelectedMode("private-seed")}
                                        >
                                            Private Seed
                                        </button>
                                        <button
                                            className="bg-primary-40 text-black p-3 rounded-lg w-full"
                                            onClick={() => setSelectedMode("vault-file")}
                                        >
                                            Vault File
                                        </button>
                                    </>
                                )}
                                <div className="my-16 mt-16 mb-16 flex w-full items-center justify-center">
                                    <div className="flex-grow border-t border-gray-500"></div>
                                    <span className="px-4 text-sm text-gray-300">Experimental️</span>
                                    <div className="flex-grow border-t border-gray-500"></div>
                                </div>
                                <div className="mt-4">
                                    <button
                                        className="bg-primary-40 p-3 rounded-lg w-full text-black"
                                        onClick={() => setSelectedMode("server-config")}
                                    >
                                        Connect to Server
                                    </button>
                                </div>
                            </div>
                        )}

                        {selectedMode === "private-seed" && (
                            <div className="text-white space-y-4">
                                <p>Enter your 55-char private seed:</p>
                                <input
                                    type="text"
                                    className="w-full p-3 bg-gray-700 rounded"
                                    value={privateSeed}
                                    onChange={(e) => handleSeedChange(e.target.value)}
                                />
                                {errorMsgSeed && <p className="text-red-500">{errorMsgSeed}</p>}
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <button
                                        className="bg-gray-600 p-3 rounded"
                                        onClick={() => setSelectedMode("none")}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="bg-primary-40 p-3 text-black rounded"
                                        onClick={connectPrivateSeed}
                                        disabled={!!errorMsgSeed}
                                    >
                                        Unlock
                                    </button>
                                </div>
                            </div>
                        )}

                        {selectedMode === "vault-file" && (
                            <div className="text-white space-y-4">
                                <p>Select your vault file</p>
                                <input
                                    type="file"
                                    onChange={handleVaultFileChange}
                                    className="w-full p-3 bg-gray-700 rounded"
                                />
                                <p>Enter vault password</p>
                                <input
                                    type="password"
                                    className="w-full p-3 bg-gray-700 rounded"
                                    value={vaultPassword}
                                    onChange={(e) => setVaultPassword(e.target.value)}
                                />
                                {errorMsgVault && <p className="text-red-500">{errorMsgVault}</p>}
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <button
                                        className="bg-gray-600 p-3 rounded"
                                        onClick={() => setSelectedVaultFileState()}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="bg-primary-40 p-3 text-black rounded"
                                        onClick={connectVaultFile}
                                    >
                                        Unlock
                                    </button>
                                </div>
                            </div>
                        )}

                        {selectedMode === "metamask" && (
                            <div className="text-white space-y-4">
                                <p>Connect via MetaMask Snap for Qubic</p>
                                <button
                                    className="bg-primary-40 p-3 text-black rounded w-full"
                                    onClick={() => connectMetamask()}
                                >
                                    Install/Use Qubic Snap
                                </button>
                                <button
                                    className="mt-2 bg-gray-600 p-3 rounded w-full"
                                    onClick={() => setSelectedMode("none")}
                                >
                                    Cancel
                                </button>
                            </div>
                        )}

                        {selectedMode === "walletconnect" && (
                            <div className="text-white space-y-4">
                                <p>Connect via Qubic Wallet (WalletConnect)</p>
                                {wcIsConnecting && (
                                    <p className="text-sm text-gray-400">
                                        Generating WalletConnect session...
                                    </p>
                                )}
                                {!wcIsConnecting && (
                                    <>
                                        {wcQrCode ? (
                                            <div className="w-full flex flex-col items-center">
                                                <img
                                                    src={wcQrCode}
                                                    alt="WalletConnect QR"
                                                    className="mx-auto mb-2"
                                                />
                                            </div>
                                        ) : (
                                            wcUri && (
                                                <p className="break-all text-sm">
                                                    URI: {wcUri}
                                                </p>
                                            )
                                        )}

                                        {wcIsConnected ? (
                                            <button
                                                className="bg-primary-40 p-3 text-black rounded w-full"
                                                onClick={connectWalletConnect}
                                            >
                                                Continue
                                            </button>
                                        ) : (
                                            <p className="text-sm text-gray-400">
                                                {
                                                    wcUri
                                                        ? ""
                                                        : "No new session. Possibly an existing session is active."
                                                }
                                            </p>
                                        )}
                                    </>
                                )}
                                <button
                                    className="mt-2 bg-gray-600 p-3 rounded w-full"
                                    onClick={() => setSelectedMode("none")}
                                >
                                    Cancel
                                </button>
                            </div>
                        )}

                        {selectedMode === "server-config" && (
                            <div className="text-white space-y-4">
                                <h3 className="text-xl font-bold">Server Configuration</h3>
                                {connectedToCustomServer ? (
                                    <button
                                        className="bg-primary-40 p-3 text-black rounded w-full"
                                        onClick={() => {
                                            resetEndpoints()
                                            setSelectedMode("none")
                                            onClose()
                                            window.location.reload()
                                        }}
                                    >
                                        Disconnect from Server
                                    </button>
                                ) : (
                                    <div>
                                        <label className="block mb-2">HTTP Endpoint:</label>
                                        <input
                                            type="text"
                                            className="w-full p-3 bg-gray-700 rounded"
                                            placeholder="Enter HTTP Endpoint"
                                            value={httpEndpointInput}
                                            onChange={(e) => setHttpEndpointInput(e.target.value)}
                                        />
                                        {errorMsg && <p className="text-red-500 mt-2">{errorMsg}</p>}
                                        <div className="grid grid-cols-2 gap-4 mt-4">
                                            <button
                                                className="bg-gray-600 p-3 rounded"
                                                onClick={() => setSelectedMode("none")}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                className="bg-primary-40 p-3 text-black rounded"
                                                onClick={() => {
                                                    if (!httpEndpointInput) {
                                                        setErrorMsg("Please enter an HTTP Endpoint.")
                                                        return
                                                    }
                                                    try {
                                                        new URL(httpEndpointInput)
                                                    } catch (_) {
                                                        setErrorMsg("Please enter a valid URL.")
                                                        return
                                                    }
                                                    updateEndpoints(httpEndpointInput)
                                                    setSelectedMode("none")
                                                    onClose()
                                                    window.location.reload()
                                                }}
                                            >
                                                Connect
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </Card>
                </div>
            )}
        </>
    )
}

export default ConnectModal
