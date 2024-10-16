import React from 'react'
import ExternalLinkFillIcon from 'remixicon-react/ExternalLinkFillIcon'
import Avatar from '@UI/DataList/components/Avatar'
import styles from './index.scss'

type IProps = {
    logo: string
    title: string
    subTitle?: string
    company?: string
    label?: string
    link?: string
    extraIcons?: {
        hide?: boolean
        icon: any
        title?: string
    }[]
    theme?: 'theme-1' | 'theme-2' | 'theme-3' | 'theme-4' | 'theme-5'
    logoSize?: any
}

const LogoTitle = (props: IProps) => {
    const {
        logo,
        title,
        subTitle = '',
        company = '',
        label = '',
        link = '',
        extraIcons = [],
        theme = 'theme-1',
        logoSize = 40
    } = props
    return (
        <div className={styles.wrapper}>
            {label && <label>{label}</label>}
            <div className={`${styles.container} ${styles[theme]}`}>
                <div className={styles.logo}>
                    <Avatar img={logo} size={logoSize} fallbackText={title} />
                </div>
                <div className={styles.info}>
                    <div className={styles.title}>
                        {title}
                        {extraIcons
                            .filter(x => x.hide !== true)
                            .map((item, index) => (
                                <div key={`extra-icon-${index}`} className={styles['extra-icon']} title={item.title}>
                                    <item.icon size={16} />
                                </div>
                            ))}
                        {link && (
                            <div className={styles['profile-icon']}>
                                <ExternalLinkFillIcon
                                    size={16}
                                    onClick={e => {
                                        e.stopPropagation()
                                        window.open(link, '_blank', 'noopener,noreferrer')
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {subTitle && (
                        <div className={styles.subTitle}>
                            {subTitle}
                            {company && <span>{company}</span>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default LogoTitle
