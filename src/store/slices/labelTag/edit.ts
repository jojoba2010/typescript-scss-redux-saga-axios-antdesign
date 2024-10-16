import { STATUS } from '@features/General'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ISagaCb } from '@typings/requestPayloads'
export interface IEditLabelTagPayload extends ISagaCb {
    id: string
    data: {
        type: string
        name: string
        textColor?: string
    }
}

export interface IEditLabelTagState {
    status: string
    data: any
    errors: any
}

const initialState: IEditLabelTagState = {
    status: STATUS.IDLE,
    data: null,
    errors: null
}

const editLabelTag = createSlice({
    name: 'label-tag/edit',
    initialState,
    reducers: {
        onRequest(state, action: PayloadAction<IEditLabelTagPayload>) {
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

export const editLabelTagActions = editLabelTag.actions
export default editLabelTag.reducer
