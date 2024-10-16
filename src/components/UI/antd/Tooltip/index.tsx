import React from 'react'
import AntTooltip, { TooltipProps } from 'antd/es/tooltip/index'
import { getPlacementDirection } from '@features/General/handlers'
import useUser from '@hooks/processor/useUser'

const Tooltip = (props: TooltipProps) => {
    const { placement } = props
    const { appDirection } = useUser()

    const tooltipPlacement = React.useMemo(
        () => getPlacementDirection(placement, appDirection),
        [placement, appDirection]
    )
    return <AntTooltip {...props} placement={tooltipPlacement} />
}

export default Tooltip
