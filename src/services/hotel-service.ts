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
    if (ticket.status === 'RESERVED') { throw paymentRequiredError }

    return "ok!"
}

async function getHotelWithRoomsService(userId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) throw notFoundError();

    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if (!ticket) throw notFoundError();
    if (ticket.status === 'RESERVED') { throw paymentRequiredError }

    return "ok!"
}


export const hotelService = {
    getAllHotelsService,
    getHotelWithRoomsService,
};
