import React from 'react'
import classNames from 'classnames'
import styles from './index.scss'
import CheckboxCircleFillIcon from 'remixicon-react/CheckboxCircleFillIcon'
import CloseCircleFillIcon from 'remixicon-react/CloseCircleFillIcon'

const MatchPercent = ({ percent = 0, color = 'orange', satisfied = true, available = true }) => {
    return (
        <span
            className={classNames(
                styles.tag,
                !satisfied ? styles.grey_tag : color === 'orange' ? styles.orange_tag : styles.green_tag
            )}
        >
            {percent >= 50 || satisfied ? (
                <>
                    <CheckboxCircleFillIcon size={15} />
                    {percent ? <span>{percent}%</span> : null}
                </>
            ) : (
                <>
                    {!available ? (
                        <span>N/A</span>
                    ) : (
                        <>
                            <CloseCircleFillIcon size={15} />
                            {percent ? <span>{percent}%</span> : null}
                        </>
                    )}
                </>
            )}
        </span>
    )
}

export default MatchPercent
