import React, { ReactElement } from 'react'
import NoImage from '@assets/images/icons/users.svg'
import Avatar from '@UI/DataList/components/Avatar'
import styles from './index.scss'

interface Props {
    data: {
        value: any
        image?: string
        icon?: any
        size?: number
        style?: any
        breakTitle?: boolean
        text?: string
        rowIndex?: number
    }
}

const ImageTitle = (props: Props): ReactElement => {
    const { data } = props
    return (
        <div className={styles.container} style={data.style}>
            {data.icon ? (
                <data.icon size={15} />
            ) : (
                <Avatar
                    img={data.image}
                    size={data.size || 32}
                    fallbackText={data.text || data.value || ''}
                    fallbackImage={NoImage}
                    rowIndex={data.rowIndex || 0}
                />
            )}
            <span className={styles.value} style={{ maxWidth: data?.breakTitle ? 125 : 'auto' }}>
                {data.value}
            </span>
        </div>
    )
}

export default ImageTitle
