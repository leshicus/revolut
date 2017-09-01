import React, {Component} from 'react'
import {connect} from 'react-redux'

import ExchangeFrom from './ExchangeFrom'
import ExchangeTo from './ExchangeTo'
import TopBottons from './TopBottons'
import {startFx} from './actions'

const styles = {
    container: {
        width          : '100%',
        fontSize       : '18px',
        backgroundColor: 'rgb(43, 158, 255)',
        color          : 'white',
    },
    button   : {
        padding        : '10px',
        width          : '100%',
        fontSize       : 'inherit',
        backgroundColor: 'rgb(0, 97, 179)',
        color          : 'white',
        border         : '0',
        cursor         : 'pointer'
    }
}

class ExchangeContainer extends Component {
    constructor(props) {
        super(props)

        this.state = {
            sumToConvert       : 0,
            validationErrorFrom: false,
            validationErrorTo  : false,
            purse              : this.props.purse
        }

        this.getRate              = this.getRate.bind(this)
        this.onChangeAmountFrom   = this.onChangeAmountFrom.bind(this)
        this.getCurrenciesInPurse = this.getCurrenciesInPurse.bind(this)
        this.onClickExchange      = this.onClickExchange.bind(this)
        this.onClickCancel        = this.onClickCancel.bind(this)

        startFx(props.dispatch, props.intervalLoadFx)
    }

    getRate = (first, second, amount, accuracy)=> {
        const {rates, base} = this.props.fx

        if (rates) {
            let val = 0

            if (second === base) {
                val = 1 / rates[first] * amount
            } else if (first === base) {
                val = rates[second] * amount
            } else {
                val = rates[second] / rates[first] * amount
            }

            val = -val;

            return +val.toFixed(accuracy)
        } else
            return 0
    }

    onChangeAmountFrom = (currencyNameFrom, currencyNameTo, event) => {
        event.preventDefault();

        const sumToConvert = +event.currentTarget.value
        this.setState({
            sumToConvert: sumToConvert
        })

        const {purse} = this.props
        const sumInPurseFrom = purse[currencyNameFrom]
        const sumInPurseTo   = purse[currencyNameTo]
        const convertedSum   = this.getRate(currencyNameFrom, currencyNameTo, sumToConvert, 2)

        if (sumToConvert > 0) { // покупка
            if (sumInPurseTo < -convertedSum || !sumInPurseTo || !sumToConvert) {
                this.setState({
                    validationErrorTo: true
                })
            } else {
                this.setState({
                    validationErrorTo: false
                })
            }
            this.setState({
                validationErrorFrom: false
            })
        } else if (sumToConvert < 0) { // продажа
            if (sumInPurseFrom < -sumToConvert || !sumInPurseFrom) {
                this.setState({
                    validationErrorFrom: true
                })
            } else {
                this.setState({
                    validationErrorFrom: false
                })
            }
            this.setState({
                validationErrorTo: false
            })
        } else {
            this.setState({
                validationErrorFrom: false,
                validationErrorTo  : false,
            })
        }
    }

    getCurrenciesInPurse = (purse)=> {
        return Object.getOwnPropertyNames(purse)
    }

    onClickCancel = ()=> {
        this.setState({
            sumToConvert       : 0,
            validationErrorFrom: false,
            validationErrorTo  : false,
        })
    }

    onClickExchange = ()=> {
        const convertedSum = this.getRate(this.props.currencyNameFrom, this.props.currencyNameTo, this.state.sumToConvert, 2)
        let purse          = this.props.purse
        let valTo          = this.props.purse[this.props.currencyNameTo]
        let valFrom        = this.props.purse[this.props.currencyNameFrom]

        if (valFrom <= 0
            || valFrom === undefined
            || !this.state.sumToConvert
            || this.props.currencyNameTo === this.props.currencyNameFrom
        ) {
            return false;
        }

        if (valTo === undefined) {
            valTo = convertedSum
        } else {
            valTo = valTo + convertedSum
        }

        valFrom = valFrom + this.state.sumToConvert

        purse[this.props.currencyNameFrom] = +valFrom.toFixed(2)
        purse[this.props.currencyNameTo]   = +valTo.toFixed(2)

        this.setState({
            purse       : purse,
            sumToConvert: 0
        })

        this.props.dispatch({
            type: 'CONVERT',
            purse
        })
    }

    render() {
        return (
            <div style={styles.container}>
                <TopBottons {...this.state} {...this.props}
                    disabled={this.state.validationErrorFrom || this.state.validationErrorTo || !this.state.sumToConvert}
                    rate={-this.getRate(this.props.currencyNameFrom, this.props.currencyNameTo, 1, 4)}
                    onClickCancel={this.onClickCancel}
                    onClickExchange={this.onClickExchange}
                />
                <ExchangeFrom currencyNameFrom={this.props.currencyNameFrom}
                              currencyNameTo={this.props.currencyNameTo}
                              sumInPurse={this.state.purse[this.props.currencyNameFrom]}
                              isError={this.state.validationErrorFrom}
                              sumToConvert={this.state.sumToConvert}
                              onChangeAmountFrom={this.onChangeAmountFrom.bind(null, this.props.currencyNameFrom, this.props.currencyNameTo)}
                              currencies={this.getCurrenciesInPurse(this.props.purse)}
                              dispatch={this.props.dispatch}
                />
                <ExchangeTo currencyNameTo={this.props.currencyNameTo}
                            currencyNameFrom={this.props.currencyNameFrom}
                            sumInPurse={this.state.purse[this.props.currencyNameTo]}
                            isError={this.state.validationErrorTo}
                            sumToConvert={this.getRate(this.props.currencyNameFrom, this.props.currencyNameTo, this.state.sumToConvert, 2)}
                            currencies={this.props.currencies}
                            rate={-this.getRate(this.props.currencyNameTo, this.props.currencyNameFrom, 1, 2)}
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
