import { STATUS } from '@features/General'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IListQueryPaginationPayload } from '@typings/requestPayloads'
import { listInitialState } from '@utils/constants/requestConstants'
// import { listSideEffectReducers, manipulateListReducers } from '../reducers'
import { sideEffectReducers } from '../reducers'

const listSlice = createSlice({
    name: 'label-tag/list',
    initialState: listInitialState,
    reducers: {
        onRequest(state, action: PayloadAction<IListQueryPaginationPayload>) {
            state.status = STATUS.RUNNING
        },
        // ...listSideEffectReducers,
        // ...manipulateListReducers
        ...sideEffectReducers
    }
})

export const listActions = listSlice.actions
export default listSlice.reducer
