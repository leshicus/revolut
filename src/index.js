import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Provider} from 'react-redux'

import configStore from './configStore'
import ExchangeContainer from './ExchangeContainer'

const store = configStore()

ReactDOM.render((
    <Provider store={store}>
        <div>
            <ExchangeContainer />
        </div>
    </Provider>
), document.getElementById('root'))


// * HMR
if (module.hot) {
    module.hot.accept()
}
