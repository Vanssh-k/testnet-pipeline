const axios = require('axios');

exports.user_token = async (req, res) => {
  try{
    
    const headers = {
      'Authorization': `Bearer ${process.env.ESTUARY_KEY}`,
      'Accept': 'application/json',
    };

    const response = await axios.post('https://api.estuary.tech/user/api-keys?perms=upload&expiry=24h', {}, {headers: headers});
    res.status(200).json(response.data);

  } catch(e){
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
}
