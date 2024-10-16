import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SearchLineIcon from 'remixicon-react/SearchLineIcon'
import Checkbox from 'antd/lib/checkbox'
import Input from '@UI/antd/Input/Input'
import { rootActions } from '@app-store/slices'
import { RootState } from '@app-store/store'
import useDebounce from '@hooks/processor/useDebounce'
import styles from './index.scss'

interface IProps {
    modelName?: string
    searchData: any
    onChange?: any
    defaultValue?: string
    showSearchSwitch?: boolean
}
const Search = (props: IProps) => {
    const { modelName = '', searchData, onChange = undefined, defaultValue = '', showSearchSwitch = false } = props
    const dispatch = useDispatch()
    const { searchValue, pagination, searchType } = modelName
        ? useSelector((state: RootState) => state.ui?.[modelName])
        : { searchValue: '', pagination: undefined, searchType: 'mongo' }
    const [value, setValue] = useState<string>(defaultValue || searchValue)
    const [changedValue, setChangedValue] = useState<string>('')

    useEffect(() => {
        let isMounted = true
        // setValue(preValue => (preValue === null ? searchValue : preValue))
        if (isMounted) {
            setValue(defaultValue || searchValue || '')
        }
        return () => {
            isMounted = false
        }
    }, [defaultValue, searchValue || ''])

    const debouncedSearchTerm = useDebounce(value, 500)

    useEffect(() => {
        if (debouncedSearchTerm?.length >= 2 || debouncedSearchTerm === '') {
            if (modelName) {
                dispatch(rootActions.ui[modelName].onChangeSearch(debouncedSearchTerm.trim()))
            } else if (typeof onChange !== 'undefined') {
                onChange(debouncedSearchTerm.trim())
            }
        }
    }, [debouncedSearchTerm])

    const handleKeyUp = e => {
        setChangedValue(e.target.value)
    }

    useEffect(() => {
        if (changedValue && changedValue === value && pagination && modelName) {
            dispatch(rootActions.ui[modelName].onChangePagination({ currentPage: 1 }))
        }
    }, [changedValue, value])

    const changeSearchType = e => {
        dispatch(
            rootActions.ui[modelName].onChangeItem({
                key: 'searchType',
                value: e.target.checked ? 'elastic' : 'mongo'
            })
        )
    }
    return (
        <div className={styles['search-container']}>
            {showSearchSwitch && (
                <span>
                    <Checkbox checked={searchType === 'elastic'} onChange={changeSearchType}>
                        Advanced Search
                    </Checkbox>
                </span>
            )}
            <Input
                suffix={<SearchLineIcon size={18} />}
                onChange={e => setValue(e.target.value)}
                onKeyUp={handleKeyUp}
                className={styles['header-search']}
                label={searchData?.placeholder || ''}
                style={{ width: searchData?.width }}
                value={value}
            />
        </div>
    )
}

export default Search
