import {IUserModel, UserModelManager} from "../../lib/schema/models/user/userModel";
import {nest} from "../../utils";
import {ModelCtor} from "sequelize";
import logger from "../../utils/logger";
import {sellerDetails, IBuyerServices, productDetails} from "./types";
import {IProductModel, ProductModelManager} from "../../lib/schema/models/product/productModel";
import {CatalogModelManager, ICatalogModel} from "../../lib/schema/models/catalogs/catalogsModel";
import {IOrderModel, OrderModelManager} from "../../lib/schema/models/orders/ordersModel";
import {_json} from "../../types";

export class BuyerService implements IBuyerServices {

    private Seller: ModelCtor<IUserModel> = UserModelManager.getInstance().getModel();
    private Catalog: ModelCtor<ICatalogModel> = CatalogModelManager.getInstance().getModel();
    private Product: ModelCtor<IProductModel> = ProductModelManager.getInstance().getModel();
    private Order: ModelCtor<IOrderModel> = OrderModelManager.getInstance().getModel();




    async getListOfSellers(): Promise<sellerDetails[] | Error> {
        let err: Error;
        let res: any;
        [err, res] = await nest(this.getSellers());
        if (err) {
            logger.error('Error in getSeller function', {error: err});
            throw new Error('Error in getSeller function');
        }
        const listOfSellers = new Array<sellerDetails>();
        res.forEach((item: { id: number; name: string; }) => {
            listOfSellers.push({
                id: item.id,
                name: item.name,
            });
        });
        return listOfSellers;
    }

    async getSellers(): Promise<any | Error> {
        let err: Error;
        let res: any;
        [err, res] = await nest(this.Seller.findAll({where : {type : 'SELLER'}}));
        if (err) {
            logger.error('Error in fetching data from the file', {Error: err});
            throw new Error('Error in fetching data from the file');
        }
        return res;
    }


    async getSellerCatalog(id : number): Promise<productDetails[] | Error>{
        let err : Error;
        let res: any;
        let catalog : ICatalogModel
        [err, catalog]= await nest(this.Catalog.findOne({where : {sellerId : id}}));
        if(err){
            logger.error('Error in fetching catalog from the database', {Error: err});
            throw new Error('Error in fetching catalog from the database');
        }
        [err,res]= await nest(this.getProductDetails(catalog.id));
        if (err) {
            logger.error('Error in getProductDetails function', {error: err});
            throw new Error('Error in getProductDetails function');
        }
        const listOfProducts = new Array<productDetails>();
        res.forEach((item: { name: string; price: number; }) => {
            listOfProducts.push({
                name: item.name,
                price: item.price,
            });
        });
        return listOfProducts;

    }


    async getProductDetails(id : number): Promise<any| Error>{
        let err : Error;
        let res: any;
        [err,res]= await nest(this.Product.findAll({where : {catalogId : id}}));
        if(err){
            logger.error('Error in fetching data from the database ', {Error: err});
            throw new Error('Error in fetching data from the database');
        }
        return res;
    }

    // eslint-disable-next-line max-len
    async placeOrder(id : number,buyerId : number, listOfProducts : any): Promise<boolean | Error> {
        const orderObject: IOrderModel = this.Order.build({
            sellerId: id,
            buyerId: buyerId,
            listOfProducts: listOfProducts,
        });
        const [err, orderData] = await nest(orderObject.save());
        if (err) {
            logger.error('Error while registering', {error: err});
            throw new Error('Error while registering');
        }

        return true;
    }

}
