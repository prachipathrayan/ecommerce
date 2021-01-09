import {_json} from "../../types";

export interface ISellerServices{
    getListOfOrders(id:number): Promise<orderDetails[] | Error>
    makeCatalog(id : number, listOfProducts : any): Promise<boolean | Error>
}

export type orderDetails = {
    buyerId: number;
    listOfProducts: _json;
}

export type productDetails={
    name: string;
    price: number;
}