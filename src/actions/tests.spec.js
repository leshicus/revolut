import {
    getCurrencyNext,
    getRate,
    getMinorDecimal,
    decrementSumInPurseFrom,
    incrementSumInPurseTo,
    isError,
} from '../actions/index'
import {RIGHT, LEFT} from './../constants/index'

//////////////////////////////// calc rate ////////////////////////////////
const fx = {
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
}

test('Convert 10 USD => RUB', () => {
    expect(getRate(fx, 'USD', 'RUB', 10, 2)).toBe(574.04);
});

test('Convert 100 RUB => USD', () => {
    expect(getRate(fx, 'RUB', 'USD', 100, 2)).toBe(1.74);
});


//////////////////////////////// Swipe ////////////////////////////////
const currencies = [
    'AUD',
    'GBP',
    'HKD',
    'RON',
    'RUB',
    'USD',
    'ZAR'
]
test('Swipe left from RON', () => {
    expect(getCurrencyNext(currencies, 'RON', LEFT)).toBe('RUB');
});

test('Swipe left from last on the end (ZAR->AUD)', () => {
    expect(getCurrencyNext(currencies, 'ZAR', LEFT)).toBe('AUD');
});

test('Swipe right from RUB', () => {
    expect(getCurrencyNext(currencies, 'RUB', RIGHT)).toBe('RON');
});

test('Swipe right from first in the beginning (AUD->ZAR)', () => {
    expect(getCurrencyNext(currencies, 'AUD', RIGHT)).toBe('ZAR');
});


//////////////////////////////// decrement/increment ////////////////////////////////
// * decrease sum of From on convert
test('decrement sum in purse From', () => {
    const purse = {
        USD: 25.51
    }
    expect(decrementSumInPurseFrom(purse, 'USD', 10)).toMatchObject({"result": true, "sum": 15.51});
    expect(decrementSumInPurseFrom(purse, 'USD', 35)).toMatchObject({"result": false, "sum": 25.51});
    expect(decrementSumInPurseFrom(purse, 'USD', 0)).toMatchObject({"result": false, "sum": 25.51});
    expect(decrementSumInPurseFrom(purse, 'RUB', 10)).toMatchObject({"result": false, "sum": 0});
});

// * icrease sum of To on convert
test('increment sum in purse To', () => {
    const purse = {
        USD: 25.51
    }
    expect(incrementSumInPurseTo(purse, 'USD', 10)).toMatchObject({"result": true, "sum": 35.51});
    expect(incrementSumInPurseTo(purse, 'USD', 0)).toMatchObject({"result": false, "sum": 25.51});
    expect(incrementSumInPurseTo(purse, 'RUB', 10)).toMatchObject({"result": true, "sum": 10});
});


//////////////////////////////// getMinorDecimal ////////////////////////////////
test('getMinorDecimal: get deciaml part of rate', () => {
    expect(getMinorDecimal(123.45678)).toBe("67");
    expect(getMinorDecimal("123.45679")).toBe("67");
    expect(getMinorDecimal(123.127898)).toBe("78");
    expect(getMinorDecimal(123.12999)).toBe("99");
    expect(getMinorDecimal(1234.00999)).toBe("99");
});


//////////////////////////////// isError ////////////////////////////////
test('is value a valid number', () => {
    expect(isError(33)).toBe(false);
    expect(isError('33')).toBe(false);
    expect(isError(12.33)).toBe(false);
    expect(isError('00.33')).toBe(false);
    expect(isError('33.')).toBe(false);

    expect(isError('00.334')).toBe(true);
    expect(isError(12.331)).toBe(true);
    expect(isError(0.331212)).toBe(true);
    expect(isError('.33')).toBe(true);
    expect(isError('+33')).toBe(true);
    expect(isError('+33+')).toBe(true);
    expect(isError('33+')).toBe(true);
    expect(isError('-33')).toBe(true);
    expect(isError('++33')).toBe(true);
    expect(isError('--33')).toBe(true);
    expect(isError('-33-')).toBe(true);
    expect(isError('e33')).toBe(true);
    expect(isError('33e')).toBe(true);
    expect(isError('33s')).toBe(true);
});