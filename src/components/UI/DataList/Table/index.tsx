import React, { memo } from 'react'
import { useDispatch } from 'react-redux'
import Table from '@UI/antd/Table/Table'
import { rootActions } from '@app-store/slices'
import { PageContext } from 'context'
import { getValueFromKey } from '@features/General'

function TableList() {
    const {
        dataSource,
        columns,
        onRowClick,
        scroll,
        hasRowSelection,
        rowSelectionKey,
        selectedRowKeys,
        hiddenColumns,
        modelName,
        components,
        rowKeys,
        expandable
    } = React.useContext(PageContext)
    const dispatch = useDispatch()
    const rowSelection = hasRowSelection
        ? {
              renderCell(checked, record, index, node) {
                  return <div onClick={e => e.stopPropagation()}>{node}</div>
              },
              selectedRowKeys,
              onChange: (_, records) => {
                  const values = records.map(item => getValueFromKey(item, rowSelectionKey))
                  dispatch(rootActions.ui[modelName].onChangeSelectedRows(values))
              }
          }
        : undefined

    const handleTableChange = (pagination, filters, sorter) => {
        if (sorter) {
            const sortBy = sorter.column
                ? (sorter.order === 'descend' ? '-' : '') + (sorter.columnKey || sorter.field)
                : null
            dispatch(rootActions.ui[modelName].onChangeItem({ key: 'sort', value: sortBy }))
        }
    }

    const tableColumns = React.useMemo(
        () =>
            columns
                .filter(item => item.hide !== true && !hiddenColumns?.includes(item.dataIndex || item.key))
                .map(col => {
                    if (!col.editable || typeof col.updateCell !== 'function') {
                        return { ...col, dataIndex: col.key }
                    }
                    return {
                        ...col,
                        dataIndex: col.key,
                        onCell: record => ({
                            record,
                            editable: col.editable.toString(),
                            dataIndex: col.key,
                            title: col.title,
                            updateCell: col.updateCell,
                            handleSave: col.handleSave
                        })
                    }
                }),
        [columns, hiddenColumns]
    )
    return (
        <Table
            rowSelection={rowSelection}
            onChange={handleTableChange}
            dataSource={dataSource}
            pagination={false}
            columns={tableColumns}
            rowKey={record => {
                const key = rowKeys.reduce((acc, item) => acc + record[item], '')
                return key
            }}
            components={components}
            onRow={
                onRowClick
                    ? record => ({
                          onClick: event => onRowClick(record)
                      })
                    : undefined
            }
            scroll={scroll}
            expandable={expandable}
        />
    )
}

export default memo(TableList)
