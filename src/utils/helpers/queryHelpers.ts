import isEmpty from 'lodash/isEmpty'
export const $orQuerySearch = (keywords: string[], value: string, stringyfy = false): any => {
    let query = {}
    if (value.trim()) {
        query = {
            $or: keywords.map(item => ({
                [item]: { $regex: `(?i)${value}` }
            }))
        }
    }
    return stringyfy ? JSON.stringify(query) : query
}

export const $andOfOrsQueryListSearch = (keywords: string[], allWords: string[]): any => {
    let query = {}
    if (allWords.length) {
        query = {
            $and: allWords.map(value => ({
                $or: keywords.map(key => ({ [key]: { $regex: `(?i)${value}` } }))
            }))
        }
    }
    return query
}

export const $inQuerySearch = (keyword: string, values: any[], stringyfy = false): any => {
    let query = null
    if (!isEmpty(values)) query = { [keyword]: { $in: values } }
    return stringyfy ? JSON.stringify(query) : query
}
