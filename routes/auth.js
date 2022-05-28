var express = require('express');
var passport = require('passport');
var db = require('../db');

var router = express.Router();

/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login/password', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureMessage: true
}));


var ethSigUtil = require('@metamask/eth-sig-util')

router.post('/login/ethereum',
  function(req, res, next) {
    console.log(req.body);
    
    var message = 'Hello!'
    
    var addr = ethSigUtil.recoverPersonalSignature({
      data: '0x' + Buffer.from(message, 'utf8').toString('hex'),
      //data: message,
      signature: req.body.signature
    });
    
    console.log(addr);
  });
  
/*
router.post('/login/ethereum/x2',
  function(req, res, next) {
    console.log(req.body);
    
    var message = 'Hello!'
    
    var addr = ethSigUtil.recoverPersonalSignature({
      data: '0x' + Buffer.from(message, 'utf8').toString('hex'),
      //data: message,
      signature: req.body.signature
    });
    
    console.log(addr);
  });
*/
  
router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
