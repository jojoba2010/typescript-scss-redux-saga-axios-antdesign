import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import dayjs from 'dayjs'
import localeData from 'dayjs/plugin/localeData'
import isEmpty from 'lodash/isEmpty'
import startCase from 'lodash/startCase'
import uniq from 'lodash/uniq'
import Form from 'antd/lib/form'
import Row from 'antd/lib/grid/row'
import Col from 'antd/lib/grid/col'
import Button from '@UI/antd/Button/Button'
import Popover from '@UI/antd/Popover/Popover'
import Filter2LineIcon from 'remixicon-react/Filter2LineIcon'
import SelectField from '@UI/Form/Fields/select'
import RangePickerField from '@UI/Form/Fields/rangePicker'
import InputField from '@UI/Form/Fields/input'
import FormButtons from '@UI/Form/FormButtons'
import { RootState } from '@app-store/store'
import { rootActions } from '@store/slices'
import { IFilters, ISideFilters } from '@features/General'
import PopoverContent from '@UI/PopoverContent'
import styles from './index.scss'

dayjs.extend(localeData)

export type IFilter = {
    list?: IFilters[]
    advancedFilter?: boolean
    sideList?: ISideFilters[]
    theme?: 'theme-1' | 'theme-2' | 'theme-3'
}
interface IProps {
    flexDirection?: any
    width?: any
    alignItems?: any
    modelName: string
    filter: IFilter
}
const Filters = (props: IProps) => {
    const { flexDirection, width, alignItems, modelName, filter } = props
    const [open, setOpen] = React.useState(false)
    const [form] = Form.useForm()
    const dispatch = useDispatch()
    const { pureFilters } = useSelector((state: RootState) => state.ui[modelName])
    const visibleFilters = filter?.list?.filter(item => !item.hide && !item.inLine)
    const visibleFiltersInLine = filter?.list?.filter(item => !item.hide && item.inLine)

    const handleSubmit = values => {
        setOpen(false)
        const filters: any = {}
        const pureFilters: any = {}
        Object.keys(values).forEach(key => {
            if (pureFilters[key]) return
            const filterItem = filter.list.find(item => item.key === key.replace('--from', '').replace('--to', ''))
            if (
                filterItem &&
                (!isEmpty(values[key]) ||
                    values[key] === true ||
                    values[key] === false ||
                    typeof values[key] === 'number')
            ) {
                if (filterItem.type === 'rangeDate') {
                    const rangeDate = values[key]
                    if (rangeDate.length) {
                        /*if (rangeDate[0]) {
                            filters[filterItem?.queryKeys?.[0] || filterItem.key || 'startTime'] = {
                                $gte: getStartOrEndTimeOfDate(rangeDate[0])
                            }
                        }
                        if (rangeDate[1]) {
                            const endKey = filterItem?.queryKeys?.[1] || filterItem.key || 'endTime'
                            const value = getStartOrEndTimeOfDate(rangeDate[1], 'end')
                            if (filterItem.key && filters[endKey]) {
                                filters[endKey].$lte = value
                            } else {
                                filters[endKey] = {
                                    $lte: value
                                }
                            }
                        }*/
                    }
                } else if (filterItem.getQuery) {
                    const filterValue = filterItem.getQuery(values[key])
                    Object.assign(filters, filterValue)
                } else {
                    const allValues = uniq(values[key])
                    if (filterItem.queryKeys) {
                        if (!filters.$and) {
                            filters.$and = []
                        }
                        const filterValue = {
                            $or: filterItem.queryKeys.map(q => ({
                                [q]: Array.isArray(allValues) ? { $in: allValues } : allValues
                            }))
                        }
                        filters.$and.push(filterValue)
                    } else {
                        filters[key] = allValues
                    }
                }
                pureFilters[key] = values[key]
            }
        })

        dispatch(rootActions.ui[modelName].onChangePagination({ currentPage: 1 }))
        dispatch(rootActions.ui[modelName].onChangeFilters(filters))
        dispatch(rootActions.ui[modelName].onChangePureFilters(pureFilters))
    }

    const clearAll = () => {
        dispatch(rootActions.ui[modelName].onResetFilters())
        form.resetFields()
    }

    React.useEffect(() => {
        if (pureFilters) {
            const formValues = {}
            Object.keys(pureFilters).map(key => {
                if (pureFilters[key]) {
                    formValues[key] = pureFilters[key]
                }
            })
            form.setFieldsValue(formValues)
        }
    }, [pureFilters])

    const handleSubmitFiltersInLine = () => {
        document.getElementById('btnSubmitFiltersInLine').click()
    }
    const getContainer = triggernode => {
        return triggernode.parentNode
    }

    const renderFilterItem = (data, label) => {
        switch (data.type) {
            case 'select':
                return (
                         <SelectField
                                name={data.key}
                                label={label}
                                options={
                                    Array.isArray(data.values)
                                        ? data.values
                                        : Object.keys(data.values).map(key => ({
                                              label: startCase(data.values[key]),
                                              value: data.values[key]
                                          }))
                                }
                                multiple={data.multiple}
                                onChange={data.inLine ? handleSubmitFiltersInLine : null}
                                allowClear
                                maxTagCount="responsive"
                                popupMatchSelectWidth={false}
                            />
                )
            case 'rangeDate':
                return (
                    <RangePickerField name={data.key} label={label} hasFeedback={false} getContainer={getContainer} />
                )
            case 'input':
                return (
                    <div className={styles['check-box-filter']}>
                        <InputField name={data.key} label={label} />
                    </div>
                )
        }
    }

    const renderFilters = filters => {
        const groupFilters = filters?.filter(item => item.showAsGroup === true)
        return (
            <>
                {filters
                    ?.filter(item => item.showAsGroup !== true)
                    ?.map(item => {
                        const label = typeof item.title === 'string' ? item.title : item.title?.[0]
                        return (
                            <Col
                                key={item.key}
                                {...(item.layout || { span: 24 })}
                                className={item.inLine ? styles[item.type + 'InLine'] : ''}
                                style={{ width: item.width }}
                            >
                                {renderFilterItem(item, label)}
                            </Col>
                        )
                    })}
                {groupFilters?.length ? (
                    <div className={styles['group-filter']}>
                        {groupFilters?.map(item => {
                            const label = typeof item.title === 'string' ? item.title : item.title?.[0]
                            return (
                                <Col
                                    key={item.key}
                                    {...(item.layout || { span: 24 })}
                                    className={item.inLine ? styles[item.type + 'InLine'] : ''}
                                    style={{ width: item.width }}
                                >
                                    {renderFilterItem(item, label)}
                                </Col>
                            )
                        })}
                    </div>
                ) : null}
            </>
        )
    }
    return (
        <>
            {visibleFilters?.length > 0 && (
                <div className={styles['container']}>
                    <Popover
                        placement= 'bottomRight'
                        overlayClassName={`${styles['overlay']} ${styles[filter.theme]}`}
                        open={open}
                        getPopupContainer={getContainer}
                        content={
                            <PopoverContent setVisible={setOpen}>
                                <div className={styles['content']}>
                                    <Form
                                        form={form}
                                        autoComplete="off"
                                        onFinish={handleSubmit}
                                        className={styles['content']}
                                    >
                                       <Row gutter={[12, 12]}>{renderFilters(visibleFilters)}</Row>
                                        <FormButtons
                                            onCancel={clearAll}
                                            cancelTitle="ClearAll"
                                            cancelButtonType="secondary-outlined"
                                            submitTitle="Apply"
                                        />
                                    </Form>
                                </div>
                            </PopoverContent>
                        }
                        trigger="click"
                    >
                        <Button typeButton="secondary-outlined" onClick={() => setOpen(prev => !prev)}>
                            <Filter2LineIcon size={18} /> <span>Filter</span>
                        </Button>
                    </Popover>
                </div>
            )}
            <Form
                form={form}
                name="frmFilterInline"
                autoComplete="off"
                className={styles['contentInLine']}
                onFinish={handleSubmit}
                style={{
                    flexDirection,
                    width,
                    alignItems,
                    display: visibleFiltersInLine?.length ? '' : 'none',
                    marginInlineStart: 10
                }}
            >
                {renderFilters(visibleFiltersInLine)}
                <button type="submit" style={{ display: 'none' }} id="btnSubmitFiltersInLine" />
            </Form>
        </>
    )
}

export default Filters
