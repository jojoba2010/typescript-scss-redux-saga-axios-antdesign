import React from 'react'
import cx from 'classnames'
import Button from '@UI/antd/Button/Button'
import Dropdown from '@UI/antd/Dropdown'
import Tooltip from '@UI/antd/Tooltip'
import ArrowDownSFillIcon from 'remixicon-react/ArrowDownSFillIcon'
import { buttonTypes } from '@UI/antd/Button/Button'
import styles from './index.scss'

type IProps = {
    items: any
    title: string
    typeButton?: buttonTypes
    selectedRowKeys?: any
}
const DropdownButton = (props: IProps) => {
    const { items, title, typeButton, selectedRowKeys } = props
    const menuItems = items.map(item => {
        const result: any = {
            key: item.key,
            label: (
                <>
                    {item.tooltip ? (
                        <Tooltip placement="topLeft" title={item.tooltip}>
                            {item.title}
                        </Tooltip>
                    ) : (
                        <>{item.title}</>
                    )}
                </>
            ),
            onClick: () => item.onClick(selectedRowKeys),
            disabled: item.disabled
        }
        if (item.icon) {
            result.icon = <item.icon size={15} style={{ color: '$iconColor3' }} />
        }
        return result
    })

    const buttonType = typeButton || 'primary-solid'
    return (
        <Dropdown
            trigger={['hover']}
            overlayClassName={styles['dropdown-box']}
            placement="bottomRight"
            menu={{
                style: { minWidth: 100 },
                items: menuItems
            }}
        >
            <Button
                typeButton={buttonType}
                className={cx(styles['button'], { [styles.primary]: buttonType === 'primary-solid' })}
            >
                {title}
                <ArrowDownSFillIcon size={14} />
            </Button>
        </Dropdown>
    )
}

export default DropdownButton
