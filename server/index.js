const express = require('express')
const path = require('path')
const { Product, Order, LineItem, seed } = require('./db')

const PORT = process.env.PORT || 3000
const app = express()

//body-parsing middleware
app.use(express.json())

//static file-serving middle-ware
app.use('/dist', express.static(path.join(__dirname, '../dist')))

//main GET route
app.get('/', (req,res,next) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'))
})

//initialize server

const init = () => {
    seed()
    app.listen(PORT, ()=> {`app is listening on ${PORT}`})
}

init()

//api routes

app.get('/api/products', (req, res, next)=> {
    Product.findAll()
      .then( products => res.send(products))
      .catch(next);
  }
);
  
app.get('/api/orders', async (req, res, next)=> {
const attr = {
    status: 'CART'
};
try {
let cart = await Order.findOne({ where: attr });
if(!cart){
    cart = await Order.create(attr); 
}
const orders = await Order.findAll({
    include: [ LineItem ],
    order: [['createdAt', 'DESC']]
})
res.send(orders);
}
catch(ex){
    next(ex);
}
});

//update line item
app.put('/api/orders/:orderId/lineItems/:id', (req, res, next)=> {
LineItem.findById(req.params.id)
    .then( lineItem => lineItem.update(req.body))
    .then( lineItem => res.send(lineItem)) 
    .catch(next);
});

//delete lineItem
app.delete('/api/orders/:orderId/lineItems/:id', (req, res, next)=> {
LineItem.destroy({
    where: {
    orderId: req.params.orderId,
    id: req.params.id
    }
})
    .then(()=> res.sendStatus(204))
    .catch(next);
});

//create lineItem
app.post('/api/orders/:orderId/lineItems/', (req, res, next)=> {
LineItem.create({ orderId: req.params.orderId, quantity: req.body.quantity, productId: req.body.productId })
    .then( lineItem => res.send(lineItem))
    .catch(next);
});

//update order
app.put('/api/orders/:id', (req, res, next)=> {
Order.findById(req.params.id)
    .then( order => order.update(req.body))
    .then( order => res.send(order))
    .catch(next);
});

//reset
app.delete('/api/reset', (req, res, next) => {
    seed()
    .then(() => res.sendStatus(204))
    .catch(next)
    // .then(() => res.sendStatus(204))
    // .catch(next)
})

// error catching middleware
app.use ((err, req, res,next) => {
    console.log(err, typeof next)
    console.error(err.stack)
    res.status(err.status || 500).send (err.message || 'Internal server error.')
})

