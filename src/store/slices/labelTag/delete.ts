import { STATUS } from '@features/General'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ISagaCb } from '@typings/requestPayloads'
export interface IDeleteLabelTagPayload extends ISagaCb {
    id: string
}

export interface IState {
    status: string
    data: any
    errors: any
}

const initialState: IState = {
    status: STATUS.IDLE,
    data: null,
    errors: null
}

const deleteLabelTag = createSlice({
    name: 'label-tag/delete',
    initialState,
    reducers: {
        onRequest(state, action: PayloadAction<IDeleteLabelTagPayload>) {
            state.status = STATUS.RUNNING
        },
        onSuccess(state, action) {
            state.status = STATUS.READY
            state.data = action.payload
        },
        onFailure(state, action) {
            state.status = STATUS.ERROR
            state.errors = action.payload
        }
    }
})

export const deleteLabelTagActions = deleteLabelTag.actions
export default deleteLabelTag.reducer
