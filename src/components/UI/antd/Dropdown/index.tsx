import React from 'react'
import AntDropdown, { DropdownProps } from 'antd/es/dropdown/index'
import { getPlacementDirection } from '@features/General/handlers'
import useUser from '@hooks/processor/useUser'

const Dropdown = (props: DropdownProps) => {
    const { placement } = props
    const { appDirection } = useUser()
    const tooltipPlacement = getPlacementDirection(placement, appDirection)

    return <AntDropdown {...props} placement={tooltipPlacement} />
}

export default Dropdown
