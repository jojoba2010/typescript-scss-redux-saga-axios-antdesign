import React from 'react'
import cx from 'classnames'
import { RiArrowUpDoubleLine } from '@remixicon/react'
import useWindowSize from 'hooks/processor/useWindowSize'
import styles from './index.scss'

const BackTop = () => {
    const [show, setShow] = React.useState<boolean>(false)
    const { isSmallDevice } = useWindowSize()

    React.useEffect(() => {
        const container = document.getElementById('dashboard-layout')
        if (container) {
            container.addEventListener(
                'scroll',
                () => {
                    setShow(container.scrollTop > 200)
                },
                { passive: true }
            )
        }
    }, [])
    const onGoTop = () => {
        const container = document.getElementById('dashboard-layout')
        if (container) {
            container.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            })
        }
    }
    return (
        <>
            {isSmallDevice ? (
                <div className={cx(styles.container, { [styles.show]: show })} onClick={onGoTop}>
                    <RiArrowUpDoubleLine size={30} />
                </div>
            ) : null}
        </>
    )
}

export default BackTop
