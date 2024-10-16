import React, { useState } from 'react'
import Popover from '@UI/antd/Popover/Popover'
import PopoverContent from '@UI/PopoverContent'
import ColorField from '@UI/Form/Fields/Color'
import RadioColorField from '@UI/Form/Fields/RadioColor'
import { paletteColors } from '@utils/constants'
import PaletteLineIcon from 'remixicon-react/PaletteLineIcon'
import styles from './index.scss'

interface IProps {
    i18n?: any
    color?: any
    onColorChange?: any
    containerId?: string
}

const ColorAction = (props: IProps) => {
    const { i18n, color, onColorChange, containerId } = props
    const [visible, setVisible] = useState(false)
    const onChange = color => {
        onColorChange(color)
        setVisible(false)
    }
    return (
        <Popover
            content={
                <PopoverContent setVisible={setVisible}>
                    <div className={styles['color-container']}>
                        <RadioColorField name="color" colors={paletteColors} onChange={value => onChange(value)} />
                        <div className={styles['color-picker']}>
                            <ColorField
                                name="colorPicker"
                                label=""
                                setFieldValue={(_, value) => onChange(value)}
                                defaultValue={color}
                            />
                        </div>
                    </div>
                </PopoverContent>
            }
            overlayClassName={styles['menu-overlay']}
            trigger="click"
            open={visible}
            getPopupContainer={() => document.getElementById(containerId)}
        >
            <div onClick={() => setVisible(prev => !prev)}>
                <PaletteLineIcon size={16} />
                <span>{i18n?.General?.Color || 'Color'}</span>
            </div>
        </Popover>
    )
}
export default ColorAction
