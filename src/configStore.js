import {createStore} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import reducer from './reducers'

const configStore = ()=> {
    const initialState = {
        fx              : {},
        purse           : {
            'GBP': 58.33,
            'USD': 25.51,
            'EUR': 116.12,
        },
        currencyNameFrom: 'GBP',
        currencyNameTo  : 'USD',
        currencies      : []
    }

    let store
    if (process.env.NODE_ENV !== 'production') {
        store = createStore(
            reducer,
            initialState,
            composeWithDevTools()
        )
    } else {
        store = createStore(
            reducer,
            initialState
        )
    }

    return store
}

export default configStore