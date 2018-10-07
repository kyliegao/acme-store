import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import loggerMiddleware from 'redux-logger'
import axios from 'axios'

// set up store
const initialState = {
    products: [],
    orders: [],
}

// actions
const GOT_PRODUCTS = 'GOT_PRODUCTS'
const GOT_ORDERS = 'GOT_ORDERS'



//action creators

export const gotProducts = (products) => ({
    type: GOT_PRODUCTS,
    products
})

export const gotOrders = (orders) => ({
    type: GOT_ORDERS,
    orders
})


//thunks

export const fetchProducts = () => {
    return (dispatch) => {
        axios.get('/api/products')
        .then(res => {
            dispatch(gotProducts(res.data))
        })
        .catch(ex => console.log(ex))
    }
}

export const fetchOrders = () => {
    return (dispatch) => {
        axios.get('/api/orders')
        .then(res => {
            dispatch(gotOrders(res.data))
        })
        .catch(ex => console.log(ex))
    }
}

export const createLineItem = (orderId, lineItem) => {
    return (dispatch) => {
        axios.post(`/api/orders/${orderId}/lineItems`, lineItem)
        .then(lineItem => {
            console.log(lineItem)
        })
        .then(() => {
            dispatch(fetchOrders())
        })
        .catch(ex => console.log(ex))
    }
}

export const updateLineItem = (orderId, lineItemId, quantity) => {
    return (dispatch) => {
        axios.put(`api/orders/${orderId}/lineItems/${lineItemId}`, quantity)
        .then(lineItem => {
            console.log(lineItem)
        })
        .then(() => {
            dispatch(fetchOrders())
        })
        .catch(ex => console.log(ex))
    }
}

export const deleteLineItem = (orderId, lineItemId) => {
    return (dispatch) => {
        axios.delete(`api/orders/${orderId}/lineItems/${lineItemId}`)
        .then(() => {
            dispatch(fetchOrders())
        })
        .catch(ex => console.log(ex))
    }
}

export const createOrder = (orderId) => {
    return(dispatch) => {
        axios.put(`api/orders/${orderId}`, {status: "ORDER"})
        .then((order) => {
            console.log(order)
        })
        .then(() => {
            dispatch(fetchOrders())
        })
        .catch(ex => console.log(ex))
    }
}

export const reset = () => {
    console.log('resetting')
    return (dispatch) => {
        axios.delete('api/reset')
        .then(() => console.log('database reset'))
        .then(() => {
            dispatch(fetchOrders())
        })
        .catch(ex => console.log(ex))
    }
}

//reducers

const reducer = (state = initialState,action) => {
    switch(action.type){
        case GOT_PRODUCTS:
            return {...state, products: action.products}

        case GOT_ORDERS:
            return {...state, orders: action.orders}

        default:
            return state
    }
}

    // const reducer = combineReducers({})

//initialize the store

export default createStore(reducer, applyMiddleware(thunkMiddleware, loggerMiddleware))