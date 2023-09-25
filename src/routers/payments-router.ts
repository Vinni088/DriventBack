import { Router } from 'express';
import { postPaymentSchema } from '@/schemas';
import { authenticateToken, validateBody } from '@/middlewares';
import { getPayments, postPaymentProcess } from '@/controllers';




const paymentsRouter = Router();

paymentsRouter
    .all('/*', authenticateToken)
    .get('/', getPayments)
    .post('/process', validateBody(postPaymentSchema), postPaymentProcess);

export { paymentsRouter };
