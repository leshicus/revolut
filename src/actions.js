import axios from 'axios'
import getSymbolFromCurrency from 'currency-symbol-map'
import {RIGHT, LEFT, SIMULATE_RATE_CHANGE} from './constants'

export function loadFx(resolve, reject) {
    axios.get('http://api.fixer.io/latest', {})
        .then(function (response) {
            if (response) {
                const data = response.data;
                if (data) {
                    resolve(data)
                }
            }
        })
        .catch(function (error) {
            console.log(error);
        });

}

// * random in inetval fom min to max
const getRandomArbitrary = (min, max) => {
    return Math.random() * (max - min) + min;
}
// * simulate that currency rate is changing
const simulateRateChange = (dispatch, fx)=> {
    if (fx && fx.rates) {
        if (SIMULATE_RATE_CHANGE) {
            let rates = fx.rates
            Object.keys(rates).map(function (key, index) {
                rates[key] = (rates[key] * getRandomArbitrary(1, 1.09)).toFixed(4, 10);
            });
        }

        dispatch({
            type: 'FX_FETCHED',
            fx
        })
    }
}

export function startFx(dispatch, intervalLoadFx) {
    if (!intervalLoadFx) {
        intervalLoadFx = setInterval(function () {
            new Promise((resolve, reject)=> {
                loadFx(resolve, reject);
            }).then((fx)=> {
                simulateRateChange(dispatch, fx)

                fillArrayOfCurrencies(dispatch, fx)
            })
        }, 10000)

        dispatch({
            type: 'START_LOAD_TIMER',
            intervalLoadFx
        })
    }

    // new Promise((resolve, reject)=> {
    //     loadFx(resolve, reject);
    // }).then((fx)=> {
    //     dispatch({
    //         type: 'FX_FETCHED',
    //         fx
    //     })
    //
    //     fillArrayOfCurrencies(dispatch, fx)
    // })
}

const fillArrayOfCurrencies = (dispatch, fx)=> {
    const {rates} = fx

    if (rates) {
        const currencies = Object.getOwnPropertyNames(rates)

        dispatch({
            type: 'SAVE_CURRENCIES',
            currencies
        })
    }
}

export const onSwiped = (dispatch, currencies, currencyName, direction, typeName)=> {
    let change             = direction === RIGHT ? RIGHT : LEFT;
    const currencyIndexNow = currencies.findIndex((item)=> item === currencyName)
    let currencyIndexNext  = currencyIndexNow + parseInt(change, 10)

    if (currencyIndexNext < 0) {
        currencyIndexNext = currencies.length - 1
    } else if (currencyIndexNext > currencies.length - 1) {
        currencyIndexNext = 0
    }

    dispatch({
        type        : typeName,
        currencyName: currencies[currencyIndexNext]
    })
}

export const getErrorText = (isError)=> {
    if (isError)
        return 'Not enough funds'
    else return ''
}

export const getRateText = (currencyNameTo, currencyNameFrom, rate)=>getSymbolFromCurrency(currencyNameTo) + '1 = ' + getSymbolFromCurrency(currencyNameFrom) + rate.toFixed(2, 10)