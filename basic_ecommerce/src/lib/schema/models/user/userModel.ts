import {IUser} from "./types";
import {DataTypes, Model, ModelCtor, Sequelize} from "sequelize";

export interface IUserModel extends IUser, Model {}

export class UserModelManager{
    private static instance: UserModelManager;
    private User: ModelCtor<IUserModel> = {} as ModelCtor<IUserModel>;
    static getInstance(): UserModelManager {
        if (!UserModelManager.instance) {
            UserModelManager.instance = new UserModelManager();
        }
        return UserModelManager.instance;
    }

    register(sequelize: Sequelize): void {
        this.User = sequelize.define<IUserModel>(
            'User',
            {
                id: {
                    primaryKey: true,
                    type: DataTypes.INTEGER.UNSIGNED,
                    autoIncrement: true,
                    allowNull: false,
                    unique: true,
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                username: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                type: {
                    type: DataTypes.ENUM,
                    values: ['BUYER', 'SELLER'],
                },
                email: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                passwordHash: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
            },
            {
                timestamps: true,
                createdAt: 'createdAt',
                updatedAt: 'updatedAt',
                indexes: [
                    {
                        unique: true,
                        fields: ['username']
                    }
                ]
            }
        );
    }getModel(): ModelCtor<IUserModel> {
        return this.User;
    }
}

export default UserModelManager.getInstance().getModel();


