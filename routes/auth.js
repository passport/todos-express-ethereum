var express = require('express');
var passport = require('passport');
var EthereumStrategy = require('passport-ethereum-siwe');
var SessionNonceStore = require('passport-ethereum-siwe').SessionNonceStore;
var db = require('../db');


var store = new SessionNonceStore();

passport.use(new EthereumStrategy({ store: store }, function verify(address, cb) {
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

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login/ethereum', passport.authenticate('ethereum', {
  failureMessage: true,
  failWithError: true
}), function(req, res, next) {
  res.json({ ok: true, location: '/' });
}, function(err, req, res, next) {
  var cxx = Math.floor(err.status / 100);
  if (cxx != 4) { return next(err); }
  res.json({ ok: false, location: '/login' });
});

router.post('/login/ethereum/challenge', function(req, res, next) {
  store.challenge(req, function(err, nonce) {
    if (err) { return next(err); }
    console.log('NONCE: ' + nonce);
    res.json({ nonce: nonce });
  });
});
  
router.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

module.exports = router;
