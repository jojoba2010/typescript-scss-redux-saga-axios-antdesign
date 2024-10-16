import { all } from '@redux-saga/core/effects'
import labelTagSagas from './labelTag'
function* rootSaga() {
    yield all([
	...labelTagSagas,
	])
}

export default rootSaga