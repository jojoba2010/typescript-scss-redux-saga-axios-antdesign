import { combineReducers } from 'redux'
import { labelTagReducers, labelTagActions } from '@app-store/slices/labelTag'
import { uiReducer, uiActions } from '@app-store/slices/ui'
export const rootReducer = combineReducers({
  ui:uiReducer,
  labelTag: labelTagReducers
})

export const rootActions = {
  ui: uiActions,
  labelTag: labelTagActions
 }