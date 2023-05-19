import config from '../config'
import { createLogger, format, transports } from "winston";

export default createLogger({
    transports: [
      // new transports.Console(),
      new transports.File({
          level: 'warn',
          filename: config.logPath + '/logsWarnings.log'
      }),
      new transports.File({
          level: 'error',
          filename: config.logPath + '/logsErrors.log'
      }),
      new transports.File({
        level: 'info',
        filename: config.logPath + '/logsInfo.log'
      }),
      new transports.File({
        filename: config.logPath + '/combined.log'
      }),
    ],
    format:  format.combine(
      format.json(),
      format.timestamp(),
      format.metadata(),
      format.prettyPrint()
    )
})
