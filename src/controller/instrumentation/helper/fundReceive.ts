import { ethers } from 'ethers'
import FundReceiveABI from '../../../contract_abi/fundReceive'
import config from '../../../config'

const contractAddress = config.lighthouse_fundReceive_address
const provider = new ethers.JsonRpcProvider(config.filecoin_rpc)

const contract = new ethers.Contract(contractAddress, FundReceiveABI, provider)

const getNativeBalance = async (): Promise<number> => {
  const bal = await contract.getNativeBalance()
  return Number(bal)
}

const getTokenBalance = async (tokenAddress: string): Promise<number> => {
  const bal = await contract.getERC20Balance(tokenAddress)
  return Number(bal)
}

export { getNativeBalance, getTokenBalance }
