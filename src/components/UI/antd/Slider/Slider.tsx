import React from 'react'
import AntSlider, { SliderBaseProps, SliderRangeProps } from 'antd/es/slider/index'

export type SliderProps = SliderBaseProps & SliderRangeProps

const Slider = (props: SliderProps) => {
    return <AntSlider {...props} />
}

export default Slider
