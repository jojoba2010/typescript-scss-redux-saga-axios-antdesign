import React from 'react'
import Checkbox from 'antd/lib/checkbox'
import Form from 'antd/lib/form'
import Space from 'antd/lib/space'
import styles from './index.scss'

export type optionTypes = 'default' | 'button'
interface IProps {
    name?: string
    label?: string | undefined
    options: {
        value: string | number
        label: string | React.ReactNode
        description?: string
        disabled?: boolean
    }[]
    value?: string | string[]
    optionType?: optionTypes
    direction?: 'horizontal' | 'vertical'
    rules?: any
    theme?: 'theme-1' | 'theme-2' | 'theme-3'
    [key: string]: any
    disabled?: boolean
    onChange?: (value: string[]) => void
}
const GroupCheckbox = (props: IProps) => {
    const {
        label = undefined,
        onChange,
        value,
        options,
        name,
        rules,
        optionType = 'default',
        theme = 'default',
        disabled = false,
        direction = 'horizontal',
        ...rest
    } = props
    return (
        <div
            className={styles['check-box-container']}
            style={{ justifyContent: label || label === '' ? 'flex-start' : 'center' }}
        >
            {label && <h5>{label}:</h5>}
            <Form.Item name={name} rules={rules} className={styles[`checkbox-type-${optionType}`]}>
                <Checkbox.Group
                    className={styles[theme]}
                    disabled={disabled}
                    {...rest}
                    onChange={onChange}
                    value={typeof value === 'string' ? [value] : value}
                >
                    <Space direction={direction}>
                        {options.map(item => (
                            <Checkbox key={item.value} value={item.value} disabled={item.disabled}>
                                <div className={styles.option}>
                                    <label>{item.label}</label>
                                    {item.description && <span>{item.description}</span>}
                                </div>
                            </Checkbox>
                        ))}
                    </Space>
                </Checkbox.Group>
            </Form.Item>
        </div>
    )
}

export default GroupCheckbox
