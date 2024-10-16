import React from 'react'
import AntMenu, { MenuProps as AntMenuProps } from 'antd/es/menu/index'
import 'antd/es/menu/style'
import './index.scss'

export type MenuProps = AntMenuProps

const Menu = (props: MenuProps) => {
    return <AntMenu {...props} />
}
Menu.Item = AntMenu.Item
export default Menu
