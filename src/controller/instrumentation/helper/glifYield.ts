import { ethers } from 'ethers'
import GlifABI from '../../../contract_abi/glifYield'
import config from '../../../config'

const contractAddress = config.lighthouse_glifYield_address
const provider = new ethers.JsonRpcProvider(config.filecoin_rpc)

const contract = new ethers.Contract(contractAddress, GlifABI, provider)

const getNetDeposit = async (): Promise<number> => {
  const bal = await contract.netDeposit()
  return Number(bal)
}

const getNetWithdrawl = async (): Promise<number> => {
  const bal = await contract.netWithdrawl()
  return Number(bal)
}

const getiFILBalance = async (): Promise<number> => {
  const bal = await contract.getiFILBalance()
  return Number(bal)
}

export { getNetDeposit, getNetWithdrawl, getiFILBalance }
