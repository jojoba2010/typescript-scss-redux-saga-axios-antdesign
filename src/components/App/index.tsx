import React from 'react'
import { Router, Switch, Route } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import loadable from '@loadable/component'
import PageLoading from '@UI/PageLoading'
import store from '@app-store/store'
import { Provider } from 'react-redux'
// import { retryDynamicImport } from '@utils/helpers/retryDynamicImport'
export const loadableOptions = { fallback: <PageLoading /> }
export const history = createBrowserHistory()

const LabelTag = loadable(() => import('@pages/labelTag'), loadableOptions)
function App() {
    return (
        <Provider store={store}>
            <Router history={history}>
                <Switch>
                      <Route exact path="/labeltag" render={() => <LabelTag />} />
                    <Route path="*" component={LabelTag} />
                </Switch>
            </Router>
        </Provider>
    )
}

export default App
