import React from 'react'
import AntImage, { ImageProps as AntImageProps } from 'antd/es/image/index'
import avatar from '@assets/images/user-avatar.png'
import styles from './index.scss'
export type ButtonProps = AntImageProps & {
    shape?: 'circle' | 'square'
}
const Avatar = props => {
    const { shape = 'circle', src, size = 100, alt = '', preview = true } = props
    return (
        <AntImage
            alt={alt}
            className={styles[shape]}
            fallback={avatar}
            src={src || avatar}
            preview={!!src && preview}
            width={size}
            height={size}
        />
    )
}

export default Avatar
