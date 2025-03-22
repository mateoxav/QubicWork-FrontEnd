import React, { createContext, useContext, useState, useEffect } from 'react'
const DEFAULT_HTTP_ENDPOINT = process.env.REACT_APP_HTTP_ENDPOINT || 'http://91.210.226.146'
const ConfigContext = createContext()
export const TICK_OFFSET = 5

export const ConfigProvider = ({ children }) => {
    const [httpEndpoint, setHttpEndpoint] = useState(DEFAULT_HTTP_ENDPOINT)
    const [connectedToCustomServer, setConnectedToCustomServer] = useState(false)

    useEffect(() => {
        // On mount, see if custom endpoints are saved
        const savedHttp = localStorage.getItem('httpEndpoint')
        if (savedHttp) {
            setHttpEndpoint(savedHttp)
            setConnectedToCustomServer(true)
        }
    }, [])

    const resetEndpoints = () => {
        setHttpEndpoint(DEFAULT_HTTP_ENDPOINT)
        setConnectedToCustomServer(false)
        localStorage.removeItem('httpEndpoint')
    }

    const updateEndpoints = (newHttpEndpoint) => {
        setHttpEndpoint(newHttpEndpoint)
        setConnectedToCustomServer(true)

        localStorage.setItem('httpEndpoint', newHttpEndpoint)
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
