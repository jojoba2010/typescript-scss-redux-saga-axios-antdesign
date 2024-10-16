import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import dayjs from 'dayjs'
import cx from 'classnames'
import weekday from 'dayjs/plugin/weekday'
import localeData from 'dayjs/plugin/localeData'
import isEmpty from 'lodash/isEmpty'
import startCase from 'lodash/startCase'
import uniq from 'lodash/uniq'
import Form from 'antd/lib/form'
import Row from 'antd/lib/grid/row'
import Col from 'antd/lib/grid/col'
import Button from '@UI/antd/Button/Button'
import Popover from '@UI/antd/Popover/Popover'
import Tooltip from '@UI/antd/Tooltip'
import Filter2LineIcon from 'remixicon-react/Filter2LineIcon'
import SaveLineIcon from 'remixicon-react/SaveLineIcon'
import RadioField from '@UI/Form/Fields/Radio'
import SelectField from '@UI/Form/Fields/select'
import DynamicSelectField from '@UI/Form/Fields/DynamicSelect'
import TreeSelectField from '@UI/Form/Fields/TreeSelect'
import DatePickerField from '@UI/Form/Fields/datePicker'
import RangePickerField from '@UI/Form/Fields/rangePicker'
import CheckboxField from '@UI/Form/Fields/GroupCheckbox'
import InputField from '@UI/Form/Fields/input'
import InputNumberField from '@UI/Form/Fields/InputNumber'
import SwitchField from '@UI/Form/Fields/Switch'
import TriStateField from '@UI/Form/Fields/TriState'
import FormButtons from '@UI/Form/FormButtons'
import useUser from '@hooks/processor/useUser'
import { RootState } from '@app-store/store'
import { rootActions } from '@store/slices'
import { LOCALSTORAGE_KEYS, IFilters, ISideFilters } from '@features/General'
import PopoverContent from '@UI/PopoverContent'
import styles from './index.scss'

