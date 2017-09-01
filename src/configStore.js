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
        currencies:[]
    }

    const store = createStore(
        reducer,
        initialState,
        composeWithDevTools()
    )
    return store
}

export default configStore