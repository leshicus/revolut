import React, {Component} from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import fx from 'money'

function loadFx(resolve, reject) {
    axios.get('http://api.fixer.io/latest', {})
        .then(function (response) {
            console.log(response);
            if (response) {
                const data = response.data;
                if (data) {
                    // const rates = data.rates;
                    // if(rates){
                    //
                    // }
                    resolve(data)
                }
            }
        })
        .catch(function (error) {
            console.log(error);
        });

}

function startFx(dispatch) {
    // const intervalFx = setInterval(function () {
    //     new Promise((resolve, reject)=> {
    //         loadFx(resolve, reject);
    //     }).then((fx)=>
    //         dispatch({
    //             type: 'FX_FETCHED',
    //             fx
    //         })
    //     )
    // }, 10000)
    new Promise((resolve, reject)=> {
        loadFx(resolve, reject);
    }).then((fx)=>
        dispatch({
            type: 'FX_FETCHED',
            fx
        })
    )
}

class ExchangeContainer extends Component {
    constructor(props) {
        super(props)

        this.getRate = this.getRate.bind(this)

        startFx(props.dispatch);
    }


    getRate(fx, first, second) {
        const {rates} = fx
        console.info(rates)

        if (rates) {
            return(
                <div>
                    {first}/{second} = {rates[first]}/{rates[second]} = {rates[first]/rates[second]}
                </div>
            )

        }

    }

    render() {
        return (
            <div>
                {this.getRate(this.props.fx, 'RUB', 'USD')}
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
