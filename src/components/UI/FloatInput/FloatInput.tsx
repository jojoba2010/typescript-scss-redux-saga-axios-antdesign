import React, { useState } from 'react'
import classNames from 'classnames'
import styles from './index.scss'

export type InputProps = {
    label: string
    placeholder: string
    className?: string
    defaultValue?: any
    value: any
    children: any
    required: boolean
    isFloat?: boolean
    isBlock?: boolean
    disabled?: boolean
}

const FloatInput = (props: InputProps) => {
    const {
        placeholder,
        children,
        label,
        value,
        isFloat = true,
        isBlock = false,
        defaultValue = undefined,
        className = '',
        disabled = false
    } = props
    const [focus, setFocus] = useState(false)
    const isOccupied = React.useMemo(() => {
        return focus || (value && value.length !== 0) || (defaultValue && defaultValue.length !== 0)
    }, [focus, value, defaultValue])

    const labelClass = isOccupied
        ? `${styles['label']} ${styles['as-label']}`
        : `${styles['label']} ${styles['as-placeholder']}`
    return (
        <div
            className={classNames(
                `${styles.input} ${className}`,
                { [styles['input__block']]: isBlock },
                { [styles['as-disabled']]: disabled }
            )}
            onBlur={() => setFocus(false)}
            onFocus={() => setFocus(true)}
        >
            {children}
            {isFloat && label && <label className={labelClass}>{isOccupied ? label : placeholder || label}</label>}
        </div>
    )
}

export default FloatInput
