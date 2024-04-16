import { ethers } from 'ethers'
import EndowmentABI from '../../../contract_abi/endowment.js'
import config from '../../../config/index.js'
import { getEndowmentTransactions } from '../../../db/instrumentation/endowmentTransactions.js'

const contractAddress = config.lighthouse_endowment_address
const provider = new ethers.JsonRpcProvider(config.filecoin_rpc)

const contract = new ethers.Contract(contractAddress, EndowmentABI, provider)

const getPoolBalance = async (tokenAddress: string): Promise<number> => {
  const bal = await contract.getContractBalance(tokenAddress)
  return Number(ethers.formatEther(bal))
}

const getAccumulatedBalance = async (): Promise<number> => {
  const bal = await contract.getVaultBalance(config.lighthouse_glifYield_address)
  return Number(ethers.formatEther(bal))
}

const getTransactions = async (): Promise<any> => {
  const record = await getEndowmentTransactions()
  return record
}

export { getPoolBalance, getAccumulatedBalance, getTransactions }
