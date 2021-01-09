import {IUserModel, UserModelManager} from "../../lib/schema/models/user/userModel";
import {nest} from "../../utils";
import {ModelCtor} from "sequelize";
import logger from "../../utils/logger";
import {productDetails, orderDetails, ISellerServices} from "./types";
import {IProductModel, ProductModelManager} from "../../lib/schema/models/product/productModel";
import {CatalogModelManager, ICatalogModel} from "../../lib/schema/models/catalogs/catalogsModel";
import {IOrderModel, OrderModelManager} from "../../lib/schema/models/orders/ordersModel";
import {_json} from "../../types";

export class SellerService implements ISellerServices {

    private User: ModelCtor<IUserModel> = UserModelManager.getInstance().getModel();
    private Catalog: ModelCtor<ICatalogModel> = CatalogModelManager.getInstance().getModel();
    private Product: ModelCtor<IProductModel> = ProductModelManager.getInstance().getModel();
    private Order: ModelCtor<IOrderModel> = OrderModelManager.getInstance().getModel();




    async getListOfOrders(id:number): Promise<orderDetails[] | Error> {
        let err: Error;
        let res: any;
        [err, res] = await nest(this.getOrders(id));
        if (err) {
            logger.error('Error in getOrders function', {error: err});
            throw new Error('Error in getOrders function');
        }
        const listOfOrders = new Array<orderDetails>();
        res.forEach((item: { buyerId: number; listOfProducts: _json; }) => {
            listOfOrders.push({
                buyerId: item.buyerId,
                listOfProducts: item.listOfProducts,
            });
        });
        return listOfOrders;
    }

    async getOrders(id:number): Promise<any | Error> {
        let err: Error;
        let res: any;
        [err, res] = await nest(this.Order.findAll({where : {sellerId : id}}));
        if (err) {
            logger.error('Error in fetching data from the file', {Error: err});
            throw new Error('Error in fetching data from the file');
        }
        return res;
    }


    async makeCatalog(id : number, listOfProducts : any): Promise<boolean | Error> {
        let err: Error;
        let catalogId: number;
        [err,catalogId]=await nest(this.isUserGenuineSeller(id));
        if(err){
            logger.error('User is not eligible for making catalog', {Error: err});
            throw new Error('User is not eligible for making catalog');
        }
        const res : productDetails[]= JSON.parse(listOfProducts).items;
        res.forEach((item: { name: string; price: number; }) => {
            const productObject: IProductModel = this.Product.build({
                name: item.name,
                price: item.price,
                catalogId: catalogId,
            });
            const data =  nest(productObject.save());
            if (err) {
                logger.error('Error while registering', {error: err});
                throw new Error('Error while registering');
            }
        });
        return true

    }
    async isUserGenuineSeller(id : number): Promise<number | Error> {
        let err : Error;
        let amount : number;
        [err,amount]= await nest(this.Catalog.count({where : {sellerId : id}}))
        if(err) {
            logger.error('Error in fetching data from the file', {Error: err});
            throw new Error('Error in fetching data from the file');
        }
        let user: IUserModel;
        [err, user]= await nest(this.User.findOne({where : {id : id}}));
        if(err){
            logger.error('Error in fetching data from the file', {Error: err});
            throw new Error('Error in fetching data from the file');
        }
        if(amount===0 && user.type=='SELLER'){
            let catalog : ICatalogModel
            [err, catalog]= await nest(this.Catalog.findOne({where : {sellerId : id}}));
            if(err){
                logger.error('Error in fetching data from the file', {Error: err});
                throw new Error('Error in fetching data from the file');
            }
            return catalog.id
        }
        else{
            throw new Error('User is not eligible for making catalog');
        }
    }

}
