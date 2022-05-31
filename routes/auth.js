var express = require('express');
var passport = require('passport');
var EthereumStrategy = require('passport-ethereum-eip4361');
var Web3Strategy = require('passport-web3');
var ethSigUtil = require('@metamask/eth-sig-util');
var db = require('../db');


passport.use(new EthereumStrategy(function verify(address, cb) {
  console.log('VERIFY SOMETHING!!!');
  console.log(address);
  
  // https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-2.md
  // https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-3.md
  
  db.get('SELECT * FROM blockchain_credentials WHERE chain = ? AND address = ?', [
    'eip155:1',
    address
  ], function(err, row) {
    if (err) { return cb(err); }
    if (!row) {
      db.run('INSERT INTO users (username) VALUES (?)', [
        address
      ], function(err) {
        if (err) { return cb(err); }
        var id = this.lastID;
        db.run('INSERT INTO blockchain_credentials (user_id, chain, address) VALUES (?, ?, ?)', [
          id,
          'eip155:1',
          address
        ], function(err) {
          if (err) { return cb(err); }
          var user = {
            id: id,
            username: address
          };
          return cb(null, user);
        });
      });
    } else {
      db.get('SELECT rowid AS id, * FROM users WHERE rowid = ?', [ row.user_id ], function(err, row) {
        if (err) { return cb(err); }
        if (!row) { return cb(null, false); }
        return cb(null, row);
      });
    }
  });
}));

passport.use(new Web3Strategy(function verify(address, cb) {
  console.log('Web3Srategy verify');
  console.log(address);
}));

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.username, name: user.name });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});


var router = express.Router();

/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login/ethereum', passport.authenticate('ethereum', {
  failureMessage: true,
  failWithError: true
}), function(req, res, next) {
  res.format({
    'text/html': function() {
      res.redirect('/');
    },
    'application/json': function() {
      res.json({ ok: true, location: '/' });
    }
  });
}, function(err, req, res, next) {
  console.log(err);
  
  if (err.status !== 401) { return next(err); }
  res.format({
    'text/html': function() {
      res.redirect('/login');
    },
    'application/json': function() {
      res.json({ ok: false, location: '/login' });
    }
  });
});

/*
router.post('/login/ethereum', passport.authenticate('web3'), function(req, res, next) {
  console.log('AUTHD!');
});
*/

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
  
// https://docs.metamask.io/guide/signing-data.html#a-brief-history
// https://eips.ethereum.org/EIPS/eip-712
// https://medium.com/metamask/scaling-web3-with-signtypeddata-91d6efc8b290
// https://danfinlay.github.io/js-eth-personal-sign-examples/
// https://stackoverflow.com/questions/71043829/recovertypedsignature-function-on-metamask-eth-sig-util-is-not-working
router.post('/api/ethereum/eth_signedTypedData_v1',
  function(req, res, next) {
    console.log('# ethereum/eth_signedTypedData_v1');
    console.log(req.body);
    
    var msgParams = req.body.msg;
    var signed = req.body.signed;
    
    const recovered = ethSigUtil.recoverTypedSignature({ version: 'V1', data: msgParams, signature: signed })
    console.log(recovered);
  });
  
  
// https://medium.com/metamask/eip712-is-coming-what-to-expect-and-how-to-use-it-bb92fd1a7a26
router.post('/api/ethereum/eth_signedTypedData_v3',
  function(req, res, next) {
    console.log('# ethereum/eth_signedTypedData_v3');
    console.log(req.body);
    
    var msgParams = req.body.msg;
    var signed = req.body.signed;
    
    const recovered = ethSigUtil.recoverTypedSignature({ version: 'V1', data: msgParams, signature: signed })
    console.log(recovered);
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
