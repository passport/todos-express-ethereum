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
      const account = accounts[0]
      
      const m = new SiweMessage({
        domain: window.location.host,
        address: account,
        statement: 'Sign in with Ethereum to the app.',
        uri: window.location.origin,
        version: '1',
        chainId: '1'
      });
      console.log(m);
      
      const message = m.prepareMessage();
      
      return ethereum.request({
        method: 'personal_sign',
        params: [message, account]
      })
      .then(function(signed) {
        console.log('signed!');
        console.log(signed);
        
        return fetch('/login/ethereum', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ address: account, message: message, sign: signed }),
        
        });
      });
      
    })
    .then(function(x) {
      console.log('fetched!!');
      console.log(x);
      
    });
    
  
  });
  
});