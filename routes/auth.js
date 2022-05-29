var express = require('express');
var passport = require('passport');
var Web3Strategy = require('passport-web3');
var ethSigUtil = require('@metamask/eth-sig-util');
var db = require('../db');


passport.use(new Web3Strategy(function verify(address, cb) {
  console.log('Web3Srategy verify');
  console.log(address);
}));


var router = express.Router();

/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login/ethereum', passport.authenticate('web3'), function(req, res, next) {
  console.log('AUTHD!');
});

router.post('/api/ethereum/personal_sign',
  function(req, res, next) {
    console.log('# ethereum/personal_sign');
    console.log(req.body);
    
    var message = 'Hello!x'
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
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

module.exports = router;
