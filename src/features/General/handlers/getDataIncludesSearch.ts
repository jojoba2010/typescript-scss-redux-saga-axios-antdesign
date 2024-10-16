import { getValueFromKey } from '@features/General'

export const getDataIncludesSearch = (data, fields, search) => {
    const filtersFunctions = fields.map((item, index) => ({
        ['fn' + index]: value => {
            const fieldValue = getValueFromKey(value, item)
            return fieldValue?.toString().toLowerCase().includes(search)
        }
    }))
    const newData = data?.filter(item =>
        filtersFunctions.some((fn: any, index) => {
            return fn['fn' + index](item)
        })
    )
    return newData
}
