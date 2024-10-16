import React from 'react'
import AntProgress, { ProgressProps as AntProgressProps } from 'antd/es/progress/index'
import styles from './index.scss'
import isEmpty from 'lodash/isEmpty'

export type ProgressProps = AntProgressProps & {
    title?: string
    value?: string | number
}

const Progress = (props: ProgressProps) => {
    const { title, value, ...rest } = props
    return (
        <div className={styles.progress}>
            {(!isEmpty(title) || !isEmpty(value)) && (
                <div className={styles['progress__label']}>
                    <span className={styles['progress__label_title']}>{title}</span>
                    <span className={styles['progress__label_value']}>{value}</span>
                </div>
            )}
            <AntProgress {...rest} style={{ height: 10 }} />
        </div>
    )
}

export default Progress
