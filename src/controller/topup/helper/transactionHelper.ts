import { v4 } from 'uuid'
import { activatePlan } from './plansHelper'
import {
  getUserTransactions,
  recordTransactions,
} from '../../../repository/topup/userTransactions'

const recordUserTransaction = async (bodyData: any, userRecord: any) => {
  const record = {
    id: v4().toString(),
    txHash: bodyData.txHash,
    publicKey: userRecord.publicKey,
    tokenAddress: bodyData.tokenAddress,
    subscriptionID: bodyData.subscriptionID.toString(),
    network: bodyData.chain,
    createdAt: Date.now(),
  }
  const saveRecord = await recordTransactions(record)
  const activate = await activatePlan(userRecord, record.subscriptionID)
  return { status: 200, data: 'Success!!!' }
}

const getUserTransactionDetails = async (publicKey: string) => {
  const record = await getUserTransactions(publicKey)
  return record
}

export { recordUserTransaction, getUserTransactionDetails }
