import React from 'react'
import { useDispatch } from 'react-redux'
import Modal, { ModalFuncProps } from 'antd/lib/modal'
import { rootActions } from '@app-store/slices'
import styles from '../index.scss'

export interface IActions {
    icon?: any
    iconColor?: string
    img?: any
    key: string
    title: string
    id?: string
    onClick?: any
    abilityAction?: string
    abilityService?: string
    hide?: boolean
    confirm?: {
        title: string
        okText?: string
        onOk?: any
        content?: string
        extraPayload?: any
        sagaCB?: {
            onSuccess: any
        }
    }
}

type IProps = {
    actions: IActions[]
    modelName?: string
    record?: any
    iconDir?: string
}
const ActionsMenu = (props: IProps) => {
    const { actions, modelName, record } = props
    const dispatch = useDispatch()
    const modalConfig = (confirm): ModalFuncProps => ({
        title: confirm?.title || 'Delete' + modelName,
        icon: null,
        okButtonProps: {
            className: 'primary-solid'
        },
        okText: confirm?.okText || confirm?.title || 'Delete' + modelName,
        cancelText: 'Cancel',
        onOk: () => {
            if (typeof confirm?.onOk === 'function') {
                confirm.onOk()
            } else {
                const payload: any = {
                    data: {
                        [confirm.storeField || 'ids']: [record._id]
                    },
                    ...(confirm.extraPayload || {}),
                    sagaCB: {
                        onSuccess: () => {
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

    const visibleActions = actions.filter(
        item => item.hide !== true
    )

    return (
        <>
            {visibleActions.length > 0 && (
                <div className={styles['icon-actions-container']} onClick={e => e.stopPropagation()}>
                    {visibleActions.map(item => (
                        <div
                            key={item.key}
                            title={item.title}
                            onClick={() => {
                                if (item.key === 'remove' || item?.confirm) {
                                    Modal.confirm(modalConfig(item.confirm))
                                } else {
                                    item.onClick(record)
                                }
                            }}
                        >
                            {item.icon && <item.icon style={{ color: item.iconColor }} size={14} />}
                            {item.img && <img src={item.img} />}
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}

export default ActionsMenu
