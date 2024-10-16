import React, { ReactNode, useState, useEffect } from 'react'
import Dropdown from 'antd/lib/dropdown'
import Button from 'antd/lib/button'
import Form from 'antd/lib/form'
import { SketchPicker } from 'react-color'
import ArrowDownSFillIcon from 'remixicon-react/ArrowDownSFillIcon'
import CloseLineIcon from 'remixicon-react/CloseLineIcon'
import classNames from 'classnames'
import styles from './index.scss'

interface IProps {
    defaultValue?: string
    name: string
    label: string
    type?: string
    setFieldValue?: any
    required?: boolean
    requiredMsg?: string
    rules?: any
    suffix?: ReactNode
    allowClear?: boolean
}
const colorField = (props: IProps) => {
    const {
        defaultValue = '#000',
        name,
        // label,
        type = 'hex',
        setFieldValue,
        required = false,
        requiredMsg = '',
        rules = [],
        suffix = null,
        allowClear = false
    } = props
    const [color, setColor] = useState(defaultValue)
    const [hexColor, setHexColor] = useState(defaultValue.replace('#', '').toUpperCase())

    useEffect(() => {
        if (defaultValue) {
            setHexColor(defaultValue.replace('#', '').toUpperCase())
            setColor(defaultValue)
        }
    }, [defaultValue])

    const handleChangeComplete = colorData => {
        if (colorData === '') {
            setHexColor('')
            setColor('')
            setFieldValue(name, '')
        } else {
            setHexColor(colorData.hex.replace('#', '').toUpperCase())
            setColor(colorData[type])
            setFieldValue(name, colorData[type])
        }
    }

    return (
        <div className={styles['suffix-container']}>
            <Form.Item
                name={name}
                rules={[
                    {
                        required: required,
                        message: requiredMsg || `Please enter your ${name}`
                    },
                    ...rules
                ]}
                hasFeedback
            >
                <Dropdown
                    trigger={['click']}
                    menu={{
                        items: [
                            {
                                key: 'color',
                                label: <SketchPicker color={color} onChangeComplete={handleChangeComplete} />
                            }
                        ]
                    }}
                    className={styles['color-field']}
                >
                    <Button>
                        <div className={styles['color-field__selected']} style={{ backgroundColor: color }} />
                        <span className={styles['color-field__selected-value']}>{hexColor}</span>
                        {allowClear && color && (
                            <CloseLineIcon
                                onClick={() => handleChangeComplete('')}
                                className={classNames(styles['close'], styles['suffix-wrapper'])}
                                size={16}
                            />
                        )}
                        {!suffix ? (
                            <h6>
                                <ArrowDownSFillIcon size={14} />
                            </h6>
                        ) : (
                            <span
                                className={classNames(
                                    allowClear && color ? styles['arrow'] : '',
                                    styles['suffix-wrapper']
                                )}
                            >
                                {suffix}
                            </span>
                        )}
                    </Button>
                </Dropdown>
            </Form.Item>
        </div>
    )
}

export default colorField
