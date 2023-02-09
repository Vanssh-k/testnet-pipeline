const {
    getActivePlanList,
    usersActivePlan,
    activatePlan,
    getPlanDetails
} = require('./helper/plansHelper')
const {
    createSubDomain,
    subDomainExists,
    getUserSubDomainDomain,
} = require('./helper/subDomain')
const {
    recordUserTransaction,
    getUserTransactionDetails,
} = require('./helper/transactionHelper')

exports.record_transaction = async (req, res, next) => {
    try {
        const data = await recordUserTransaction(req.body, req.user)
        res.status(data.status).json({ data: data.data })
    } catch (error) {
        next(error)
    }
}

exports.create_subdomain = async (req, res, next) => {
    try {
        const data = await createSubDomain(
            req.body.publicKey,
            req.body.subDomain
        )
        res.status(data.status).json({ data: data.data })
    } catch (error) {
        next(error)
    }
}

exports.check_subdomain = async (req, res, next) => {
    try {
        const exists = await subDomainExists(req.query.subDomain)
        res.status(200).json(exists)
    } catch (error) {
        next(error)
    }
}

exports.get_subdomain = async (req, res, next) => {
    try {
        const records = await getUserSubDomainDomain(req.query.publicKey)
        res.status(200).json(records)
    } catch (error) {
        next(error)
    }
}

exports.get_user_transactions = async (req, res, next) => {
    try {
        const record = await getUserTransactionDetails(req.query.publicKey)
        res.status(200).json(record)
    } catch (error) {
        next(error)
    }
}

exports.get_active_plan_list = async (req, res, next) => {
    try {
        const planList = await getActivePlanList()
        res.status(200).send(planList)
    } catch (error) {
        console.log(error)
        next(error)
    }
}

exports.users_active_plan = async (req, res, next) => {
    try {
        const data = await usersActivePlan(req.query.publicKey)
        res.status(data.status).json({ data: data.data })
    } catch (error) {
        next(error)
    }
}

exports.plan_details_by_id = async (req, res, next) => {
    try {
        const data = await getPlanDetails(req.query.subscriptionId)
        res.status(data.status).json({ data: data.data })
    } catch (error) {
        next(error)
    }
}

// exports.activate_plan = async (req, res, next) => {
//     try {
//         const record = await userDetails(req.query.publicKey, "evm")
//         const data = await activatePlan(record)
//         res.status(data.status).json({ data: data.data })
//     } catch (error) {
//         next(error)
//     }
// }
