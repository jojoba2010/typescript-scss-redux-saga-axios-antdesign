import React from 'react'
import AntTree, { TreeProps as AntTreeProps } from 'antd/es/tree/index'
import 'antd/es/tree/style/index'
import './index.scss'

export type TreeProps = AntTreeProps

const Tree = (props: TreeProps) => {
    return <AntTree {...props} />
}

export default Tree
