import { useEffect, useMemo, useState } from 'react'
import { getQuery, getSearchApiQuery } from '@features/General'

const useDataList = (search, filters, projection, pagination, pureFilters = {}, modelName = '') => {
    const [data, setData] = useState<any>([])
    const validSearchValue = useMemo(() => {
        return search?.value?.replaceAll('+', '')?.trim()
    }, [search?.value?.replaceAll('+', '')?.trim()])

    useEffect(() => {
        setData([])
    }, [modelName])

    const getParams = (
        isSearchApi = false,
        listFiltersSearchReplacements = {},
        listFiltersSearchExtentionsReplacements = {},
        listSearchShouldFields = {}
    ) => {
        let searchFields = []
        let searchExistenceFields = []
        let searchShouldFields = []
        let searchText = ''
        let query = {}
        if (isSearchApi) {
            searchText = validSearchValue
            const result = getSearchApiQuery(
                pureFilters,
                listFiltersSearchReplacements,
                listFiltersSearchExtentionsReplacements,
                listSearchShouldFields
            )
            searchFields = result.searchFields
            searchExistenceFields = result.searchExistenceFields
            searchShouldFields = result.searchShouldFields
        } else {
            query = getQuery(validSearchValue, search?.fields, filters, search?.hasSearchParam, search?.hasQuerySearch)
        }
        let necessaryProjectionArray: any = null
        if (projection?.length) {
            necessaryProjectionArray = { necessaryProjectionArray: projection }
        }
        const limitation = pagination
            ? { skip: (pagination.currentPage - 1) * pagination.itemsPerPage, limit: pagination.itemsPerPage }
            : {}
        // if (gridView)
        //     limitation = {
        //         skip,
        //         limit: pagination.itemsPerPage
        //     }
        const result: any = {
            query,
            searchFields,
            searchExistenceFields,
            searchShouldFields,
            searchText,
            necessaryProjectionArray,
            limit: limitation
        }
        if (search?.hasSearchParam) {
            result.search = validSearchValue
        }
        return result
    }

    return {
        getParams,
        validSearchValue,
        data,
        setData
    }
}

export default useDataList
