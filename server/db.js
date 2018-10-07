const Sequelize = require('Sequelize')
const pg = require('pg')

db = new Sequelize (process.env.DATABASE_URL || 'postgres://localhost:5432/acmestore')

const Product = db.define('product', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
  });
  
  const Order = db.define('order', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    status: {
      type: Sequelize.ENUM('CART', 'ORDER'),
      allowNull: false,
      defaultValue: 'CART'
    }
  });
  
  const LineItem = db.define('lineItem', {
    quantity: {
      type: Sequelize.INTEGER,
      defaultValue: 1
    },
  });

  Product.hasMany(LineItem)
  Order.hasMany(LineItem)

  const seed = () =>{
    
      db.sync({ force: true })
      .then(() => {
          Promise.all([
            Product.create({name: 'daisies'}),
            Product.create({name: 'lilacs'}),
            Product.create({name: 'pinkRoses'}),
            Product.create({name: 'peonies'})
          ])
          .then(() => {
            console.log('seeded!!!!')
          })
          .catch (ex => console.log(ex))
      })
      .catch(ex => console.log(ex))
  }

  module.exports = {
      Product,
      Order,
      LineItem,
      seed,
  }