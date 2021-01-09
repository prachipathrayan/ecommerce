import bcrypt from 'bcrypt';
import { nest } from './index';
import logger from '../shared/logger';

export const passwordHash = async (password: string): Promise<string> => {
    const saltRounds = 12;
    const [err, passwordHash] = await nest(bcrypt.hash(password, saltRounds));
    if (err) {
        logger.error('Error while generating password hash', { error: err });
        throw Error('Error while generating password hash');
    }
    return passwordHash;
};

export const comparePassword = async (
    inputPassword: string,
    userPassword: string
): Promise<boolean | Error> => {
    const [err, response] = await nest(
        bcrypt.compare(userPassword, inputPassword)
    );
    if (err && !response) {
        logger.error('Error while comparing password', { error: err });
        throw Error('Error while comparing password');
    }
    return response;
};