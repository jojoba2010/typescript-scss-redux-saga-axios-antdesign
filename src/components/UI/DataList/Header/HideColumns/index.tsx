import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import LayoutColumnLineIcon from 'remixicon-react/LayoutColumnLineIcon'
import CheckLineIcon from 'remixicon-react/CheckLineIcon'
import Button from '@UI/antd/Button/Button'
import Popover from '@UI/antd/Popover/Popover'
import PopoverContent from '@UI/PopoverContent'
import { PageContext } from 'context'
import useUser from '@hooks/processor/useUser'
import { RootState } from '@store/store'
import { rootActions } from '@store/slices'
import styles from './index.scss'

const HideColumns = () => {
    const { modelName, columns } = React.useContext(PageContext)
    const dispatch = useDispatch()
    const hiddenColumns = useSelector((state: RootState) => state.ui?.[modelName]?.hiddenColumns)
    const { data: i18n } = useSelector((state: RootState) => state.localization.locals)
    const hideableColumns = columns?.filter(item => item.allowHide)
    const [open, setOpen] = React.useState(false)
    const { appDirection } = useUser()

    const handleClick = key => {
        const newHidedColumns = [...hiddenColumns]
        const currentIndex = newHidedColumns.findIndex(item => item === key)
        if (currentIndex > -1) {
            newHidedColumns.splice(currentIndex, 1)
        } else {
            newHidedColumns.push(key)
        }
        dispatch(rootActions.ui[modelName].onChangeHidedColumns(newHidedColumns))
    }
    return (
        <>
            {hideableColumns?.length > 0 && (
                <Popover
                    placement={appDirection === 'ltr' ? 'bottomLeft' : 'bottomRight'}
                    open={open}
                    overlayClassName={styles['none']}
                    content={
                        <div className={styles['container']}>
                            <PopoverContent setVisible={setOpen}>
                                {hideableColumns.map(item => {
                                    const key = item.dataIndex || item.key
                                    return (
                                        <div className={styles['item']} key={key} onClick={() => handleClick(key)}>
                                            {item.title}
                                            <CheckLineIcon
                                                className={hiddenColumns?.includes(key) ? styles['hide'] : ''}
                                            />
                                        </div>
                                    )
                                })}
                            </PopoverContent>
                        </div>
                    }
                >
                    <Button
                        typeButton="secondary-outlined"
                        onClick={() => setOpen(prev => !prev)}
                        style={{ margin: 0 }}
                    >
                        <LayoutColumnLineIcon size={18} /> <span>{i18n?.General?.Columns || 'Columns'}</span>
                    </Button>
                </Popover>
            )}
        </>
    )
}

export default HideColumns
