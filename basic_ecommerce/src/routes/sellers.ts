import { Request, Response, Router } from 'express';
import {nest} from "../utils";
import logger from "../utils/logger";
import {checkToken} from "../utils/tokenauth.middleware";
import {SellerService} from "../services/sellerService";
import {productDetails, sellerDetails} from "../services/buyerService/types";
import {_json} from "../types";
import {orderDetails} from "../services/sellerService/types";

// Init shared
const router = Router();



/******************************************************************************
 *                      Get All Users - "GET /api/seller/orders"
 ******************************************************************************/

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/orders', checkToken, async (req: Request, res: Response) => {
    const sellerService = new SellerService();
    let orderDetails: orderDetails[];
    let err: Error;
    const  sellerId: any = res.getHeader('user_id');
    [err, orderDetails]= await nest(sellerService.getListOfOrders(sellerId));
    if(err){
        logger.error('Router Problem');
        return res.json({
            Error: err.message,
        })
    }
    else{
        return res.json({
            data: orderDetails,
            error: null
        });}

});




/******************************************************************************
 *                       Add One - "POST /api/seller/create-catalog"
 ******************************************************************************/

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/create-catalog', checkToken, async (req: Request, res: Response) => {
    const productList: any = req.body;
    const  sellerId: any = res.getHeader('user_id');
    const sellerService = new SellerService();
    console.log(productList.productList)

    const [err, isCreated]= await nest(
        sellerService.makeCatalog(sellerId,productList.productList));
    if(err){
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
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

