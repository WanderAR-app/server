import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const getDate = () => {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

const { format } = winston;

var transport: DailyRotateFile = new DailyRotateFile({
    filename: 'logs/%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    // zippedArchive: true,
    // maxSize: '20m',
    maxFiles: '14d',
    level: 'http',
});

const logger = winston.createLogger({
    format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf((info) => {
            return `${info.timestamp} ${info.level}: ${info.message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        transport,
        // new winston.transports.File({ filename: `logs/${getDate()}.log`, level: 'http' }),
    ]
});

export default logger;