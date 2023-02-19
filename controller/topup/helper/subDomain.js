const { v4: uuidv4 } = require('uuid')
const {
    checkSubdomain,
    getRecord,
    updateSubDomain,
} = require('../../../repository/topup/subdomain')
const { usersActivePlan } = require('./plansHelper')
const { addDNSRecord } = require('./cloudFlareHelper')

const ForbiddenError = require('../../../errors/forbidden')
const NotFoundError = require('../../../errors/not-found-error')

const subDomainExists = async (subDomain) => {
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

const getUserSubDomainDomain = async (publicKey) => {
    const record = await getRecord(publicKey)
    if (!record) {
        throw new NotFoundError()
    }

    return record
}

const createSubDomain = async (publicKey, subDomain) => {
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
            data.data.planDetails.dedicatedGateway
        )

        // Does user already have a sub domain
        const userDomainRecord = await getRecord(publicKey)
        if (userDomainRecord.length >= allowedSubDomainCount) {
            throw new ForbiddenError('User already own gateway')
        }

        const _ = await updateSubDomain({
            id: uuidv4().toString(),
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

module.exports = { subDomainExists, createSubDomain, getUserSubDomainDomain }
