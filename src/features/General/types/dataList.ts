import { buttonTypes } from '@UI/antd/Button/Button'

export interface IColumn {
    title?: string
    dataIndex?: string
    aliasDataIndex?: string
    key: string
    nestedKeys?: string[]
    arrayIndex?: number
    handleSave?: any
    updateCell?: any
    allowHide?: boolean
    staticEnumModule?: string
    staticEnumKey?: string
    preview?: boolean
    type?:
        | 'NestedTitleAndLogo'
        | 'TitleAndLogo'
        | 'nested'
        | 'actions'
        | 'iconActions'
        | 'renderHtml'
        | 'badge'
        | 'dateTime'
        | 'attendees'
        | 'matchPercent'
        | 'button'
        | 'lineClamp'
        | 'nestedLineClamp'
        | 'avatar'
        | 'companies'
        | 'image'
        | 'amount'
        | 'progress'
    lines?: number
    className?: string
    attendeesType?: 'users' | 'usersWithCommunicationCard' | 'emails' | 'countries' | 'phones'
    companiesType?: 'names' | 'emails' | 'countries' | 'phones'
    hostsField?: string
    guestField?: string
    hostCompanyField?: string
    guestCompanyField?: string
    fields?: string[]
    logoField?: string
    logoSize?: number
    titleField?: string | string[]
    fallbackImage?: any
    width?: string | number
    align?: 'right' | 'left'
    fetchValue?: any
    bg?: any
    isLink?: any
    progressField?: string
    breakTitle?: boolean
    showExtraData?: any
    to?: any
    linkParamKey?: string
    openNewTab?: boolean
    format?:
        | string
        | {
              date: string
              time: string
          }
    timezone?: string
    actions?: (record) => {
        key: string
        title: string
        id?: string
        icon?: any
        img?: any
        hide?: boolean
        checkAbility?: boolean | undefined
        abilityService?: string
    }[]
    percent?: boolean
    satisfied?: (value) => boolean
    matchAvailable?: boolean
    typeButton?: any
    buttonTitle?: string | ((record) => string)
    hide?: boolean | ((value) => boolean)
    onClick?: any
    sorter?: boolean
    defaultSortOrder?: any
    editable?: boolean
    render?: any
    options?: any
    onChange?: any
    iconRender?: (record: any) => any
    fallbackTextColumns?: string[]
    theme?: string
    showActions?: boolean
    labelTagModelName?: string
    labelTagActionName?: string
    labelTagType?: string
    labelTagField?: string
    labelTagShowInLine?: boolean
    hasLabelTag?: boolean
    showUserActivityStatus?: boolean
}

export type IButtons = {
    key: string
    type?: buttonTypes
    title?: string
    disabled?: boolean
    onClick?: any
    options?: any
    icon?: any
    image?: any
    abilityService?: string
    abilityAction?: string
    hide?: boolean
    showWhenRowsSelected?: boolean
    align?: 'left' | 'right'
    groupRemove?: boolean
    modelTitle?: string
    downloadList?: boolean
    loading?: boolean
    showAsDropDown?: boolean
    showWithData?: boolean
    tooltip?: string
    refreshList?: boolean
    confirm?: {
        title?: string
        deleteTitle?: string
        storeField?: string
        okText?: any
        actionName?: string
        modelName?: string
        sagaCB?: {
            onSuccess: any
        }
    }
    hasPadding?: boolean
}

export type IFilters = {
    key: string
    modelName?: string
    listName?: string
    extraParams?: any
    hasCustomOptions?: boolean
    valueOption?: string
    title: string | string[]
    limit?: number
    type:
        | 'select'
        | 'tree-select'
        | 'dateTime'
        | 'rangeDate'
        | 'checkbox'
        | 'input'
        | 'price'
        | 'switch'
        | 'radio'
        | 'tri-state'
        | 'tree'
    queryKeys?: string[]
    query?: any
    projection?: string[]
    hide?: boolean
    values?: any
    sort?: string
    labelField?: string | string[]
    logoField?: string
    searchableFields?: string[]
    multiple?: boolean
    range?: boolean
    rangeKey?: boolean
    greaterThanZero?: boolean
    orOtherItemsKeys?: string[]
    align?: string
    inLine?: boolean
    getQuery?: (e: any) => any
    layout?: any
    showAll?: boolean
    parentKey?: string
    width?: number
    applyInMatchPopulateKey?: string
    showAsGroup?: boolean
    onChange?: (e: any) => void
    dependencyFilter?: string
    dependencyFilterKey?: string
}

type SideFilter = {
    key: string
    title: string
    icon?: any
    children: IFilters[]
    applyInMatchPopulateKey?: string
}

export type ISideFilters = {
    key: string
    title: string
    icon?: any
    type?: string
    values?: any
    queryKeys?: string[]
    labelField?: string
    projection?: string[]
    searchableFields?: string[]
    multiple?: boolean
    layout?: any
    modelName?: string
    listName?: string
    hasCustomOptions?: boolean
    sort?: any
    valueOption?: string
    hide?: boolean
    rangeKey?: boolean
    query?: any
    children?: (IFilters | SideFilter)[]
}

export type ISearch =
    | {
          placeholder?: string
          align?: string
          width?: number | string
          fields: string[]
          hasQuerySearch?: boolean // use for apply search in query beside the search parameter
          hasSearchParam?: boolean // use for send search parameter directly to endpoint
      }
    | undefined
