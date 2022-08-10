const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.fetchall()
  .then(products=>{
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  })
  .catch(err=>{
    console.log(err)
  })
};

 exports.getproduct=(req,res,next)=>{
  const prodId=req.params.productid;
  Product.findbyId(prodId)
  .then((product)=>{
    res.render('shop/product-detail',{product: product,pageTitle: product.title,path: '/products'});
  })
  .catch(err=>{
    console.log(err);
  });
}; 

exports.getIndex = (req, res, next) => {
  Product.fetchall()
  .then(products=>{
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  })
  .catch(err=>{
    console.log(err)
  })
};

 exports.getCart = (req, res, next) => {
  req.user.getcart()
  .then(products=>{
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        Products: products
      });
 })
    .catch(err=>{
      console.log(err);
    })
}; 

exports.postcart= (req,res,next)=>{
  const prodId= req.body.productId;
  Product.findbyId(prodId)
  .then(product=>{
    return req.user.AddtoCart(product);
  })
  .then(result=>{
    console.log(result);
    res.redirect('/cart');
  })
  /*let fetchedcart;
  let newquantity=1;
  req.user.getCart()
  .then(cart=>{
    fetchedcart=cart;
    return cart.getProducts({where: {id: prodId}});
  })
  .then(products=>{
    let product;
    if(products.length>0){
      product=products[0];
    }
    if(product){
      const oldquantity=product.cartitem.quantity;
      newquantity=oldquantity+1;
      return product;
    }
    else{
      return Product.findByPk(prodId)
    }
  })
  .then(product=>{
    fetchedcart.addProduct(product,{through : {quantity: newquantity}});
  })
  .then(()=>{
    res.redirect('/cart');
  })
  .catch(err=>{
    console.log(err);
  })*/
};

exports.postdeletecartitem= (req,res,next)=>{
  const prodid=req.body.productid;
  req.user.deletecartitem(prodid)
  .then(result=>{
    res.redirect('/cart');
  })
  .catch(err=>{
    console.log(err);
  })
};

exports.postorder= (req,res,next)=>{
  let fetchedcart;
  req.user.addorder()
  .then(result=>{
    res.redirect('/orders');
  })
  .catch(err=>{
    console.log(err);
  })
};

exports.getOrders = (req, res, next) => {
  req.user.getorder()
  .then(orders=>{
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders
    });
  })
  .catch(err=>{
    console.log(err);
  })
};

