import React from 'react'
import ArrowLeftSLineIcon from 'remixicon-react/ArrowLeftSLineIcon'
import ArrowRightSLineIcon from 'remixicon-react/ArrowRightSLineIcon'
import ArrowLeftSFillIcon from 'remixicon-react/ArrowLeftSFillIcon'
import ArrowRightSFillIcon from 'remixicon-react/ArrowRightSFillIcon'
import ArrowLeftLineIcon from 'remixicon-react/ArrowLeftLineIcon'
import ArrowRightLineIcon from 'remixicon-react/ArrowRightLineIcon'
import useUser from '@hooks/processor/useUser'

function XArrowIcon({
    onClick = () => undefined,
    reverse = false,
    size = 20,
    fill = false,
    thin = true,
    className = ''
}) {
    const props = {
        size,
        className,
        onClick
    }
    const { appDirection } = useUser()
    let icon: any = <ArrowLeftSLineIcon {...props} />
    if (fill) {
        icon = <ArrowLeftSFillIcon {...props} />
    } else if (!thin) {
        icon = <ArrowLeftLineIcon {...props} />
    }
    if ((appDirection === 'ltr' && reverse) || (appDirection !== 'ltr' && !reverse)) {
        if (fill) {
            icon = <ArrowRightSFillIcon {...props} />
        } else if (!thin) {
            icon = <ArrowRightLineIcon {...props} />
        } else {
            icon = <ArrowRightSLineIcon {...props} />
        }
    }
    return <>{icon}</>
}

export default XArrowIcon
