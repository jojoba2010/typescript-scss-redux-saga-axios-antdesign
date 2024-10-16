import React from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import styles from './index.scss'

dayjs.extend(relativeTime)
interface IProps {
    value: string
    format: any
    startTime?: string
    endTime?: string
    visible?: boolean
}
const DateTime = (props: IProps) => {
    const { value, format, startTime = '', endTime = '', visible = true } = props
    if (!visible) return <></>
    const getDate = value => dayjs(value, 'YYYY-MM-DD hh:mm AZ')
    const date = getDate(value)

    if (props.format === 'relativeTime') {
        return <span style={{ whiteSpace: 'nowrap' }}>{date.fromNow()}</span>
    } else if (props.format === 'dayMonthName' || format.date === 'dayMonthName') {
        return (
            <div style={{ whiteSpace: 'nowrap' }}>
                <b className={styles.day_number}>{date.format('DD')}</b>
                <span className={styles.day_month_name}>
                    <span>{date.format('MMMM')}</span>
                    <br />
                    <span>{date.format('dddd')}</span>
                    {format.time && (
                        <>
                            <br /> <span>{date.format(format.time)}</span>
                        </>
                    )}
                </span>
            </div>
        )
    } else if (props.format === 'startAndEndTime') {
        return (
            <div className={styles.start_and_end_time}>
                <span>{getDate(startTime).format('hh:mm a')}</span>
                <br />
                <span>{getDate(endTime).format('hh:mm a')}</span>
            </div>
        )
    } else if (format.date && format.time) {
        return (
            <>
                <span>{date.format(format.date || format)}</span>
                {format.time && (
                    <>
                        <br /> <span>{date.format(format.time)}</span>
                    </>
                )}
            </>
        )
    } else {
        return <span style={{ whiteSpace: 'nowrap' }}> {date.format(props.format)} </span>
    }
}

export default DateTime
