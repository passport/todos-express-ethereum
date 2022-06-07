import { ethers } from 'ethers';
import { SiweMessage } from 'siwe';

window.addEventListener('load', function() {
  
  document.getElementById('siw-ethereum').addEventListener('click', function(event) {
    if (typeof window.ethereum == 'undefined') { return; }
    
    event.preventDefault();
    
    return fetch('/login/ethereum/challenge', {
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      return ethereum.request({ method: 'eth_requestAccounts' })
      .then(function(accounts) {
        return [ accounts[0], json.nonce ]
      });
    })
    .then(function(args) {
      const account = args[0];
      const address = ethers.utils.getAddress(account);
      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: 'Sign in with Ethereum to the app.',
        uri: window.location.origin,
        nonce: args[1],
        version: '1',
        chainId: '1'
      });
      
      const m = message.prepareMessage();
      return ethereum.request({
        method: 'personal_sign',
        params: [ m, address ]
      })
      .then(function(signature) {
        return [ m, signature ]
      });
    })
    .then(function(args) {
      return fetch('/login/ethereum', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ message: args[0], signature: args[1] }),
      });
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      window.location.href = json.location;
    });
  });
  
});
