import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { reset } from './store'

const Nav = (props) => {
    const { cart, orders, reset } = props

    console.log('orders item', orders)
    let orderedItems = 0

    if (orders.length){
        orderedItems = orders.reduce( (accum, order) => { 
            if(order.lineItems.length){
                return accum += order.lineItems.reduce( (accum2, lineItem) => { 
                    return accum2 += lineItem.quantity
                },0)
            } else {
                return accum += 0
            }
        },0)
    }

    return (
        <div>
            <ul>
                <li><Link to = '/'>Home</Link></li>
                <li><Link to = '/cart'>Cart {cart.length}</Link></li>
                <li><Link to = '/orders'>Orders {orders.length}</Link></li>
            </ul>
            <br/>
            {orderedItems} items sold!!
            <br/>
            <button onClick = {() => reset() }>Reset</button>
        </div>
    )
}

const mapStateToProps = state => ({
    cart: state.orders.filter(order => order.status === "CART"),
    orders: state.orders.filter(order => order.status === "ORDER")
})

const mapDispatchToProps = (dispatch) => ({
    reset: () => dispatch(reset()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Nav)