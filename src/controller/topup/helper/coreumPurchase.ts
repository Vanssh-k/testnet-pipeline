import axios from 'axios'
import { Request } from 'express'
import { v4 } from 'uuid'
import updateUserDataLimit from 'src/db/user/updateUserDataLimit.js'
import { getUserTransactionDetails } from './transactionHelper.js'
import { recordTransactions } from 'src/db/topup/userTransactions.js'
import config from '../../../config/index.js'

const checkTxnExists = async (address: string, transactionHash: string) => {
  const userTxns = await getUserTransactionDetails(address)
  const userTxn = userTxns.find((item) => item.txHash === transactionHash)
  if (userTxn) {
    return true
  }
  return false
}

const validatePayment = async (req: Request) => {
  const response = await axios.get(`${config.coreum_api_url}/${req.body.transactionHash}`)
  const amountFromTx = (response.data.tx.body.messages[0].amount[0].amount / 1000000).toFixed(2)
  const fromAddress = response.data.tx.body.messages[0].from_address
  const toAddress = response.data.tx.body.messages[0].to_address
  const txnExist = await checkTxnExists(req.body.address, req.body.transactionHash)
  if (
    amountFromTx == req.body.amount &&
    fromAddress == req.body.address &&
    toAddress == process.env.LIGHTHOUSE_COREUM_ADDRESS &&
    !txnExist
  ) {
    await recordTransactions({
      id: v4().toString(),
      txHash: req.body.transactionHash,
      publicKey: fromAddress,
      tokenAddress: 'Coreum Payment',
      subscriptionID: req.body.subscriptionId,
      amount: req.body.amount,
      network: 'coreum',
      createdAt: Date.now(),
    })
    return true
  }
  return false
}

export const checkCoreumTxnUpdateCap = async (req: Request) => {
  const value = await validatePayment(req)
  if (value) {
    // await updateUserDataLimit(req.body.address, req.body.dataCapPurchased)
    console.log('updating package')
  }
}
