import { notFoundError } from '@/errors';
import { userTickets, userTicketsUnformated } from '@/protocols';
import { Enrollment, TicketType } from '@prisma/client';
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
function formatTicket( lst: userTickets[] ){
    let respostaFormatted = {
        id: lst[0].id,
        status: lst[0].status, 
        ticketTypeId: lst[0].ticketTypeId,
        enrollmentId: lst[0].enrollmentId,
        TicketType: {
          id: lst[0].TicketType[0].id,
          name: lst[0].TicketType[0].name,
          price: lst[0].TicketType[0].price,
          isRemote: lst[0].TicketType[0].isRemote,
          includesHotel: lst[0].TicketType[0].includesHotel,
          createdAt: correctData(new Date(lst[0].TicketType[0].createdAt).toISOString()),
          updatedAt: correctData(new Date(lst[0].TicketType[0].updatedAt).toISOString())
        },
        createdAt: new Date(lst[0].createdAt).toISOString(),
        updatedAt: new Date(lst[0].updatedAt).toISOString()
      }

    return respostaFormatted
}
async function getTicketsFromUser(userId: number) {
    let checkForEnrollment: Enrollment = await ticketRepository.checkEnrollment(userId)
    if (!checkForEnrollment) {
        throw notFoundError();
    }

    let respostaUnformatted = await ticketRepository.readTicketsFromUser(userId) as userTickets[]
    if (respostaUnformatted.length === 0) {
        throw notFoundError();
    }
    
    return formatTicket(respostaUnformatted)
}

async function postTicketService(userId: number, ticketTypeId: number) {
    let checkForEnrollment: Enrollment = await ticketRepository.checkEnrollment(userId)
    if (!checkForEnrollment) {
        throw notFoundError();
    }

    await ticketRepository.createTicket(ticketTypeId, checkForEnrollment.id) //criação

    let respostaUnformatted = await ticketRepository.readTicketsFromUser(userId) as userTickets[]
    return formatTicket(respostaUnformatted)
}

export const ticketService = {
    getTicketsFromUser,
    getAllTicketTypes,
    postTicketService
};
