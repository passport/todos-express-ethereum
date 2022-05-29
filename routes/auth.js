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

// personal_sign
// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-191.md
// https://github.com/ethereum/go-ethereum/pull/2940
// https://blog.spruceid.com/sign-in-with-ethereum-wallet-support-eip-191-vs-eip-712/
//
// https://github.com/coopermaruyama/passport-web3
// https://github.com/psychobunny/passport-dapp-web3
// https://www.npmjs.com/package/web3-eth-accounts
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
  
  
// https://eips.ethereum.org/EIPS/eip-712
router.post('/api/ethereum/eth_signedTypedData_v1',
  function(req, res, next) {
    console.log('# ethereum/eth_signedTypedData_v1');
    console.log(req.body);
    
    /*
    var message = 'Hello!x'
    var addr = ethSigUtil.recoverPersonalSignature({
      data: '0x' + Buffer.from(message, 'utf8').toString('hex'),
      //data: message,
      signature: req.body.signature
    });
    
    console.log(addr);
    */
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
