import AntButton, { ButtonProps as AntButtonProps } from 'antd/es/button/index'
import React from 'react'
import cx from 'classnames'
import styles from './index.scss'

export type buttonTypes =
    | 'primary-solid'
    | 'depressive-solid'
    | 'primary-outlined'
    | 'secondary-outlined'
    | 'secondary-outlined-icon'
    | 'primary-ghost'
    | 'secondary-ghost'
    | 'secondary-ghost-icon'

export type ButtonProps = AntButtonProps & {
    typeButton: buttonTypes
    sizeButton?: 'normal' | 'medium' | 'small'
    label?: ''
    hasPadding?: boolean
    isRound?: boolean
}

const Button = (props: ButtonProps) => {
    const { className = '', typeButton, sizeButton, hasPadding = false, isRound = false } = props
    const attrs = { ...props }
    const wrongHtmlAttrs = ['typeButton', 'sizeButton', 'className', 'hasPadding', 'isRound']
    wrongHtmlAttrs.forEach(attr => {
        delete attrs[attr]
    })
    return (
        <AntButton
            className={cx(styles.button, styles[typeButton], styles[sizeButton], className, {
                [styles.padding]: hasPadding,
                [styles['is-round']]: isRound
            })}
            {...attrs}
        />
    )
}

export default Button
