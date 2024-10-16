import { Action } from 'redux'
import { put, takeLatest } from 'redux-saga/effects'
import { rootActions } from '@app-store/slices'
import axios from '@utils/request'
import { IEditLabelTagPayload } from '@app-store/slices/labelTag/edit'

interface TaskAction extends Action {
    payload: IEditLabelTagPayload
}

const { onRequest, onSuccess, onFailure } = rootActions.labelTag.edit

function* editLabelTagSagaTask({ payload }: TaskAction) {
    try {
        const response = yield axios.put(`/attachments/badges/${payload.id}`, payload.data)
        if (response.success) {
            yield put(onSuccess(response.result))
            if (payload?.sagaCB?.onSuccess) yield payload?.sagaCB?.onSuccess(response.result)
        } else {
            throw new Error('')
        }
    } catch (error) {
        yield put(onFailure(error))
    }
}

function* editLabelTagSaga(): any {
    yield takeLatest<TaskAction>(onRequest, editLabelTagSagaTask)
}

export default editLabelTagSaga
