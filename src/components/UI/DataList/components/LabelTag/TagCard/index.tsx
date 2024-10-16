import React from 'react'
import Actions from '@UI/DataList/components/Actions'
import ColorAction from './ColorAction'
import DeleteBinLineIcon from 'remixicon-react/DeleteBinLineIcon'
import CloseFillIcon from 'remixicon-react/CloseFillIcon'
import PencilLineIcon from 'remixicon-react/PencilLineIcon'
import styles from './index.scss'

interface IProps {
    tag?: any
    i18n?: any
    isSelected?: boolean
    theme?: string | 'theme1' | 'theme2'
    removeItem?: any
    onAddItem?: any
    editTag?: any
    setEditKey?: any
    editKey?: any
    name?: string
    containerId?: string
    showAction?: boolean
}

const TagCard = (props: IProps) => {
    const {
        tag,
        i18n,
        isSelected = false,
        theme = 'theme1',
        removeItem,
        onAddItem,
        editTag,
        setEditKey,
        editKey,
        name,
        containerId,
        showAction = true
    } = props
    const handleKeyDown = e => {
        if (e.key === 'Enter') {
            e.preventDefault()
            const name = e.target.value
            const newTag = { ...tag }
            if (newTag.name !== name) {
                newTag.name = name
                editTag(newTag)
            } else setEditKey('')
        }
    }
    const onColorChange = textColor => {
        if (textColor !== tag.textColor) {
            const newTag = { ...tag }
            if (newTag.textColor !== textColor) {
                newTag.textColor = textColor
                newTag.backgroundColor = textColor + '30'
                editTag(newTag)
            }
        } else setEditKey('')
    }
    return (
        <div
            className={styles[editKey === name + tag._id ? '' : theme]}
            style={{
                backgroundColor: isSelected && editKey !== name + tag._id ? tag.textColor : undefined
            }}
        >
            <div
                className={styles['name-container']}
                onClick={() => !isSelected && editKey !== name + tag._id && onAddItem(tag._id)}
                style={{
                    backgroundColor: !isSelected && editKey !== name + tag._id ? tag.textColor : undefined
                }}
            >
                {editKey === name + tag._id ? (
                    <input defaultValue={tag?.name} onKeyDown={handleKeyDown} onClick={e => e.preventDefault()} />
                ) : (
                    <span>{tag?.name}</span>
                )}
            </div>
            {showAction && editKey !== name + tag._id && (
                <div className={styles['actions']}>
                    <Actions
                        actions={[
                            {
                                title: i18n?.General?.Edit,
                                icon: PencilLineIcon,
                                key: 'labeltag',
                                abilityAction: 'AddBadge',
                                abilityService: 'attachments',
                                onClick: () => setEditKey(name + tag._id)
                            },
                            {
                                title: i18n?.General?.Delete,
                                icon: DeleteBinLineIcon,
                                key: 'remove',
                                abilityAction: 'DeleteBadge',
                                abilityService: 'attachments',
                                confirm: {
                                    title: i18n?.TradeHub?.LabelTag || 'LabelTag',
                                    deleteTitle: i18n?.TradeHub?.LabelTag || 'LabelTag',
                                    extraPayload: { id: tag._id },
                                    sagaCB: {
                                        onSuccess: () => {
                                            removeItem(tag._id)
                                        }
                                    }
                                }
                            },
                            {
                                title: '',
                                component: () => (
                                    <ColorAction
                                        i18n={i18n}
                                        onColorChange={onColorChange}
                                        color={tag?.textColor}
                                        containerId={containerId}
                                    />
                                ),
                                key: 'colorAction'
                            }
                        ]}
                        modelName="labelTag"
                        iconDir="horizontal"
                        containerId={containerId}
                    />
                </div>
            )}
            {showAction && isSelected && editKey !== name + tag._id && (
                <div
                    className={styles['remove']}
                    onClick={e => {
                        e.preventDefault()
                        removeItem(tag._id)
                    }}
                >
                    <CloseFillIcon size={16} />
                </div>
            )}
        </div>
    )
}
export default TagCard
