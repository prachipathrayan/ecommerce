import { Request, Response, Router } from 'express';
import {nest} from "../utils";
import logger from "../utils/logger";
import {checkToken} from "../utils/tokenauth.middleware";
import {BuyerService} from "../services/buyerService";
import {productDetails, sellerDetails} from "../services/buyerService/types";
import {_json} from "../types";

// Init shared
const router = Router();



/******************************************************************************
 *                      Get All Users - "GET /api/buyer/list-of-sellers"
 ******************************************************************************/

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/list-of-sellers', checkToken, async (req: Request, res: Response) => {
    const buyerService = new BuyerService();
    let sellerDetails : sellerDetails[];
    let err: Error;
    [err, sellerDetails]= await nest(buyerService.getListOfSellers());
    if(err){
        logger.error('Router Problem');
        return res.json({
            Error: err.message,
        })
    }
    else{
        return res.json({
            data: sellerDetails,
            error: null
        });}

});


/******************************************************************************
 *                      Get All Users - "GET /api/buyer/seller-catalog/:seller_id"
 ******************************************************************************/

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/seller-catalog/:seller_id', checkToken, async (req: Request, res: Response) => {
    const buyerService = new BuyerService();
    const id : number = parseInt(req.params.seller_id);
    let catalogDetails : productDetails[];
    let err: Error;
    [err, catalogDetails]= await nest(buyerService.getSellerCatalog(id));
    if(err){
        logger.error('Router Problem');
        return res.json({
            Error: err.message,
        })
    }
    else{
        return res.json({
            data: catalogDetails,
            error: null
        });}

});

/******************************************************************************
 *                       Add One - "POST /api/buyer/create-order/:seller_id"
 ******************************************************************************/

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/create-order/:seller_id', checkToken, async (req: Request, res: Response) => {
    const {
        productList,
    }: _json = req.body;
    const id : number = parseInt(req.params.seller_id);
    const  buyerId: any = res.getHeader('user_id');

    const buyerService = new BuyerService();
    let err : Error;
    let isCreated : boolean;

    [err, isCreated]= await nest(
        buyerService.placeOrder(id,buyerId,productList));
    if(err){
        logger.error('Error in placing the order',{ 'error' : err});
        return res.json({
            error : err.message,
        })
    }
    else{
        return res.json({
            isCreated : isCreated,
        });
    }

});


/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;

