import {ICatalog} from "./types";
import {DataTypes, Model, ModelCtor, Sequelize} from "sequelize";

export interface ICatalogModel extends ICatalog, Model {}

export class CatalogModelManager{
    private static instance: CatalogModelManager;
    private Catalog: ModelCtor<ICatalogModel> = {} as ModelCtor<ICatalogModel>;
    static getInstance(): CatalogModelManager {
        if (!CatalogModelManager.instance) {
            CatalogModelManager.instance = new CatalogModelManager();
        }
        return CatalogModelManager.instance;
    }

    register(sequelize: Sequelize): void {
        this.Catalog = sequelize.define<ICatalogModel>(
            'Catalog',
            {
                id: {
                    primaryKey: true,
                    type: DataTypes.INTEGER.UNSIGNED,
                    autoIncrement: true,
                    allowNull: false,
                    unique: true,
                },
            },
            {
                timestamps: true,
                createdAt: 'createdAt',
                updatedAt: 'updatedAt',
                indexes: [{ unique: true, fields: ['id'] }],
            }
        );
    }getModel(): ModelCtor<ICatalogModel> {
        return this.Catalog;
    }
}

export default CatalogModelManager.getInstance().getModel();