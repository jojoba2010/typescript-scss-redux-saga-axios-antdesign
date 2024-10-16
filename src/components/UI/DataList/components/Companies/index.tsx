import React, { useState, useEffect } from 'react'
import CompanyProfileImg from '@assets/images/company-profile.svg'
import Avatar from '@UI/DataList/components/Avatar'
import styles from './index.scss'

const Companies = props => {
    const { host, guest, type, rowIndex } = props
    const [data, setData] = useState<any>([])

    useEffect(() => {
        setData([host, guest])
    }, [host, guest])
    const correctData = data.filter(Boolean)
    if (type === 'names') {
        return (
            <div className={styles['user-list']}>
                {correctData.map((company, index) => (
                    <div key={index} className={styles['user-figure']}>
                        <Avatar
                            img={company.logo}
                            size={34}
                            fallbackText={company.name || ''}
                            fallbackImage={CompanyProfileImg}
                            rowIndex={rowIndex}
                        />
                        <span>
                            {company.name}
                            {company.userType && <small>({company.userType})</small>}
                        </span>
                    </div>
                ))}
            </div>
        )
    } else if (type === 'emails') {
        return (
            <div className={styles['col-wrapper']}>
                {correctData.map((company, index) => (
                    <span key={index} className={styles['normal-text']}>
                        {company.email}
                    </span>
                ))}
            </div>
        )
    } else if (type === 'countries') {
        return (
            <div className={styles['col-wrapper']}>
                {correctData.map((company, index) => (
                    <span key={index} className={styles['normal-text']}>
                        {company.country?.name || company.country}
                    </span>
                ))}
            </div>
        )
    } else if (type === 'phones') {
        return (
            <div className={styles['col-wrapper']}>
                {correctData.map((company, index) => (
                    <span key={index} className={styles['normal-text']}>
                        {company.phone}
                    </span>
                ))}
            </div>
        )
    } else return null
}

export default Companies
