export const daoFactoryABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_tokenContractAddress",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "_allowIndependentAIA",
        "type": "bool"
      },
      {
        "internalType": "bytes32",
        "name": "_otherContentHash",
        "type": "bytes32"
      }
    ],
    "name": "createDAO",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "daoAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "DAOCreated",
    "type": "event"
  }
]

export const daoFactoryAddress = "0x770f1499426Ec8331a01a181b17bcf1911A7e429" as const
