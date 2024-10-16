import React from 'react'
import ArrowLeftSLineIcon from 'remixicon-react/ArrowLeftSLineIcon'
import ArrowRightSLineIcon from 'remixicon-react/ArrowRightSLineIcon'
import ArrowLeftSFillIcon from 'remixicon-react/ArrowLeftSFillIcon'
import ArrowRightSFillIcon from 'remixicon-react/ArrowRightSFillIcon'
import ArrowLeftLineIcon from 'remixicon-react/ArrowLeftLineIcon'
import ArrowRightLineIcon from 'remixicon-react/ArrowRightLineIcon'

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
    let icon: any = <ArrowLeftSLineIcon {...props} />
    if (fill) {
        icon = <ArrowLeftSFillIcon {...props} />
    } else if (!thin) {
        icon = <ArrowLeftLineIcon {...props} />
    }
    if (!reverse) {
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
