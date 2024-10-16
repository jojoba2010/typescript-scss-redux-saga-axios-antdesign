import React from 'react'
import classNames from 'classnames'
import styles from './index.scss'
const FieldWrapper = ({ children }) => {
    const [open, setOpen] = React.useState(false)

    return (
        <div
            className={classNames(styles['field-wrapper'], {
                [styles['open-field']]: open
            })}
        >
            <span
                className={classNames(styles['icon'], {
                    [styles['minus']]: open
                })}
                onClick={() => setOpen(state => !state)}
            />
            {children}
        </div>
    )
}

export default FieldWrapper
