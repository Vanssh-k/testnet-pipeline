const { v4: uuidv4 } = require("uuid");
const { addProposal, allProposals } = require("../../repository/proposals");

exports.add_proposal = async (req, res, next) => {
  try {
    const {proposal, publicKey} = req.body;
    const timestamp = Date.now();
    const _ = await addProposal({
      id: uuidv4().toString(),
      publicKey: publicKey,
      proposal: proposal,
      createdAt: timestamp,
      updatedAt: timestamp
    });

    res.status(200).json("Proposal Added");
  } catch (error) {
    next(error);
  }
};

exports.all_proposals = async (req, res, next) => {
  try {
    const records = await allProposals();
    res.status(200).json(records);
  } catch (error) {
    next(error);
  }
};
