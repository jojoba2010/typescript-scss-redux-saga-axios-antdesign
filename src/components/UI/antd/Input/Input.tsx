import React, { useRef } from 'react'
import AntInput, { InputProps as AntInputProps, TextAreaProps as AntTextAreaProps } from 'antd/es/input/index'
import AntInputNumber, { InputNumberProps as AntInputNumberProps } from 'antd/es/input-number/index'
import AntTextarea from 'antd/es/input/TextArea'
import FloatInput from '@UI/FloatInput/FloatInput'
import FloatTextarea from '@UI/FloatInput/FloatTextarea'
import omit from 'lodash/omit'
import styles from './index.scss'

export type InputProps = AntInputProps & {
    label: string
    isFloat?: boolean
    isBlock?: boolean
}
export type InputNumberProps = AntInputNumberProps & {
    label: string
    placeholder?: string
    isFloat?: boolean
    isBlock?: boolean
    value?: number
    required?: boolean
    defaultValue?: number
}
export type TextAreaProps = AntTextAreaProps & {
    label: string
    isFloat?: boolean
    isBlock?: boolean
}

const Input = (props: InputProps) => {
    const {
        placeholder,
        label,
        value = '',
        required,
        isFloat = true,
        isBlock = false,
        defaultValue = '',
        disabled = false
    } = props
    const ref: any = useRef()
    const inputProps = omit(props, ['isFloat', 'isBlock'])

    return (
        <FloatInput
            label={label}
            isFloat={isFloat}
            isBlock={isBlock}
            placeholder={placeholder || label}
            required={required}
            value={value || ref?.current?.state?.value?.toString() || ''}
            defaultValue={defaultValue}
            disabled={disabled}
        >
            <AntInput ref={ref} {...inputProps} />
        </FloatInput>
    )
}

const Number = (props: InputNumberProps) => {
    const ref: any = useRef()
    const { placeholder, label, value = '', required, isFloat = true, isBlock = false, defaultValue = '' } = props
    const inputProps = omit(props, ['isFloat', 'isBlock'])

    return (
        <div className={styles.input}>
            <FloatInput
                label={label}
                isFloat={isFloat}
                isBlock={isBlock}
                placeholder={placeholder || label}
                required={required}
                value={value?.toString() || ref?.current?.state?.value?.toString() || ''}
                defaultValue={defaultValue}
            >
                <AntInputNumber ref={ref} {...inputProps} />
            </FloatInput>
        </div>
    )
}

const TextArea = (props: TextAreaProps) => {
    const ref: any = useRef()
    const { placeholder, label, value, required, isFloat = true, isBlock = false, defaultValue } = props
    const textareaProps = omit(props, ['isFloat', 'isBlock'])
    return (
        <FloatTextarea
            label={label}
            isFloat={isFloat}
            isBlock={isBlock}
            placeholder={placeholder || label}
            required={required}
            value={value || ref?.current?.state.vale || ''}
            defaultValue={defaultValue}
        >
            <AntTextarea {...textareaProps} />
        </FloatTextarea>
    )
}
Input.TextArea = TextArea
Input.Number = Number
export default Input
