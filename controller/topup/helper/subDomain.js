const {
    checkSubdomain,
    getRecord,
    updateSubDomain,
} = require('../../../repository/topup/subdomain')
const { usersActivePlan } = require('./plansHelper')

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

const createSubDomain = async (publicKey, subDomain) => {
    // Does the dub domain exist
    const exists = await subDomainExists(subDomain)
    if (exists === 'exist') {
        throw new ForbiddenError()
    }

    // has user subscribed to plan
    const data = await usersActivePlan(publicKey)

    if (data.status !== 200) {
        throw new ForbiddenError()
    }

    const timestamp = Date.now()

    const _ = await updateSubDomain({
        publicKey,
        subDomainName: req.body.subDomain,
        subscriptionID: data.data.subscriptionId.toString(),
        updatedAt: timestamp,
    })

    return { status: 200, data: 'Success' }
}

const getUserSubDomainDomain = async (publicKey) => {
    const record = await getRecord(publicKey)
    if (!record) {
        throw new NotFoundError()
    }

    return record.subDomainName
}

module.exports = { subDomainExists, createSubDomain, getUserSubDomainDomain }
