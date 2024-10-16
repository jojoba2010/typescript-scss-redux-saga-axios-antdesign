import React from 'react'
import Progress from 'antd/lib/progress'

type IProps = {
    percent: number
}
const ProgressModule = (props: IProps) => {
    const { percent } = props
    return <>{typeof percent === 'number' && <Progress type="circle" percent={percent} size={35} />}</>
}

export default ProgressModule
