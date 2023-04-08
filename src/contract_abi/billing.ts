export default [
	{
		"inputs": [
			{
				"internalType": "uint8",
				"name": "subscriptionId",
				"type": "uint8"
			},
			{
				"internalType": "uint32",
				"name": "increase",
				"type": "uint32"
			}
		],
		"name": "Billing__DEDUCTION_BLOCK_CANT_BE_ZERO",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			}
		],
		"name": "Billing__INVALID_ADDRESS",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "asset",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Billing__NOT_ENOUGH_BALANCE",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "uint64",
				"name": "subscriptionId",
				"type": "uint64"
			},
			{
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			}
		],
		"name": "Billing__OCCURANCE_STILL_LEFT",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			}
		],
		"name": "Billing__STABLECOIN_NOT_ACTIVE",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "uint64",
				"name": "subID",
				"type": "uint64"
			}
		],
		"name": "Billing__SUB_ALREADY_CANCELED",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "uint8",
				"name": "subscriptionId",
				"type": "uint8"
			},
			{
				"internalType": "uint32",
				"name": "increase",
				"type": "uint32"
			}
		],
		"name": "Billing__VALUE_CANT_BE_ZERO",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint64",
				"name": "planID",
				"type": "uint64"
			},
			{
				"indexed": false,
				"internalType": "uint32",
				"name": "totalNumOfDeduction",
				"type": "uint32"
			},
			{
				"indexed": false,
				"internalType": "uint32",
				"name": "nextDeductionInNumOfBlocks",
				"type": "uint32"
			},
			{
				"indexed": false,
				"internalType": "uint128",
				"name": "amount",
				"type": "uint128"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "isActive",
				"type": "bool"
			},
			{
				"indexed": false,
				"internalType": "bytes7",
				"name": "code",
				"type": "bytes7"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "details",
				"type": "string"
			}
		],
		"name": "AddPlanEvent",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "previousAdmin",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "newAdmin",
				"type": "address"
			}
		],
		"name": "AdminChanged",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "beacon",
				"type": "address"
			}
		],
		"name": "BeaconUpgraded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "subscriptionID",
				"type": "uint256"
			}
		],
		"name": "CancelSubscription",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint8",
				"name": "subscriptionID",
				"type": "uint8"
			},
			{
				"indexed": true,
				"internalType": "uint32",
				"name": "increase",
				"type": "uint32"
			}
		],
		"name": "IncreaseBlockNumber",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint8",
				"name": "version",
				"type": "uint8"
			}
		],
		"name": "Initialized",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "subscriptionID",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			}
		],
		"name": "PlanPurchased",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint64",
				"name": "planID",
				"type": "uint64"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "isActive",
				"type": "bool"
			},
			{
				"indexed": false,
				"internalType": "bytes7",
				"name": "code",
				"type": "bytes7"
			}
		],
		"name": "RemovePlanEvent",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint64",
				"name": "rate",
				"type": "uint64"
			},
			{
				"indexed": true,
				"internalType": "bool",
				"name": "isActive",
				"type": "bool"
			}
		],
		"name": "StableCoinStatus",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "active",
				"type": "bool"
			},
			{
				"indexed": true,
				"internalType": "uint64",
				"name": "subscriptionID",
				"type": "uint64"
			}
		],
		"name": "SubscriptionStatusEvent",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "updateBy",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newImplementation",
				"type": "address"
			}
		],
		"name": "UpdateContract",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "implementation",
				"type": "address"
			}
		],
		"name": "Upgraded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "WithdrawApproval",
		"type": "event"
	},
	{
		"inputs": [
			{
				"components": [
					{
						"internalType": "uint32",
						"name": "totalNumOfDeduction",
						"type": "uint32"
					},
					{
						"internalType": "uint32",
						"name": "nextDeductionInNumOfBlocks",
						"type": "uint32"
					},
					{
						"internalType": "uint128",
						"name": "amount",
						"type": "uint128"
					},
					{
						"internalType": "bool",
						"name": "isActive",
						"type": "bool"
					},
					{
						"internalType": "bytes7",
						"name": "code",
						"type": "bytes7"
					}
				],
				"internalType": "struct IBilling.Subscription",
				"name": "_sub",
				"type": "tuple"
			},
			{
				"internalType": "string",
				"name": "_details",
				"type": "string"
			}
		],
		"name": "addSubscriptionPlan",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_tokenAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "approveAmount",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getActivePlanList",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "index",
						"type": "uint256"
					},
					{
						"internalType": "uint32",
						"name": "totalNumOfDeduction",
						"type": "uint32"
					},
					{
						"internalType": "uint32",
						"name": "nextDeductionInNumOfBlocks",
						"type": "uint32"
					},
					{
						"internalType": "uint128",
						"name": "amount",
						"type": "uint128"
					},
					{
						"internalType": "bool",
						"name": "isActive",
						"type": "bool"
					},
					{
						"internalType": "string",
						"name": "detail",
						"type": "string"
					}
				],
				"internalType": "struct IBilling.ISubscription[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_tokenAddress",
				"type": "address"
			},
			{
				"internalType": "uint64",
				"name": "_subscriptionID",
				"type": "uint64"
			}
		],
		"name": "getPayableAmount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "installment",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalValue",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			}
		],
		"name": "getSubscriptionStatus",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			},
			{
				"internalType": "uint64",
				"name": "",
				"type": "uint64"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint8",
				"name": "_subscriptionId",
				"type": "uint8"
			},
			{
				"internalType": "uint32",
				"name": "_increase",
				"type": "uint32"
			}
		],
		"name": "increaseBlockNumber",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "initialize",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			}
		],
		"name": "isSubscriptionActive",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "proxiableUUID",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint8",
				"name": "_subscriptionId",
				"type": "uint8"
			},
			{
				"internalType": "address",
				"name": "_tokenAddress",
				"type": "address"
			}
		],
		"name": "purchasePlan",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint64",
				"name": "_subscriptionId",
				"type": "uint64"
			}
		],
		"name": "removePlan",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "stableCoinStatus",
		"outputs": [
			{
				"internalType": "uint64",
				"name": "rate",
				"type": "uint64"
			},
			{
				"internalType": "bool",
				"name": "isActive",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "subscriptionList",
		"outputs": [
			{
				"internalType": "uint32",
				"name": "totalNumOfDeduction",
				"type": "uint32"
			},
			{
				"internalType": "uint32",
				"name": "nextDeductionInNumOfBlocks",
				"type": "uint32"
			},
			{
				"internalType": "uint128",
				"name": "amount",
				"type": "uint128"
			},
			{
				"internalType": "bool",
				"name": "isActive",
				"type": "bool"
			},
			{
				"internalType": "bytes7",
				"name": "code",
				"type": "bytes7"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "unsubscribe",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_tokenAddress",
				"type": "address"
			},
			{
				"components": [
					{
						"internalType": "uint64",
						"name": "rate",
						"type": "uint64"
					},
					{
						"internalType": "bool",
						"name": "isActive",
						"type": "bool"
					}
				],
				"internalType": "struct IBilling.StableCoinState",
				"name": "_stableCoin",
				"type": "tuple"
			}
		],
		"name": "updateStableCoin",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newImplementation",
				"type": "address"
			}
		],
		"name": "upgradeTo",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newImplementation",
				"type": "address"
			},
			{
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			}
		],
		"name": "upgradeToAndCall",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	}
]
