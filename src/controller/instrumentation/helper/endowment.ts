import { ethers } from 'ethers'
import EndowmentABI from '../../../contract_abi/endowment'
import config from '../../../config'
import { getEndowmentTransactions } from '../../../repository/instrumentation/endowmentTransactions'
import { DatabaseError } from '../../../errors'

const contractAddress = config.lighthouse_endowment_address
const provider = new ethers.JsonRpcProvider(config.filecoin_rpc)

const contract = new ethers.Contract(contractAddress, EndowmentABI, provider)

const getPoolBalance = async (tokenAddress: string): Promise<number> => {
  const bal = await contract.getContractBalance(tokenAddress)
  return Number(bal)
}

const getAccumulatedBalance = async (): Promise<number> => {
  const bal = await contract.getVaultBalance(
    config.lighthouse_glifYield_address
  )
  return Number(bal)
}

const getTransactions = async (): Promise<any> => {
  const record = await getEndowmentTransactions()
  if (!record) {
    throw new DatabaseError()
  }
  return record
}

export { getPoolBalance, getAccumulatedBalance, getTransactions }
