import React from 'react'
import { useDispatch } from 'react-redux'
import Modal, { ModalFuncProps } from 'antd/lib/modal'
import Tooltip from 'antd/lib/tooltip'
import Image from 'antd/lib/image'
import Button from '@UI/antd/Button/Button'
import { PageContext } from 'context'
import { rootActions } from '@app-store/slices'
import loadable from '@loadable/component'

const DropdownButton = loadable(() => import('@UI/DropdownButton'))

type IProps = {
    align?: string
}
const Buttons = (props: IProps) => {
    const { align = 'right' } = props
    const { noData, modelName, buttons, selectedRowKeys, getList, onDownload, dropdownButtonTitle } =
        React.useContext(PageContext)
    const dispatch = useDispatch()
    const modalConfig = (confirm): ModalFuncProps => ({
        title: `Delete ${confirm?.title}`,
        icon: null,
        okButtonProps: {
            className: 'primary-solid'
        },
        okText: confirm?.okText || `Delete ${confirm?.title || modelName}`,
        cancelText: 'Cancel',
        onOk: () => {
            if (typeof confirm?.onOk === 'function') {
                confirm.onOk()
            } else {
                const payload: any = {
                    data: {
                        [confirm.storeField || 'ids']: selectedRowKeys
                    },
                    sagaCB: {
                        onSuccess: () => {
                            getList()
                            confirm?.sagaCB?.onSuccess()
                        }
                    }
                }
                dispatch(rootActions[confirm.modelName || modelName][confirm.actionName || 'delete'].onRequest(payload))
            }
        },
        cancelButtonProps: {
            className: 'secondary-ghost'
        },
        content: <p>{confirm?.content || `Delete_Description ${confirm?.title}?`}</p>
    })
    const visibleButtons = React.useMemo(
        () =>
            buttons.filter(
                item =>
                    (!noData || (noData && !item.showWithData)) &&
                    (item.align || 'right') === align &&
                    !item.hide &&
                    (!item?.showWhenRowsSelected || (item?.showWhenRowsSelected && selectedRowKeys.length > 0))
            ),
        [buttons, align, selectedRowKeys, noData]
    )

    const dropDownButtonItems = visibleButtons
        .filter(item => item.showAsDropDown)
        .map((item, index) => ({
            key: item.key + index.toString(),
            title: item.title,
            onClick: item.onClick,
            icon: item.icon,
            tooltip: item.tooltip,
            type: item.type,
            disabled: item.disabled
        }))
    const renderButton = item => (
        <Button
            key={item.key}
            loading={item.loading}
            onClick={() => {
                if (typeof item.onClick === 'function') {
                    if (item.showWhenRowsSelected) {
                        item.onClick(selectedRowKeys)
                    } else {
                        item.onClick()
                    }
                } else if (item.key === 'remove') {
                    Modal.confirm(modalConfig(item.confirm))
                } else if (item.downloadList) {
                    onDownload()
                } else if (item.refreshList) {
                    getList()
                }
            }}
            disabled={item.disabled === true}
            typeButton={item.type}
            hasPadding={item.hasPadding === true}
        >
            {item.title || ''}
            {typeof item?.icon !== 'undefined' && <item.icon />}
            {typeof item?.image !== 'undefined' && <Image src={item.image} preview={false} />}
        </Button>
    )
    return (
        <>
            {visibleButtons
                .filter(item => dropDownButtonItems < 2 || !item.showAsDropDown)
                .map(item => (
                    <React.Fragment key={item.key}>
                        {item.tooltip ? (
                            <Tooltip key={item.key} title={item.tooltip}>
                                {renderButton(item)}
                            </Tooltip>
                        ) : (
                            renderButton(item)
                        )}
                    </React.Fragment>
                ))}
            {dropDownButtonItems.length > 1 && (
                <DropdownButton
                    typeButton={dropDownButtonItems?.[0]?.type}
                    items={dropDownButtonItems}
                    title={dropdownButtonTitle}
                    selectedRowKeys={selectedRowKeys}
                />
            )}
        </>
    )
}

export default Buttons
