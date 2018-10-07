import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createLineItem, updateLineItem, deleteLineItem, createOrder } from './store'

class Orders extends Component {
    constructor(props){
        super(props)
        this.add = this.add.bind(this)
        this.remove = this.remove.bind(this)
        this.create = this.create.bind(this)
    }

    add(productid){
        const { createLineItem, updateLineItem, cart } = this.props
        const existingLineItem = cart.lineItems.filter(lineItem => lineItem.productId == productid)

        if (existingLineItem.length){
            updateLineItem(cart.id, existingLineItem[0].id, 
                {quantity: existingLineItem[0].quantity + 1 }
            )
        } else {
            createLineItem(cart.id, {
                productId: productid,
                quantity: 1
            })
        }
    }

    remove(productid){
        const { deleteLineItem, updateLineItem, cart } = this.props
        const existingLineItem = cart.lineItems.filter(lineItem => lineItem.productId == productid)
        if (!existingLineItem[0]){
            return
        }
        else if (existingLineItem[0].quantity > 1){
            updateLineItem(cart.id, existingLineItem[0].id, {
                quantity: existingLineItem[0].quantity - 1
            })
        } else if (existingLineItem.length){
            deleteLineItem(cart.id, existingLineItem[0].id)
        }
        else return
    }

    create(){
        const { createOrder, cart } = this.props
        createOrder(cart.id)
    }

    render(){
        const { products, cart } = this.props
        const { add, remove, create } = this

        return(
            <div>
                <h2>Products</h2>
                <ul>
                    {products.map(product => (
                        <li key = {product.id}>
                            {product.name}
                            <br/>
                            { cart ?
                            cart.lineItems.filter(lineItem => lineItem.productId == product.id
                            ).length ?
                            cart.lineItems.filter(lineItem => lineItem.productId == product.id
                            )[0].quantity
                            :
                            '0'
                            :
                            '0'
                            } ordered
                            <br/>
                            <button onClick = {() => add(product.id)}>+</button>
                            <button onClick = {() => remove(product.id)}>-</button>
                        </li>
                    )
                    )}
                </ul>
                <button onClick = {() => create()}>Create Order</button>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    createLineItem: (orderId, lineItem) => dispatch(createLineItem(orderId, lineItem)),
    updateLineItem: (orderId, lineItemId, quantity) => dispatch(updateLineItem(orderId, lineItemId, quantity)),
    deleteLineItem: (orderId, lineItemId) => dispatch(deleteLineItem(orderId, lineItemId)),
    createOrder: (orderId) => dispatch(createOrder(orderId)),
})


const mapStateToProps = state => ({
    products: state.products,
    cart: state.orders.filter(order => order.status === "CART")[0]
})

export default connect(mapStateToProps, mapDispatchToProps)(Orders)