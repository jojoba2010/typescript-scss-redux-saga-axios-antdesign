import { combineReducers } from 'redux'
import createReducer, { createLabelTagActions } from '@app-store/slices/labelTag/create'
import editReducer, { editLabelTagActions } from '@app-store/slices/labelTag/edit'
import listReducer, { listActions } from '@app-store/slices/labelTag/list'
import deleteReducer, { deleteLabelTagActions } from '@app-store/slices/labelTag/delete'
export const labelTagReducers = combineReducers({
    create: createReducer,
    edit: editReducer,
    list: listReducer,
    delete: deleteReducer
})

export const labelTagActions = {
    create: createLabelTagActions,
    edit: editLabelTagActions,
    list: listActions,
    delete: deleteLabelTagActions
}
