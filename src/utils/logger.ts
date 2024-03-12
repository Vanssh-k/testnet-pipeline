import config from '../config'
import { createLogger, format, transports } from 'winston'
import LokiTransport from 'winston-loki'

const httpTransportOptions = {
  host: config.data_dog_host,
  path: `/api/v2/logs?dd-api-key=${config.data_dog_key}&ddsource=nodejs&service=${config.service}`,
  ssl: true,
}

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
