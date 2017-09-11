import React, {Component} from 'react'
import {connect} from 'react-redux'

// * View
import ExchangeFrom from './ExchangeFrom'
import ExchangeTo from './ExchangeTo'
import TopBottons from './TopBottons'

import {
    startFx,
    dispatchValidationError,
    dispatchConvertationError,
    dispatchSum,
    dispatchConvert,
    getRate,
    decrementSumInPurseFrom,
    incrementSumInPurseTo,
    isError,
    cleanSum
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

const isButtonExchangeDisabled = (props)=> {
    return props.validationError || props.sumToConvert == 0 || props.currencyNameFrom === props.currencyNameTo
}

const getErrorType = (props)=> {
    if (props.validationError === true)
        return 1
    if (props.convertationError === true)
        return 2

    return 0
}

class ExchangeContainer extends Component {
    constructor(props) {
        super(props)

        // this.onChangeAmountFrom = this.onChangeAmountFrom.bind(this)
        // this.onClickExchange    = this.onClickExchange.bind(this)
        // this.onClickCancel      = this.onClickCancel.bind(this)
    }

    componentWillMount() {
        startFx(this.props.dispatch, this.props.intervalLoadFx)
    }

    onChangeAmountFrom = (event) => {
        event.preventDefault();

        let sumToConvert     = event.currentTarget.value
        // console.info('sumToConvert',sumToConvert);
        const {purse} = this.props
        const sumInPurseFrom = purse[this.props.currencyNameFrom]

        sumToConvert = cleanSum(sumToConvert)
        const error  = isError(sumToConvert)

        if (!error) {
            dispatchSum(this.props.dispatch, sumToConvert)

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
        dispatchConvertationError(this.props.dispatch, false)
    }

    onClickExchange = ()=> {
        const convertedSum        = getRate(this.props.fx, this.props.currencyNameFrom, this.props.currencyNameTo, this.props.sumToConvert, 2)
        const resultDecrementFrom = decrementSumInPurseFrom(this.props.purse, this.props.currencyNameFrom, this.props.sumToConvert)
        const resultIncrementTo   = incrementSumInPurseTo(this.props.purse, this.props.currencyNameTo, convertedSum)

        if (resultDecrementFrom.result && resultIncrementTo.result) {
            this.props.purse[this.props.currencyNameFrom] = resultDecrementFrom.sum
            this.props.purse[this.props.currencyNameTo]   = resultIncrementTo.sum

            dispatchSum(this.props.dispatch, '')
            dispatchConvert(this.props.dispatch, this.props.purse)
            dispatchConvertationError(this.props.dispatch, false)
        } else {
            dispatchConvertationError(this.props.dispatch, true)
        }
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
                              errorType={getErrorType(this.props)}
                              sumToConvert={this.props.sumToConvert}
                              onChangeAmountFrom={(e)=>this.onChangeAmountFrom(e)}
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
