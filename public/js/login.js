window.addEventListener('load', function() {
  console.log('load...');
  
  // https://docs.metamask.io/guide/signing-data.html
  
  var currentAccount = null
  
  if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
    console.log('isMetaMask: ' + ethereum.isMetaMask);
    
    console.log(ethereum.networkVersion); // deprecated
    console.log(ethereum.selectedAddress);
    console.log(ethereum.isConnected());
    
    ethereum.on('accountsChanged', function (accounts) {
      // Time to reload your interface with accounts[0]!
      console.log('account changed');
      console.log(accounts)
      currentAccount = accounts[0];
    });
    
    ethereum.on('chainChanged', function (chainId) {
      // Time to reload your interface with accounts[0]!
      console.log('chain changed');
      console.log(chainId)
    });
    
  }
  
  document.getElementById('ethereum').addEventListener('click', function(event) {
    event.preventDefault();
    
    console.log('ETHEREUM: eth_requestAccounts');
    ethereum.request({ method: 'eth_requestAccounts' })
      .then(function(accounts) {
        console.log('got accounts')
        console.log(accounts);
      
        var from = accounts[0];
        //var msg = `0x${Buffer.from(exampleMessage, 'utf8').toString('hex')}`;
        var msg = 'Hello!';
      
      
        console.log('ETHEREUM: personal_sign');
        ethereum.request({
            method: 'personal_sign',
            params: [msg, from]
          })
          .then(function(sign) {
            console.log(sign);
        
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/login/ethereum', true);
            xhr.onreadystatechange = function() {
              console.log(this.readyState);
              console.log(this.status);
              console.log(this.responseText)
          
              //if (this.readyState === XMLHttpRequest.DONE) {
              //  window.location = '/';
              //}
            };
        
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({ account: accounts[0], signature: sign }));
          })
          .catch(function(error) {
            console.log('ERROR');
            console.log(error);
          })
        
        
        /*
        const msgParams = [
          {
            type: 'string',
            name: 'Message',
            value: 'Hi, Alice!',
          },
          {
            type: 'uint32',
            name: 'A number',
            value: '1337',
          },
        ];
        
        ethereum.request({
          method: 'eth_signTypedData',
          params: [msgParams, from]
        })
        .then(function(sign) {
          console.log(sign);
          
          var xhr = new XMLHttpRequest();
          xhr.open('POST', '/login/ethereum/x2', true);
          xhr.onreadystatechange = function() {
            console.log(this.readyState);
            console.log(this.status);
            console.log(this.responseText)
            
            //if (this.readyState === XMLHttpRequest.DONE) {
            //  window.location = '/';
            //}
          };
          
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.send(JSON.stringify({ account: accounts[0], signature: sign }));
        })
        .catch(function(error) {
          console.log('ERROR');
          console.log(error);
        })
        */
        
        
      })
      .catch(function(error) {
        console.log('ERROR');
        console.log(error);
      })
    
    /*
    ethereum.request({ method: 'eth_chainId' })
      .then(function(chainId) {
        console.log(chainId);
      })
      .catch(function(error) {
        console.log('ERROR');
        console.log(error);
      })
    */
    
  });
  
});
