import React from 'react'
import Swipeable from 'react-swipeable'
import getSymbolFromCurrency from 'currency-symbol-map'
import {onSwiped, getRateText} from './../actions'
import {RIGHT, LEFT, FONTSIZE_MAIN, FONTSIZE_SUB} from './../constants'

const styles = {
    currencyName: {},
    container   : {
        minHeight      : '8rem',
        padding        : '10px',
        backgroundColor: 'rgb(2, 131, 241)',
    },
    input       : {
        width    : '70%',
        fontSize : FONTSIZE_MAIN,
        textAlign: 'right'
    },
    sumInPurse  : {
        fontSize: FONTSIZE_SUB,
        opacity : '0.7',
        margin  : '5px 25px'
    },
    rate        : {
        float  : 'right',
        padding: '0 10px'
    },
    firstRow    : {
        display       : 'flex',
        justifyContent: 'space-between',
        fontSize      : FONTSIZE_MAIN,
        margin        : '0 10px 0 25px'
    },
    buttonLeft  : {
        // float     : 'left',
        height    : '9rem',
        position  : 'absolute',
        fontSize  : '2em',
        border    : '0',
        background: '#0283f1',
        color     : 'white',
        opacity   : '0.5',
        padding   : '0',
    },
    buttonRight : {
        float     : 'right',
        height    : '9rem',
        // position  : 'absolute',
        fontSize  : '2em',
        border    : '0',
        background: '#0283f1',
        color     : 'white',
        opacity   : '0.5',
        padding   : '0',
    }
}

const getSumInPurse = (currencyName, sumInPurse)=>'You have ' + getSymbolFromCurrency(currencyName) + '' + getSum(sumInPurse)

const getSum = (sumInPurse)=>sumInPurse > 0 ? sumInPurse : 0

const ExchangeTo = ({dispatch, currencyNameTo, currencyNameFrom, rate, sumInPurse, sumToConvert, currencies})=> {
    return (
        <Swipeable
            onSwipedLeft={()=>onSwiped(dispatch, currencies, currencyNameTo, LEFT, 'CHANGE_CURRENCY_TO')}
            onSwipedRight={()=>onSwiped(dispatch, currencies, currencyNameTo, RIGHT,'CHANGE_CURRENCY_TO')}
        >
            <button style={styles.buttonLeft}
                    type="arrow"
                    onClick={()=>onSwiped(dispatch, currencies, currencyNameTo, LEFT, 'CHANGE_CURRENCY_TO')}
            >⇦
            </button>
            <button style={styles.buttonRight}
                    type="arrow"
                    onClick={()=>onSwiped(dispatch, currencies, currencyNameTo,RIGHT,'CHANGE_CURRENCY_TO')}
            >⇨
            </button>
            <div style={styles.container}>
                <div style={styles.firstRow}>
                    {currencyNameTo}
                    <div style={styles.input}>
                        {sumToConvert == 0 ? '' : '+' + sumToConvert}
                    </div>
                </div>
                <div style={styles.sumInPurse}>
                    {getSumInPurse(currencyNameTo, sumInPurse)}
                    <div style={styles.rate}>
                        {getRateText(currencyNameTo, currencyNameFrom, rate)}
                    </div>
                </div>
            </div>
        </Swipeable>
    )
}

export default ExchangeTo
