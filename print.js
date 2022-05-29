const siwe = require('siwe');

// https://login.xyz
// https://docs.login.xyz/sign-in-with-ethereum/quickstart-guide/creating-siwe-messages
// https://github.com/spruceid/siwe-quickstart/tree/main/00_print

const domain = "localhost";
const origin = "https://localhost/login";

function createSiweMessage (address, statement) {
  const siweMessage = new siwe.SiweMessage({
    domain,
    address,
    statement,
    uri: origin,
    version: '1',
    chainId: '1'
  });
  return siweMessage.prepareMessage();
}

console.log(createSiweMessage(
    "0x6Ee9894c677EFa1c56392e5E7533DE76004C8D94",
    "This is a test statement."
  ));
