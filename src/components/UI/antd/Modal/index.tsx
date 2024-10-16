import React, { ReactNode } from 'react'
import AntModal, { ModalProps as AntModalProps } from 'antd/es/modal/index'
import CloseLineIcon from 'remixicon-react/CloseLineIcon'
import classNames from 'classnames'

import 'antd/es/modal/style/index'

type ModalSizes = 'small' | 'medium' | 'large' | number

export type ModalProps = AntModalProps & {
    modalSize: ModalSizes
    children: ReactNode
}

function getWidthByType(modalSize: ModalSizes) {
    if (typeof modalSize === 'number') {
        return modalSize
    }

    switch (modalSize) {
        case 'small':
            return 480
        case 'medium':
            return 720
        case 'large':
            return 1200
        default:
            return 480
    }
}

const Modal = (props: ModalProps) => {
    const { className, modalSize, children } = props
    const attr = { ...props }
    const width = getWidthByType(modalSize)
    const cx = [className]

    return (
        <AntModal
            width={width}
            maskClosable={false}
            closeIcon={<CloseLineIcon />}
            className={classNames(...cx)}
            {...attr}
        >
            {children}
        </AntModal>
    )
}

export default Modal
