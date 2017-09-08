import React from 'react'
import Swipeable from 'react-swipeable'
import getSymbolFromCurrency from 'currency-symbol-map'
import {onSwiped, getErrorText} from './../actions'
import {RIGHT, LEFT, FONTSIZE_MAIN, FONTSIZE_SUB} from './../constants'

const styles = {
    container  : {
        minHeight: '8rem',
        padding  : '10px',
    },
    input      : {
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
    sumInPurse : {
        fontSize: FONTSIZE_SUB,
        margin : '5px 25px',
        opacity : '0.7'
    },
    errorText  : {
        fontSize: FONTSIZE_SUB,
        margin : '5px 25px'
    },
    firstRow   : {
        display       : 'flex',
        justifyContent: 'space-between',
        fontSize      : FONTSIZE_MAIN,
        margin       : '0 10px 0 25px'
    },
    buttonLeft : {
        // float     : 'left',
        height    : '9rem',
        position  : 'absolute',
        fontSize  : '2em',
        border    : '0',
        background: 'rgb(43, 158, 255)',
        color     : 'white',
        opacity   : '0.5',
        padding   : '0',
    },
    buttonRight: {
        float     : 'right',
        height    : '9rem',
        // position  : 'absolute',
        fontSize  : '2em',
        border    : '0',
        background: 'rgb(43, 158, 255)',
        color     : 'white',
        opacity   : '0.5',
        padding   : '0',
    },

}

const onInputBlur = (event)=> {
    const input = event.currentTarget

    input.focus()
}

const getSumInPurse = (currencyName, sumInPurse)=>'You have ' + getSymbolFromCurrency(currencyName) + '' + sumInPurse

const ExchangeFrom = ({dispatch, currencyNameFrom, sumInPurse, errorType, onChangeAmountFrom, currencies, sumToConvert})=> {
    return (
        <Swipeable
            onSwipedLeft={()=>onSwiped(dispatch, currencies, currencyNameFrom,LEFT,'CHANGE_CURRENCY_FROM')}
            onSwipedRight={()=>onSwiped(dispatch, currencies, currencyNameFrom,RIGHT,'CHANGE_CURRENCY_FROM')}
        >
            <button style={styles.buttonLeft}
                    type="arrow"
                    onClick={()=>onSwiped(dispatch, currencies, currencyNameFrom,LEFT,'CHANGE_CURRENCY_FROM')}
            >⇦
            </button>
            <button style={styles.buttonRight}
                    type="arrow"
                    onClick={()=>onSwiped(dispatch, currencies, currencyNameFrom,RIGHT,'CHANGE_CURRENCY_FROM')}
            >⇨
            </button>
            <div style={styles.container}>
                <div style={styles.firstRow}>
                    {currencyNameFrom}
                    <input type="text"
                           onChange={onChangeAmountFrom}
                           onBlur={onInputBlur}
                           style={styles.input}
                           value={sumToConvert === '' ? '' : '-' + sumToConvert}
                           // value={sumToConvert === '0' ? '0' : (sumToConvert === '' ? '' : '-' + sumToConvert)}
                           autoFocus
                    />
                </div>
                <div style={styles.sumInPurse}>
                    {getSumInPurse(currencyNameFrom, sumInPurse)}
                </div>
                <div style={styles.errorText}>
                    {getErrorText(errorType)}
                </div>
            </div>
        </Swipeable>
    )
}

export default ExchangeFrom
