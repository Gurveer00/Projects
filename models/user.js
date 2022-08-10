const getdb= require('../util/database').getdb;
const mongodb= require('mongodb');

class User {
    constructor(username, email, cart, id){
        this.username=username;
        this.email=email;
        this.cart= cart;
        this._id= id;
    }

    save(){
        const db= getdb();
        return db.collection('users').insertOne(this);
    }

    static findbyId(id){
        const db= getdb();
        return db.collection('users')
                .findOne({_id: new mongodb.ObjectId(id)})
                .then(user=>{
                    console.log(user);
                    return user;
                })
                .catch(err=>{
                    console.log(err);
                });
    }

    AddtoCart(product){
        const cartitemindex= this.cart.items.findIndex(cp=>{
           return cp.productid.toString() === product._id.toString();
        })
        let newquantity= 1;
        const updatedcartitems= [...this.cart.items];
        if(cartitemindex>=0){
            newquantity= this.cart.items[cartitemindex].quantity + 1;
            updatedcartitems[cartitemindex].quantity= newquantity;
        }
        else{
            updatedcartitems.push({productid:new mongodb.ObjectId(product._id),quantity: 1});
        }
        const updatedcart= { items: updatedcartitems};
        const db= getdb();
        return db.collection('users').updateOne({_id: new mongodb.ObjectId(this._id)}, {$set : {cart: updatedcart}});
    }

    getcart(){
        const db= getdb();
        const productIds= this.cart.items.map(i=>{
            return i.productid;
        })
        return db
            .collection('products')
            .find({_id: {$in: productIds}})
            .toArray()
            .then(products=>{
                return products.map(p=>{
                    return {...p, quantity: this.cart.items.find(i=>{
                        return i.productid.toString()===p._id.toString();
                    }).quantity
                };
                });
            });
    }

    deletecartitem(id){
        const updatedcartitems= this.cart.items.filter(item=>{
            return item.productid.toString() !== id.toString();
        })
        const db= getdb();
        return db.collection('users').updateOne({_id : new mongodb.ObjectId(this._id)},{$set : {cart : {items: updatedcartitems}}});
    }

    addorder(){
    const db= getdb();
    return this.getcart()
            .then(products=>{
                const order = {
                    items : products,
                    user: {
                        _id : new mongodb.ObjectId(this._id),
                        name: this.username
                    }
                }
                return db.collection('orders')
                .insertOne(order);
            })
             .then(result=>{
                    this.cart.items= [];
                    return db.collection('users').updateOne({_id: new mongodb.ObjectId(this._id)}, {$set : {cart: {items : []}}}
                    );
                })
    }

    getorder(){
        const db= getdb();
        return db.collection('orders')
                 .find({'user._id' : new mongodb.ObjectId(this._id)})
                 .toArray();
    }
}


/*const Sequelize=require('sequelize');

const sequelize=require('../util/database');

const User= sequelize.define('User',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    mail: {
        type: Sequelize.STRING,
        allowNull: false
    }
})*/

module.exports= User;