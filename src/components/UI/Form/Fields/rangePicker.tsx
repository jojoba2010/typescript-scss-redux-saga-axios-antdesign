import React from 'react'
import Form from 'antd/lib/form'
import DatePicker from 'antd/lib/date-picker'
import type { RangePickerProps } from 'antd/es/date-picker'
import dayjs from 'dayjs'
import styles from './index.scss'

interface IProps {
    name: string
    required?: boolean
    requiredMsg?: string
    rules?: any
    label?: string
    format?: string
    disabledPastDate?: boolean
    hasFeedback?: boolean
    allowEmpty?: [boolean, boolean]
    getContainer?: any
    onChange?: any
}

const { RangePicker } = DatePicker
const RangePickerField = (props: IProps) => {
    const {
        name,
        required = false,
        requiredMsg = '',
        rules = [],
        label = '',
        format = 'YYYY-MM-DD',
        disabledPastDate = false,
        hasFeedback = true,
        allowEmpty = [true, true],
        getContainer = undefined,
        onChange
    } = props
    // const [focus, setFocus] = useState(false)
    // const [className, setClassName] = useState(`${styles['label']} ${styles['placeholder']}`)
    const disabledDate: RangePickerProps['disabledDate'] = current => {
        return current && current.isBefore(dayjs().format('YYYY-MM-DD'), 'day')
    }
    return (
        <div className={styles.range}>
            {label && <label>{label + (required ? ' *' : '')}</label>}
            <Form.Item
                name={name}
                rules={[
                    {
                        required: required,
                        message: requiredMsg || `Please enter your ${name}`
                    },
                    ...rules
                ]}
                hasFeedback={hasFeedback}
            >
                <RangePicker
                    getPopupContainer={getContainer}
                    allowEmpty={allowEmpty}
                    disabledDate={disabledPastDate ? disabledDate : undefined}
                    format={format}
                    onChange={onChange}
                />
            </Form.Item>
        </div>
    )
}

export default RangePickerField
