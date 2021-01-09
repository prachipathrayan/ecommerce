import {ModelCtor, QueryTypes, Sequelize} from 'sequelize';
import {IDatabase} from "./types";
import { nest } from '../../utils';
import config from '../../config/index';
import logger from "../../utils/logger";
import {IUserModel, UserModelManager} from "../schema/models/user/userModel";
import {IProductModel, ProductModelManager} from "../schema/models/product/productModel";
import {CatalogModelManager, ICatalogModel} from "../schema/models/catalogs/catalogsModel";
import {IOrderModel, OrderModelManager} from "../schema/models/orders/ordersModel";
import mysqlDbConfig from "../../config/index";



export class MysqlManager implements IDatabase {
    private getDbUri() : string{
        let key : string;
        if(!mysqlDbConfig.database.mysql.uri){
            logger.error('Error in getting your mySQL uri', {error : "Error in getting your mySQL uri"});
            throw new Error('Error in getting your mySQL uri');
        }
        else{
            key = mysqlDbConfig.database.mysql.uri;
        }
        return key;
    }
    private static instance: MysqlManager;
    private dbUri: string = this.getDbUri();

    static getInstance(): MysqlManager {
        if (!MysqlManager.instance) {
            MysqlManager.instance = new MysqlManager();
        }
        return MysqlManager.instance;
    }

    connect(): Promise<boolean | Error> {
        return new Promise(async (resolve, reject) => {
            try {
                const tempClient: Sequelize = this.getSequelizeInstance();
                await tempClient.authenticate();
                await this.registerModels(tempClient);
                logger.info('mysql db connected successfully');
                return resolve(true);
            } catch (e) {
                logger.error('Error in connecting to mysql', {error: e});
                return reject(new Error('Error in connecting to mysql'));
            }
        });
    }

    private getSequelizeInstance(): Sequelize {
        return new Sequelize(this.dbUri, {logging: false});
    }

    private async addUserAssociation(): Promise<boolean | Error>{
        const User: ModelCtor<IUserModel> = UserModelManager.getInstance().getModel();
        const Catalog: ModelCtor<ICatalogModel> =CatalogModelManager.getInstance().getModel();
        const Order: ModelCtor<IOrderModel> = OrderModelManager.getInstance().getModel();



        try{
            User.hasOne(Catalog, {
                    sourceKey: 'id',
                    foreignKey: 'sellerId',
                });
            Catalog.belongsTo(User, {
                    foreignKey: 'sellerId',
                });
            User.hasMany(Order, {
                sourceKey: 'id',
                foreignKey: 'sellerId',
            });
            Order.belongsTo(User, {
                foreignKey: 'sellerId',
            });
            User.hasMany(Order, {
                sourceKey: 'id',
                foreignKey: 'buyerId',
            });
            Order.belongsTo(User, {
                foreignKey: 'buyerId',
            });

            return true;
        } catch (err) {
            logger.error('Error while adding association into studentModel', {
                error: err,
            });
            throw new Error('Error while adding association studentModel');
        }
    }


    private async addCatalogAssociation(): Promise<boolean | Error>{
        const Product: ModelCtor<IProductModel> = ProductModelManager.getInstance().getModel();
        const Catalog: ModelCtor<ICatalogModel> =CatalogModelManager.getInstance().getModel();

        try{
            Catalog.hasMany(Product, {
                sourceKey: 'id',
                foreignKey: 'catalogId',
            });
            Product.belongsTo(Catalog, {
                foreignKey: 'catalogId',
            });
            return true;
        } catch (err) {
            logger.error('Error while adding association into courseModel', {
                error: err,
            });
            throw new Error('Error while adding association courseModel');
        }
    }



    private async registerModels(sequelize: Sequelize): Promise<boolean | Error> {
        UserModelManager.getInstance().register(sequelize);
        ProductModelManager.getInstance().register(sequelize);
        CatalogModelManager.getInstance().register(sequelize);
        OrderModelManager.getInstance().register(sequelize);

        this.addUserAssociation();
        this.addCatalogAssociation();
        const [err, isCreated] = await nest(sequelize.sync({ alter: true }));
        if (err && !isCreated) {
            logger.error('Error in registering models', { error: err });
            throw new Error('Error in registering models');
        }
        return true;
    }
    async executeUpdateQuery(query: string): Promise<boolean | Error> {
        let err: Error;
        let result: any;
        [err, result] = await nest(
            this.getSequelizeInstance().query(query, {
                raw: true,
                type: QueryTypes.UPDATE,
            })
        );
        if (err) {
            logger.error('Error in executing raw query', { error: err, query });
            throw new Error('Error in executing query');
        }
        return true;
    }

    async executeDeleteQuery(query: string): Promise<boolean | Error> {
        let err: Error;
        let result: any;
        [err, result] = await nest(
            this.getSequelizeInstance().query(query, {
                raw: true,
                type: QueryTypes.DELETE,
            })
        );
        if (err) {
            logger.error('Error in executing raw query', { error: err, query });
            throw new Error('Error in executing query');
        }
        return true;
    }
}
