const reducer = (state = {
}, action) => {
    switch (action.type) {
        case 'FX_FETCHED':
            return Object.assign({}, state, {
                fx    : action.fx
            })
        default:
            return state
    }
}
export default reducer