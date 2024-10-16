import createSagaMiddleware from 'redux-saga'
import { configureStore } from '@reduxjs/toolkit'
import { rootReducer } from '@app-store/slices'
import rootSaga from '@app-store/sagas'

const sagaMiddleware = createSagaMiddleware()

const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => {
        return getDefaultMiddleware({
            thunk: false,
            serializableCheck: false,
            immutableCheck: {
                // Ignore state paths, e.g. state for 'items':
                ignoredPaths: ['items.data']
            }
        }).concat(sagaMiddleware)
    },
    devTools: process.env.NODE_ENV !== 'production'
})

sagaMiddleware.run(rootSaga)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
