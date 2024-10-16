import React, { ReactNode, useState } from 'react'
import AntUpload, { UploadProps as AntUploadProps } from 'antd/es/upload/index'
import classNames from 'classnames'
import DeleteBin6FillIcon from 'remixicon-react/DeleteBin6FillIcon'
import 'antd/es/upload/style/index'
import styles from './index.scss'
import Spin from 'antd/lib/spin'

export type UploadProps = AntUploadProps & {
    text?: string
    icon?: ReactNode
    isFetching?: boolean
    defaultValue?: any
    value?: any
}

const Upload = (props: UploadProps) => {
    const { defaultValue, disabled, ...rest } = props
    const [file, setFile] = useState(defaultValue || { name: null })
    const { text, icon, className, isFetching = false } = props
    const handleChange = e => {
        setFile(e)
        return false
    }
    const removeFile = e => {
        e.preventDefault
        setFile({ name: null })
        props.onChange(null)
        return false
    }

    delete rest.value
    return (
        <AntUpload
            {...rest}
            showUploadList={false}
            maxCount={1}
            beforeUpload={handleChange}
            className={classNames(styles['upload-box'], className)}
            disabled={file.name !== null || disabled}
        >
            <div className={classNames(styles['upload-button'])}>
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
        </AntUpload>
    )
}

export default React.memo(Upload)
