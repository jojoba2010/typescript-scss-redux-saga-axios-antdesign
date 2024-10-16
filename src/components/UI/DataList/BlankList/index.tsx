import React from 'react'
import Empty from 'antd/lib/empty'
import BlankImage from '@assets/images/no-list-placeholder.svg'
import styles from './index.scss'

const BlankList = () => {
    return (
        <Empty
            className={`flex-col ${styles['container']}`}
            image={BlankImage}
            description="Empty_List"
        />
    )
}

export default BlankList
