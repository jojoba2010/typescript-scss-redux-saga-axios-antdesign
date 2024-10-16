import React, { ReactNode, useState } from 'react'
import AntUpload, { UploadProps as AntUploadProps } from 'antd/es/upload/index'
import 'antd/es/upload/style/index'
import styles from './index.scss'
import AccountBoxFillIcon from 'remixicon-react/AccountBoxFillIcon'
import CloseLineIcon from 'remixicon-react/CloseLineIcon'

export type UploadProps = AntUploadProps & {
    image?: string
    title?: string
    text?: string
    onChange?: any
    icon?: ReactNode
}

const UploadAvatar = (props: UploadProps) => {
    const [file, setFile] = useState(null)
    const { text, title, onChange, image } = props

    const handleChange = async file => {
        setFile(file)
        onChange(file)
        return false
    }

    const removeFile = e => {
        e.preventDefault()
        setFile(null)
        onChange(file)
        return false
    }

    return (
        <AntUpload
            showUploadList={false}
            maxCount={1}
            beforeUpload={handleChange}
            className={styles['upload-box']}
            disabled={file !== null}
            {...props}
        >
            {file || typeof image === 'string' ? (
                <div className={styles['upload-file-content']}>
                    <img src={typeof image === 'string' ? image : URL.createObjectURL(file)} alt="" />
                    <a onClick={removeFile} className={styles['upload-file-remove']} href="#">
                        <CloseLineIcon size={16} />
                    </a>
                </div>
            ) : (
                <div className={styles['upload-button']}>
                    <AccountBoxFillIcon size={36} />
                    <div className={styles['upload-button__title']}>{title}</div>
                    <div className={styles['upload-button__text']}>{text}</div>
                </div>
            )}
        </AntUpload>
    )
}

export default UploadAvatar
