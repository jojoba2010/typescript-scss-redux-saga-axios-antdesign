import { STATUS } from '@features/General'

export const manipulateListReducers = {
    onAddToList(state, action) {
        const newData = [...state.data]
        newData.push(action.payload)
        state.data = newData
    },
    onRemoveFromList(state, action) {
        let newData = [...state.data]
        newData = newData.filter(item => item._id !== action.payload)
        state.data = newData
    },
    onEditRecordInList(state, action) {
        const newData = [...state.data]
        const record = newData.find(item => item._id === action.payload.id)
        if (record) {
            Object.keys(action.payload.data).forEach(key => {
                record[key] = action.payload.data[key]
            })
        }
        state.data = newData
    }
}

export const sideEffectReducers = {
    onSuccess(state, action) {
        state.status = STATUS.READY
        state.data = action.payload
    },
    onFailure(state, action) {
        state.status = STATUS.ERROR
        state.errors = action.payload
    }
}

export const listSideEffectReducers = {
    onSuccess(state, action) {
        state.status = STATUS.READY
        if (action.payload?.noSaveInStore !== true) {
            state.data = action.payload.data || []
            state.pagination = {
                ...state.pagination,
                skip: action.payload.skip,
                total: action.payload.total
            }
        }
    },
    onFailure(state, action) {
        state.status = STATUS.ERROR
        state.errors = action.payload
    }
}