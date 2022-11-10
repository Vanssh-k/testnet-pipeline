const { v4: uuidv4 } = require("uuid");
const { addProposal, allProposals } = require("../../../repository/governance/proposals");

exports.createProposal = async (publicKey, proposal) => {
  try {
    const timestamp = Date.now();
    const _ = await addProposal({
      id: uuidv4().toString(),
      publicKey: publicKey,
      proposal: proposal,
      createdAt: timestamp,
      updatedAt: timestamp
    });
    return("Success");
  } catch (error) {
    next(error);
  }
};

exports.listProposals = async () => {
  try {
    return(await allProposals());
  } catch (error) {
    next(error);
  }
};
