import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { ticketService } from '@/services';


export async function getTicketTypes(req: AuthenticatedRequest, res: Response) {
    let resposta = await ticketService.getAllTicketTypes()

    return res.status(httpStatus.OK).send(resposta);
}

export async function getTickets(req: AuthenticatedRequest, res: Response) {
    const userId = Number(req.userId);

    let resposta = await ticketService.getTicketsFromUser(userId)

    return res.status(httpStatus.OK).send(resposta);
}

export async function postTicket(req: AuthenticatedRequest, res: Response) {
    const ticketTypeId = req.body.ticketTypeId as number;
    const userId = Number(req.userId);

    let resposta = await ticketService.postTicketService(userId, ticketTypeId);

    return res.status(httpStatus.CREATED).send(resposta);
}
