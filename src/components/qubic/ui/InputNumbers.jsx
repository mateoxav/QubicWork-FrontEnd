import React, {forwardRef, useImperativeHandle, useState} from 'react'
import {formatQubicAmount} from "../util"

const InputNumbers = forwardRef(({
                                         id,
                                         labelComponent,
                                         placeholder,
                                         minLimit = 0,
                                         maxLimit = Infinity,
                                         onChange
                                     }, ref) => {
    const [value, setValue] = useState('')
    const [error, setError] = useState('')

    const handleChange = (e) => {
        const newValue = e.target.value

        const regEx = /^[0-9]*$/

        if (regEx.test(newValue)) {
            setValue(newValue)
            onChange(newValue)

            if (newValue === '') {
                setError('')
            } else {
                const numericValue = Number(newValue)
                if (numericValue < minLimit) {
                    setError(`Value must be greater than or equal to ${formatQubicAmount(minLimit)}`)
                } else if (numericValue > maxLimit) {
                    setError(`Value must be less than or equal to ${formatQubicAmount(maxLimit)}`)
                } else {
                    setError('')
                }
            }
        } else {
            setError('Invalid input')
        }
    }

    useImperativeHandle(ref, () => ({
        validate: () => {
            if (value === '') {
                setError('This field is required')
                return false
            }
            const numericValue = Number(value)
            if (numericValue < minLimit) {
                setError(`Value must be greater than or equal to ${formatQubicAmount(minLimit)}`)
                return false
            }
            if (numericValue > maxLimit) {
                setError(`Value must be less than or equal to ${formatQubicAmount(maxLimit)}`)
                return false
            }
            setError('')
            return true
        }
    }))

    return (
        <div>
            {labelComponent}
            <input
                id={id}
                type="text"  // change to "text" to prevent "e" input, while using regex for validation
                className={`w-full p-4 bg-gray-80 border border-gray-70 text-white rounded-lg placeholder-gray-500 ${error && 'border-red-500'}`}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
            />
            {/*{value && <p>Formatted: {formatQubicAmount(value)}</p>}*/}
            {error && <p className="text-red-500 text-right">{error}</p>}
        </div>
    );
});

export default InputNumbers;
