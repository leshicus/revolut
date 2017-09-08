import axios from 'axios'
import getSymbolFromCurrency from 'currency-symbol-map'
import {RIGHT, LEFT, SIMULATE_RATE_CHANGE} from './../constants'

export function loadFx(resolve, reject) {
    axios.get('https://api.fixer.io/latest', {})
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
                rates[key] = (rates[key] * getRandomArbitrary(1, 1.09)).toFixed(4, 10)
                return rates
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

export const getCurrencyNext = (currencies, currencyName, direction)=> {
    let change             = direction === RIGHT ? RIGHT : LEFT;
    const currencyIndexNow = currencies.findIndex((item)=> item === currencyName)
    let currencyIndexNext  = currencyIndexNow + parseInt(change, 10)

    if (currencyIndexNext < 0) {
        currencyIndexNext = currencies.length - 1
    } else if (currencyIndexNext > currencies.length - 1) {
        currencyIndexNext = 0
    }

    return currencies[currencyIndexNext]
}

export const onSwiped = (dispatch, currencies, currencyName, direction, typeName)=> {
    const currencyNext = getCurrencyNext(currencies, currencyName, direction)

    dispatch({
        type        : 'CHANGE_SUM',
        sumToConvert: ''
    })

    dispatch({
        type           : 'VALIDATION_ERROR',
        validationError: false
    })

    dispatch({
        type             : 'CONVERTATION_ERROR',
        convertationError: false
    })

    dispatch({
        type        : typeName,
        currencyName: currencyNext
    })
}

export const dispatchValidationError = (dispatch, error)=> {
    dispatch({
        type           : 'VALIDATION_ERROR',
        validationError: error
    })
}

export const dispatchConvertationError = (dispatch, error)=> {
    dispatch({
        type             : 'CONVERTATION_ERROR',
        convertationError: error
    })
}

export const dispatchSum = (dispatch, sum)=> {
    dispatch({
        type        : 'CHANGE_SUM',
        sumToConvert: sum
    })
}

export const dispatchConvert = (dispatch, purse)=> {
    dispatch({
        type: 'CONVERT',
        purse
    })
}

export const getErrorText = (errorType)=> {
    if (errorType === 1)
        return 'Not enough funds'
    if (errorType === 2)
        return 'Convertation failed'
    else return ''
}

export const getRateText = (currencyNameTo, currencyNameFrom, rate)=>getSymbolFromCurrency(currencyNameTo) + '1 = ' + getSymbolFromCurrency(currencyNameFrom) + rate.toFixed(2, 10)

export const getRate = (fx, first, second, amount, accuracy)=> {
    const {rates, base} = fx

    if (rates) {
        let val = 0

        if (second === base) {
            val = 1 / rates[first] * amount
        } else if (first === base) {
            val = rates[second] * amount
        } else {
            val = rates[second] / rates[first] * amount
        }

        return +val.toFixed(accuracy)
    } else
        return 0
}

export const decrementSumInPurseFrom = (purse, currencyNameFrom, sumToConvert)=> {
    let sumInPurseFrom = purse[currencyNameFrom]
    let result         = false

    if (sumInPurseFrom === undefined) {
        sumInPurseFrom = 0
    }

    if (sumInPurseFrom > 0
        && sumToConvert > 0
        && (sumInPurseFrom - sumToConvert > 0)
    ) {
        sumInPurseFrom = sumInPurseFrom - sumToConvert
        result         = true
    }

    return {
        sum   : +sumInPurseFrom.toFixed(2),
        result: result
    }
}

export const incrementSumInPurseTo = (purse, currencyNameTo, convertedSum)=> {
    let sumInPurseTo = purse[currencyNameTo]
    let result       = false

    if (sumInPurseTo === undefined) {
        sumInPurseTo = 0
    }

    if (convertedSum > 0 && sumInPurseTo >= 0) {
        sumInPurseTo += convertedSum
        result = true
    }

    return {
        sum   : +sumInPurseTo.toFixed(2),
        result: result
    }
}

// return 3-d and 4-th digits after point
export const getMinorDecimal = (sum)=> {
    // const decimal = sum % 0.01
    // const minor   = decimal * 10000
    //
    // return minor.toFixed(0, 10)
    const decimal    = Math.abs(sum) - Math.floor(sum) // 123.12999 -> 0.12999
    const strDecimal = decimal + ''
    const minorPart  = strDecimal.substring(4, 6)

    return minorPart
}

// * correct values: 0., 0.1, 0.12, 123., 123.1, 123.12
export const isError = (value)=> {
    const reg = /^(([0-9]+(\.[0-9]{1,2})?)|([0-9]+(\.)?))$/

    if (value === '')
        value = 0

    // const valueStr = parseFloat(value).toFixed(2, 10)
    const valueStr = value + ''

    if (reg.test(valueStr) && isNumber(value)) {
        return false
    } else
        return true
}

export const isNumber = (n)=> {
    return !isNaN(parseFloat(n))
}

export const cleanSum = (sum)=> {
    if (sum === '+'
        || sum === '+.'
        || sum === '-'
        || sum === '-.'
        || sum === '.'
    ) {
        sum = ''
    }

    sum = sum
        .replace(/-/g, '')
        .replace(/\+/g, '')
        .replace('e', '')
        .replace('E', '')
        .replace(/^0+(?=\d)/, '')

    return sum || ''
}