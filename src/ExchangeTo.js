import React from 'react'
import Swipeable from 'react-swipeable'
import getSymbolFromCurrency from 'currency-symbol-map'
import {onSwiped, getErrorText, getRateText} from './actions'
import {RIGHT, LEFT, FONTSIZE_MAIN, FONTSIZE_SUB} from './constants'

const styles = {
    currencyName: {},
    container   : {
        minHeight      : '7.2rem',
        padding        : '10px',
        backgroundColor: 'rgb(2, 131, 241)',
    },
    input       : {
        width    : '70%',
        fontSize : FONTSIZE_MAIN,
        textAlign: 'right'
    },
    sumInPurse  : {
        fontSize  : FONTSIZE_SUB,
        paddingTop: '5px',
        opacity   : '0.7'
    },
    errorText   : {
        fontSize: FONTSIZE_SUB,
    },
    rate        : {
        float: 'right',

    },
    firstRow    : {
        display       : 'flex',
        justifyContent: 'space-between',
        fontSize      : FONTSIZE_MAIN,
    }
}

const getSumInPurse = (currencyName, sumInPurse)=>'You have ' + getSymbolFromCurrency(currencyName) + '' + getSum(sumInPurse)
const getSum        = (sumInPurse)=>sumInPurse > 0 ? sumInPurse : 0
const ExchangeTo    = ({dispatch, currencyNameTo, currencyNameFrom, rate, sumInPurse, isError, sumToConvert, currencies})=> {
    return (
        <Swipeable
            onSwipedLeft={()=>onSwiped(dispatch, currencies, currencyNameTo,LEFT, 'CHANGE_CURRENCY_TO')}
            onSwipedRight={()=>onSwiped(dispatch, currencies, currencyNameTo,RIGHT,'CHANGE_CURRENCY_TO')}>
            <div style={styles.container}>
                <div style={styles.firstRow}>
                    {currencyNameTo}
                    <div style={styles.input}>
                        {sumToConvert === 0 ? '' : sumToConvert}
                    </div>
                </div>
                <div style={styles.sumInPurse}>
                    {getSumInPurse(currencyNameTo, sumInPurse)}
                    <div style={styles.rate}>
                        {getRateText(currencyNameTo, currencyNameFrom, rate)}
                    </div>
                </div>
                <div style={styles.errorText}>
                    {getErrorText(isError)}
                </div>
            </div>
        </Swipeable>
    )
}

export default ExchangeTo
