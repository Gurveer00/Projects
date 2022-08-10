const getdb= require('../util/database').getdb;
const mongodb= require('mongodb');

class Product{
  constructor(title,price,imageurl,description,id,UserId){
    this.title=title;
    this.price=price;
    this.imageurl=imageurl;
    this.description=description;
    if(id){
      this._id= new mongodb.ObjectId(id);
    }
    this.UserId=UserId;
  }

  save(){
    const db=getdb();
    let dbop;
    if(this._id){
      dbop=db.collection('products').updateOne({_id: this._id}, {$set: this});
    }
    else{
      dbop= db.collection('products').insertOne(this);
    }
    return dbop
          .then(result=>{
            console.log(result)
          })
          .catch(err=>{
            console.log(err);
         })
        }

  static fetchall(){
    const db= getdb();
    return db.collection('products')
    .find()
    .toArray()
    .then(products=>{
      return products;
    })
    .catch(err=>{
      console.log(err);
    })
  }

  static findbyId(id){
    const db= getdb();
    return db.collection('products')
    .find({_id: mongodb.ObjectId(id)})
    .next()
    .then(product=>{
      return product;
    })
    .catch(err=>{
      console.log(err);
    })
  }

  static deletebyId(id){
    const db= getdb();
    return db.collection('products')
    .deleteOne({_id: new mongodb.ObjectId(id)})
    .then(result=>{
      console.log('deleted');
    })
    .catch(err=>{
      console.log(err);
    })
  }
}


/* const Sequelize=require('sequelize');

const sequelize=require('../util/database');

const Product= sequelize.define('product',{
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allownull: false,
    primaryKey: true
  },
  title: {
    type: Sequelize.STRING
  },
  price: {
    type: Sequelize.DOUBLE,
    allownull: false
  },
  imageUrl: {
    type: Sequelize.STRING,
    allownull: false
  },
  description: {
    type: Sequelize.STRING,
    allownull: false
  }
}) */

module.exports= Product;