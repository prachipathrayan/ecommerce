import {IProduct} from "./types";
import {DataTypes, Model, ModelCtor, Sequelize} from "sequelize";

export interface IProductModel extends IProduct, Model {}

export class ProductModel{
    private static instance: ProductModel;
    private Product: ModelCtor<IProductModel> = {} as ModelCtor<IProductModel>;
    static getInstance(): ProductModel {
        if (!ProductModel.instance) {
            ProductModel.instance = new ProductModel();
        }
        return ProductModel.instance;
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
                indexes: [{ unique: true, fields: ['slug'] }],
            }
        );
    }getModel(): ModelCtor<IProductModel> {
        return this.Product;
    }
}

export default ProductModel.getInstance().getModel();