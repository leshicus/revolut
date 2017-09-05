const reducer = (state = {}, action) => {
    switch (action.type) {
        case 'FX_FETCHED':
            return Object.assign({}, state, {
                fx: action.fx
            })
        case 'SAVE_CURRENCIES':
            return Object.assign({}, state, {
                currencies: action.currencies
            })
        case 'CHANGE_CURRENCY_TO':
            return Object.assign({}, state, {
                currencyNameTo: action.currencyName
            })
        case 'CHANGE_CURRENCY_FROM':
            return Object.assign({}, state, {
                currencyNameFrom: action.currencyName
            })
        case 'CONVERT':
            return Object.assign({}, state, {
                purse: action.purse
            })
        case 'START_LOAD_TIMER':
            return Object.assign({}, state, {
                intervalLoadFx: action.intervalLoadFx
            })
        case 'VALIDATION_ERROR':
            return Object.assign({}, state, {
                validationError: action.validationError
            })
        case 'CHANGE_SUM':
            return Object.assign({}, state, {
                sumToConvert: action.sumToConvert
            })
        default:
            return state
    }
}
export default reducer