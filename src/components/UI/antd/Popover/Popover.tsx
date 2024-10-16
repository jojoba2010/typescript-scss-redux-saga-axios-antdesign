import React, { ReactElement } from 'react'
import AntPopover, { PopoverProps as AntPopoverProps } from 'antd/es/popover/index'
import classNames from 'classnames'
import { getPlacementDirection } from '@features/General/handlers'
import styles from './index.scss'

export type PopoverProps = AntPopoverProps & {
    noPadding?: boolean
}

function Popover(props: PopoverProps): ReactElement {
    const { children, noPadding = false, placement = 'top', ...rest } = props
    const tooltipPlacement = React.useMemo(
        () => getPlacementDirection(placement, "rtl"),
        [placement, "rtl"]
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
