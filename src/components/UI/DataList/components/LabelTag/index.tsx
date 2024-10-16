import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import cloneDeep from 'lodash/cloneDeep'
import Popover from '@UI/antd/Popover/Popover'
import Input from '@UI/antd/Input/Input'
import Tooltip from 'antd/lib/tooltip'
import { rootActions } from '@app-store/slices'
import PopoverContent from '@UI/PopoverContent'
import { RootState } from '@store/store'
import TagCard from './TagCard'
import tagIcon from '@assets/svg/tag.svg'
import styles from './index.scss'

type IProps = {
    modelName?: string
    actionName?: string
    record?: any
    type?: string
    field?: string
    theme?: string
    position?: 'static' | 'relative' | 'absolute' | 'sticky' | 'fixed'
    showAction?: boolean
    maxWidthSelectedItem?: number
}
const LabelTag = (props: IProps) => {
    const {
        modelName,
        actionName = 'edit',
        record,
        type,
        field,
        position = 'absolute',
        showAction = true,
        theme,
        maxWidthSelectedItem = 250
    } = props
    const dispatch = useDispatch()
    const recordID = record._id || record.id
    const { data: tagList } = useSelector((state: RootState) => state.labelTag.list)
    const [visible, setVisible] = useState(false)
    const [search, setSearch] = useState<string>('')
    const [newRecord, setNewRecord] = useState(null)
    const [editKey, setEditKey] = useState('')
    useEffect(() => setNewRecord(cloneDeep(record?.[field] || record)), [record])
    const getList = React.useMemo(
        () =>
            tagList.filter(
                item =>
                    [(type === 'Contact' || type === 'Company') && 'Directory', 'Generic', type].includes(item.type) &&
                    !newRecord?.badges?.includes(item._id) &&
                    item.name.toLowerCase().trim().includes(search.toLowerCase().trim())
            ),
        [search, tagList, newRecord]
    )
    const getTextWidth = text => {
        // Create a canvas element
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        // Set the font size and font family
        context.font = `14px Arial`
        // Measure the text width
        const width = context.measureText(text).width
        return width
    }
    const getSelectedTag = React.useMemo(
        () =>
            tagList?.filter(
                item =>
                    [(type === 'Contact' || type === 'Company') && 'Directory', 'Generic', type].includes(item.type) &&
                    newRecord?.badges?.includes(item._id)
            ),
        [tagList, newRecord]
    )

    const getSelectedTagToShow = React.useMemo(() => {
        const selectedTags = getSelectedTag?.reduce(
            (acc, tag) => {
                const tagWidth = getTextWidth(tag.name) + 30
                if (acc.totalWidth + tagWidth <= maxWidthSelectedItem) {
                    acc.selectedTags.push(tag)
                    acc.totalWidth += tagWidth
                }
                return acc
            },
            { selectedTags: [], totalWidth: 0 }
        ).selectedTags
        return selectedTags
    }, [getSelectedTag])
    const getNotShowTag = React.useMemo(
        () => (getSelectedTag?.length || 0) - (getSelectedTagToShow?.length || 0),
        [getSelectedTagToShow, getSelectedTag]
    )
    const handleKeyDown = e => {
        if (e.key === 'Enter') {
            e.preventDefault()
            const data = {
                name: e.target.value,
                textColor: '#ff681a',
                backgroundColor: '#ff681a30',
                type: type.split(',')[0]
            }
            dispatch(
                rootActions.labelTag.create.onRequest({
                    data,
                    sagaCB: {
                        onSuccess: response => {
                            setSearch('')
                            addTagToItem(response._id)
                        }
                    }
                })
            )
        }
    }
    const updateRecordBadge = badges => {
        const newBadges = [...(badges || [])]
        setNewRecord(prevRecord => ({
            ...prevRecord,
            badges: newBadges
        }))
    }
    const addTagToItem = id => {
        if (!newRecord?.badges?.find(item => item === id))
            dispatch(
                rootActions[modelName][actionName].onRequest({
                    id: newRecord._id || newRecord.id,
                    data: { badges: [...(newRecord.badges || []), id] },
                    sagaCB: {
                        onSuccess: response => {
                            updateRecordBadge(response.badges)
                        }
                    }
                })
            )
    }
    const removeItem = id => {
        const badges = newRecord?.badges.filter(item => item !== id)
        dispatch(
            rootActions[modelName][actionName].onRequest({
                id: newRecord._id || newRecord.id,
                data: { badges },
                sagaCB: {
                    onSuccess: response => {
                        updateRecordBadge(response.badges)
                    }
                }
            })
        )
    }
    const editTag = tag => {
        dispatch(
            rootActions.labelTag.edit.onRequest({
                id: tag._id,
                data: { ...tag, _id: undefined },
                sagaCB: {
                    onSuccess: () => {
                        setEditKey('')
                    }
                }
            })
        )
    }
    const changeVisible = e => {
        if (!editKey) setVisible(e)
    }

    return <div className={styles['main']}>
            <div className={styles['container']} onClick={e => e.stopPropagation()} style={{ position }}>
                {getSelectedTagToShow?.length > 0 && (
                    <div className={styles['selected-tag']}>
                        {getSelectedTagToShow?.map((tag, key) => (
                            <TagCard
                                key={key}
                                name="main"
                                tag={tag}
                                isSelected={true}
                                removeItem={id => removeItem(id)}
                                editTag={editTag}
                                setEditKey={setEditKey}
                                editKey={editKey}
                                showAction={showAction}
                                theme={theme}
                            />
                        ))}
                    </div>
                )}
                {getNotShowTag > 0 && (
                    <div className={styles['more-item']} onClick={() => setVisible(prev => !prev)}>
                        <span>+{getNotShowTag}</span>
                    </div>
                )}
                <Popover
                    content={
                        <PopoverContent setVisible={changeVisible}>
                            <div className={styles['labelTag-container']} id={recordID}>
                                <div className={styles['labelTag-selected']}>
                                    {getSelectedTag?.map((tag, key) => (
                                        <TagCard
                                            key={key}
                                            name="top"
                                            tag={tag}
                                            isSelected={true}
                                            removeItem={id => removeItem(id)}
                                            editTag={editTag}
                                            setEditKey={setEditKey}
                                            editKey={editKey}
                                            containerId={recordID}
                                        />
                                    ))}
                                </div>
                                <div>
                                    <Input
                                        isFloat={false}
                                        label= 'Search or Create new'
                                        placeholder='Search or Create new'
                                        name="searchTag"
                                        onChange={e => setSearch(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        value={search}
                                    />
                                </div>
                                <div className={styles['list-tag-container']}>
                                    <div className={styles['list-tag']}>
                                        {getList?.map((tag, key) => (
                                            <TagCard
                                                key={key}
                                                name="list"
                                                tag={tag}
                                                theme="theme2"
                                                onAddItem={addTagToItem}
                                                editTag={editTag}
                                                setEditKey={setEditKey}
                                                editKey={editKey}
                                                containerId={recordID}
                                            />
                                        ))}
                                        <span className={styles['no-tag']}>
                                            {tagList?.filter(
                                                item => item.type !== (type === 'Contact' ? 'Company' : 'Contact')
                                            )?.length === 0
                                                ?  'No tags created'
                                                : getList?.length === 0 && search
                                                ? 'Press enter to create a new tag'
                                                : ''}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </PopoverContent>
                    }
                    overlayClassName={styles['menu-overlay']}
                    className={styles['menu']}
                    trigger="click"
                    open={visible}
                >
                    <div
                        onClick={e => {
                            e.preventDefault()
                            setVisible(prev => !prev)
                        }}
                    >
                        <Tooltip placement="top" title={'Add Tag'}>
                            <img src={tagIcon} />
                        </Tooltip>
                    </div>
                </Popover>
            </div>
        </div>
}

export default LabelTag
