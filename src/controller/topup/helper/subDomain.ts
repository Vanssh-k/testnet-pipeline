import { v4 } from 'uuid'
import {
    checkSubdomain,
    getRecord,
    updateSubDomain,
} from '../../../repository/topup/subdomain'
import { usersActivePlan } from './plansHelper'
import { addDNSRecord } from './cloudFlareHelper'

import ForbiddenError from '../../../errors/forbidden'
import NotFoundError from '../../../errors/not-found-error'

const subDomainExists = async (subDomain: string) => {
    const restrictedNames = [
        'api',
        'gateway',
        'testnet',
        'mainnet',
        'node',
        'docs',
        'encryption',
    ]
    if (restrictedNames.includes(subDomain) || /[^A-Za-z0-9]/.test(subDomain)) {
        return 'exist'
    }

    const exists = await checkSubdomain(subDomain)
    if (!exists) {
        return 'not-exist'
    }

    return 'exist'
}

const getUserSubDomainDomain = async (publicKey: string) => {
    const record = await getRecord(publicKey)
    if (!record) {
        throw new NotFoundError()
    }

    return record
}

const createSubDomain = async (publicKey: string, subDomain: string) => {
    try {
        // Does the sub domain exist
        const exists = await subDomainExists(subDomain)
        if (exists === 'exist') {
            throw new ForbiddenError()
        }

        // has user subscribed to plan
        const data = await usersActivePlan(publicKey)

        if (data.status !== 200) {
            throw new ForbiddenError()
        }

        // Get plan details
        const allowedSubDomainCount = parseInt(
            `${data?.data?.planDetails?.dedicatedGateway ?? 0}`,
            10
        )

        // Does user already have a sub domain
        const userDomainRecord = await getRecord(publicKey)
        if (userDomainRecord.length >= allowedSubDomainCount) {
            throw new ForbiddenError('User already own gateway')
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
        console.log(error)
        return { status: 403, data: 'Forbidden' }
    }
}

export { subDomainExists, createSubDomain, getUserSubDomainDomain }
