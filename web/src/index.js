import { ethers } from 'ethers';
import { SiweMessage } from 'siwe';

console.log('hello workspace');



window.addEventListener('load', function() {
  console.log('load');
  
  if (typeof window.ethereum == 'undefined') {
    console.log('Ethereum-compatible browser not detected. Please install MetaMask.');
    return;
  }
  

  document.getElementById('siw-ethereum').addEventListener('click', function(event) {
    event.preventDefault();
  
    console.log('sign in...');
    
    ethereum.request({ method: 'eth_requestAccounts' })
    .then(function(accounts) {
      const account = accounts[0];
      const address = ethers.utils.getAddress(account);
      
      const m = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: 'Sign in with Ethereum to the app.',
        uri: window.location.origin,
        version: '1',
        chainId: '1'
      });
      
      const message = m.prepareMessage();
      
      return ethereum.request({
        method: 'personal_sign',
        params: [message, address]
      })
      .then(function(signature) {
        console.log('signed!');
        console.log(signature);
        
        return fetch('/login/ethereum', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ message: message, signature: signature }),
        });
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
