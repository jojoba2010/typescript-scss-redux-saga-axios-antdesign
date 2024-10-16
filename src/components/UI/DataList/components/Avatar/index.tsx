import React from 'react'
import classNames from 'classnames'
import Image from 'antd/lib/image'
import { getCharacterColor, getAvatarCharacters } from '@features/General/handlers'
import AvatarLogo from '@assets/images/user-avatar.png'
import styles from './index.scss'

type IProps = {
    img: string
    fallbackImage?: any
    fallbackText?: any
    size?: number
    onClick?: () => void
    isSquare?: boolean
    rowIndex?: number
    preview?: boolean
}
const Avatar = (props: IProps) => {
    const {
        img,
        fallbackImage = AvatarLogo,
        fallbackText = '',
        size = 46,
        onClick = e => undefined,
        isSquare = false,
        rowIndex = 0,
        preview = false
    } = props
    const [hasError, setHasError] = React.useState(false)
    const [visiblePreview, setVisiblePreview] = React.useState(false)
    const hasFallback = fallbackText && typeof fallbackText === 'string' //use in matchlist

    return (
        <div
            className={classNames(styles['container'], { [styles['square']]: isSquare })}
            style={{ width: size, height: size }}
        >
            {(hasError || !img) && hasFallback ? (
                <div
                    className={`${styles.text}`}
                    style={{
                        background: getCharacterColor(fallbackText, rowIndex),
                        width: size,
                        minWidth: size,
                        height: size,
                        fontSize: Math.floor((19 * size) / 46)
                    }}
                    onClick={onClick}
                >
                    <span>{getAvatarCharacters(fallbackText)}</span>
                </div>
            ) : (
                <Image
                    preview={
                        preview
                            ? {
                                  visible: visiblePreview,
                                  onVisibleChange: visible => {
                                      setVisiblePreview(visible)
                                      if (visible) {
                                          // To avoid calling onRowClick function in tables
                                          setTimeout(() => {
                                              const classes = [
                                                  'ant-image-preview-mask',
                                                  'ant-image-preview-wrap',
                                                  'ant-image-preview-close'
                                              ]
                                              classes.forEach(className => {
                                                  document.getElementsByClassName(className)?.[0]?.addEventListener(
                                                      'click',
                                                      event => {
                                                          event.stopPropagation()
                                                          if (className === 'ant-image-preview-close') {
                                                              setVisiblePreview(false)
                                                          }
                                                      },
                                                      true
                                                  )
                                              })
                                          }, 100)
                                      }
                                  }
                              }
                            : false
                    }
                    src={img}
                    fallback={!hasFallback && fallbackImage}
                    alt="avatar"
                    width={size}
                    height={size}
                    onError={() => {
                        if (hasFallback) setHasError(true)
                    }}
                    onClick={e => {
                        if (preview) {
                            e.stopPropagation()
                        }
                        onClick(e)
                    }}
                />
            )}
        </div>
    )
}

export default Avatar
