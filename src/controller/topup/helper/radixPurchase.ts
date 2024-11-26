import axios from 'axios'
import { Request } from 'express'
import { v4 } from 'uuid'
import updateUserDataLimit from '../../../db/user/updateUserDataLimit.js'
import { getUserTransactionDetails } from './transactionHelper.js'
import { recordTransactions } from '../../../db/topup/userTransactions.js'
import config from '../../../config/index.js'
import { paymentPlans } from '../../../config/paymentPlans.js'
import CustomError from '../../../middlewares/error/customError.js'

const checkTxnExists = async (pubKey: string, transactionHash: string) => {
  const userTxns = await getUserTransactionDetails(pubKey)
  const userTxn = userTxns.find((item) => item.txHash === transactionHash)
  if (userTxn) {
    return true
  }
  return false
}

const validatePayment = async (req: Request) => {
  const response = await axios.post(config.radix_api_url, {
    intent_hash: req.body.transactionHash,
    opt_ins: { balance_changes: true },
  })
  const amountFromTx = response.data.transaction.balance_changes.fungible_balance_changes[1].balance_change
  const fromAddress = response.data.transaction.balance_changes.fungible_balance_changes[0].entity_address
  const toAddress = response.data.transaction.balance_changes.fungible_balance_changes[1].entity_address
  const resourceAddress = response.data.transaction.balance_changes.fungible_balance_changes[1].resource_address
  const pubKey = req.body.publicKey
  const txnExist = await checkTxnExists(pubKey, req.body.transactionHash)
  const requestAmount = req.body.amount
  const txAmount = amountFromTx
  if (
    txAmount == requestAmount &&
    fromAddress == pubKey &&
    toAddress == config.lighthouse_radix_address &&
    !txnExist &&
    resourceAddress == 'resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd'
  ) {
    const data = {
      id: v4().toString(),
      txHash: req.body.transactionHash,
      publicKey: pubKey,
      tokenAddress: 'coreum Payment',
      subscriptionID: req.body.subscriptionId,
      amount: requestAmount,
      network: 'radix',
      createdAt: Date.now(),
    }
    // await recordTransactions(data)
    const paymentPlan = paymentPlans.find((plan) => plan.index === Number(req.body.subscriptionId))
    const dataCapPurchased = (paymentPlan ? paymentPlan.storageInGB : 0) * 1073741824
    return dataCapPurchased
  }
  return 0
}
export const checkRadixTxnUpdateCap = async (req: Request) => {
  const value = await validatePayment(req)
  if (value) {
    await updateUserDataLimit(req.body.publicKey, value)
  } else {
    throw new CustomError(401, 'Failed.')
  }
}
