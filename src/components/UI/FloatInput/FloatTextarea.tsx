import React, { useState } from 'react'
import classNames from 'classnames'
import styles from './index.scss'

export type InputProps = {
    label: string
    placeholder: string
    value: any
    defaultValue: any
    children: any
    required: boolean
    isFloat?: boolean
    isBlock?: boolean
}

const FloatInput = (props: InputProps) => {
    const [focus, setFocus] = useState(false)
    let { placeholder } = props
    const { children, label, value, isFloat = true, isBlock = false, defaultValue } = props

    if (!placeholder) placeholder = label

    const isOccupied =
        focus ||
        (value && typeof value !== 'number' && value.length !== 0) ||
        (defaultValue && typeof defaultValue !== 'number' && defaultValue.length !== 0)

    const labelClass = isOccupied
        ? `${styles['label']} ${styles['as-label']}`
        : `${styles['label']} ${styles['as-placeholder']}`

    return (
        <div
            className={classNames(`${styles.input} ${styles.textarea}`, { [styles['input__block']]: isBlock })}
            onBlur={() => setFocus(false)}
            onFocus={() => setFocus(true)}
        >
            {children}
            {isFloat && label && <label className={labelClass}>{isOccupied ? label : placeholder}</label>}
        </div>
    )
}

export default FloatInput
