'use strict';
// #### NOTE :- commented fields are optional to add.

// eslint-disable-next-line @typescript-eslint/no-var-requires
const projectLogger = require('logfly');
const config = {
    // eventLogger: {
    // filenamePrefix: "events"
    // },
    accessLogger: {
        // filenamePrefix: "access",\
        logResponseBody: false,
        logRequestBody: false,
        // requestWhitelist: ["url", "headers", "method", "httpVersion", "originalUrl", "query", "params"],
        // responseWhitelist: ["_header", "statusCode", "statusMessage"]
    },
    logger: {
        filenamePrefix: 'dev',
    },
    logDir: process.env.logDir || '.',
    blackList: [
        'x-access-token',
        'u-access-token',
        'otp',
        'password',
        'aadhar',
        'pan',
        'phone',
    ],
};

export default projectLogger.init(config);