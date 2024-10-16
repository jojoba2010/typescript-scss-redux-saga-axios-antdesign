import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Modal, { ModalFuncProps } from 'antd/lib/modal'
import More2FillIcon from 'remixicon-react/More2FillIcon'
import MoreFillIcon from 'remixicon-react/MoreFillIcon'
import Popover from '@UI/antd/Popover/Popover'
import { rootActions } from '@app-store/slices'
import PopoverContent from '@UI/PopoverContent'
import styles from './index.scss'
import { RootState } from '@store/store'
import classnames from 'classnames'

export interface IActions {
    title: string
    component?: any
    icon?: any
    img?: any
    key: string
    id?: string
    onClick?: any
    abilityAction?: string
    abilityService?: string
    hide?: boolean
    disabled?: boolean
    confirm?: {
        title: string
        deleteTitle?: string
        okText?: string
        onOk?: any
        actionName?: string
        storeField?: string
        storeFieldValue?: any
        content?: string
        extraPayload?: any
        sagaCB?: {
            onSuccess: any
        }
    }
    hasLineSeparator?: boolean
}

type IProps = {
    actions: IActions[]
    modelName?: string
    record?: any
    iconDir?: string
    getList?: any
    theme?: string
    containerId?: string
}
const ActionsMenu = (props: IProps) => {
    const { actions, modelName, record, iconDir = 'vertical', getList, theme = 'theme-1', containerId } = props
    const [visible, setVisible] = React.useState(false)
    const dispatch = useDispatch()
    const appDirection = "rtl"
    const pagination = useSelector((state: RootState) => state.ui?.[modelName]?.pagination)
    const modalConfig = (confirm): ModalFuncProps => ({
        title: confirm?.title || `Delete ${confirm?.deleteTitle || modelName}`,
        icon: null,
        okButtonProps: {
            className: 'primary-solid'
        },
        cancelText: 'Cancel',
        okText:
            confirm?.okText || `Delete ${confirm?.deleteTitle || modelName}` || confirm?.deleteTitle,
        onOk: () => {
            if (typeof confirm?.onOk === 'function') {
                confirm.onOk()
            } else {
                const action = confirm.actionName || 'delete'
                const payload: any = {
                    data: {
                        [confirm.storeField || 'ids']: confirm.storeField
                            ? confirm.storeFieldValue || record._id
                            : [record?._id]
                    },
                    [confirm.storeField || 'ids']: confirm.storeField ? record._id : [record?._id],
                    ...(confirm.extraPayload || {}),
                    sagaCB: {
                        onSuccess: response => {
                            getList(() => {
                                if (
                                    action === 'delete' &&
                                    Math.ceil((pagination?.total - 1) / pagination.itemsPerPage) <
                                        pagination.currentPage
                                ) {
                                    dispatch(
                                        rootActions.ui[modelName].onChangePagination({
                                            currentPage: pagination.currentPage - 1
                                        })
                                    )
                                }
                            })
                            confirm?.sagaCB?.onSuccess(response)
                        }
                    }
                }
                dispatch(rootActions[confirm.modelName || modelName][action].onRequest(payload))
            }
        },
        cancelButtonProps: {
            className: 'secondary-ghost'
        },
        content: <p>{confirm?.content || `Delete_Description ${confirm?.deleteTitle}?`}</p>
    })

    const visibleActions = actions.filter(
        item =>
            item.hide !== true
    )

    return (
        <>
            {visibleActions.length > 0 && (
                <div className={styles['actions-container']} onClick={e => e.stopPropagation()}>
                    <Popover
                        content={
                            <PopoverContent setVisible={setVisible}>
                                <div className={styles[theme]}>
                                    {visibleActions.map(item => (
                                        <React.Fragment key={item.key}>
                                            {' '}
                                            <div
                                                className={classnames({
                                                    [styles['disabled']]: item.disabled
                                                })}
                                                onClick={e => {
                                                    if (!item.disabled) {
                                                        if (item.key === 'remove' || item?.confirm) {
                                                            Modal.confirm(modalConfig(item.confirm))
                                                        } else if (item.onClick) {
                                                            item.onClick(record)
                                                        }
                                                        if (!item.component) setVisible(false)
                                                    }
                                                }}
                                            >
                                                {item.icon && <item.icon size={17} />}
                                                {item.img && <img src={item.img} />}
                                                {item.title && <span>{item.title}</span>}
                                                {item.component?.(setVisible)}
                                            </div>
                                            {item.hasLineSeparator ? <hr /> : null}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </PopoverContent>
                        }
                        placement={appDirection === 'rtl' ? 'bottomLeft' : 'bottomRight'}
                        overlayClassName={styles['menu-overlay']}
                        className={styles['menu']}
                        trigger="click"
                        open={visible}
                        getPopupContainer={() => document.getElementById(containerId)}
                    >
                        <div
                            onClick={e => {
                                e.preventDefault()
                                setVisible(prev => !prev)
                            }}
                        >
                            {iconDir === 'vertical' ? <More2FillIcon size={16} /> : <MoreFillIcon size={16} />}
                        </div>
                    </Popover>
                </div>
            )}
        </>
    )
}

export default ActionsMenu
