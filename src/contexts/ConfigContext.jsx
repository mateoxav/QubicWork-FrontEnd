import React, { createContext, useContext, useState, useEffect } from 'react'
const DEFAULT_HTTP_ENDPOINT = 'https://rpc.qubic.org'
const ConfigContext = createContext()
export const TICK_OFFSET = 5

// [TODO] This file brought from Quottery, which needs backend server. We don't need it here. Remove it.
export const ConfigProvider = ({ children }) => {
    const [httpEndpoint, setHttpEndpoint] = useState(DEFAULT_HTTP_ENDPOINT)
    const [connectedToCustomServer, setConnectedToCustomServer] = useState(false)

    useEffect(() => {
        // On mount, see if custom endpoints are saved
        const savedHttp = localStorage.getItem('httpEndpoint')
        const savedBackend = localStorage.getItem('backendUrl')
        if (savedHttp && savedBackend) {
            setHttpEndpoint(savedHttp)
            setConnectedToCustomServer(true)
        }
    }, [])

    const resetEndpoints = () => {
        setHttpEndpoint(DEFAULT_HTTP_ENDPOINT)
        setConnectedToCustomServer(false)
        localStorage.removeItem('httpEndpoint')
        localStorage.removeItem('backendUrl')
    }

    const updateEndpoints = (newHttpEndpoint, newBackendUrl) => {
        setHttpEndpoint(newHttpEndpoint)
        setConnectedToCustomServer(true)

        localStorage.setItem('httpEndpoint', newHttpEndpoint)
        localStorage.setItem('backendUrl', newBackendUrl)
    }

    return (
        <ConfigContext.Provider value={{
            httpEndpoint,
            connectedToCustomServer,
            resetEndpoints,
            updateEndpoints,
        }}>
            {children}
        </ConfigContext.Provider>
    )
}

export const useConfig = () => useContext(ConfigContext)
