import React, { useEffect, useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import cloneDeep from 'lodash/cloneDeep'
import isEmpty from 'lodash/isEmpty'
import { ExportToCsv } from 'export-to-csv'
import Spin from 'antd/lib/spin'
import QueryString from 'qs'
import { IButtons, ISearch } from '@features/General'
import Header from './Header'
import Table from './Table'
import Grid from './Grid'
import { IFilter } from './Header/Filters'
import Pagination from './Pagination'
import Button from '@UI/antd/Button/Button'
import { rootActions } from '@app-store/slices'
import { RootState } from '@app-store/store'
import { PageContext } from 'context'
import {
    STATUS,
    getLocationSearch,
    getValueFromKey,
    csvDownloadOptions,
    getDataIncludesSearch
} from '@features/General'
import TitleImage from './components/TitleImage'
import Actions from './components/Actions'
import IconActions from './components/IconActions'
import Badge from './components/Badge'
import DateTime from './components/DateTime'
import Avatar from './components/Avatar'
import BackTop from './BackTop'
import BlankList from './BlankList'
import useDataList from '@hooks/component/useDataList'
import { listSize } from 'config'
import styles from './index.scss'

interface IProps {
    title?: any
    tableView?: boolean
    gridView?: boolean
    isSmallDevice?: boolean
    dataSource?: any
    columns?: any
    blankListComponent?: any
    card?: { component: any }
    modelName?: string
    searchModelName?: string
    uiModelName?: string
    hasPagination?: boolean
    showQuickJumper?: boolean
    showMore?: boolean
    search?: ISearch
    theme?: string
    buttons?: IButtons[]
    dropdownButtonTitle?: string
    filter?: IFilter
    customQuery?: any
    searchQuery?: { key: string; value: string | string[] }[]
    onRowClick?: any
    scroll?: any
    loading?: boolean | null
    hasRowSelection?: boolean
    rowSelectionKey?: string
    sider?: any
    listHeader?: {
        component: React.ReactNode
        position?: 'top-list' | 'top-table'
    }[]
    showFiltersAsBadge?: boolean
    addFiltersToUrl?: boolean
    addPageToUrl?: boolean
    getExcelData?: (data: any) => any
    excelTitle?: string
    actionName?: string
    searchActionName?: string
    components?: any
    extraHeaders?: {
        key: string
        component?: React.ReactNode
        align?: 'left' | 'right'
        showWithData?: boolean
        hide?: boolean
    }[]
    goBack?: any
    rowKeys?: string[]
    filterAlign?: 'left' | 'right'
    expandable?: any
    extraFilterApplied?: boolean
    extraPayload?: any
    minFiltersNumberForElastic?: number
    listFiltersSearchReplacements?: { [key: string]: string }
    listFiltersSearchExtentionsReplacements?: { [key: string]: string }
    listSearchShouldFields?: { [key: string]: string | string[] }
}
// To-do:
/**
 remove limit state and use redux instead
 */
function DataList(props: IProps) {
    const {
        title = '',
        tableView = true,
        gridView = false,
        isSmallDevice = false,
        dataSource = [],
        columns = [],
        blankListComponent = <BlankList />,
        card = null,
        modelName = '',
        searchModelName = '',
        uiModelName = '',
        hasPagination = true,
        showMore = false,
        search = undefined,
        theme = 'theme-1',
        buttons = [],
        dropdownButtonTitle = '',
        filter = {},
        customQuery = {},
        searchQuery = [],
        onRowClick,
        scroll = undefined,
        loading = null,
        hasRowSelection = false,
        rowSelectionKey = '_id',
        sider = undefined,
        listHeader = [],
        showFiltersAsBadge = false,
        addFiltersToUrl = false,
        addPageToUrl = false,
        getExcelData = data => undefined,
        excelTitle = '',
        extraHeaders = [],
        actionName = 'list',
        searchActionName = '',
        components = {},
        goBack = false,
        rowKeys = ['_id'],
        filterAlign = 'left',
        expandable = undefined,
        extraFilterApplied = false,
        showQuickJumper = true,
        extraPayload = {},
        minFiltersNumberForElastic = 1,
        listFiltersSearchReplacements = {},
        listFiltersSearchExtentionsReplacements = {},
        listSearchShouldFields = {}
    } = props
    const dispatch = useDispatch()
    const [gridColumns, setGridColumns] = useState<any>(null)
    const [showMoreVisible, setShowMoreVisible] = useState<boolean>(false)
    const rowClickRef = React.useRef(false)
    const parsedQuery: any = QueryString.parse(location.search, { ignoreQueryPrefix: true })
    const UIModelName = useMemo(() => uiModelName || modelName, [uiModelName, modelName])
    const {
        searchType,
        searchValue,
        filters,
        pureFilters,
        sort,
        projection,
        pagination,
        needPopulate,
        populates,
        addPresignedURL,
        selectedRowKeys,
        hiddenColumns,
        preLoading
    } = useSelector((state: RootState) => state.ui[UIModelName])
    const { itemsPerPage, currentPage, total } = pagination
    const useElasticEndpoint = useMemo(() => {
        return (
            searchType === 'elastic' &&
            (searchValue?.trim() || Object.keys(filters).length >= minFiltersNumberForElastic)
        )
    }, [searchType, searchValue || '', JSON.stringify(filters), minFiltersNumberForElastic])
    const storeModelName = React.useMemo(
        () => (searchModelName && useElasticEndpoint ? searchModelName : modelName),
        [useElasticEndpoint, modelName, searchModelName]
    )
    const storeActionName = React.useMemo(
        () => (searchActionName && useElasticEndpoint ? searchActionName : actionName),
        [useElasticEndpoint, actionName, searchActionName]
    )

    const { data: storeDataList, status: gettingListStatus } = storeModelName
        ? useSelector((state: RootState) => state[storeModelName]?.[storeActionName])
        : { data: [], status: loading ? STATUS.RUNNING : STATUS.READY }
    const { getParams, validSearchValue, data, setData } = useDataList(
        { value: searchValue, ...search },
        filters,
        projection,
        pagination,
        pureFilters
    )
    const params = useMemo(() => {
        if (modelName) {
            return getParams(
                useElasticEndpoint,
                listFiltersSearchReplacements,
                listFiltersSearchExtentionsReplacements,
                listSearchShouldFields
            )
        }
    }, [
        modelName,
        useElasticEndpoint,
        // removeByIdHasError,
        currentPage,
        validSearchValue || '',
        JSON.stringify(filters),
        JSON.stringify(pureFilters),
        JSON.stringify(customQuery),
        searchType,
        JSON.stringify(extraPayload)
    ])
    const getList = React.useCallback(
        (sagaCB = undefined) => {
            if (modelName && preLoading !== true) {
                let query = { ...params.query }
                let searchFields = []
                if (useElasticEndpoint) {
                    searchFields = [...searchQuery, ...params.searchFields]
                } else {
                    query = { ...customQuery, ...params.query }
                }
                const paramsValues: any = {
                    ...extraPayload,
                    ...params.limit,
                    sort,
                    query,
                    searchFields,
                    searchExistenceFields: params.searchExistenceFields,
                    searchShouldFields: params.searchShouldFields,
                    searchText: params.searchText,
                    hasTotal: true,
                    ...params.necessaryProjectionArray,
                    addPresignedURL,
                    needPopulate,
                    populates,
                    sagaCB: {
                        onSuccess: response => {
                            if (typeof sagaCB === 'function') {
                                sagaCB()
                            }
                            dispatch(rootActions.ui[UIModelName].onChangeTotal(response.total || response.count || 0))
                        }
                    }
                }
                if (params.search) {
                    paramsValues.search = params.search
                }
                dispatch(rootActions[storeModelName][storeActionName].onRequest(paramsValues))
            }
        },
        [
            JSON.stringify(params),
            preLoading,
            JSON.stringify(populates),
            useElasticEndpoint,
            UIModelName,
            sort,
            JSON.stringify(customQuery)
        ]
    )

    useEffect(() => {
        if (searchValue === null) {
            if (addFiltersToUrl) {
                const params = getLocationSearch()
                dispatch(
                    rootActions.ui[UIModelName].onChangeSearch(params.find(item => item.key === 'Keyword')?.value || '')
                )
            } else {
                dispatch(rootActions.ui[UIModelName].onChangeSearch(''))
            }
        }
    }, [addFiltersToUrl, validSearchValue || '', UIModelName])

    useEffect(() => {
        return () => {
            if (!rowClickRef.current) {
                dispatch(rootActions.ui[UIModelName]?.onChangeSearch(''))
                dispatch(rootActions.ui[UIModelName]?.onResetFilters())
                dispatch(
                    rootActions.ui[UIModelName]?.onChangePagination({ currentPage: Number(parsedQuery?.page) || 1 })
                )
            }
        }
    }, [UIModelName])

    useEffect(() => {
        if (addFiltersToUrl) {
            const url: any = new URL(window.location.toString())
            if (searchValue?.trim()) {
                url.searchParams.set('Keyword', searchValue)
            } else {
                url.searchParams.delete('Keyword')
            }
            if (filters) {
                for (const fltKey in filters) {
                    const filterValue = filters[fltKey]
                    if (filterValue && filterValue.toString()?.toLowerCase() !== 'all') {
                        url.searchParams.set(fltKey, filterValue)
                    }
                }
            }
            window.history.pushState({}, '', url)
        }
    }, [addFiltersToUrl, JSON.stringify(filters), validSearchValue || ''])

    useEffect(() => {
        if (searchValue || searchValue === '') {
            getList()
        }
    }, [
        uiModelName,
        storeModelName,
        sort,
        // removeByIdHasError,
        currentPage,
        validSearchValue,
        JSON.stringify(pureFilters),
        JSON.stringify(customQuery),
        JSON.stringify(extraPayload),
        JSON.stringify(populates)
    ])

    const getListFromDataSource = () => {
        let data = cloneDeep(dataSource)

        if (['updatedAt', 'createdAt'].includes(sort)) {
            data = data.sort((a, b) => {
                if (sort.includes('-')) {
                    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
                } else {
                    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
                }
            })
        } else if (sort) {
            const sortKey = sort?.replace('-', '')
            data = data?.sort((a, b) => {
                if (sort.includes('-')) {
                    return a?.[sortKey]?.localeCompare(b?.[sortKey])
                } else {
                    return b?.[sortKey]?.localeCompare(a?.[sortKey])
                }
            })
        }
        const searchText = searchValue?.trim().toLowerCase()
        const page = (Number(parsedQuery?.page) || currentPage) - 1
        const pageItems = currentPage * itemsPerPage
        if (searchText && search?.fields?.length) {
            const newData = getDataIncludesSearch(data, search?.fields, searchText)
            if (hasPagination) {
                return newData?.splice(itemsPerPage * page, itemsPerPage)
            } else {
                return newData?.splice(0, pageItems)
            }
        }
        if (hasPagination) {
            const removed = data?.splice(itemsPerPage * page, itemsPerPage)
            return removed
        }
        return data?.splice(0, pageItems)
    }

    useEffect(() => {
        if (addPageToUrl) {
            if (parsedQuery?.page && parsedQuery.page !== currentPage && !isNaN(parsedQuery.page) && UIModelName) {
                dispatch(
                    rootActions.ui[UIModelName].onChangePagination({
                        currentPage: Number(parsedQuery.page || 1)
                    })
                )
            } else {
                const url: any = new URL(window.location.toString())
                url.searchParams.set('page', currentPage || 1)
                window.history.pushState({}, '', url)
            }
        }
    }, [])

    useEffect(() => {
        if ((modelName && gettingListStatus === STATUS.READY) || !modelName) {
            const result =
                modelName && showMore && currentPage > 1 ? data.splice(0, (currentPage - 1) * itemsPerPage) : []
            const dataList = modelName ? storeDataList : getListFromDataSource()
            dataList
                .filter(item => item?._id || item?.id)
                .forEach((record, index) => {
                    let rowItem = { recordData: record }
                    columns
                        .filter(col => col.hide !== true && !hiddenColumns?.includes(col.dataIndex || col.key))
                        .forEach(col => {
                            const dataIndex = col.dataIndex || col.key
                            if (col.visible === false) {
                                return null
                            }
                            let dataResult =
                                !col.fields?.length || col.type
                                    ? record[dataIndex]
                                    : col.fields.map(field => record[field]).join(' ')
                            if (col?.nestedKeys?.length) {
                                let x = 0
                                while (x < col?.nestedKeys?.length) {
                                    if (Array.isArray(dataResult)) {
                                        dataResult = dataResult.map(item => item[col?.nestedKeys[x]])
                                    } else {
                                        dataResult = dataResult[col?.nestedKeys[x]]
                                    }
                                    x++
                                }
                            }
                            let aliasIsApplied = false
                            if (col.aliasDataIndex && (typeof col.showAlias !== 'function' || col.showAlias(record))) {
                                dataResult = record[col.aliasDataIndex]
                                aliasIsApplied = true
                            }
                            if (col.arrayIndex !== undefined && dataResult?.[col.arrayIndex]) {
                                dataResult = dataResult[col.arrayIndex]
                            }
                            let content: any = ''
                            const extraData = typeof col.showExtraData === 'function' ? col.showExtraData(record) : ''

                            switch (col.type) {
                                case 'avatar':
                                    const text = getValueFromKey(record, col.fallbackTextColumns)
                                    content = (
                                        <div className={styles['user-activity']}>
                                            <Avatar
                                                img={dataResult}
                                                fallbackImage={col.fallbackImage}
                                                fallbackText={text}
                                                rowIndex={index}
                                                preview={col.preview}
                                            />
                                        </div>
                                    )
                                    break
                                case 'NestedTitleAndLogo':
                                case 'TitleAndLogo':
                                    let title = ''
                                    const fieldData = Array.isArray(dataResult) ? dataResult[0] : dataResult
                                    if (Array.isArray(col.titleField)) {
                                        col.titleField.forEach(item => {
                                            title +=
                                                (col.type === 'NestedTitleAndLogo'
                                                    ? fieldData?.[item] || ''
                                                    : record[item]) || '' + ' '
                                        })
                                    } else {
                                        title =
                                            col.type === 'NestedTitleAndLogo'
                                                ? dataResult?.[col.titleField]
                                                : record?.[col.titleField]
                                    }
                                    const fallbackText = getValueFromKey(record, col.fallbackTextColumns)
                                    const fieldResult = {
                                        img:
                                            col.type === 'NestedTitleAndLogo'
                                                ? dataResult?.[col.logoField]
                                                : record?.[col.logoField],
                                        fallbackImage: col?.fallbackImage,
                                        fallbackText,
                                        rowIndex: index,
                                        title: title?.trim(),
                                        description:
                                            col.showExtraData === true && record?.hostId?.jobTitle
                                                ? record.hostId.jobTitle + ' @ ' + record.hostId.company?.name
                                                : ''
                                    }
                                    content = title?.trim() ? (
                                        <TitleImage
                                            extraData={extraData}
                                            data={fieldResult}
                                            breakTitle={col.breakTitle}
                                            logoSize={col.logoSize || 46}
                                            onClick={e =>
                                                typeof col.onClick === 'function' ? col.onClick(e, record) : undefined
                                            }
                                        />
                                    ) : null
                                    break
                                case 'nested':
                                    content = aliasIsApplied ? (
                                        dataResult
                                    ) : Array.isArray(dataResult) ? (
                                        <span>
                                            {dataResult.map((x, idx) => {
                                                const nestedContent = (
                                                    <>
                                                        <span>
                                                            {col.fields.map(field => x?.[field] || '').join(' ')}
                                                        </span>
                                                        {idx < dataResult.length - 1 && (
                                                            <>
                                                                ,<br />
                                                            </>
                                                        )}
                                                    </>
                                                )
                                                if (col.isLink) {
                                                    return (
                                                        <Link
                                                            target={col.openNewTab ? '_blank' : ''}
                                                            to={() => col.to(record, idx)}
                                                        >
                                                            {nestedContent}
                                                        </Link>
                                                    )
                                                } else {
                                                    return nestedContent
                                                }
                                            })}
                                            <>{extraData}</>
                                        </span>
                                    ) : (
                                        <span>{getValueFromKey(dataResult, col.fields) + extraData}</span>
                                    )
                                    break
                                case 'actions':
                                    content = (
                                        <Actions
                                            actions={col.actions(record)}
                                            modelName={modelName}
                                            record={record}
                                            getList={getList}
                                            theme={col.theme}
                                        />
                                    )
                                    break
                                case 'iconActions':
                                    content = (
                                        <IconActions
                                            actions={col.actions(record)}
                                            modelName={modelName}
                                            record={record}
                                        />
                                    )
                                    break
                                case 'badge':
                                    const value = col?.fetchValue ? col?.fetchValue(record) : dataResult
                                    content = (
                                        <Badge
                                            extraData={extraData}
                                            value={value}
                                            bg={col.bg}
                                            column={col}
                                            record={record}
                                        />
                                    )
                                    if (isSmallDevice && !card) {
                                        const _rowMain = columns.find(
                                            x => x.type === 'NestedTitleAndLogo' || x.type === 'TitleAndLogo'
                                        )
                                        const titleAndLogoContent = rowItem[_rowMain?.dataIndex || _rowMain?.key]
                                        if (titleAndLogoContent) {
                                            content = (
                                                <div style={{ display: 'flex' }}>
                                                    {titleAndLogoContent}
                                                    <div style={{ marginInlineStart: 'auto' }}>{content}</div>
                                                </div>
                                            )
                                            rowItem[_rowMain.dataIndex || _rowMain.key] = content
                                            content = ''
                                        }
                                    }
                                    break
                                case 'dateTime':
                                    let dataResultValue = dataResult
                                    if (col.fields?.length && dataResult)
                                        dataResultValue = col.fields.map(field => dataResult[field])
                                    content = (
                                        <DateTime
                                            value={dataResultValue}
                                            format={col.format}
                                            startTime={record?.startTime}
                                            endTime={record?.endTime}
                                            visible={typeof col.hide === 'function' ? !col.hide(record) : !col.hide}
                                        />
                                    )
                                    break
                                case 'button':
                                    if (
                                        typeof col.hide === 'function'
                                            ? !col.hide(record)
                                            : col.hide === undefined
                                            ? true
                                            : !col.hide
                                    ) {
                                        content = (
                                            <Button
                                                typeButton={
                                                    typeof col.typeButton === 'function'
                                                        ? col.typeButton(record)
                                                        : col.typeButton
                                                }
                                                onClick={e => col.onClick(record, e)}
                                            >
                                                {typeof col.buttonTitle === 'function'
                                                    ? col.buttonTitle(record)
                                                    : col.buttonTitle}
                                            </Button>
                                        )
                                    } else content = ''
                                    break
                                case 'nestedLineClamp':
                                case 'lineClamp':
                                    if (col.type === 'nestedLineClamp') {
                                        dataResult = dataResult[col.fields[0]]
                                    }
                                    if (!col.editable) {
                                        content = (
                                            <span className="line-clamp" style={{ WebkitLineClamp: col.lines || 3 }}>
                                                {dataResult || ''}
                                            </span>
                                        )
                                    } else if (col.width) {
                                        content = <div style={{ width: col.width }}>{dataResult}</div>
                                    } else {
                                        content = dataResult
                                    }
                                    break
                                case 'amount':
                                    content = (
                                        <>
                                            {dataResult.toLocaleString('en-US', {
                                                minimumFractionDigits: 2
                                            })}
                                        </>
                                    )
                                    break
                                default:
                                    dataResult = col?.fetchValue ? col?.fetchValue(record) : dataResult
                                    if (extraData) {
                                        content = (
                                            <>
                                                {dataResult}
                                                {extraData}
                                            </>
                                        )
                                    } else {
                                        if (col.width) {
                                            content = <div style={{ width: col.width }}>{dataResult}</div>
                                        } else {
                                            content = dataResult
                                        }
                                    }
                                    break
                            }
                            if (
                                col.type !== 'nested' &&
                                ((((col?.linkParamKey && record[col?.linkParamKey]) ||
                                    (!col?.linkParamKey && record._id)) &&
                                    !isSmallDevice) ||
                                    (isSmallDevice && !card)) &&
                                (typeof col.isLink === 'function' ? col.isLink(record) : col.isLink)
                            ) {
                                content = (
                                    <div
                                        className="flex"
                                        style={{
                                            flexDirection: 'column',
                                            alignItems: 'flex-start',
                                            gap: 0
                                        }}
                                    >
                                        <Link target={col.openNewTab ? '_blank' : ''} to={() => col.to(record)}>
                                            {content}
                                        </Link>
                                    </div>
                                )
                            }
                            if (typeof col.iconRender === 'function') {
                                const icon: any = col.iconRender(record)
                                if (icon?.component) {
                                    content = (
                                        <>
                                            {content}
                                            <icon.component {...icon.props} />
                                        </>
                                    )
                                }
                            }

                            rowItem[col.key || col.dataIndex] = content
                        })
                    rowItem = { ...record, ...rowItem }
                    result.push(rowItem)
                })
            setData(result)
            if (isSmallDevice && !card) {
                setGridColumns(columns)
            } else {
                setGridColumns(null)
            }
        }
    }, [
        JSON.stringify(storeDataList),
        currentPage,
        JSON.stringify(columns),
        modelName,
        JSON.stringify(dataSource),
        validSearchValue || '',
        sort,
        JSON.stringify(hiddenColumns)
    ])

    useEffect(() => {
        if (!showMore && !modelName && dataSource) {
            dispatch(rootActions.ui[UIModelName].onChangeTotal(dataSource.length))
        }
        if (showMore && data?.length) {
            const pageItems = currentPage * itemsPerPage
            if (dataSource?.length) {
                setShowMoreVisible(pageItems < dataSource.length)
            } else {
                setShowMoreVisible(pageItems < total)
            }
        }
    }, [showMore, JSON.stringify(data), UIModelName, currentPage, itemsPerPage, JSON.stringify(dataSource)])

    const onDownload = () => {
        const csvExporter = new ExportToCsv(
            csvDownloadOptions(`${modelName || uiModelName}-${new Date().getTime()}`, excelTitle)
        )
        if (modelName) {
            let exlData = []
            const skip = 0
            const getData = skip => {
                dispatch(
                    rootActions[modelName][actionName].onRequest({
                        ...extraPayload,
                        sort,
                        query: { ...customQuery, ...params.query },
                        hasTotal: true,
                        ...params.necessaryProjectionArray,
                        needPopulate,
                        populates,
                        skip,
                        limit: listSize,
                        noSaveInStore: true,
                        sagaCB: {
                            onSuccess: response => {
                                exlData = [...exlData, ...(response.data || response)]
                                skip += listSize
                                if (response.total > skip) {
                                    getData(skip)
                                } else {
                                    const csvData = getExcelData(exlData)
                                    csvExporter.generateCsv(csvData)
                                }
                            }
                        }
                    })
                )
            }
            getData(skip)
        } else {
            const csvData = getExcelData(dataSource)
            csvExporter.generateCsv(csvData)
        }
    }

    const noData = useMemo(
        () => !data?.length && !searchValue?.trim() && isEmpty(filters) && !extraFilterApplied,
        [JSON.stringify(data), searchValue, JSON.stringify(filters), extraFilterApplied]
    )
    return (
        <PageContext.Provider
            value={{
                search,
                buttons,
                title,
                modelName: UIModelName,
                selectedRowKeys,
                hiddenColumns,
                getList,
                showFiltersAsBadge,
                onDownload,
                filter,
                onRowClick: record => {
                    rowClickRef.current = true
                    if (typeof onRowClick === 'function') {
                        onRowClick(record)
                    }
                },
                dataSource: cloneDeep(data),
                columns,
                gridColumns,
                scroll,
                hasRowSelection,
                rowSelectionKey,
                extraHeaders,
                components,
                goBack,
                rowKeys,
                dropdownButtonTitle,
                filterAlign,
                noData,
                expandable,
                disableHideColumns: !tableView,
                blankListComponent,
                showQuickJumper,
                searchActionName
            }}
        >
            <Spin spinning={gettingListStatus === STATUS.RUNNING}>
                <div className={styles[theme]}>
                    {(title || search || buttons?.length > 0) && <Header />}
                    <div className={styles.content}>
                        {listHeader
                            .filter(lh => lh.position === 'top-list')
                            .map((lh, index) => (
                                <div key={`list-header-${index}`}>{lh.component}</div>
                            ))}
                        <div className={styles.list}>
                            {sider && <div style={{ width: sider.width }}>{sider.component}</div>}
                            <div
                                className={styles.data}
                                style={{ width: sider && !isSmallDevice ? `calc(100% - ${sider?.width}px)` : '100%' }}
                            >
                                {listHeader
                                    .filter(lh => lh.position !== 'top-list')
                                    .map((lh, index) => (
                                        <div key={`list-header-${index}`}>{lh.component}</div>
                                    ))}
                                {blankListComponent &&
                                !extraFilterApplied &&
                                gettingListStatus !== STATUS.RUNNING &&
                                !data?.length ? (
                                    <>{blankListComponent}</>
                                ) : (
                                    <>
                                        {tableView && <Table />}
                                        {(gridView || isSmallDevice) && card && <Grid card={card} />}
                                        {hasPagination && (
                                            <Pagination
                                                modelName={UIModelName}
                                                showQuickJumper={showQuickJumper}
                                                addPageToUrl={addPageToUrl}
                                            />
                                        )}
                                        {showMore && showMoreVisible && (
                                            <div className={styles['show-more-container']}>
                                                <span>{`Total ${modelName ? total : dataSource.length} items`}</span>
                                                <Button
                                                    typeButton="secondary-outlined"
                                                    onClick={() =>
                                                        dispatch(
                                                            rootActions.ui[uiModelName]?.onChangePagination({
                                                                currentPage: currentPage + 1
                                                            })
                                                        )
                                                    }
                                                >
                                                    ShowMore
                                                </Button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Spin>
            <BackTop />
        </PageContext.Provider>
    )
}

export default DataList
