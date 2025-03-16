import React, { useState } from "react"

const CopyButton = ({ textToCopy }) => {
    const [copied, setCopied] = useState(false)

    const handleCopyClick = () => {
        navigator.clipboard.writeText(textToCopy)
        setCopied(true)
        setTimeout(() => setCopied(false), 5000)
    }

    return (
        <button
            onClick={handleCopyClick}
            className="p-1 hover:bg-gray-600 rounded"
            title="Copy full address"
        >
            {copied ? (
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
                // Copy icon SVG
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="1em"
                    height="1em"
                >
                    <path
                        fill="currentColor"
                        d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2m0 16H8V7h11z"
                    ></path>
                </svg>
            )}
        </button>
    )
}

export default CopyButton
