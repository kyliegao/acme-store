import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Switch, Redirect, Route, HashRouter as Router} from 'react-router-dom'
import Nav from './Nav'
import Orders from './Orders'
import Cart from './Cart'
import store, {fetchProducts, fetchOrders} from './store'


class Main extends Component{
    constructor(props){
        super(props)
    }

    componentDidMount(){
        this.props.fetchProducts()
        this.props.fetchOrders()
    }

    render(){

        const { products, cart, orders } = this.props
        console.log(this.props)
        
        return(
            <Router>
                <div>
                    <h1>The Store</h1>
                    <Nav />
                    <Route path = '/cart' component = {Cart}/>
                    <Route path = '/orders' component = {Orders}/>
                </div> 
            </Router>   
        )
    }
}

const mapDispatchToProps = dispatch => ({
    fetchProducts: () => dispatch(fetchProducts()),
    fetchOrders: () => dispatch(fetchOrders())
})

const mapStateToProps = state => ({
    cart: state.cart,
    orders: state.orders,
    products: state.products,
})

export default connect(mapStateToProps, mapDispatchToProps)(Main)





