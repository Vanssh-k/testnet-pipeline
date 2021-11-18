const axios = require('axios');

// temporary key for client
// query example - 24h
exports.user_token = async (req, res) => {
  try{  
    const headers = {
      'Authorization': `Bearer ${process.env.ESTUARY_KEY}`,
      'Accept': 'application/json',
    };

    const response = await axios.post(`https://api.estuary.tech/user/api-keys?perms=upload&expiry=${req.query.expiry}`, {}, {headers: headers});
    res.status(200).json(response.data);

  } catch(e){
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
}

// get metadata around the storage per CID
exports.metadata_by_cid = async (req, res) => {
  try{
    const headers = {
      'Authorization': `Bearer ${process.env.ESTUARY_KEY}`,
      'Accept': 'application/json',
    };

    const response = await axios.get(`https://api.estuary.tech/content/by-cid/${req.query.cid}`, {headers: headers});
    res.status(200).json(response.data);

  } catch(e){
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
}

// list all of the data you have pinned to Estuary
exports.list_data = async (req, res) => {
  try{
    const headers = {
      'Authorization': `Bearer ${process.env.ESTUARY_KEY}`,
      'Accept': 'application/json',
    };

    const response = await axios.get(`https://api.estuary.tech/content/stats?offset=${req.query.offset}&limit=${req.query.limit}`, {headers: headers});
    res.status(200).json(response.data);

  } catch(e){
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
}

// get all of the content on Estuary that is also stored on Filecoin
exports.get_deals_filecoin = async (req, res) => {
  try{
    const headers = {
      'Authorization': `Bearer ${process.env.ESTUARY_KEY}`,
      'Accept': 'application/json',
    };

    const response = await axios.get('https://api.estuary.tech/content/deals', {headers: headers});
    res.status(200).json(response.data);

  } catch(e){
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
}

// get all of the deals being made for a specific Content ID stored
exports.get_deals = async (req, res) => {
  try{
    const headers = {
      'Authorization': `Bearer ${process.env.ESTUARY_KEY}`,
      'Accept': 'application/json',
    };

    const response = await axios.get(`https://api.estuary.tech/content/status/${req.query.content_id}`, {headers: headers});
    res.status(200).json(response.data);

  } catch(e){
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
}

