import React, { ReactNode, useState } from 'react'
import Upload from 'antd/lib/upload'
import ImgCrop from 'antd-img-crop'
import Spin from 'antd/lib/spin'
import Modal from 'antd/lib/modal'
import DeleteBin6FillIcon from 'remixicon-react/DeleteBin6FillIcon'
import AccountBoxFillIcon from 'remixicon-react/AccountBoxFillIcon'
import classNames from 'classnames'
import styles from './index.scss'

const getBase64 = file =>
    new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)

        reader.onload = () => resolve(reader.result)

        reader.onerror = error => reject(error)
    })
export type Size = {
    width: number
    height: number
}
type ModalSizes = 'small' | 'medium' | 'large' | number
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
interface IProps {
    accept?: string
    text?: string
    icon?: ReactNode
    isFetching?: boolean
    defaultValue?: any
    children?: ReactNode
    onChange: (image) => void
    className?: string
    disabled?: boolean
    cropShape?: 'rect' | 'round'
    cropSize?: Size
    modalWidth?: ModalSizes
    aspectSlider?: boolean
}

const UploadCrop = (props: IProps) => {
    const {
        text,
        icon = <AccountBoxFillIcon size={16} />,
        accept = 'image/*',
        className,
        isFetching = false,
        defaultValue,
        disabled = false,
        onChange,
        children,
        cropShape = 'rect',
        cropSize,
        modalWidth = 'small',
        aspectSlider = true
    } = props
    const [file, setFile] = useState(defaultValue || { name: null })
    const removeFile = e => {
        e.preventDefault
        setFile({ name: null })
        onChange(null)
        return false
    }
    const [previewVisible, setPreviewVisible] = useState(false)
    const [previewImage, setPreviewImage] = useState('')
    const [previewTitle, setPreviewTitle] = useState('')

    const handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj)
        }

        setPreviewImage(file.url || file.preview)
        setPreviewVisible(true)
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
    }

    const handleCancel = () => setPreviewVisible(false)
    const beforeUpload = (file, fileList) => {
        onChange({ file })
        setFile(file)
        return false
    }

    return (
        <>
            <Modal open={previewVisible} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img
                    alt="example"
                    style={{
                        width: '100%'
                    }}
                    src={previewImage}
                />
            </Modal>
            <ImgCrop
                showGrid
                rotationSlider
                showReset
                cropperProps={{
                    cropSize,
                    restrictPosition: false,
                    zoomSpeed: 0,
                    style: {},
                    mediaProps: undefined
                }}
                cropShape={cropShape}
                modalWidth={getWidthByType(modalWidth)}
                minZoom={0}
                aspectSlider={aspectSlider}
            >
                <Upload
                    accept={accept}
                    onPreview={handlePreview}
                    showUploadList={false}
                    className={className}
                    disabled={file.name !== null || disabled}
                    beforeUpload={beforeUpload}
                >
                    {children ? (
                        <div className={classNames(styles['upload-button'])}>{children}</div>
                    ) : (
                        <div className={styles['theme1']}>
                            {isFetching ? (
                                <Spin />
                            ) : file.name ? (
                                <>
                                    <span>{file.name}</span>
                                    <DeleteBin6FillIcon onClick={removeFile} size={16} />
                                </>
                            ) : (
                                <>
                                    <span>{text}</span>
                                    {icon}
                                </>
                            )}
                        </div>
                    )}
                </Upload>
            </ImgCrop>
        </>
    )
}

export default React.memo(UploadCrop)
