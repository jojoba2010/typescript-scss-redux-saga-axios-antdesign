import { STATUS } from '@features/General'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ISagaCb } from '@typings/requestPayloads'
export interface ICreateLabelTagPayload extends ISagaCb {
    data: {
        type: string
        name: string
        textColor?: string
    }
}

export interface ICreateLabelTagState {
    status: string
    data: any
    errors: any
}

const initialState: ICreateLabelTagState = {
    status: STATUS.IDLE,
    data: null,
    errors: null
}

const createLabelTag = createSlice({
    name: 'label-tag/create',
    initialState,
    reducers: {
        onRequest(state, action: PayloadAction<ICreateLabelTagPayload>) {
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

export const createLabelTagActions = createLabelTag.actions
export default createLabelTag.reducer
