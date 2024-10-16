import React from 'react'
import routes from '@utils/constants/routes'
import tail from 'lodash/tail'

/**
 * componentWillUnmount in hook way
 *
 * @export
 * @param {() => any} onUnmount
 * @returns
 */
function useBreadCrumb() {
    const [state, setState] = React.useState([])
    const findSelectedNode = () => {
        const bread = []
        const locationArrayPath = tail(location.pathname.split('/'))
        let keepPath = routes

        locationArrayPath.forEach((item, index) => {
            keepPath = keepPath?.[item.replace('-', '_')]
            if (keepPath) {
                bread.push({
                    name: keepPath?.name || '',
                    route: keepPath?._ || location.pathname
                })
            }
        })

        return bread
    }

    React.useEffect(() => {
        setState(findSelectedNode())
    }, [location.pathname])

    return [state]
}

export default useBreadCrumb
