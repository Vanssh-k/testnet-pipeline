import config from '../config'
import { createLogger, format, transports } from 'winston'
import LokiTransport from 'winston-loki'

export default function logger(logLevel: string, service: string) {
  const logger = createLogger({
    level: logLevel,
    defaultMeta: {
      service: service,
    },
    exitOnError: false,
    format: format.combine(
      format.json(),
      format.timestamp(),
      format.metadata(),
      format.prettyPrint(),
      format.errors()
    ),
    transports: [
      config.isDev
        ? new transports.File({
            filename: `${config.logPath}/combined.log`,
          })
        : new LokiTransport({
            host: config.loki_host,
            labels: { service: config.serviceName, env: config.env },
          }),
    ],
  })
  return logger
}
