import React, { ReactNode } from 'react'
import cx from 'classnames'
import Input from '@UI/antd/Input/Input'
import Form from 'antd/lib/form'
import styles from './index.scss'
// rules can be including:
// 1- { whitespace: true }
// 2- { min: 3 }
// 3- { max: 10 }
// 4- { required: true, message: 'Please enter your name' }
type IProps = {
    addonBefore?: React.ReactNode
    defaultValue?: string
    onClick?: any
    type?: string
    label?: string
    name: string | [number, string]
    onChange?: any
    required?: boolean
    requiredMsg?: string
    rules?: any
    placeholder?: string
    hasFeedback?: boolean
    suffix?: ReactNode
    className?: string
    wrapperClassName?: string
    onBlur?: any
    lowercase?: boolean
    regex?: {
        pattern: any
        msg?: string
    }
    validateTrigger?: string | string[]
    disabled?: boolean
    readOnly?: boolean
    help?: string
    autoComplete?: string
    theme?: 'round-theme' | ''
    length?: number[]
}
const InputField = (props: IProps) => {
    const {
        length = [],
        label = '',
        name,
        onChange = undefined,
        required = false,
        requiredMsg = '',
        rules = [],
        placeholder = '',
        hasFeedback = true,
        suffix = null,
        className = '',
        wrapperClassName = '',
        onBlur = undefined,
        regex = null,
        validateTrigger = 'onChange',
        disabled = false,
        help = '',
        lowercase = false,
        readOnly = false,
        theme = '',
        ...rest
    } = props
    const fieldRules = []
    if (required) {
        fieldRules.push({
            required: required,
            message: requiredMsg || `Please enter the ${name}`
        })
    }
    if (length.length) {
        fieldRules.push({
            min: length[0],
            message: `${label} must be at least ${length[0]} characters long.`
        })
        if (length.length > 1) {
            fieldRules.push({
                max: length[1],
                message: `${label} must not exceed ${length[1]} characters.`
            })
        }
    }
    if (regex?.pattern) {
        fieldRules.push({
            pattern: regex?.pattern,
            message: regex.msg || `Please enter a valid ${label}`
        })
    }
    return (
        <div
            className={cx(wrapperClassName, styles[theme], styles['input-container'], {
                [styles['lower-case']]: lowercase
            })}
        >
            <Form.Item
                validateTrigger={validateTrigger}
                name={name}
                rules={[...fieldRules, ...rules]}
                hasFeedback={suffix ? false : hasFeedback}
                style={{ marginBottom: help?.trim() ? 4 : 'auto' }}
            >
                <Input
                    label={label ? label + (required ? ' *' : '') : ''}
                    onChange={onChange}
                    placeholder={placeholder}
                    suffix={suffix}
                    className={className}
                    onBlur={onBlur}
                    disabled={disabled}
                    readOnly={readOnly}
                    {...rest}
                />
            </Form.Item>
            {help.trim() && <div className={styles['help-text']}>{help.trim()}</div>}
        </div>
    )
}

export default InputField
