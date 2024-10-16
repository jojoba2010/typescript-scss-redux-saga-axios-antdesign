import React from 'react'
import CheckFillIcon from 'remixicon-react/CheckFillIcon'
import Form from 'antd/lib/form'
import Radio from 'antd/lib/radio'
import { pickForeColor } from '@utils/helpers/commonHelpers'
import styles from './index.scss'

interface IProps {
    name: string
    colors: string[]
    onChange?: (value: string) => void
    disabled?: boolean
}
const RadioColor = (props: IProps) => {
    const { name, colors, onChange = value => undefined, disabled = false } = props

    return (
        <Form.Item noStyle shouldUpdate>
            {({ getFieldValue }) => {
                const value = getFieldValue(name)
                return (
                    <Form.Item name={name} className={styles['color-container']}>
                        <Radio.Group onChange={e => onChange(e.target.value)} disabled={disabled}>
                            {colors.map((color, index) => (
                                <Radio
                                    className={styles['color-item']}
                                    value={color}
                                    style={{ backgroundColor: color }}
                                    key={index}
                                >
                                    <CheckFillIcon
                                        size={20}
                                        style={{
                                            fill: pickForeColor(color, '#b1bac5', '#44484d'),
                                            opacity: color !== value ? 0 : 1
                                        }}
                                    />
                                </Radio>
                            ))}
                        </Radio.Group>
                    </Form.Item>
                )
            }}
        </Form.Item>
    )
}

export default RadioColor
