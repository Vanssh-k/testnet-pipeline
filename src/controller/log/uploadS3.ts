import fs from 'fs'
import config from '../../config'
import { s3Connect } from './s3connect'

export const uploadS3 = async (keyName: string, filePath: string) => {
  try {
    const s3 = await s3Connect()
    if (!s3) {
      throw new Error()
    }

    const fileStream = fs.createReadStream(filePath)

    const uploadParams = {
      Bucket: config.log_storage_bucket,
      Key: keyName,
      Body: fileStream,
    }
    const data = await s3.upload(uploadParams).promise()
    console.log('File pushed to bucket:' + data.Location)
    return 'Success'
  } catch (error) {
    return null
  }
}
