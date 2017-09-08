import React from 'react'
import {
    getRateText,
    getMinorDecimal
} from './../actions'
import {FONTSIZE_SUB, FONTSIZE_MINOR} from './../constants'

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

const TopBottons = ({currencyNameFrom, currencyNameTo, rate, buttonExchangeDisabled, onClickExchange, onClickCancel})=> {
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
                    disabled={buttonExchangeDisabled}
            >
                Exchange
            </button>
        </div>
    )
}


export default TopBottons
