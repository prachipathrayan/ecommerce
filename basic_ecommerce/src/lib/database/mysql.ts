import {QueryTypes, Sequelize} from 'sequelize';
import {IDatabase} from "./type";
import { nest } from '../../utils';
import config from '../../config/index';
import logger from "@shared/Logger";



export class MysqlManager implements IDatabase {
    private static instance: MysqlManager;
    private dbUri: string = config.database.mysql.uri;

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

    private async addStudentAssociation(): Promise<boolean | Error>{
        try{
            StudentModel.getInstance()
                .getModel()
                .hasMany(EnrollmentModel.getInstance().getModel(), {
                    sourceKey: 'id',
                    foreignKey: 'studentId',
                });
            EnrollmentModel.getInstance()
                .getModel()
                .belongsTo(StudentModel.getInstance().getModel(), {
                    foreignKey: 'studentId',
                });
            return true;
        } catch (err) {
            logger.error('Error while adding association into studentModel', {
                error: err,
            });
            throw new Error('Error while adding association studentModel');
        }
    }


    private async addCourseAssociation(): Promise<boolean | Error>{
        try{
            CourseModel.getInstance()
                .getModel()
                .hasMany(EnrollmentModel.getInstance().getModel(), {
                    sourceKey: 'id',
                    foreignKey: 'courseId',
                });
            EnrollmentModel.getInstance()
                .getModel()
                .belongsTo(CourseModel.getInstance().getModel(), {
                    foreignKey: 'courseId',
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
        CourseModel.getInstance().register(sequelize);
        StudentModel.getInstance().register(sequelize);
        EnrollmentModel.getInstance().register(sequelize);
        this.addCourseAssociation();
        this.addStudentAssociation();
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
