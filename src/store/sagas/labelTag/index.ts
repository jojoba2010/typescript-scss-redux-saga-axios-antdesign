import createSaga from './createSaga'
import listSaga from './listSaga'
import deleteSaga from './deleteSaga'
import editSaga from './editSaga'

const labelTagSaga = [createSaga(), editSaga(), listSaga(), deleteSaga()]

export default labelTagSaga
