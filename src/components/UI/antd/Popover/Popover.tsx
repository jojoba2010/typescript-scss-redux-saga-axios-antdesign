import React, { ReactElement } from 'react'
import AntPopover, { PopoverProps as AntPopoverProps } from 'antd/es/popover/index'
import classNames from 'classnames'
import { getPlacementDirection } from '@features/General/handlers'
import useUser from '@hooks/processor/useUser'
import styles from './index.scss'

export type PopoverProps = AntPopoverProps & {
    noPadding?: boolean
}

function Popover(props: PopoverProps): ReactElement {
    const { children, noPadding = false, placement = 'top', ...rest } = props
    const { appDirection } = useUser()
    const tooltipPlacement = React.useMemo(
        () => getPlacementDirection(placement, appDirection),
        [placement, appDirection]
    )
    return (
        <AntPopover
            autoAdjustOverflow
            placement={tooltipPlacement}
            overlayClassName={classNames(styles['custom-popover'], { [styles['no-padding']]: noPadding })}
            {...rest}
        >
            {children}
        </AntPopover>
    )
}

export default Popover
