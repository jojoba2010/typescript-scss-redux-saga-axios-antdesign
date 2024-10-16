import { Link } from 'react-router-dom'
import React from 'react'
import useBreadCrumb from 'hooks/component/useBreadCrumb'
import styles from './index.scss'

const BreadCrumb = () => {
    const [crumbs] = useBreadCrumb()

    return (
        <div className={styles['bread-crumb']}>
            {crumbs.map((item, index) => (
                <Link key={index} to={item.route}>
                    {item.name}
                </Link>
            ))}
        </div>
    )
}

export default BreadCrumb
