import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { bookingService } from '@/services';

export async function getBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;

    const resposta = await bookingService.getBooking(userId);

    res.status(httpStatus.OK).send(resposta);
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const   roomId   = Number(req.body.roomId);

    const resposta = await bookingService.postBooking(userId, roomId);

    res.status(httpStatus.OK).send(resposta);
}

export async function updateBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const bookingId = Number(req.params.bookingId);
    const roomId = Number(req.body.roomId);

    const resposta = await bookingService.updateBooking(userId, roomId, bookingId);

    res.status(httpStatus.OK).send(resposta);
}
