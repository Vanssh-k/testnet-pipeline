
exports.upload_client = async (req, res) => {
  try {
    const projectId = process.env.INFURA_PROJECT_ID
    const projectSecret = process.env.INFURA_PROJECT_SECRET
    const auth =
      'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')
    
    res.status(200).json(auth);
  } catch (e) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};