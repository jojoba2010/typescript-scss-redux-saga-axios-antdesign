import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import CloseLineIcon from 'remixicon-react/CloseLineIcon'
import Select from '@UI/antd/Select/Select'
import { pickForeColor } from '@utils/helpers/commonHelpers'
import styles from '../index.scss'

interface IProps {
    value: string
    bg: any
    width?: string | number
    column?: any
    record?: any
    extraData?: string
    textColor?: string
}

const Badge = (props: IProps) => {
    const { value, extraData = '', bg, column = {}, record = {}, textColor } = props
    const [val, setVal] = useState(value)
    useEffect(() => {
        setVal(value)
    }, [value])
    const backgroundColor = typeof bg === 'function' ? bg(val) : bg
    const foreColor = React.useMemo(
        () => textColor || pickForeColor(backgroundColor),
        [val, backgroundColor, textColor]
    )
    const options = column.options
    return (
        <span
            style={{ backgroundColor, color: foreColor, width: column.width || 'auto' }}
            className={classNames(styles['badge'], { [styles['badge-change']]: column.editable })}
        >
            {column.editable ? (
                <>
                    <Select
                        className={styles['badge-select']}
                        suffixIcon={<></>}
                        options={options}
                        value={val || ''}
                        popupMatchSelectWidth={false}
                        popupClassName={styles['badge-dropdown']}
                        onChange={value => {
                            column.onChange(record, value)
                            setVal(value)
                        }}
                    >
                        {column.options.map(item => (
                            <Select.Option value={item} key={item}>
                                {item}
                            </Select.Option>
                        ))}
                    </Select>
                    {!!val && (
                        <CloseLineIcon
                            className={styles.close}
                            onClick={() => {
                                column.onChange(record, null)
                                setVal('')
                            }}
                            size={14}
                        />
                    )}
                </>
            ) : (
                <>{`${val} ${extraData}`}</>
            )}
        </span>
    )
}

export default Badge
