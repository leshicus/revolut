import React, {Component} from 'react'
import {connect} from 'react-redux'

// * View
import ExchangeFrom from './ExchangeFrom'
import ExchangeTo from './ExchangeTo'
import TopBottons from './TopBottons'

import {
    startFx,
    dispatchValidationError,
    dispatchSum,
    dispatchConvert,
    getRate
} from './../actions'
import loading from './../assets/loading.gif'

const styles = {
    container       : {
        width          : '100%',
        fontSize       : '18px',
        backgroundColor: 'rgb(43, 158, 255)',
        color          : 'white',
    },
    button          : {
        padding        : '10px',
        width          : '100%',
        fontSize       : 'inherit',
        backgroundColor: 'rgb(0, 97, 179)',
        color          : 'white',
        border         : '0',
        cursor         : 'pointer'
    },
    containerLoading: {
        display      : 'flex',
        flexDirection: 'column'
    },
    loadingText     : {
        textAlign: 'center'
    }
}

const getCurrenciesInPurse = (purse)=> {
    return Object.getOwnPropertyNames(purse)
}

const isNumber = (n)=> {
    return !isNaN(parseFloat(n)) && isFinite(n)
}

const isError = (value)=> {
    const reg = /^[+]?((\.[0-9]+)|([0-9]+(\.[0-9]+)?))$/

    if (value === '')
        value = 0

    const valueStr = parseFloat(value).toFixed(2, 10)

    // console.info(value, valueStr, reg.test(valueStr), isNumber(value));

    if (reg.test(valueStr) && isNumber(value))
        return false
    else
        return true
}

const isButtonExchangeDisabled = (props)=> {
    return props.validationError || props.sumToConvert == 0 || props.currencyNameFrom === props.currencyNameTo
}

class ExchangeContainer extends Component {
    constructor(props) {
        super(props)

        this.onChangeAmountFrom       = this.onChangeAmountFrom.bind(this)
        this.onClickExchange          = this.onClickExchange.bind(this)
        this.onClickCancel            = this.onClickCancel.bind(this)
    }

    componentWillMount() {
        startFx(this.props.dispatch, this.props.intervalLoadFx)
    }

    onChangeAmountFrom = (currencyNameFrom, currencyNameTo, event) => {
        event.preventDefault();

        let sumToConvert     = event.currentTarget.value
        const {purse} = this.props
        const sumInPurseFrom = purse[currencyNameFrom]
        
// console.info(sumToConvert);
        if (sumToConvert === '+'
            || sumToConvert === '+.'
            || sumToConvert === '-'
            || sumToConvert === '-.'
            || sumToConvert === '.'
        ) {
            sumToConvert = ''
        }

        sumToConvert = sumToConvert
            .replace(/-/g, '')
            .replace('+', '')
            .replace('e', '')
            .replace('E', '')
            .replace(/^0+(?=\d)/, '')

        sumToConvert = sumToConvert || ''

        const error = isError(sumToConvert)
        if (!error) {
            dispatchSum(this.props.dispatch, sumToConvert)
        }
// console.info(sumInPurseFrom, sumToConvert, sumInPurseFrom < parseFloat(sumToConvert));
        if (isNumber(sumToConvert)) {
            if (sumInPurseFrom < parseFloat(sumToConvert)) {
                dispatchValidationError(this.props.dispatch, true)
            } else {
                dispatchValidationError(this.props.dispatch, false)
            }
        }
    }

    onClickCancel = ()=> {
        dispatchSum(this.props.dispatch, '')
        dispatchValidationError(this.props.dispatch, false)
    }

    onClickExchange = ()=> {
        const convertedSum = getRate(this.props.fx, this.props.currencyNameFrom, this.props.currencyNameTo, this.props.sumToConvert, 2)
        let purse          = this.props.purse
        let valTo          = this.props.purse[this.props.currencyNameTo]
        let valFrom        = this.props.purse[this.props.currencyNameFrom]

        if (valFrom <= 0
            || valFrom === undefined
            || !this.props.sumToConvert
            || this.props.currencyNameTo === this.props.currencyNameFrom
        ) {
            return false;
        }

        if (valTo === undefined) {
            valTo = convertedSum
        } else {
            valTo = valTo + convertedSum
        }

        valFrom = valFrom - this.props.sumToConvert

        purse[this.props.currencyNameFrom] = +valFrom.toFixed(2)
        purse[this.props.currencyNameTo]   = +valTo.toFixed(2)

        dispatchSum(this.props.dispatch, '')
        dispatchConvert(this.props.dispatch, purse)
    }

    render() {
        if (Object.keys(this.props.fx).length === 0) {
            return (
                <div style={styles.containerLoading}>
                    <img id="loading-image" src={loading} alt="Loading..."/>
                    <span style={styles.loadingText}>Loading FX...</span>
                </div>
            )
        }

        return (
            <div style={styles.container}>
                <TopBottons {...this.state} {...this.props}
                    buttonExchangeDisabled={isButtonExchangeDisabled(this.props)}
                    rate={getRate(this.props.fx, this.props.currencyNameFrom, this.props.currencyNameTo, 1, 4)}
                    onClickCancel={this.onClickCancel}
                    onClickExchange={this.onClickExchange}
                />
                <ExchangeFrom currencyNameFrom={this.props.currencyNameFrom}
                              currencyNameTo={this.props.currencyNameTo}
                              sumInPurse={this.props.purse[this.props.currencyNameFrom]}
                              isError={this.props.validationError}
                              sumToConvert={this.props.sumToConvert}
                              onChangeAmountFrom={this.onChangeAmountFrom.bind(null, this.props.currencyNameFrom, this.props.currencyNameTo)}
                              currencies={getCurrenciesInPurse(this.props.purse)}
                              dispatch={this.props.dispatch}
                />
                <ExchangeTo currencyNameTo={this.props.currencyNameTo}
                            currencyNameFrom={this.props.currencyNameFrom}
                            sumInPurse={this.props.purse[this.props.currencyNameTo]}
                            sumToConvert={getRate(this.props.fx, this.props.currencyNameFrom, this.props.currencyNameTo, this.props.sumToConvert, 2)}
                            currencies={this.props.currencies}
                            rate={getRate(this.props.fx, this.props.currencyNameTo, this.props.currencyNameFrom, 1, 2)}
                            dispatch={this.props.dispatch}
                />
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => ({
    ...state
})
export default connect(
    mapStateToProps
)(ExchangeContainer)
