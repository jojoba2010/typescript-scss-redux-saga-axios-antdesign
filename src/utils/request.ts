import isEmpty from 'lodash/isEmpty'
import Axios, { AxiosError, AxiosRequestConfig } from 'axios'
import {LOCALSTORAGE_KEYS} from '@features/General/constants'
const TIMEOUT = 60000

// if you want another config, create one!!
const DEFAULTCONFIG: AxiosRequestConfig = {
    baseURL: 'https://aliasd.ir:9443',
    timeout: TIMEOUT
}

const NO_NEED_AUTH_URLS = ['auth/login']

const request = Axios.create(DEFAULTCONFIG)

request.interceptors.request.use(config => {
    const token = localStorage.getItem(LOCALSTORAGE_KEYS.TOKEN)
    if (!NO_NEED_AUTH_URLS.includes(config.url) && !isEmpty(token) && !config.url.includes('/by-token')) {
        config.headers['Authorization'] = `Basic ${token}`
        // config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
})

request.interceptors.response.use(
    function (response) {
        return response.data
    },
    function (error: AxiosError) {
        if (error.response) {
            if (error.response.status === 413) {
                showErrorMessage(
                    'The response size is too large to display. Please apply filters such as date ranges or categories to reduce the data size and enhance performance.'
                )
                return Promise.reject(error)
            }
            
        } else if (error.request) {
            throw new Error(error.request)
        }
        return Promise.reject(error)
    }
)

function showErrorMessage(message, data = []) {
    switch (message) {
        default:
            const config: any = { message }
            console.log(config)
            break
    }
}

export const getParams = (payload, isElastic = false) => {
    const query: any = payload.query || undefined
    const pagination = payload.pagination || undefined
    const necessaryProjectionArray = payload.necessaryProjectionArray || undefined
    const needPopulate = payload.needPopulate || undefined
    const search = payload.search || undefined
    const populates = payload.populates || undefined
    const addPresignedURL = payload.addPresignedURL || undefined
    const hasTotal = payload.hasTotal || false
    const skip = payload.skip || undefined
    const sort = payload.sort || undefined
    const limit = payload.limit || undefined
    const searchText = payload.searchText || undefined
    const searchFields = payload.searchFields || []
    const searchExistenceFields = payload.searchExistenceFields || []
    const searchShouldFields = payload.searchShouldFields || []
    const params = {}

    if (Object.keys(query || {}).length > 0) Object.assign(params, { query })
    if (pagination) Object.assign(params, { ...pagination })
    if (necessaryProjectionArray?.length) Object.assign(params, { necessaryProjectionArray })
    if (addPresignedURL) Object.assign(params, { addPresignedURL })
    if (needPopulate) Object.assign(params, { needPopulate })
    if (search) Object.assign(params, { search })
    if (populates?.length) Object.assign(params, { populates })
    if (hasTotal) Object.assign(params, { hasTotal })
    if (skip) Object.assign(params, { skip })
    if (limit) Object.assign(params, { limit })
    if (searchText) Object.assign(params, { searchText })
    if (searchFields.length) Object.assign(params, { searchFields })
    if (searchExistenceFields.length) Object.assign(params, { searchExistenceFields })
    if (searchShouldFields.length) Object.assign(params, { searchShouldFields })
    if (payload.fields) {
        Object.assign(params, { fields: payload.fields })
    }
    if (!isElastic) {
        if (sort) Object.assign(params, { sort })
    }
    return params
}
export default request
