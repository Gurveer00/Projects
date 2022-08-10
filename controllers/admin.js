const e = require('express');
const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    edit: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const UserId= req.user._id;
  const product = new Product(title,price,imageUrl,description,null,UserId);
  product.save()
  .then(result=>{
    console.log('product created');
    res.redirect('/')
  })
  .catch(err=>{
    console.log(err);
  })
};

exports.geteditProduct = (req, res, next) => {
  const editmode=req.query.edit;
  const prodid=req.params.productid;
  console.log('in edit mode');
  if(!editmode){
    return res.redirect('/');
  }
  Product.findbyId(prodid)
  .then(product=>{
    res.render('admin/edit-product', {
      pageTitle: 'edit Product',
      path: '/admin/edit-product',
      edit: editmode,
      product: product
    })})
  .catch(err=>{
    console.log(err);
  })
};

exports.posteditproduct=(req,res,next)=>{
  const id=req.body.productid;
  const updatedtitle=req.body.title;
  const updatedprice=req.body.price;
  const updatedimgUrl=req.body.imageUrl;
  const updateddescription=req.body.description;
  const product= new Product(updatedtitle,updatedprice,updatedimgUrl,updateddescription,id);
  product.save()
  .then(result=>{
    console.log('PRODUCT UPDATED!!');
    res.redirect('/');
  })
  .catch(err=>{
    console.log(err);
  })
}; 

exports.getProducts = (req, res, next) => {
  Product.fetchall().then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    })})
    .catch(err=>{
      console.log(err);
    })
};

exports.postdeleteproduct = (req,res,next)=>{
  const id=req.body.productid;
  Product.deletebyId(id)
  .then(result=>{
    console.log('PRODUCT DELETED');
    res.redirect('/');
  })
  .catch(err=>{
    console.log(err);
  })
}; 