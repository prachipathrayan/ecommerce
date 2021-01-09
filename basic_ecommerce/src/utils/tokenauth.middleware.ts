import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import {
    IUserModel,
    UserModelManager,
} from '../lib/schema/models/user/userModel';
import jwtObject from '../config/jwt.config';
import logger from './logger';
import { nest } from './index';

export const checkToken = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        let token: string = <string>req.headers['authorization'];
        if (token && token.length > 7) {
            token = token.split('Bearer ')[1];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-call
            const jwtPayload = <any>jwt.verify(token, jwtObject.secret);
            // eslint-disable-next-line camelcase
            const { user_id } = jwtPayload;
            res.setHeader('user_id', user_id);
            const userModel = UserModelManager.getInstance().getModel();
            let err: Error;
            let userDetails: IUserModel;
            // eslint-disable-next-line prefer-const
            [err, userDetails] = await nest(userModel.findByPk(user_id));
            if (err || !userDetails) {
                throw Error('User not found');
            }
            next();
        } else {
            throw Error('Please provide valid token');
        }
    } catch (e) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        logger.error('Error verifying token', { error: e });
        res.json({
            error: `Error verifying token ${e}`,
            data: [],
        });
    }
};

