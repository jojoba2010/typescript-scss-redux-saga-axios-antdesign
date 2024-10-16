import React, { ReactElement } from 'react'
import { EventStatusColors } from '@features/Event/constants'
import styles from './index.scss'

interface IstatusBadge {
    status: 'DEMO' | 'CLOSED' | 'LIVE'
}

function StatusBadge(props: IstatusBadge): ReactElement {
    const { status } = props

    return (
        <span className={styles['badge']} style={{ backgroundColor: EventStatusColors(status) }}>
            {status}
        </span>
    )
}

export default StatusBadge
