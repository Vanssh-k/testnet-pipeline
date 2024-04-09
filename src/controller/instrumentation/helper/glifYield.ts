import { ethers } from 'ethers'
import GlifABI from '../../../contract_abi/glifYield.js'
import config from '../../../config/index.js'

const contractAddress = config.lighthouse_glifYield_address
const provider = new ethers.JsonRpcProvider(config.filecoin_rpc)

const contract = new ethers.Contract(contractAddress, GlifABI, provider)

const getNetDeposit = async (): Promise<number> => {
  const bal = await contract.netDeposit()
  return Number(ethers.formatEther(bal))
}

const getNetWithdrawl = async (): Promise<number> => {
  const bal = await contract.netWithdrawl()
  return Number(ethers.formatEther(bal))
}

const getiFILBalance = async (): Promise<number> => {
  const bal = await contract.getiFILBalance()
  return Number(ethers.formatEther(bal))
}

export { getNetDeposit, getNetWithdrawl, getiFILBalance }
