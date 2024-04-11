export interface IndexPath {
  index: string
  path: string[]
}

export interface InclusionProof {
  proofIndex: IndexPath
  proofSubtree: IndexPath
}

export interface IndexRecord {
  commDs: string
  offset: number
  size: number
  checksum: string
}

export interface VerifierData {
  commPc: string
  sizePc: string
}

export interface FileProof {
  inclusionProof: InclusionProof
  indexRecord: IndexRecord
  verifierData: VerifierData
}

export interface PODSIRecord {
  cid: string
  aggregateIDs: string[]
  pieceCID: string
  fileProofs: FileProof[]
  lastUpdate: number
}

export interface DealArrayProofItem {
  dealId: number
  storageProvider: string
  proof: FileProof
}

export interface ProofServiceResponse {
  pieceCID: string
  dealInfo: DealArrayProofItem[]
}
