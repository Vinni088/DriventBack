import { notFoundError } from '@/errors';
import { Enrollment, TicketType } from '@prisma/client';
import { ticketRepository } from '@/repositories';

async function getAllTicketTypes() {
    let resposta: TicketType[] = await ticketRepository.readTicketTypes()

    return resposta
}

async function getTicketsFromUser(userId: number) {
    let checkForEnrollment: Enrollment = await ticketRepository.checkEnrollment(userId)
    if (!checkForEnrollment) {
        throw notFoundError();
    }

    let resposta = await ticketRepository.readTicketsFromUser2(checkForEnrollment.id)
    if (!resposta) {
        throw notFoundError();
    }

    return resposta
}

async function postTicketService(userId: number, ticketTypeId: number) {
    let checkForEnrollment: Enrollment = await ticketRepository.checkEnrollment(userId)
    if (!checkForEnrollment) {
        throw notFoundError();
    }

    await ticketRepository.createTicket(ticketTypeId, checkForEnrollment.id) //criação

    let resposta = await ticketRepository.readTicketsFromUser2(checkForEnrollment.id)
    return resposta
}

export const ticketService = {
    getTicketsFromUser,
    getAllTicketTypes,
    postTicketService
};
