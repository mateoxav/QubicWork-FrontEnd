import React, { createContext, useContext, useEffect, useState } from "react"
import SignClient from "@walletconnect/sign-client"
import { toast } from "react-hot-toast"

const WalletConnectContext = createContext(null)

export function WalletConnectProvider({ children }) {
  const [signClient, setSignClient] = useState(null)
  const [sessionTopic, setSessionTopic] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  const WC_PROJECT_ID = "2d3b11ae82b87043a64c8abd87f865c8"
  const QUBIC_CHAIN_ID = "qubic:mainnet"

  useEffect(() => {
    const init = async () => {
      try {
        const client = await SignClient.init({
          projectId: WC_PROJECT_ID,
          metadata: {
            name: "Qubic DApp",
            description: "Qubic WalletConnect Integration",
            url: window.location.origin,
            icons: ["https://walletconnect.com/walletconnect-logo.png"],
          },
        })
        setSignClient(client)

        const storedTopic = localStorage.getItem("wcSessionTopic")
        if (storedTopic) {
          try {
            const existingSession = client.session.get(storedTopic)
            if (existingSession) {
              setSessionTopic(storedTopic)
              setIsConnected(true)
            }
          } catch (err) {
            localStorage.removeItem("wcSessionTopic")
          }
        }
      } catch (err) {
        console.error("WalletConnect init error:", err)
        toast.error("Error initializing WalletConnect")
      }
    }

    init()
  }, [])

  const connect = async () => {
    if (!signClient) throw new Error("WalletConnect not initialized")
    
    try {
      setIsConnecting(true)
      const { uri, approval } = await signClient.connect({
        requiredNamespaces: {
          qubic: {
            methods: ["qubic_getAccounts", "qubic_signTransaction"],
            chains: [QUBIC_CHAIN_ID],
            events: [],
          },
        },
      })
      return { uri, approval }
    } catch (err) {
      console.error("WalletConnect connect error:", err)
      throw err
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = async () => {
    if (sessionTopic) {
      await signClient?.disconnect({
        topic: sessionTopic,
        reason: { code: 6000, message: "User disconnected" },
      })
    }
    setSessionTopic("")
    setIsConnected(false)
    localStorage.removeItem("wcSessionTopic")
  }

  const value = {
    signClient,
    sessionTopic,
    isConnecting,
    isConnected,
    connect,
    disconnect
  }

  return (
    <WalletConnectContext.Provider value={value}>
      {children}
    </WalletConnectContext.Provider>
  )
}

export function useWalletConnectContext() {
  const context = useContext(WalletConnectContext)
  if (!context) {
    throw new Error("useWalletConnectContext must be used within WalletConnectProvider")
  }
  return context
}