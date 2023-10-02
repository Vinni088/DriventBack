import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { hotelService } from '@/services';

export async function getAllHotels(req: AuthenticatedRequest, res: Response) {
    const userId = Number(req.userId);
    
    const resposta = await hotelService.getAllHotelsService(userId);

    return res.status(httpStatus.OK).send(resposta);
}

export async function getHotelWithRooms(req: AuthenticatedRequest, res: Response) {
    const userId = Number(req.userId);

    const resposta = await hotelService.getHotelWithRoomsService(userId);

    res.status(httpStatus.OK).send(resposta);
}
