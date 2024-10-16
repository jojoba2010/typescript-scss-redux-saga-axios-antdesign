import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@app-store/store'
import { rootActions } from '@app-store/slices'
import Pagination from 'antd/lib/pagination'
import styles from '../index.scss'

type IProps = {
    modelName: string
    showQuickJumper?: boolean
    addPageToUrl?: boolean
}
const ListPagination = (props: IProps) => {
    const { modelName, showQuickJumper = true, addPageToUrl = false } = props
    const dispatch = useDispatch()
    const pagination = useSelector((state: RootState) => state.ui[modelName].pagination)
    const { itemsPerPage, currentPage, total } = pagination
    const handleChangePagination = page => {
        if (addPageToUrl) {
            const url: any = new URL(window.location.toString())
            url.searchParams.set('page', page || 1)
            window.history.pushState({}, '', url)
        }
        dispatch(rootActions.ui[modelName].onChangePagination({ currentPage: page || 1 }))
    }

    return (
        <Pagination
            className={styles['pagination']}
            showQuickJumper={showQuickJumper}
            current={currentPage}
            total={total}
            pageSize={itemsPerPage}
            onChange={handleChangePagination}
            showSizeChanger={false}
            showTotal={total => `Total ${total} items`}
        />
    )
}

export default ListPagination
