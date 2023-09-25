import { Response } from 'express';
import httpStatus from 'http-status';
import { paymentService } from '@/services';
import { PostPaymentInfo } from '@/protocols';
import { AuthenticatedRequest } from '@/middlewares';

export async function getPayments(req: AuthenticatedRequest, res: Response) {
    let ticketId = Number(req.query.ticketId);
    const userId = req.userId as number;

    let resposta = await paymentService.getPaymentsService(userId, ticketId)

    return res.status(httpStatus.OK).send(resposta);
}


export async function postPaymentProcess(req: AuthenticatedRequest, res: Response) {
    const card = req.body as PostPaymentInfo;
    const userId = req.userId as number;

    let resposta = await paymentService.postPaymentService(userId, card);

    return res.status(httpStatus.OK).send(resposta);
}
