import { Router } from 'express';
import { postTicketSchema } from '@/schemas/tickets-schemas';
import { authenticateToken, validateBody } from '@/middlewares';
import { getTickets, getTicketTypes, postTicket } from '@/controllers';



const ticketsRouter = Router();

ticketsRouter
    .all('/*', authenticateToken)
    .get('/', getTickets)
    .get('/types', getTicketTypes)
    .post('/', validateBody(postTicketSchema), postTicket);

export { ticketsRouter };
