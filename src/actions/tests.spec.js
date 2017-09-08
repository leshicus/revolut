import {
    getCurrencyNext,
    getRate,
    getMinorDecimal,
    decrementSumInPurseFrom,
    incrementSumInPurseTo
} from '../actions/index'
import {RIGHT, LEFT} from './../constants/index'

const store = {
    fx              : {
        base : 'EUR',
        date : '2017-09-06',
        rates: {
            AUD: 1.4961,
            GBP: 0.91428,
            HKD: 9.3362,
            RON: 4.5986,
            RUB: 68.489,
            USD: 1.1931,
            ZAR: 15.396
        }
    },
    purse           : {
        GBP: 58.33,
        USD: 25.51,
        EUR: 116.12,
    },
    currencyNameFrom: 'USD',
    currencyNameTo  : 'RUB',
    currencies      : [
        'AUD',
        'GBP',
        'HKD',
        'RON',
        'RUB',
        'USD',
        'ZAR'
    ],
    // validationError: false,
    sumToConvert    : '14.5',
}

// * calc rate
test('Convert 10 USD => RUB', () => {
    expect(getRate(store.fx, store.currencyNameFrom, store.currencyNameTo, 10, 2)).toBe(574.04);
});

test('Convert 100 RUB => USD', () => {
    expect(getRate(store.fx, store.currencyNameTo, store.currencyNameFrom, 100, 2)).toBe(1.74);
});

// * Swipe
test('Swipe left from RON', () => {
    expect(getCurrencyNext(store.currencies, 'RON', LEFT)).toBe('RUB');
});

test('Swipe left from last on the end (ZAR->AUD)', () => {
    expect(getCurrencyNext(store.currencies, 'ZAR', LEFT)).toBe('AUD');
});

test('Swipe right from RUB', () => {
    expect(getCurrencyNext(store.currencies, 'RUB', RIGHT)).toBe('RON');
});

test('Swipe right from first in the beginning (AUD->ZAR)', () => {
    expect(getCurrencyNext(store.currencies, 'AUD', RIGHT)).toBe('ZAR');
});

// * уменьшение суммы From при конвертации
test('decrement sum in purse From', () => {
    const purse = {
        USD: 25.51
    }
    expect(decrementSumInPurseFrom(purse, 'USD', 10)).toMatchObject({"result": true, "sum": 15.51});
    expect(decrementSumInPurseFrom(purse, 'USD', 35)).toMatchObject({"result": false, "sum": 25.51});
    expect(decrementSumInPurseFrom(purse, 'USD', 0)).toMatchObject({"result": false, "sum": 25.51});
});

// * увеличение суммы To при конвертации
test('increment sum in purse To', () => {
    const purse = {
        USD: 25.51
    }
    expect(incrementSumInPurseTo(purse, 'USD', 10)).toMatchObject({"result": true, "sum": 35.51});
    expect(incrementSumInPurseTo(purse, 'USD', 0)).toMatchObject({"result": false, "sum": 25.51});
});

test('getMinorDecimal: get deciaml part of rate', () => {
    expect(getMinorDecimal(123.45678)).toBe("67");
    expect(getMinorDecimal("123.45679")).toBe("67");
    expect(getMinorDecimal(123.127898)).toBe("78");
    expect(getMinorDecimal(123.12999)).toBe("99");
    expect(getMinorDecimal(1234.00999)).toBe("99");
});

