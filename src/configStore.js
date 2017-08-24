import {createStore} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import reducer from './reducers'

const configStore = ()=> {
    const initialState = {
        fx: {}
    }

    const store = createStore(
        reducer,
        initialState,
        composeWithDevTools()
    )
    return store
}

export default configStore