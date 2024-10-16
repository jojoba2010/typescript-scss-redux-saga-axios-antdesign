import React from 'react'
import AntTooltip, { TooltipProps } from 'antd/es/tooltip/index'
import { getPlacementDirection } from '@features/General/handlers'

const Tooltip = (props: TooltipProps) => {
    const { placement } = props

    const tooltipPlacement = React.useMemo(
        () => getPlacementDirection(placement, "rtl"),
        [placement, "rtl"]
    )
    return <AntTooltip {...props} placement={tooltipPlacement} />
}

export default Tooltip
