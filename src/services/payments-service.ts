import { invalidDataError, notFoundError, unauthorizedError } from '@/errors';
import { PostPaymentInfo } from '@/protocols';
import { Enrollment } from '@prisma/client';
import { paymentRepository, ticketRepository } from '@/repositories';


async function getPaymentsService(userId: number, ticketId: number) {
    // há um ticketId?
    if (!ticketId) {
        throw invalidDataError('Missing ticketId!');
    }
    
    // o ticketId não existe? // o ticketId está associado ao usuário?
    let checkTicket = await ticketRepository.readTickets(ticketId);
    if(!checkTicket) {
        throw notFoundError();
    }

    let checkForEnrollment = await ticketRepository.checkEnrollmentById(checkTicket.enrollmentId)
    if (checkForEnrollment.userId !== userId) {
        throw unauthorizedError();
    }

    let resposta = await paymentRepository.readPayments(ticketId);

    return resposta
}

async function postPaymentService(userId: number, card: PostPaymentInfo) {

    let checkTicket = await ticketRepository.readTickets(card.ticketId);
    if(!checkTicket) {
        throw notFoundError();
    }

    let checkForEnrollment = await ticketRepository.checkEnrollmentById(checkTicket.enrollmentId)
    if (checkForEnrollment.userId !== userId) {
        throw unauthorizedError();
    }

    await paymentRepository.createPayment(card)

    let resposta = await paymentRepository.readPayments(card.ticketId);

    return resposta
}

export const paymentService = {
    getPaymentsService,
    postPaymentService
};
