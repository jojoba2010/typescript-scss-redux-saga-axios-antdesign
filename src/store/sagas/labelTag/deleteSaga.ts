import { Action } from 'redux'
import { put, takeLatest } from 'redux-saga/effects'
import { rootActions } from '@app-store/slices'
import axios from '@utils/request'
import { IDeleteLabelTagPayload } from '@app-store/slices/labelTag/delete'

interface TaskAction extends Action {
    payload: IDeleteLabelTagPayload
}

const { onRequest, onSuccess, onFailure } = rootActions.labelTag.delete

function* deleteLabelTagSagaTask({ payload }: TaskAction) {
    try {
        const response = yield axios.delete(`/attachments/badges/${payload.id}`)
        if (response.success) {
            yield put(onSuccess(response.result))
           if (payload?.sagaCB?.onSuccess) payload.sagaCB.onSuccess(response.result)
        } else {
            throw new Error('')
        }
    } catch (error) {
        yield put(onFailure(error))
    }
}

function* deleteLabelTagSaga(): any {
    yield takeLatest<TaskAction>(onRequest, deleteLabelTagSagaTask)
}

export default deleteLabelTagSaga
