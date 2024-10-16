import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import isEmpty from 'lodash/isEmpty'
import debounce from 'lodash/debounce'
import classNames from 'classnames'
import XArrowIcon from '@UI/XArrowIcon'
import SelectField from '@UI/Form/Fields/select'
import DynamicSelectField from '@UI/Form/Fields/DynamicSelect'
import DatePickerField from '@UI/Form/Fields/datePicker'
import RangePickerField from '@UI/Form/Fields/rangePicker'
import CheckboxField from '@UI/Form/Fields/GroupCheckbox'
import InputField from '@UI/Form/Fields/input'
import Form from 'antd/lib/form'
import { PageContext } from 'context'
import { RootState } from '@app-store/store'
import { rootActions } from '@store/slices'
import TreeField from '@UI/Form/Fields/TreeField'
// import FieldWrapper from './FieldWrapper'
import styles from './index.scss'

const SideFilters = () => {
    const { modelName, filter } = React.useContext(PageContext)
    const [lastOpenLevel, setLastOpenLevel] = React.useState<number>(0)
    const [subMenu, setSubMenu] = React.useState([])
    const [visibleSubMenu, setVisibleSubMenu] = React.useState('')
    const [form] = Form.useForm()
    const dispatch = useDispatch()
    const { pureFilters, openSideFilter: open } = useSelector((state: RootState) => state.ui[modelName])
    const { data: i18n } = useSelector((state: RootState) => state.localization.locals)

    useEffect(() => {
        dispatch(rootActions.ui[modelName].changeSideFilterVisibility(false))
        setLastOpenLevel(0)
    }, [modelName])

    useEffect(() => {
        setSubMenu([])
        setVisibleSubMenu('')
    }, [modelName])

    useEffect(() => {
        if (!open) {
            setVisibleSubMenu('')
        }
    }, [open])

    const toggleMenu = () => {
        if (!open) {
            dispatch(rootActions.ui[modelName].changeSideFilterVisibility(true))
        } else {
            if (lastOpenLevel > 0) {
                const clonedSubMenu = [...subMenu]
                clonedSubMenu.splice(clonedSubMenu.length - 1, 1)
                setVisibleSubMenu(clonedSubMenu.length ? clonedSubMenu[clonedSubMenu.length - 1].key : '')
                // setSubMenu(clonedSubMenu)
            } else {
                dispatch(rootActions.ui[modelName].changeSideFilterVisibility(false))
            }
            setLastOpenLevel(prev => prev - 1)
        }
    }

    const findChildMenu = (item, level: number) => {
        const itemLevel = subMenu.findIndex(x => x.key === item.key)
        const clonedSubMenu = [...subMenu]

        if (isEmpty(item.children)) {
            return undefined
        }

        if (!open) {
            dispatch(rootActions.ui[modelName].changeSideFilterVisibility(true))
        }

        if (level === 1) {
            setSubMenu(state => {
                if (state.findIndex(x => x.key === item.key) === -1) {
                    return [...state, item]
                } else return state
            })
            return setVisibleSubMenu(item.key)
        }

        if (level === itemLevel + 1) {
            clonedSubMenu[level + 1] = item
            return setSubMenu(clonedSubMenu)
        }

        if (!isEmpty(item) && itemLevel === -1) {
            return setSubMenu([...subMenu, item])
        }
    }

    // const clearAll = () => {
    //     dispatch(rootActions.ui[modelName].onResetFilters())
    //     form.resetFields()
    // }

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
    }, [])

    const handleChange = (value, filter) => {
        if (!value || (Array.isArray(value) && !value.length)) {
            const key = filter.queryKeys?.length ? filter.queryKeys[0] : filter.key
            if (filter.applyInMatchPopulateKey) {
                dispatch(rootActions.ui[modelName].removeMatchFromPopulate({ key: filter.applyInMatchPopulateKey }))
            } else {
                dispatch(rootActions.ui[modelName].onRemoveFilter(key))
            }
            dispatch(rootActions.ui[modelName].onRemovePureFilter(filter.key))
        } else {
            const result: any = {}
            const pureFilters: any = {}
            if (filter.queryKeys?.length > 1) {
                if (!result.$and) {
                    result.$and = []
                }
                const filterValue = {
                    $or: filter.queryKeys.map(q => ({
                        [q]: Array.isArray(value) ? { $in: value } : value
                    }))
                }
                result.$and.push(filterValue)
            } else if (filter.type === 'input') {
                result[filter.key] = value?.trim() ? { $regex: `(?i)${value}` } : ''
            } else {
                result[filter.queryKeys?.length ? filter.queryKeys[0] : filter.key] = value
            }
            pureFilters[filter.key] = value
            if (filter.applyInMatchPopulateKey) {
                dispatch(
                    rootActions.ui[modelName].addMatchToPopulate({ key: filter.applyInMatchPopulateKey, value: result })
                )
            } else {
                dispatch(rootActions.ui[modelName].onAddFilter(result))
            }
            dispatch(rootActions.ui[modelName].onAddPureFilter(pureFilters))
        }
    }

    const renderFields = data => {
        switch (data.type) {
            case 'select':
                return (
                    <>
                        {data.values ? (
                            <SelectField
                                name={data.key}
                                label={data.title}
                                options={Object.keys(data.values).map(key => ({
                                    label: data.values[key],
                                    value: data.values[key]
                                }))}
                                multiple={data.multiple}
                                allowClear
                                onChange={value => handleChange(value, data)}
                                maxTagCount="responsive"
                                fieldKey="sider-"
                            />
                        ) : (
                            <DynamicSelectField
                                module={data.modelName || data.key}
                                projections={data.projection}
                                listName={data.listName || 'list'}
                                hasCustomOptions={data.hasCustomOptions || false}
                                valueOption={data.valueOption || '_id'}
                                name={data.key}
                                query={data.query || {}}
                                label={data.title}
                                sort={data.sort}
                                displayOption={data.labelField}
                                searchKeys={data.searchableFields}
                                multiple={data.multiple}
                                allowClear
                                lazy={(pureFilters?.[data.key]?.length || 0) === 0}
                                onChange={value => handleChange(value, data)}
                                maxTagCount="responsive"
                                fieldKey="sider-"
                            />
                        )}
                    </>
                )
            case 'input':
                return (
                    <InputField
                        name={data.key}
                        label={data.title}
                        // onChange={value => handleChange(value, data)}
                        onChange={debounce(function (e) {
                            handleChange(e.target.value, data)
                        }, 1000)}
                    />
                )
            case 'dateTime':
                return <DatePickerField name={data.key} label={data.title} hasFeedback={false} />
            case 'rangeDate':
                return <RangePickerField name={data.key} label={data.title} hasFeedback={false} />
            case 'checkbox':
                return (
                    <div className={styles['check-box-filter']}>
                        <CheckboxField name={data.key} options={[{ label: data.title, value: data.key }]} />
                    </div>
                )
            case 'tree':
                return (
                    <div>
                        <TreeField
                            name={data.key}
                            module={data.modelName || data.key}
                            projections={data.projection}
                            levels={2}
                            label={data.title}
                            onChange={value => handleChange(value, data)}
                        />
                    </div>
                )
        }
    }

    const renderParent = (data, showArrowIcon) => (
        <>
            <div>
                <data.icon size={20} />
                {data.title}
            </div>
            {showArrowIcon && (
                <div className={styles['forward-arrow']}>
                    <XArrowIcon reverse />
                </div>
            )}
        </>
    )

    return (
        <div
            className={classNames(styles['filter'], styles[`is-open-level-${lastOpenLevel}`], {
                [styles['is-open']]: open
            })}
        >
            <Form form={form}>
                <div className={styles['filter-header']}>
                    <span onClick={() => toggleMenu()}>
                        <XArrowIcon fill reverse={!open} />
                        {open ? <div className={styles['filter-header-text']}>{i18n?.TradeHub?.Hide_Panel}</div> : null}
                    </span>
                </div>
                <div className={styles['filter-content']}>
                    <ul className={styles['menu']}>
                        {filter?.sideList.map(item => (
                            <li
                                className={classNames({
                                    [styles['active']]: item.key === visibleSubMenu,
                                    [styles.withIcon]: !!item.icon,
                                    [styles.closed]: !open,
                                    [styles.hide]: item.hide === true || (!item.icon && !open)
                                })}
                                key={item.key}
                                onClick={() => {
                                    if (item.children) {
                                        setLastOpenLevel(1)
                                        findChildMenu(item, 1)
                                    }
                                }}
                            >
                                {!item.icon ? renderFields(item) : renderParent(item, open)}
                            </li>
                        ))}
                    </ul>
                    {subMenu.map((menu, index) => (
                        <ul
                            key={index}
                            className={classNames(styles['menu'], styles['sub-menu'], {
                                [styles.hide]: !menu.children,
                                [styles.hide]: menu.key !== visibleSubMenu
                            })}
                        >
                            {menu.children.map(item => (
                                <li
                                    key={item.key}
                                    className={classNames({
                                        [styles.tree]: item.type === 'tree'
                                    })}
                                    onClick={() => {
                                        if (!item.type) {
                                            setLastOpenLevel(2)
                                            findChildMenu(item, index)
                                        }
                                    }}
                                >
                                    {renderFields(item)}
                                    {!item.type && (
                                        <div
                                            className={classNames(styles['sub-menu-item'], {
                                                [styles['active']]: subMenu.findIndex(x => x.key === item.key) > -1
                                            })}
                                        >
                                            {renderParent(item, !isEmpty(item.children))}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ))}
                </div>
            </Form>
        </div>
    )
}

export default SideFilters
