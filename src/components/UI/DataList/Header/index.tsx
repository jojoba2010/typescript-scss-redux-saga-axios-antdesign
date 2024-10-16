import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CloseFillIcon from 'remixicon-react/CloseFillIcon'
import { rootActions } from '@app-store/slices'
import { RootState } from '@app-store/store'
import { PageContext } from 'context'
import GoBack from '@UI/GoBack'
import Badge from '@UI/DataList/components/Badge'
import Search from './Search'
import Buttons from './Buttons'
import Filters from './Filters'
import HideColumns from './HideColumns'
import styles from '../index.scss'

const Header = () => {
    const {
        noData,
        modelName,
        title,
        search,
        showFiltersAsBadge,
        extraHeaders,
        goBack,
        filterAlign,
        disableHideColumns,
        filter,
        statusBadge,
        searchActionName
    } = React.useContext(PageContext)
    const searchValue = useSelector((state: RootState) => state.ui?.[modelName]?.searchValue)
    const { data: i18n } = useSelector((state: RootState) => state.localization.locals)
    const dispatch = useDispatch()

    const onResetSearch = () => {
        dispatch(rootActions.ui[modelName].onChangeSearch(''))
    }

    const renderExtraHeaders = align => (
        <>
            {extraHeaders
                ?.filter(item => (item.align || 'left') === align && ((noData && !item.showWithData) || !noData))
                .map(item => (
                    <div key={item.key} style={{ display: item.hide && 'none' }} className={styles['extra-header']}>
                        {item.component}
                    </div>
                ))}
        </>
    )

    return (
        <div className={`px-5 ${styles['header-container']}`}>
            <div className={styles['header']}>
                <div className={styles['header-left']}>
                    {goBack && (
                        <div style={{ marginInlineEnd: 10 }}>
                            <GoBack route={goBack.route} />
                        </div>
                    )}
                    {!!title && <h6>{title}</h6>}
                    {statusBadge && <Badge value={statusBadge.value} bg={statusBadge.bg} />}
                    {search?.fields?.length && search?.align === 'left' && !noData && (
                        <Search modelName={modelName} searchData={search} showSearchSwitch={!!searchActionName} />
                    )}
                    <Buttons align="left" />
                    {filterAlign === 'left' && !noData && <Filters modelName={modelName} filter={filter} />}
                    {!noData && !disableHideColumns && <HideColumns />}
                    {renderExtraHeaders('left')}
                </div>

                <div className={styles['header-right']}>
                    {renderExtraHeaders('right')}
                    {search?.fields?.length && search?.align !== 'left' && !noData && (
                        <Search modelName={modelName} searchData={search} />
                    )}
                    <Buttons />
                    {filterAlign === 'right' && !noData && <Filters modelName={modelName} filter={filter} />}
                </div>
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

export default Header
