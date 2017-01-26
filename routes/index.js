var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var Cart = require('../models/cart');

/* GET home page. */
router.get('/', function(req, res, next) {
  var successMsg = req.flash('success')[0];
  Product.find(function(err,docs) {
    var productChunks = [];
    var chunkSize = 3;

    for(var i = 0; i < docs.length; i+=chunkSize) {
      productChunks.push(docs.slice(i,i+chunkSize));
    }
    res.render('shop/index', { title: 'Shopping Cart', products: productChunks, successMsg:successMsg, noMessages: !successMsg });
  });
});

router.get('/add-to-cart/:id',function(req,res,next) {
  var productId = req.params.id;

  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId,function(err,product) {
    if(err) {
      return res.redirect('/');
    }

    cart.add(product, productId);
    req.session.cart = cart;

    console.log(req.session.cart);
    res.redirect('/');
  });
});

router.get('/shoppingcart',function(req,res,next) {
  if(!req.session.cart) {
    return res.render('shop/shoppingcart', {products:null})
  }

  var cart = new Cart(req.session.cart);
  res.render('shop/shoppingcart',{products: cart.generateArray(), totalPrice: cart.totalPrice})
});


router.get('/checkout',function(req,res,next) {
  if(!req.session.cart) {
    return res.redirect('shop/shoppingcart')
  }

  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];
  res.render('shop/checkout', {totalPrice: cart.totalPrice, errMsg:errMsg, noError: !errMsg})
});


router.post('/checkout',function(req,res,next) {
  if(!req.session.cart) {
    return res.redirect('shop/shoppingcart');
  }

  var cart = new Cart(req.session.cart);

  var stripe = require("stripe")(
      "sk_test_nAE9MDU4igRXXUhVv18KB60V"
  );

  stripe.charges.create({
    amount: cart.totalPrice * 100,
    currency: "cad",
    source: req.body.stripeToken, // obtained with Stripe.js
    description: "Test charge"
  }, function(err, charge) {
    if(err) {
      req.flash('error',err.message);
      return res.redirect('/checkout');
    }
    req.flash('success','Successfully bought product!');
    req.session.cart = null;
    res.redirect('/');
  });
});

module.exports = router;
