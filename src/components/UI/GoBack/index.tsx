import React from 'react'
import { useHistory } from 'react-router-dom'
import Button from '@UI/antd/Button/Button'
import XArrowIcon from '@UI/XArrowIcon'
import styles from './index.scss'

function GoBack({ route = '', title = '', onBackClick = undefined, titleColor = '' }) {
    const history = useHistory()
    const backToMatchList = () => {
        if (onBackClick) onBackClick()
        else if (route) {
            history.push(route)
        } else {
            history.goBack()
        }
    }

    return (
        <div className={styles['container']}>
            <Button className={styles['button']} onClick={backToMatchList} typeButton={'secondary-outlined-icon'}>
                <XArrowIcon thin size={18} />
            </Button>
            {title && (
                <h6 className={styles['header']} style={{ color: titleColor }}>
                    {title}
                </h6>
            )}
        </div>
    )
}

export default GoBack
