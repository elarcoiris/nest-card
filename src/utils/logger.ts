import { createLogger, format, transports } from 'winston';
import { omit } from 'lodash';

const isAWS = (env = process.env): boolean => 'AWS_LAMBDA_FUNCTION_NAME' in env;
// const isLocal = (env = process.env): boolean => !isAWS(env);

const isProduction = process.env.NODE_ENV === 'prd';
const logLevel = isProduction ? 'info' : process.env.LOG_LEVEL || 'debug';

const localFormat = format.printf(({ level, message, ...args }) => {
  const meta = omit(args, ['level', 'message']);
  return `[${level.toUpperCase()}] ${message} ${
    Object.keys(meta).length ? JSON.stringify(meta) : ''
  }`;
});

const appendAppDetails = format((info) =>
  Object.assign(info, {
    app: 'nest-card',
    applicationName: 'nest-card',
    version: process.env.BUILD_VERSION,
  }),
);

const defaultFormat = format.combine(
  appendAppDetails(),
  format.timestamp(),
  format.json(),
);

const logger = createLogger({
  level: logLevel,
  silent: process.env.NODE_ENV === 'test',
  transports: [
    new transports.Console({
      format: !isAWS() ? localFormat : defaultFormat,
    }),
  ],
});

export { logger };
