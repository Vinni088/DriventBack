import { notFoundError } from '@/errors';
import { userTickets, userTicketsUnformated } from '@/protocols';
import { TicketType } from '@prisma/client';
import { ticketRepository } from '@/repositories';
import { string } from 'joi';


async function getAllTicketTypes() {
    let resposta: TicketType[] = await ticketRepository.readTicketTypes()

    return resposta
}

function correctData(data: string){
    let D = new Date(data)

    D.setTime( D.getTime() - 3*(60)*(60)*1000)

    return D.toISOString()
}

async function getTicketsFromUser(userId: number) {
    let checkForEnrollment = await ticketRepository.checkEnrollment(userId)
    if (!checkForEnrollment) {
        throw notFoundError();
    }

    let respostaUnformatted = await ticketRepository.readTicketsFromUser(userId) as userTickets[]
    if (respostaUnformatted.length === 0) {
        throw notFoundError();
    }
    
    let respostaFormatted = {
        id: respostaUnformatted[0].id,
        status: respostaUnformatted[0].status, 
        ticketTypeId: respostaUnformatted[0].ticketTypeId,
        enrollmentId: respostaUnformatted[0].enrollmentId,
        TicketType: {
          id: respostaUnformatted[0].TicketType[0].id,
          name: respostaUnformatted[0].TicketType[0].name,
          price: respostaUnformatted[0].TicketType[0].price,
          isRemote: respostaUnformatted[0].TicketType[0].isRemote,
          includesHotel: respostaUnformatted[0].TicketType[0].includesHotel,
          createdAt: correctData(new Date(respostaUnformatted[0].TicketType[0].createdAt).toISOString()),
          updatedAt: correctData(new Date(respostaUnformatted[0].TicketType[0].updatedAt).toISOString())
        },
        createdAt: new Date(respostaUnformatted[0].createdAt).toISOString(),
        updatedAt: new Date(respostaUnformatted[0].updatedAt).toISOString()
      }

    return respostaFormatted
}

async function postTicketService(userId: number, ticketTypeId: number) {
    let checkForEnrollment = await ticketRepository.checkEnrollment(userId)
    if (!checkForEnrollment) {
        throw notFoundError();
    }

    return "resposta 3"
}


export const ticketService = {
    getTicketsFromUser,
    getAllTicketTypes,
    postTicketService
};
