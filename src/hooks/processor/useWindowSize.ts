import { useState, useEffect } from 'react'
import { BREAKPOINTS } from '@features/General'

/**
 * useWindowSize in hook way
 *
 * @export
 * @param {} windowSize
 * @returns @string
 */

function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined
    })
    useEffect(() => {
        let isMounted = true
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            })
        }
        if (isMounted) {
            window.addEventListener('resize', handleResize)
            handleResize()
        }

        return () => {
            isMounted = false
            window.removeEventListener('resize', handleResize)
        }
    }, [])
    const userAgent = navigator.userAgent.toLowerCase()
    const isAndroidOs = userAgent.indexOf('android') > -1
    const isIosOs = userAgent.indexOf('iphone') > -1 || userAgent.indexOf('ipad') > -1
    return {
        width: windowSize.width,
        height: windowSize.height,
        isAndroidOs,
        isIosOs,
        isPcDevice: !isAndroidOs && !isIosOs,
        isMobile: windowSize.width < BREAKPOINTS.SM,
        isSmallDevice: windowSize.width <= BREAKPOINTS.MD
    }
}

export default useWindowSize
