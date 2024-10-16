import React from 'react'
import AntDropdown, { DropdownProps } from 'antd/es/dropdown/index'
import { getPlacementDirection } from '@features/General/handlers'

const Dropdown = (props: DropdownProps) => {
    const { placement } = props
    const tooltipPlacement = getPlacementDirection(placement, "rtl")

    return <AntDropdown {...props} placement={tooltipPlacement} />
}

export default Dropdown
