import React from 'react'
import Swipeable from 'react-swipeable'
import getSymbolFromCurrency from 'currency-symbol-map'
import {onSwiped, getErrorText} from './actions'
import {RIGHT, LEFT, FONTSIZE_MAIN, FONTSIZE_SUB} from './constants'

const styles = {
    container : {
        minHeight: '7.2rem',
        padding  : '10px',
    },
    input     : {
        width          : '70%',
        fontSize       : FONTSIZE_MAIN,
        border         : '0',
        textAlign      : 'right',
        paddingTop     : '5px',
        paddingBottom  : '5px',
        backgroundColor: 'rgb(43, 158, 255)',
        color          : 'white',
        marginTop      : '-5px'
    },
    sumInPurse: {
        fontSize  : FONTSIZE_SUB,
        paddingTop: '5px',
        opacity   : '0.7'
    },
    errorText : {
        fontSize: FONTSIZE_SUB,
    },
    firstRow  : {
        display       : 'flex',
        justifyContent: 'space-between',
        fontSize      : FONTSIZE_MAIN,
    }
}

const onInputBlur   = (event)=> {
    const input = event.currentTarget

    input.focus()
}
const getSumInPurse = (currencyName, sumInPurse)=>'You have ' + getSymbolFromCurrency(currencyName) + '' + sumInPurse
const ExchangeFrom  = ({dispatch, currencyNameFrom, sumInPurse, isError, onChangeAmountFrom, currencies, sumToConvert})=> {
    return (
        <Swipeable
            onSwipedLeft={()=>onSwiped(dispatch, currencies, currencyNameFrom,LEFT,'CHANGE_CURRENCY_FROM')}
            onSwipedRight={()=>onSwiped(dispatch, currencies, currencyNameFrom,RIGHT,'CHANGE_CURRENCY_FROM')}>
            <div style={styles.container}>
                <div style={styles.firstRow}>
                    {currencyNameFrom}
                    <input type="number"
                           onChange={onChangeAmountFrom}
                           onBlur={onInputBlur}
                           style={styles.input}
                           value={sumToConvert === 0 ? '' : sumToConvert}
                           autoFocus
                    />
                </div>
                <div style={styles.sumInPurse}>
                    {getSumInPurse(currencyNameFrom, sumInPurse)}
                </div>
                <div style={styles.errorText}>
                    {getErrorText(isError)}
                </div>
            </div>
        </Swipeable>
    )
}

export default ExchangeFrom
