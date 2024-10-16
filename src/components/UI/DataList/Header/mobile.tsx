import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CloseFillIcon from 'remixicon-react/CloseFillIcon'
import { rootActions } from '@app-store/slices'
import { RootState } from '@app-store/store'
import { PageContext } from 'context'
import GoBack from '@UI/GoBack'
import Search from './Search'
import Buttons from './Buttons'
import Filters from './Filters'
import styles from '../index.scss'

const MobileHeaderView = () => {
    const { modelName, title, search, showFiltersAsBadge, extraHeaders, goBack, filterAlign, filter } =
        React.useContext(PageContext)
    const { searchValue } = useSelector((state: RootState) => state.ui[modelName])
    const { data: i18n } = useSelector((state: RootState) => state.localization.locals)
    const [searchDataNew, setSearchDataNew] = React.useState()
    const dispatch = useDispatch()

    const onResetSearch = () => {
        dispatch(rootActions.ui[modelName].onChangeSearch(''))
    }
    React.useEffect(() => {
        const searchNew = search
        searchNew.width = '100%'
        setSearchDataNew(searchNew)
    }, [])
    return (
        <div className={styles['header-container']}>
            <div className={styles['header']} style={{ flexDirection: 'column', gap: 20 }}>
                {goBack && (
                    <div style={{ marginInlineEnd: 10 }}>
                        <GoBack route={goBack.route} />
                    </div>
                )}
                {!!title && <h6>{title}</h6>}
                {search?.fields?.length && search?.align === 'left' && (
                    <Search modelName={modelName} searchData={searchDataNew ? searchDataNew : search} />
                )}
                <Buttons align="left" />
                {filterAlign === 'left' && (
                    <Filters
                        flexDirection={'column'}
                        width={'100%'}
                        alignItems={'flex-start'}
                        modelName={modelName}
                        filter={filter}
                    />
                )}
                <>
                    {extraHeaders.map(item => (
                        <div key={item.key}>{item.component}</div>
                    ))}
                </>

                {search?.fields?.length && search?.align !== 'left' && (
                    <Search modelName={modelName} searchData={searchDataNew ? searchDataNew : search} />
                )}
                <Buttons />
                {filterAlign === 'right' && (
                    <Filters
                        flexDirection={'column'}
                        width={'100%'}
                        alignItems={'flex-start'}
                        modelName={modelName}
                        filter={filter}
                    />
                )}
            </div>
            {showFiltersAsBadge && (
                <div className={styles['badges']}>
                    {searchValue?.trim() && (
                        <div className={styles['badge-item']}>
                            <span className={styles['badge-item-title']}>{i18n?.General?.Keyword}:</span>
                            <span className={styles['badge-item-value']}>{searchValue?.trim()}</span>
                            <CloseFillIcon size={12} onClick={onResetSearch} />
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default MobileHeaderView
