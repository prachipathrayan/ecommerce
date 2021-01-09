import { nest } from '../../utils';
import { comparePassword, passwordHash } from '../../utils/bcrypt';
import { IUser, LoginRequest, SignUpRequest } from './types';
import logger from '../../utils/logger';
import {
    IUserModel,
    UserModelManager,
} from '../../lib/schema/models/user/userModel';
import jwt from 'jsonwebtoken';
import jwtObject from '../../config/jwt.config';
import { ModelCtor } from 'sequelize';


export class AuthService implements IUser {
    async logInAndGenerateToken(
        loginRequest: LoginRequest
    ): Promise<string | Error> {
        const User: ModelCtor<IUserModel> = UserModelManager.getInstance().getModel();
        let err: Error;
        let userDetails: IUserModel;
        let isValid: boolean | false;
        [err, userDetails] = await nest(
            User.findOne({ where: { email: loginRequest.email } })
        );
        if (err) {
            logger.error('Error finding user', { error: err });
            throw new Error('Error finding user');
        }
        [err, isValid] = await nest(
            comparePassword(userDetails.passwordHash, loginRequest.password)
        );
        if (err) {
            logger.error('Error comparing password', { error: err });
            throw new Error('Error comparing password');
        }
        if (!isValid) {
            logger.error('Invalid credentials');
            throw new Error('Invalid credentials');
        }
        let token: string;
        [err, token] = await nest(this.generateToken({ user_id: userDetails.id }));
        if(err){
            logger.error('Error while generating token',{error : err})
            throw new Error('Error while generating token');
        }
        return token;
    }

    async registerAndGenerateToken(
        signUpRequest: SignUpRequest
    ): Promise<string | Error> {
        const User = UserModelManager.getInstance().getModel();
        const userObject: IUserModel = User.build({
            username: signUpRequest.username,
            name: signUpRequest.name,
            email: signUpRequest.email,
            type: signUpRequest.type,
            passwordHash: await passwordHash(signUpRequest.password),
        });
        const [err, userData] = await nest(userObject.save());
        if (err) {
            logger.error('Error while registering', { error: err });
            throw new Error('Error while registering');
        }
        let token: string;
        let error: Error;
        [error, token]= await nest(this.generateToken({ user_id: userData.id }));
        if(error){
            logger.error('Error while generating token',{error : err})
            throw new Error('Error while generating token');
        }

        return token;
    }

    private getJwtSecret() : string{
        let key : string;
        if(!jwtObject.secret){
            logger.error('Error in getting your mySQL uri', {error : "Error in getting your mySQL uri"});
            throw new Error('Error in getting your mySQL uri');
        }
        else{
            key = jwtObject.secret;
        }
        return key;
    }
    // eslint-disable-next-line camelcase,@typescript-eslint/require-await
    async generateToken(payload: { user_id: number }): Promise<string | Error> {
        try {
            const token = jwt.sign(payload, this.getJwtSecret(), {
                expiresIn: 172800000,
            });
            return token;
        } catch (e) {
            logger.error('Error generating new token', { error: e });
            throw new Error('Error generating new token');
        }
    }
}
