import { ethers } from 'ethers'
import EndowmentABI from '../../../contract_abi/endowment.js'
import config from '../../../config/index.js'
import { getExchangeRate, get24hVolume, getDepositerCount } from './utils.js'

const contractAddress = config.lighthouse_endowment_address
const provider = new ethers.JsonRpcProvider(config.filecoin_rpc)

const contract = new ethers.Contract(contractAddress, EndowmentABI, provider)

const getPoolMetrics = async () => {
  try {
    const filBalRaw = await contract.getContractBalance(ethers.ZeroAddress)
    const filBal = parseFloat(ethers.formatEther(filBalRaw))
    const usdcBalRaw = await contract.getContractBalance(config.filecoin_usdc)
    const usdcBal = parseFloat(ethers.formatEther(usdcBalRaw))
    const iFilBalRaw = await contract.getVaultBalance(config.lighthouse_glifYield_address)
    const iFilBal = parseFloat(ethers.formatEther(iFilBalRaw))

    const rate = await getExchangeRate()

    const filUSD = filBal * rate
    const iFilUSD = iFilBal * rate

    const tvlRaw = usdcBal + filUSD + iFilUSD
    const tvl = tvlRaw.toFixed(2)

    const volumeRaw = await get24hVolume()
    const volume = volumeRaw.toFixed(2)

    const depositors = await getDepositerCount()

    const feePercentage = await contract.endowmentFee()
    let fee: number = volumeRaw * (Number(feePercentage) / 100000)
    fee = parseFloat(fee.toFixed(2))

    const stakedAmount = iFilUSD.toFixed(2)
    let liquidAmount: number = filUSD + usdcBal
    liquidAmount = parseFloat(liquidAmount.toFixed(2))

    const filShare = ((filUSD + iFilUSD) * 100) / tvlRaw
    const usdcShare = (usdcBal * 100) / tvlRaw

    const composition = {
      FIL: [iFilBal.toFixed(2), filBal.toFixed(2), filShare.toFixed(2)],
      USDC: ['0.00', usdcBal.toFixed(2), usdcShare.toFixed(2)],
    }

    return {
      tvl,
      volume,
      fee,
      stakedAmount,
      liquidAmount,
      depositors,
      composition,
    }
  } catch (error: any) {
    console.error(error)
    throw new Error()
  }
}

export { getPoolMetrics }
