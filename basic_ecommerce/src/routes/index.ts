import { Router } from 'express';
import BuyerRouter from './buyers';
import AuthRouter from './auth'

// Init router and path
const router = Router();

// Add sub-routes
router.use('/auth', AuthRouter);
router.use('/buyer', BuyerRouter);

// Export the base-router
export default router;
