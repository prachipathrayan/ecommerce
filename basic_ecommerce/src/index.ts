import './pre-start'; // Must be the first import
import app from '@server';
import logger from './utils/logger';
import {MysqlManager} from "./lib/database/mysql";
import {IDatabase} from "./lib/database/types";
import {nest} from "./utils";


// Start the server
const init = async () => {
    let err: Error;
    const databaseManager: IDatabase = MysqlManager.getInstance();
    let isConnected: boolean;
    [err, isConnected] = await nest(databaseManager.connect());
    if (isConnected) {
        logger.info('Database connected successfully');

    }
    if (err) {
        logger.error('Error in connecting to mysql', { error: err });
        throw new Error('Error in connecting to mysql');
    }
    const port = Number(process.env.PORT || 3000);
    app.listen(port, () => {
        logger.info('Express server started on port: ' + port);
    });
};

init()
    .then(() => {
        logger.info('Server started');
    })
    .catch((e) => {
        logger.error('Server crashed', { error: e });
    });