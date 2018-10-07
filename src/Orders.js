import React from 'react'
import { connect } from 'react-redux'

const Orders = (props) => {
    const { orders, products } = props

    return(
        <div>
            <h2>Orders</h2>
            <ul>
                {orders.map(order => (
                    <li key = {order.id}>
                        {order.id}
                        <ul>
                            {order.lineItems.map(lineItem => (
                                <li key = {order.id + lineItem.id}>
                                    {products.filter(product => (product.id == lineItem.productId))[0].name}
                                    {lineItem.quantity}
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    )
    
}


const mapStateToProps = state => ({
    orders: state.orders.filter(order => order.status === "ORDER"),
    products: state.products
})

export default connect(mapStateToProps)(Orders)