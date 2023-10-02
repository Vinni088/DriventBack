import {
    paymentRequiredError,
    unauthorizedError,
    invalidDataError,
    notFoundError
} from '@/errors';
import {
    enrollmentRepository,
    ticketsRepository,
    hotelsRepository
} from '@/repositories';

async function getAllHotelsService(userId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) throw notFoundError();

    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if (!ticket) throw notFoundError();

    if (ticket.status === 'RESERVED') throw paymentRequiredError();
    if (ticket.TicketType.isRemote === true) throw paymentRequiredError();
    if (ticket.TicketType.includesHotel === false) throw paymentRequiredError();

    let resposta = await hotelsRepository.getHotels();
    if (resposta.length === 0) throw notFoundError();

    return resposta
}

async function getHotelWithRoomsService(userId: number, hotelId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) throw notFoundError();

    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if (!ticket) throw notFoundError();

    if (ticket.status === 'RESERVED') throw paymentRequiredError();
    if (ticket.TicketType.isRemote === true) throw paymentRequiredError();
    if (ticket.TicketType.includesHotel === false) throw paymentRequiredError();

    let resposta = await hotelsRepository.getHotelWithRooms(hotelId);
    if (!resposta) throw notFoundError();

    return resposta
}


export const hotelService = {
    getAllHotelsService,
    getHotelWithRoomsService,
};
