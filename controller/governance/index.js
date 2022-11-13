const { createProposal, listProposals } = require('./helper/proposalHelper');

exports.create_proposal = async (req, res, next) => {
  try {
    const { proposal, publicKey } = req.body;
    const _ = createProposal(publicKey, proposal);
    res.status(200).json('Proposal Added');
  } catch (error) {
    next(error);
  }
};

exports.list_proposals = async (req, res, next) => {
  try {
    const proposals = await listProposals();
    res.status(200).json(proposals);
  } catch (error) {
    next(error);
  }
};
