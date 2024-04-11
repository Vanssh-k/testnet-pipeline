import { getInclusionProof } from '../../databaseDataAccess/getInclusionProof.js'
import { getRaasInfo } from '../../databaseDataAccess/getRaasInfo.js'
import { ProofServiceResponse, DealArrayProofItem } from '../../types/dbTypes/inclusionProofTypes.js'

export const getProofService = async (cid: string, network: string): Promise<ProofServiceResponse | null> => {
  const inclusionProof = await getInclusionProof(cid, network)
  const raasInfo = await getRaasInfo(cid, network)

  if (!inclusionProof || !raasInfo || !raasInfo?.dealIDs) {
    return null
  }

  let prefix: string = ''
  if (network === 'testnet') {
    prefix = 't0'
  } else {
    prefix = 'f0'
  }

  const deals = raasInfo?.dealIDs
  const storageProvider = raasInfo?.miners

  const dealArray: DealArrayProofItem[] = deals?.map((deal, i) => ({
    dealId: deal, // Convert dealId to string
    storageProvider: prefix + storageProvider[i],
    proof: inclusionProof?.fileProofs[i],
  }))

  const response: ProofServiceResponse = {
    pieceCID: inclusionProof?.cid,
    dealInfo: dealArray,
  }

  return response
}
