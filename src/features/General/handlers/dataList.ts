import { $andOfOrsQueryListSearch, $orQuerySearch } from '@utils/helpers/queryHelpers'
import uniq from 'lodash/uniq'

export const getSearchApiQuery = (
    pureFilters,
    listFiltersSearchReplacements,
    listFiltersSearchExtentionsReplacements,
    listSearchShouldFields
) => {
    const result = {
        searchFields: [],
        searchExistenceFields: [],
        searchShouldFields: []
    }
    if (pureFilters) {
        for (const fltKey in pureFilters) {
            const filterValue = pureFilters[fltKey]
            if (
                (filterValue || filterValue === 0 || filterValue === false) &&
                filterValue.toString()?.toLowerCase() !== 'all'
            ) {
                if (listSearchShouldFields[fltKey]) {
                    if (Array.isArray(listSearchShouldFields[fltKey])) {
                        listSearchShouldFields[fltKey].forEach(item => {
                            result.searchShouldFields.push([
                                {
                                    key: item,
                                    value: filterValue
                                }
                            ])
                        })
                    } else {
                        result.searchShouldFields.push([
                            {
                                key: fltKey,
                                value: filterValue
                            }
                        ])
                    }
                } else if (listFiltersSearchExtentionsReplacements[fltKey] && [true, false].includes(filterValue)) {
                    result.searchExistenceFields.push({
                        key: listFiltersSearchExtentionsReplacements[fltKey] || fltKey,
                        value: !filterValue
                    })
                } else {
                    result.searchFields.push({
                        key: listFiltersSearchReplacements[fltKey] || fltKey,
                        value: filterValue
                    })
                }
            }
        }
    }
    return result
}
export const getQuery = (searchValue, fields, filters, hasSearchParam = false, hasQuerySearch = false) => {
    const query: any = {}
    if ((!hasSearchParam || hasQuerySearch) && searchValue?.trim() && fields?.length) {
        if (fields.some(item => item.includes('firstname'))) {
            const allWords: string[] = uniq(searchValue.split(' ').filter(item => item.trim()))
            // if (allWords.length > 1) {
            //     const regexFields = fields.filter(item => item.includes('firstname') || item.includes('lastname'))
            //     regexFields.forEach(item => {
            //         query[item] = { $regex: `(?i)${searchValue?.trim().replaceAll(/  +/g, ' ').replaceAll(' ', '|')}` }
            //     })
            // }
            const searchQuery = $andOfOrsQueryListSearch(fields, allWords)
            if (searchQuery.$and.length > 1) {
                query.$and = searchQuery.$and
            } else if (searchQuery.$and.length === 1) {
                query.$or = searchQuery.$and[0].$or
            }
        } else {
            const searchQuery = $orQuerySearch(fields, searchValue?.trim())
            query.$or = searchQuery.$or
        }
    }
    if (filters) {
        for (const fltKey in filters) {
            const filterValue = filters[fltKey]
            if (
                (filterValue || filterValue === 0 || filterValue === false) &&
                filterValue.toString()?.toLowerCase() !== 'all'
            ) {
                if (Array.isArray(filterValue) && !['$and'].includes(fltKey)) {
                    query[fltKey] = { $in: filterValue }
                } else {
                    query[fltKey] = filterValue
                }
            } else {
                delete query[fltKey]
            }
        }
    }
    return query
}

export const getValueFromKey = (data, fields) => {
    let result: any = ''
    if (!fields) {
        return result
    }
    if (Array.isArray(fields)) {
        fields.forEach(item => {
            let temp = data
            const keys = item.split('.')
            keys.forEach((key, i) => {
                if (typeof temp?.[key] === 'string' && temp?.[key].trim() && i < keys.length - 1) {
                    temp = temp?.[key].trim() || temp
                } else if (
                    typeof temp?.[key] === 'undefined' ||
                    (typeof temp?.[key] === 'string' && !temp?.[key]?.trim())
                ) {
                    temp = ''
                } else {
                    temp = temp?.[key] || temp?.[key] === 0 ? temp?.[key] : temp
                }
            })
            result += temp + ' '
        })
    } else {
        let temp = data
        const keys = fields.split('.')
        keys.forEach(key => {
            temp = temp?.[key]
        })
        result = temp
    }
    return typeof result === 'string' ? result.trim() : result
}
