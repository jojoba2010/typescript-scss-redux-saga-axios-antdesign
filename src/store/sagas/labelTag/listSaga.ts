import { put, takeLatest } from 'redux-saga/effects'
import { rootActions } from '@app-store/slices'
import axios, { getParams } from '@utils/request'
import { ListTaskAction } from '@typings/requestPayloads'

const { onRequest, onSuccess, onFailure } = rootActions.labelTag.list

function* listLabelTagSagaTask({ payload }) {
    try {
        const params = yield getParams(payload)
        console.log(params)
        console.log('payload', payload)
        // const response = yield axios.get(`/search`, { params })
        const response = yield axios.get('/search?startAt=0&maxResults=10&jql=creator=user1  ORDER BY created DESC')

        if (response) {
        // if (response.success) {
            yield put(onSuccess(response))
            if (payload?.sagaCB?.onSuccess) payload.sagaCB.onSuccess(response)
        } else {
            throw new Error('')
        }
    } catch (error) {
        yield put(onFailure(error))
    }
}

function* listLabelTagSaga(): any {
    yield takeLatest<ListTaskAction>(onRequest, listLabelTagSagaTask)
}

export default listLabelTagSaga
