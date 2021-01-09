import {IProduct} from "./types";
import {DataTypes, Model, ModelCtor, Sequelize} from "sequelize";

export interface IProductModel extends IProduct, Model {}

export class ProductModelManager{
    private static instance: ProductModelManager;
    private Product: ModelCtor<IProductModel> = {} as ModelCtor<IProductModel>;
    static getInstance(): ProductModelManager {
        if (!ProductModelManager.instance) {
            ProductModelManager.instance = new ProductModelManager();
        }
        return ProductModelManager.instance;
    }

    register(sequelize: Sequelize): void {
        this.Product = sequelize.define<IProductModel>(
            'Product',
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
                slug: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    set() {
                        const slug: string = this.name.toLowerCase().split(' ').join('_');
                        this.setDataValue('slug', slug);
                    },
                },
                price: {
                    type: DataTypes.FLOAT,
                    allowNull: false,
                },
            },
            {
                timestamps: true,
                createdAt: 'createdAt',
                updatedAt: 'updatedAt',
                indexes: [{ unique: true, fields: ['slug','catalogId'] }],
            }
        );
    }getModel(): ModelCtor<IProductModel> {
        return this.Product;
    }
}

export default ProductModelManager.getInstance().getModel();
