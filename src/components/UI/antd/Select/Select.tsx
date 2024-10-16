import React, { useRef } from 'react'
import AntSelect, { SelectProps as AntSelectProps } from 'antd/es/select/index'
import FloatInput from '@UI/FloatInput/FloatInput'
import styles from './index.scss'
import arrowSelect from '@assets/svg/caret_down.svg'
import omit from 'lodash/omit'
import Spin from 'antd/lib/spin'

export type SelectProps = AntSelectProps<any> & {
    name?: string
    mode?: string
    label?: string
    required?: boolean
    placeholder?: string
    isFloat?: boolean
}

const Select = (props: SelectProps) => {
    let { placeholder } = props
    const ref: any = useRef()
    const { label = '', value, required = false, isFloat = true, defaultValue, disabled = false } = props
    const selectProps = omit(props, ['isFloat', 'isBlock'])
    if (!placeholder) placeholder = label

    return (
        <FloatInput
            isBlock
            label={label}
            placeholder={placeholder}
            required={required}
            isFloat={isFloat}
            value={value}
            defaultValue={defaultValue}
            disabled={disabled}
        >
            <AntSelect
                ref={ref}
                popupClassName={styles['ala-select-dropdown']}
                suffixIcon={props.loading ? <Spin size="small" /> : <img src={arrowSelect} />}
                {...selectProps}
            />
        </FloatInput>
    )
}
Select.Option = AntSelect.Option
export default Select
