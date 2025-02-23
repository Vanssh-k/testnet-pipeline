import config from '../config/index.js'
import { service } from '../config/constants.js'
import LokiTransport from 'winston-loki'
import { createLogger, format, transports, Logger } from 'winston'

const selectTransports = (): transports.FileTransportInstance | LokiTransport => {
  // if (config.environment === 'production') {
  //   return new LokiTransport({
  //     host: config.logger_loki_host!,
  //     labels: { service: service, environment: config.environment },
  //     basicAuth: `${config.logger_loki_username}:${config.logger_loki_password}`,
  //   })
  // }
  return new transports.File({
    filename: config.devLogPath,
  })
}

const logger: Logger = createLogger({
  level: 'info',
  defaultMeta: {
    service: service,
  },
  exitOnError: false,
  format: format.combine(format.json(), format.timestamp(), format.metadata(), format.prettyPrint(), format.errors()),
  transports: selectTransports(),
})

export default logger
