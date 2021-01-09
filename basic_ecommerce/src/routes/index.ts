import { Router } from 'express';
import BuyerRouter from './buyers';
import AuthRouter from './auth';
import SellerRouter from './sellers'


// Init router and path
const router = Router();

// Add sub-routes
router.use('/auth', AuthRouter);
router.use('/buyer', BuyerRouter);
router.use('/seller', SellerRouter);

// Export the base-router
export default router;
