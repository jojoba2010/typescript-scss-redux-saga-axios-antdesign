import React, { useState } from 'react'
import classNames from 'classnames'
import Form from 'antd/lib/form'
import Select from '@UI/antd/Select/Select'
import useStopPropagarionClickPopup from '@hooks/processor/useStopPropagarionClickPopup'
import styles from './index.scss'

// rules can be including:
// 1- { whitespace: true }
// 2- { min: 3 }
// 3- { max: 10 }
// 4- { required: true, message: 'Please enter your name' }
interface IProps {
    label?: string
    name: string | [number, string]
    onChange?: any
    onSelect?: any
    required?: boolean
    requiredMsg?: string
    rules?: any
    options?: any
    disabledOptions?: any
    showSearch?: boolean
    width?: string | number
    disabled?: boolean
    style?: any
    styleForm?: any
    loading?: boolean
    theme?: string
    multiple?: boolean
    hasCustomOptions?: boolean
    help?: string
    allowClear?: boolean
    onSearch?: any
    modalForm?: boolean
    defaultValue?: any
    maxTagCount?: string
    fieldKey?: string
    popupMatchSelectWidth?: boolean
    hideSelectedLabels?: boolean
    value?: any
}
const SelectField = (props: IProps) => {
    const {
        label,
        name,
        onChange = null,
        onSelect = null,
        required = false,
        requiredMsg = '',
        rules = [],
        options = [],
        defaultValue = '',
        disabledOptions = [],
        showSearch = true,
        width = 'auto',
        disabled = false,
        style = {},
        styleForm = {},
        loading = false,
        theme = 'theme-1',
        multiple = false,
        hasCustomOptions = false,
        help = '',
        allowClear = false,
        onSearch = null,
        modalForm = false,
        maxTagCount = '',
        fieldKey = '',
        popupMatchSelectWidth = true,
        hideSelectedLabels = false,
        value = null
    } = props
    const [searchValue, setSearchValue] = useState<string>('')
    const containerId = 'select-' + fieldKey + name
    useStopPropagarionClickPopup(containerId)
    const restProps: any = {}
    if (multiple) {
        restProps.mode = 'multiple'
    }
    if (defaultValue) {
        restProps.defaultValue = defaultValue
    }

    const handleSearch = value => {
        setSearchValue(value)
        if (typeof onSearch === 'function') {
            onSearch(value)
        }
    }
    const handleChange = (value, item) => {
        setSearchValue('')
        if (typeof onChange === 'function') {
            const data = options.find(item => item.value === value)
            onChange(value, data)
        }
    }
    const showCustomOption = React.useMemo(
        () => hasCustomOptions && searchValue.trim(),
        [hasCustomOptions, searchValue]
    )
    const handleKeyDown = (e, currentValue, setFieldValue) => {
        if (handleKeyDown && multiple) {
            if (['Tab', 'Enter'].includes(e.key)) {
                e.preventDefault()
                if (!options.map(item => item.label).includes(searchValue)) {
                    if (e.key === 'Tab') {
                        setFieldValue(name, [...currentValue, searchValue])
                        setSearchValue('')
                    }
                }
            }
        }
    }
    return (
        <div className={styles['field-container']} id={containerId}>
            <Form.Item
                noStyle
                shouldUpdate={(prev, next) => {
                    if (typeof name === 'string') {
                        return multiple
                            ? JSON.stringify(prev[name]) !== JSON.stringify(next[name])
                            : prev[name] !== next[name]
                    }
                    return false
                }}
            >
                {({ getFieldValue, setFieldValue }) => {
                    const currentValue = getFieldValue(name) || []
                    if (showCustomOption && !multiple) {
                        const newValue: any = multiple ? [...currentValue] : searchValue
                        if (multiple && !currentValue.includes(searchValue)) {
                            newValue.push(searchValue)
                        }
                        setFieldValue(name, newValue)
                    }
                    if (value) {
                        setFieldValue(name, value)
                    }
                    return (
                        <Form.Item
                            name={name}
                            style={{ ...styleForm, minWidth: width, marginBottom: help?.trim() ? 4 : 'auto' }}
                            rules={[
                                {
                                    required: required,
                                    message: requiredMsg || `Please choose ${name}`
                                },
                                ...rules
                            ]}
                            className={styles['select-' + theme]}
                        >
                            <Select
                                label={label ? label + (required ? ' *' : '') : ''}
                                onChange={handleChange}
                                showSearch={showSearch || hasCustomOptions}
                                disabled={disabled}
                                maxTagCount={maxTagCount}
                                className={classNames(
                                    classNames(styles['select-field'], {
                                        [styles['multiple-select']]: multiple,
                                        [styles['hide-labels']]: hideSelectedLabels
                                    })
                                )}
                                searchValue={searchValue}
                                onSelect={(value, option) => {
                                    if (onSelect) {
                                        onSelect(value, option)
                                    }
                                    setSearchValue('')
                                }}
                                onKeyDown={e => handleKeyDown(e, currentValue, setFieldValue)}
                                getPopupContainer={() => {
                                    if (modalForm) {
                                        return document.body
                                    }
                                    return document.getElementById(containerId)
                                }}
                                filterOption={
                                    (showSearch || hasCustomOptions) && !onSearch
                                        ? (input, option) =>
                                              option?.children
                                                  ?.toString()
                                                  .toLowerCase()
                                                  .includes(input.toLowerCase()) ||
                                              option?.key?.toLowerCase().includes(input.toLowerCase())
                                        : false
                                }
                                style={style}
                                loading={loading}
                                {...restProps}
                                onSearch={handleSearch}
                                allowClear={allowClear}
                                popupMatchSelectWidth={popupMatchSelectWidth}
                                popupClassName={classNames({
                                    [styles['hide-check-icons']]: hideSelectedLabels
                                })}
                            >
                                {options.map(option => (
                                    <Select.Option
                                        key={option.key || option.value}
                                        value={option.value}
                                        disabled={disabledOptions.includes(option.value)}
                                    >
                                        {option.label}
                                    </Select.Option>
                                ))}
                                {hasCustomOptions &&
                                    searchValue.trim() &&
                                    !options.map(item => item.label).includes(searchValue) && (
                                        <Select.Option key={searchValue} value={searchValue}>
                                            {searchValue}
                                        </Select.Option>
                                    )}
                            </Select>
                        </Form.Item>
                    )
                }}
            </Form.Item>
            {help.trim() && <div className={styles['help-text']}>{help.trim()}</div>}
        </div>
    )
}

export default SelectField
