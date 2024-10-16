import React from 'react'
import Form from 'antd/lib/form'
import ErrorWarningFillIcon from 'remixicon-react/ErrorWarningFillIcon'
import Button from '@UI/antd/Button/Button'
import Row from '@UI/antd/Row'
import Col from '@UI/antd/Col'
import Popover from '@UI/antd/Popover/Popover'
import { buttonTypes } from '@UI/antd/Button/Button'
import styles from './index.scss'

interface IProps {
    onCancel?: any
    onSubmit?: any
    submitTitle?: string
    cancelTitle?: string
    cancelButtonType?: buttonTypes
    extraButtons?: {
        title: string
        onClick: any
        type: buttonTypes
        visible?: boolean
        loading?: boolean
        className?: any
        icon?: any
    }[]
    loading?: boolean
    showSubmitButton?: boolean
    disabledSubmit?: boolean
    errorText?: string
}
const FormButtons = (props: IProps) => {
    const {
        onCancel = undefined,
        cancelTitle =  'Cancel',
        submitTitle =  'Create',
        extraButtons = [],
        cancelButtonType = 'secondary-ghost',
        loading = false,
        showSubmitButton = true,
        disabledSubmit = false,
        onSubmit = undefined,
        errorText = ''
    } = props

    const submitButton = (
        <Button
            htmlType={typeof onSubmit === 'function' ? 'button' : 'submit'}
            block
            typeButton="primary-solid"
            disabled={disabledSubmit}
            className={disabledSubmit || errorText ? styles.disabled : ''}
            loading={loading}
            onClick={e => {
                e.stopPropagation()
                if (typeof onSubmit === 'function' && !disabledSubmit && !errorText) onSubmit()
            }}
        >
            {submitTitle}
            {errorText && <ErrorWarningFillIcon />}
        </Button>
    )
    const extraVisibleButtons = React.useMemo(() => extraButtons.filter(item => item.visible !== false), [extraButtons])
    return (
        <Form.Item wrapperCol={{ span: 24 }}>
            <Row className={styles['container']}>
                <Col {...(extraVisibleButtons.length ? { md: 16, sm: 12, xs: 24 } : { span: 0 })}>
                    <div className={styles['form-extra-buttons']}>
                        {extraVisibleButtons.map((eButton, index) => (
                            <div key={eButton.title + index.toString()}>
                                <div className={styles['form-extra-buttons-item']}>
                                    <Button
                                        onClick={() => eButton.onClick()}
                                        typeButton={eButton.type}
                                        loading={eButton.loading}
                                        className={eButton.className}
                                    >
                                        {eButton?.icon && <eButton.icon />}
                                        {eButton.title}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Col>
                <Col {...(extraVisibleButtons.length ? { md: 8, sm: 12, xs: 24 } : { span: 24 })}>
                    <div className={styles['form-buttons']}>
                        <div className={styles['button-row']}>
                            {onCancel && (
                                <Button block typeButton={cancelButtonType} onClick={onCancel}>
                                    {cancelTitle}
                                </Button>
                            )}

                            {showSubmitButton && (
                                <>
                                    {errorText ? (
                                        <Popover
                                            content={
                                                <div className={styles['controller-footer-error']}>{errorText}</div>
                                            }
                                        >
                                            <div>{submitButton}</div>
                                        </Popover>
                                    ) : (
                                        <>{submitButton}</>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </Col>
            </Row>
        </Form.Item>
    )
}

export default FormButtons
