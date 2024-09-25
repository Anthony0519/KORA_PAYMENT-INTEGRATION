import { Router } from 'express';
import {
    payIn,
    payOut,
    verifyBank,
    webhookRes
} from '../requestHandler/transaction';
import { authenticate } from '../middleware/authentication';

const router = Router();

router.post('/deposite', authenticate, payIn);
router.post('/pay-out', authenticate, payOut);
router.get('/verify-bank', authenticate, verifyBank);
router.put('/webhook', webhookRes);

export { router as transactionRoutes };
