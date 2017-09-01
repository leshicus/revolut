import React from 'react'

import {getRateText} from './actions'
import {FONTSIZE_SUB, FONTSIZE_MINOR} from './constants'

const styles = {
    container     : {
        padding        : '2px',
        backgroundColor: 'rgb(43, 158, 255)',
        display        : 'flex',
        justifyContent : 'space-between'
    },
    buttonCancel  : {
        backgroundColor: 'rgb(43, 158, 255)',
        color          : 'white',
        border         : 0,
        fontSize       : FONTSIZE_SUB,
    },
    buttonExchange: {
        backgroundColor: 'rgb(43, 158, 255)',
        color          : 'white',
        border         : 0,
        fontSize       : FONTSIZE_SUB,
    },
    rate          : {
        backgroundColor: 'rgb(2, 131, 241)',
        color          : 'white',
        fontSize       : FONTSIZE_SUB,
        border         : '1px solid rgba(255, 255, 255, 0.5)',
        borderRadius   : '3px',
        padding        : '2px',
        lineHeight     : '20px'
    },
    minorDecimal  : {
        fontSize: FONTSIZE_MINOR,
    }
}

// возвращает 3-й и 4-й знаки после запятой
const getMinorDecimal = (sum)=> {
    const floor        = Math.floor(sum)
    const decimal      = sum - floor
    const minorDecimal = decimal - decimal.toFixed(2, 10)
    const minor        = minorDecimal * 10000

    return '' + Math.abs(minor.toFixed(0, 10))
}

const TopBottons = ({currencyNameFrom, currencyNameTo, rate, disabled, onClickExchange, onClickCancel})=> {
    return (
        <div style={styles.container}>
            <button style={styles.buttonCancel}
                    onClick={onClickCancel}
            >
                Cancel
            </button>
            <div style={styles.rate}>
                {getRateText(currencyNameFrom, currencyNameTo, rate)}<span
                style={styles.minorDecimal}>{getMinorDecimal(rate)}</span>
            </div>
            <button style={styles.buttonExchange}
                    onClick={onClickExchange}
                    disabled={disabled}
            >
                Exchange
            </button>
        </div>
    )
}


export default TopBottons
