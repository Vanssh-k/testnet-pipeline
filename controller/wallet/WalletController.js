const axios = require('axios');
const EthCrypto = require('eth-crypto');
const CryptoJS = require('crypto-js');

// generate public private key pair here
exports.create_wallet = async(req, res) => {
  const identity = EthCrypto.createIdentity();
  identity['privateKeyEncrypted'] = CryptoJS.AES.encrypt(identity['privateKey'], req.body.password).toString();
  const publicKey = EthCrypto.publicKeyByPrivateKey(
    identity['privateKey']
  );
  const address = EthCrypto.publicKey.toAddress(
    publicKey
  );
  identity['publicKey'] = address
  delete identity['address']
  res.status(200).json(identity);
}

// get balance of matic tokens
exports.get_balance = async(req, res) => {
  try{
    const response = await axios.get(`https://api.covalenthq.com/v1/137/address/${req.body.publicKey}/balances_v2/?key=${process.env.COVALENT_API_KEY}`)
    let balance = 0;
    for(let i=0; i<response.data.data.items.length; i++){
      if(response.data.data.items[i].contract_ticker_symbol === 'MATIC'){
        balance = response.data.data.items[i].balance;
        break;
      }
    }
    res.status(200).json({data: balance});
  } catch(err){
    res.status(500);
  }
}
