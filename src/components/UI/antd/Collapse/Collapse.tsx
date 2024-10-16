import React from 'react'
import AntCollapse from 'antd/es/collapse/index'
import 'antd/es/collapse/style/index'
import './index.scss'

const Collapse = props => {
    return <AntCollapse {...props} />
}
Collapse.Panel = AntCollapse.Panel
export default Collapse
