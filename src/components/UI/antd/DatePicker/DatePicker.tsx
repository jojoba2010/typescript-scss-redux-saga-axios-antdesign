import React from 'react'
import AntDatePicker, { DatePickerProps as AntDatePickerProps } from 'antd/es/date-picker/index'
// import 'antd/es/date-picker/style/index'
import FloatInput from '@UI/FloatInput/FloatInput'
import CalendarEventFillIcon from 'remixicon-react/CalendarEventFillIcon'
export type DatePickerProps = AntDatePickerProps & {
    mode?: string
    label?: string
    required?: boolean
    placeholder?: string
    withInput?: boolean
    popupClassName?: string
}

const DatePicker = (props: DatePickerProps) => {
    const { label, value, required = false, defaultValue, withInput = true, placeholder = false } = props
    if (!withInput) {
        return <AntDatePicker style={{ visibility: 'hidden', width: 0 }} {...props} />
    }
    return (
        <FloatInput
            label={label}
            placeholder={placeholder || label}
            isBlock
            required={required}
            value={value ? value : defaultValue}
        >
            <AntDatePicker allowClear={false} suffixIcon={<CalendarEventFillIcon size={16} />} {...props} />
        </FloatInput>
    )
}

export default DatePicker
