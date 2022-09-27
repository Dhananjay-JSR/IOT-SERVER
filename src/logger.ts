import path from 'path';
import winston  from 'winston'

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(),winston.format.json()),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: path.join(process.cwd(),'log','error.log'), level: 'warn' }),
    new winston.transports.File({ filename: path.join(process.cwd(),'log','combined.log') }),
  ],
});