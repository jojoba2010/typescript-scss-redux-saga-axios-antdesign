import React from 'react'
import dayjs from 'dayjs'
import styles from './index.scss'

function GregorianDate(props) {
    const date = dayjs(props.date, 'YYYY-MM-DD hh:mm AZ')
    if (props.format === 'relativeTime') {
        return <span style={{ whiteSpace: 'nowrap' }}>{date.fromNow()}</span>
    } else if (props.format === 'dayMonthName') {
        return (
            <div style={{ whiteSpace: 'nowrap' }}>
                <b className={styles.day_number}>{date.format('DD')}</b>
                <span className={styles.day_month_name}>
                    <span>{date.format('MMMM')}</span>
                    <br />
                    <span>{date.format('dddd')}</span>
                </span>
            </div>
        )
    } else if (props.format === 'startAndEndTime') {
        return (
            <div className={styles.start_and_end_time}>
                <span>{dayjs(props.startTime, 'YYYY-MM-DD hh:mm AZ').format('hh:mm a')}</span>
                <br />
                <span>{dayjs(props.endTime, 'YYYY-MM-DD hh:mm AZ').format('hh:mm a')}</span>
            </div>
        )
    } else {
        return <span style={{ whiteSpace: 'nowrap' }}> {date.format(props.format)} </span>
    }
}

export default GregorianDate
