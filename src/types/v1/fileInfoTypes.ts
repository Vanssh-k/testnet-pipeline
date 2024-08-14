import { DealInfoResponse } from './dealTypes.js'

export interface FileList {
  aggregatedIn: string[]
  carSize: number
  cidV1: string
  cid: string
  pieceCid: string
  fileSize: number
  pieceSize: number
  lastUpdate: number
}

export interface FileInfoResponse {
  cid: string
  cidV1: string
  pieceCid: string
  fileSize: number
  carSize: number
}

export interface FileDetailsResponse {
  cid: string
  cidV1: string
  pieceCid: string
  fileSize: number
  carSize: number
  deals: DealInfoResponse[]
}
