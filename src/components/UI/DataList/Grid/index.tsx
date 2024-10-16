import React from 'react'
import { useDispatch } from 'react-redux'
import Empty from 'antd/lib/empty'
import Card from 'antd/lib/card'
import Checkbox from 'antd/lib/checkbox'
import { PageContext } from 'context'
import { rootActions } from '@store/slices'
import { getValueFromKey } from '@features/General'
import TablePlaceHolder from '@assets/images/no-list-placeholder.svg'
import styles from '../index.scss'

const Grid = ({ card }) => {
    const { component: CardComponent, ...cardProps } = card
    const dispatch = useDispatch()
    const { onRowClick, hasRowSelection, rowSelectionKey, modelName, gridColumns, dataSource, blankListComponent } =
        React.useContext(PageContext)
    const [isCheckedAll, setIsCheckedAll] = React.useState(false)

    const onChangeSelection = e => {
        let values = []
        if (e.target.checked) {
            values = dataSource.map(item => getValueFromKey(item, rowSelectionKey))
        }
        dispatch(rootActions.ui[modelName].onChangeSelectedRows(values))
        setIsCheckedAll(e.target.checked)
    }
    const unCheckedAll = () => {
        if (isCheckedAll) setIsCheckedAll(false)
    }
    return card ? (
        dataSource.length ? (
            <div className={`flex ${styles['grid-box']}`}>
                {hasRowSelection && (
                    <div onClick={e => e.stopPropagation()} className={styles['checkbox-all']}>
                        <Checkbox onChange={onChangeSelection} checked={isCheckedAll} />
                    </div>
                )}
                {dataSource.map(item => (
                    <CardComponent
                        key={item._id}
                        data={item}
                        onRowClick={onRowClick}
                        isCheckedAll={isCheckedAll}
                        unCheckedAll={unCheckedAll}
                        {...cardProps}
                    />
                ))}
            </div>
        ) : (
            blankListComponent
        )
    ) : (
        <>
            {dataSource?.map(item => {
                return (
                    <Card style={{ marginBottom: 10 }} key={item._id} onClick={() => onRowClick(item)}>
                        {gridColumns?.map((col, index) => (
                            <React.Fragment key={item._id + index}>{item[col.key]}</React.Fragment>
                        ))}
                    </Card>
                )
            })}
            {gridColumns?.length == 0 && (
                <Empty style={{ margin: '40px 0' }} image={TablePlaceHolder} description={"Empty_List"} />
            )}
        </>
    )
}

export default Grid
