import axios from 'axios'
import { Request } from 'express'
import { v4 } from 'uuid'
import updateUserDataLimit from '../../../db/user/updateUserDataLimit.js'
import { getUserTransactionDetails } from './transactionHelper.js'
import { recordTransactions } from '../../../db/topup/userTransactions.js'
import config from '../../../config/index.js'
import { paymentPlans } from '../../../config/paymentPlans.js'
import CustomError from '../../../middlewares/error/customError.js'

const checkTxnExists = async (pubKey: string, transactionHash: string): Promise<boolean> => {
  const userTxns = await getUserTransactionDetails(pubKey)
  const userTxn = userTxns.find((item: any) => item.txHash === transactionHash)
  if (userTxn) {
    return true
  }
  return false
}

const validatePayment = async (req: Request): Promise<number> => {
  const response = await axios.get(`${config.coreum_api_url}/${req.body.transactionHash}`)
  const amountFromTx = (response.data.tx.body.messages[0].amount[0].amount / 1000000).toFixed(1)
  const fromAddress = response.data.tx.body.messages[0].from_address
  const toAddress = response.data.tx.body.messages[0].to_address
  const pubKey = req.body.publicKey
  const txnExist = await checkTxnExists(pubKey, req.body.transactionHash)
  const requestAmount = parseFloat(req.body.amount).toFixed(2)
  const txAmount = parseFloat(amountFromTx).toFixed(2)
  if (
    txAmount == requestAmount &&
    fromAddress == req.body.address &&
    toAddress == config.lighthouse_coreum_address &&
    !txnExist
  ) {
    const data = {
      id: v4().toString(),
      txHash: req.body.transactionHash,
      publicKey: pubKey,
      tokenAddress: 'Coreum Payment',
      subscriptionID: req.body.subscriptionId,
      amount: requestAmount,
      network: 'coreum',
      createdAt: Date.now(),
    }
    const paymentPlan = paymentPlans.find((plan) => plan.index === Number(req.body.subscriptionId))
    const dataCapPurchased = (paymentPlan ? paymentPlan.storageInGB : 0) * 1073741824
    return dataCapPurchased
  }
  return 0
}

export const checkCoreumTxnUpdateCap = async (req: Request): Promise<void> => {
  const value = await validatePayment(req)
  if (value) {
    await updateUserDataLimit(req.body.publicKey, value)
  } else {
    throw new CustomError(401, 'Failed.')
  }
}
