import {IOrders} from "./types";
import {DataTypes, Model, ModelCtor, Sequelize} from "sequelize";

export interface IOrderModel extends IOrders, Model {}

export class OrderModelManager{
    private static instance: OrderModelManager;
    private Order: ModelCtor<IOrderModel> = {} as ModelCtor<IOrderModel>;
    static getInstance(): OrderModelManager {
        if (!OrderModelManager.instance) {
            OrderModelManager.instance = new OrderModelManager();
        }
        return OrderModelManager.instance;
    }

    register(sequelize: Sequelize): void {
        this.Order = sequelize.define<IOrderModel>(
            'Order',
            {
                id: {
                    primaryKey: true,
                    type: DataTypes.INTEGER.UNSIGNED,
                    autoIncrement: true,
                    allowNull: false,
                    unique: true,
                },
                listOfProducts: {
                    type: DataTypes.JSON,
                    allowNull: false,
                },
            },
            {
                timestamps: true,
                createdAt: 'createdAt',
                updatedAt: 'updatedAt',
                indexes: [{ unique: true, fields: ['id'] }],
            }
        );
    }getModel(): ModelCtor<IOrderModel> {
        return this.Order;
    }
}

export default OrderModelManager.getInstance().getModel();