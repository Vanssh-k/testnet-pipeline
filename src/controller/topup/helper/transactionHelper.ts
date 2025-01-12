import { v4 } from 'uuid'
import { activatePlan } from './plansHelper.js'
import { getUserTransactions, recordTransactions } from '../../../db/topup/userTransactions.js'
import { UserTransaction } from '../../../types/transaction.js'

interface BodyData {
  txHash: string
  tokenAddress: string
  subscriptionID: number
  chain: string
}

interface UserRecord {
  publicKey: string
}

const recordUserTransaction = async (
  bodyData: BodyData,
  userRecord: UserRecord,
): Promise<{ status: number; data: string }> => {
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
  const activate = await activatePlan(userRecord, Number(record.subscriptionID))
  return { status: 200, data: 'Success!!!' }
}

const getUserTransactionDetails = async (publicKey: string): Promise<UserTransaction[]> => {
  const record = await getUserTransactions(publicKey)
  return record
}

export { recordUserTransaction, getUserTransactionDetails }