dayjs.extend(weekday)
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
    const { appDirection } = useUser()
    const { pureFilters } = useSelector((state: RootState) => state.ui[modelName])
    const { data: i18n } = useSelector((state: RootState) => state.localization.locals)
    const contactInfo: any = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEYS.CONTACT_INFO))
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
                if (filterItem.type === 'dateTime') {
                    if (filterItem.range || filterItem.rangeKey) {
                        if (filterItem.rangeKey) {
                            filters[filterItem.key] = {
                                $lte: getStartOrEndTimeOfDate(values[key], 'end'),
                                $gte: getStartOrEndTimeOfDate(values[key])
                            }
                        } else {
                            filters.startTime = {
                                $gte: getStartOrEndTimeOfDate(values[key])
                            }
                            filters.endTime = {
                                $lte: getStartOrEndTimeOfDate(values[key], 'end')
                            }
                        }
                    } else {
                        filters[key] = values[key]
                    }
                } else if (filterItem.type === 'rangeDate') {
                    const rangeDate = values[key]
                    if (rangeDate.length) {
                        if (rangeDate[0]) {
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
                        }
                    }
                } else if (filterItem.type === 'checkbox') {
                    if (values[key]) {
                        if (filterItem.orOtherItemsKeys) {
                            if (!filters.$and) {
                                filters.$and = []
                            }
                            const filterValue = { $or: [{ [key]: filterItem.greaterThanZero ? { $gt: 0 } : true }] }
                            filterItem.orOtherItemsKeys.forEach(item => {
                                if (values[item]) {
                                    filterValue.$or.push({ [item]: filterItem.greaterThanZero ? { $gt: 0 } : true })
                                    pureFilters[item] = values[item]
                                }
                                filters.$and.push(filterValue)
                            })
                        } else if (Array.isArray(values[key])) filters[key] = values[key]
                        else {
                            filters[key] = filterItem.greaterThanZero ? { $gt: 0 } : true
                        }
                    }
                } else if (filterItem.type === 'tri-state') {
                    if (values[key] !== 'all') {
                        if (filterItem.getQuery) {
                            filters[filterItem.queryKeys?.[0] || key] = filterItem.getQuery(values[key])
                        } else {
                            filters[filterItem.queryKeys?.[0] || key] = values[key]
                        }
                    }
                } else if (filterItem.type === 'price') {
                    if (filterItem.range) {
                        const priceFilter: any = {}
                        if (values[filterItem.key + '--from']) {
                            priceFilter.$gte = values[filterItem.key + '--from']
                            pureFilters[filterItem.key + '--from'] = values[filterItem.key + '--from']
                        }
                        if (values[filterItem.key + '--to']) {
                            priceFilter.$lte = values[filterItem.key + '--to']
                            pureFilters[filterItem.key + '--to'] = values[filterItem.key + '--to']
                        }
                        filters[filterItem.key] = priceFilter
                    }
                } else if (filterItem.type === 'switch' && filterItem.key === 'hostId') {
                    if (values[key]) {
                        if (filterItem.queryKeys) {
                            if (!filters.$and) {
                                filters.$and = []
                            }
                            const filterValue = {
                                $or: filterItem.queryKeys.map(q => ({
                                    [q]: { $in: contactInfo?._id }
                                }))
                            }
                            filters.$and.push(filterValue)
                        } else {
                            filters[key] = { $in: [contactInfo?._id] } //values[key]
                        }
                    }
                } else if (filterItem.getQuery) {
                    const filterValue = filterItem.getQuery(values[key])
                    Object.assign(filters, filterValue)
                } else {
                    const allValues = filterItem.type !== 'tree-select' ? values[key] : uniq(values[key])
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
            case 'radio':
                return (
                    <RadioField
                        name={data.key}
                        label={label}
                        optionType="default"
                        options={
                            Array.isArray(data.values)
                                ? data.values
                                : Object.keys(data.values).reduce(
                                      (prev, key) => [
                                          ...prev,
                                          {
                                              label: startCase(data.values[key]),
                                              value: data.values[key]
                                          }
                                      ],
                                      data.showAll ? [{ label: i18n?.General?.All, value: 'all' }] : []
                                  )
                        }
                    />
                )
            case 'select':
                return (
                    <>
                        {data.values ? (
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
                        ) : (
                            <Form.Item
                                noStyle
                                shouldUpdate={(prev, next) =>
                                    prev?.[data.dependencyFilter] !== next?.[data.dependencyFilter]
                                }
                            >
                                {({ getFieldValue }) => {
                                    const query = data.query || {}
                                    const dependencyFilterValue = getFieldValue(data.dependencyFilter)
                                    if (data.dependencyFilter && dependencyFilterValue) {
                                        query[data.dependencyFilterKey || data.dependencyFilter] =
                                            typeof dependencyFilterValue === 'string'
                                                ? getFieldValue(data.dependencyFilter)
                                                : { $in: dependencyFilterValue }
                                    }
                                    return (
                                        <DynamicSelectField
                                            module={data.modelName || data.key}
                                            projections={data.projection}
                                            listName={data.listName || 'list'}
                                            hasCustomOptions={data.hasCustomOptions || false}
                                            valueOption={data.valueOption || '_id'}
                                            name={data.key}
                                            query={query}
                                            label={label}
                                            sort={data.sort}
                                            disabled={data.dependencyFilter ? !dependencyFilterValue : false}
                                            displayOption={data.labelField}
                                            searchKeys={data.searchableFields}
                                            multiple={data.multiple}
                                            lazy={(pureFilters?.[data.key]?.length || 0) === 0}
                                            maxTagCount="responsive"
                                            extraParams={data.extraParams || {}}
                                            onChange={data.inLine ? handleSubmitFiltersInLine : data.onChange}
                                        />
                                    )
                                }}
                            </Form.Item>
                        )}
                    </>
                )
            case 'tree-select':
                return (
                    <TreeSelectField
                        module={data.modelName || data.key}
                        projections={data.projection}
                        listName={data.listName || 'list'}
                        valueOption={data.valueOption || '_id'}
                        name={data.key}
                        limit={data.limit || 0}
                        query={data.query || {}}
                        label={label}
                        sort={data.sort}
                        displayOption={data.labelField}
                        searchKeys={data.searchableFields}
                        multiple={data.multiple}
                        parentKey={data.parentKey}
                        maxTagCount="responsive"
                    />
                )
            case 'dateTime':
                return <DatePickerField name={data.key} label={label} hasFeedback={false} />
            case 'rangeDate':
                return (
                    <RangePickerField name={data.key} label={label} hasFeedback={false} getContainer={getContainer} />
                )
            case 'tri-state':
                return <TriStateField name={data.key} label={data.title} />
            case 'checkbox':
                return (
                    <div className={styles['check-box-filter']}>
                        <CheckboxField
                            name={data.key}
                            options={
                                Array.isArray(data.values) ? data.values : [{ label: data.title, value: data.key }]
                            }
                        />
                    </div>
                )
            case 'input':
                return (
                    <div className={styles['check-box-filter']}>
                        <InputField name={data.key} label={label} />
                    </div>
                )
            case 'switch':
                return <SwitchField name={data.key} label={data.title} onChange={handleSubmitFiltersInLine} />
            case 'price':
                return (
                    <div className={styles['price-filter']}>
                        <InputNumberField name={`${data.key}--from`} label={data.title[0]} min={0} />
                        <InputNumberField name={`${data.key}--to`} label={data.title[1]} />
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
                    <SaveSearchModal modelName={modelName} i18n={i18n} />
                    <Popover
                        placement={appDirection === 'ltr' ? 'bottomLeft' : 'bottomRight'}
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
                                        <Tooltip title={i18n?.General.SaveYourSearch || 'Save your search'}>
                                            <SaveLineIcon
                                                className={cx(styles.saveIcon, {
                                                    [styles.absolute]:
                                                        visibleFilters?.[0]?.layout?.span === 24 ||
                                                        !visibleFilters?.[0]?.layout
                                                })}
                                                size={20}
                                                onClick={() => {
                                                    setOpen(false)
                                                    dispatch(
                                                        rootActions.ui.general.changeSaveSearchModalVisiblity(true)
                                                    )
                                                }}
                                            />
                                        </Tooltip>
                                        <Row gutter={[12, 12]}>{renderFilters(visibleFilters)}</Row>
                                        <FormButtons
                                            onCancel={clearAll}
                                            cancelTitle={i18n?.General?.ClearAll}
                                            cancelButtonType="secondary-outlined"
                                            extraButtons={[
                                                {
                                                    title: i18n?.General?.AdvancedFilter || 'Advanced Filter',
                                                    type: 'secondary-ghost',
                                                    visible: !!filter.advancedFilter,
                                                    className: styles['advancedLink'],
                                                    onClick: () => {
                                                        dispatch(
                                                            rootActions.ui[modelName].changeSideFilterVisibility(true)
                                                        )
                                                        setOpen(false)
                                                    }
                                                }
                                            ]}
                                            submitTitle={i18n?.General?.Apply}
                                        />
                                    </Form>
                                </div>
                            </PopoverContent>
                        }
                        trigger="click"
                    >
                        <Button typeButton="secondary-outlined" onClick={() => setOpen(prev => !prev)}>
                            <Filter2LineIcon size={18} /> <span>{i18n?.General?.Filter}</span>
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
