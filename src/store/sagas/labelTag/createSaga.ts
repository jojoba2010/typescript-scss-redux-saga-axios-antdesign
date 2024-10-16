import { Action } from 'redux'
import { put, takeLatest } from 'redux-saga/effects'
import { rootActions } from '@app-store/slices'
import axios from '@utils/request'
import { ICreateLabelTagPayload } from '@app-store/slices/labelTag/create'

interface TaskAction extends Action {
    payload: ICreateLabelTagPayload
}

const { onRequest, onSuccess, onFailure } = rootActions.labelTag.create

function* createLabelTagSagaTask({ payload }: TaskAction) {
    try {
        const response = yield axios.post(`/attachments/badges`, payload.data)
        if (response.success) {
            yield put(onSuccess(response.result))
            // yield put(rootActions.labelTag.list.onAddToList(response.result))
            if (payload?.sagaCB?.onSuccess) yield payload?.sagaCB?.onSuccess(response.result)
        } else {
            throw new Error('')
        }
    } catch (error) {
        yield put(onFailure(error))
    }
}

function* createLabelTagSaga(): any {
    yield takeLatest<TaskAction>(onRequest, createLabelTagSagaTask)
}

export default createLabelTagSaga
