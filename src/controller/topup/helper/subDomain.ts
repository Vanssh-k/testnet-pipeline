import { v4 } from 'uuid'
import { checkSubdomain, getRecord, updateSubDomain } from '../../../db/topup/subdomain.js'
import { addDNSRecord } from './cloudFlareHelper.js'

import CustomError from '../../../middlewares/error/customError.js'
import { GatewayTableRecord } from '../../../types/subdomain.js'

const subDomainExists = async (subDomain: string): Promise<string> => {
  const restrictedNames = ['api', 'gateway', 'testnet', 'mainnet', 'node', 'docs', 'encryption']
  if (restrictedNames.includes(subDomain) || /[^A-Za-z0-9]/.test(subDomain)) {
    return 'exist'
  }

  const exists = await checkSubdomain(subDomain)
  if (!exists) {
    return 'not-exist'
  }

  return 'exist'
}

const getUserSubDomainDomain = async (publicKey: string): Promise<GatewayTableRecord[]> => {
  const record = await getRecord(publicKey)
  if (!record) {
    throw new CustomError(404, 'Record Not Found')
  }

  return record
}

const createSubDomain = async (publicKey: string, subDomain: string): Promise<{ status: number; data: string }> => {
  try {
    // Does the sub domain exist
    const exists = await subDomainExists(subDomain)
    if (exists === 'exist') {
      throw new CustomError(404, 'SubDomain Does Not Exist')
    }

    // has user subscribed to plan
    // Temporary fix till its plan is live
    const data = {
      data: { planDetails: { dedicatedGateway: 1 }, subscriptionId: 0 },
      status: 200,
    } //await usersActivePlan(publicKey)

    if (data.status !== 200) {
      throw new CustomError(403, 'Forbidden')
    }

    // Get plan details
    const allowedSubDomainCount = parseInt(`${data?.data?.planDetails?.dedicatedGateway ?? 0}`, 10)

    // Does user already have a sub domain
    const userDomainRecord = await getRecord(publicKey)
    if (userDomainRecord.length >= allowedSubDomainCount) {
      throw new CustomError(403, 'User already own gateway')
    }

    const _ = await updateSubDomain({
      id: v4().toString(),
      publicKey,
      subDomainName: subDomain,
      subscriptionID: data.data.subscriptionId.toString(),
      updatedAt: Date.now(),
    })

    const dNSRecord = await addDNSRecord(subDomain)
    return { status: 200, data: 'Success' }
  } catch (error) {
    return { status: 403, data: 'Forbidden' }
  }
}

export { subDomainExists, createSubDomain, getUserSubDomainDomain }
