import { uploadS3 } from './uploadS3'
import config from '../../config'
import fs from 'fs'
import { v4 } from 'uuid'

export const exportAndClearLogs = async() =>{
  try {
    const date = new Date()
    const key = `a_${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}_coreApi_${v4().split('-')[0]}`
    await uploadS3(key, `${config.logPath}/combined.log`)

    // clear logs
    fs.truncate(`${config.logPath}/combined.log`, 0, function(){console.log('cleared')})
    fs.truncate(`${config.logPath}/logsWarnings.log`, 0, function(){console.log('cleared')})
    fs.truncate(`${config.logPath}/logsErrors.log`, 0, function(){console.log('cleared')})
    fs.truncate(`${config.logPath}/logsInfo.log`, 0, function(){console.log('cleared')})
  } catch(error){
    console.log(error)
  }
}
