import React from 'react'
import Avatar from '@UI/DataList/components/Avatar'
import NoImage from '@assets/images/icons/users.svg'
import styles from '../index.scss'

interface IProps {
    data: {
        img: string
        fallbackImage?: any
        fallbackText?: any
        title: string
        description?: string
        rowIndex?: number
    }
    logoSize?: number
    breakTitle?: boolean
    extraData?: React.ReactNode
    onClick?: any
}
const TitleImage = (props: IProps) => {
    const { data, breakTitle = false, extraData = '', logoSize = 46, onClick } = props
    return (
        <div onClick={onClick}>
            <div className={styles['receiver-item']}>
                <Avatar
                    img={data?.img}
                    fallbackText={data?.title}
                    rowIndex={data?.rowIndex}
                    size={logoSize}
                    fallbackImage={data?.fallbackImage || NoImage}
                />
                <span style={{ maxWidth: breakTitle ? 125 : 'auto' }}>
                    {data.title}
                    {data.description && <div className={styles['description-item']}>{data.description}</div>}
                    {extraData}
                </span>
            </div>
        </div>
    )
}
export default TitleImage
