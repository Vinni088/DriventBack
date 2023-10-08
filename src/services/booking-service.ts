import {
    TicketStatus
} from '@prisma/client';
import {
    notFoundError,
    cannotListHotelsError,
    unauthorizedBookingError
} from '@/errors';
import {
    enrollmentRepository,
    hotelRepository,
    ticketsRepository,
    bookingRepository
} from '@/repositories';
/* Booking helpers? */
async function validateUserBooking(userId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) throw notFoundError();

    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if (!ticket) throw notFoundError();

    const type = ticket.TicketType;

    if (ticket.status === TicketStatus.RESERVED || type.isRemote || !type.includesHotel) {
        throw unauthorizedBookingError();
    }
}

async function validateRoom(roomId: number) {
    let room = await hotelRepository.findRoomsById(roomId);

    if ( !room ) { throw notFoundError() }
    
    if ( room.capacity === room.Booking.length ) { throw unauthorizedBookingError("capacidade máxima") }
}

/* Efective services */
async function getBooking(userId: number) {
    let bookingWithRoom = await bookingRepository.findBooking(userId)

    if (!bookingWithRoom) { throw notFoundError() }

    return bookingWithRoom;
}

async function postBooking(userId: number, roomId: number) {
    await validateUserBooking(userId);

    await validateRoom(roomId);

    let createdBooking = await bookingRepository.createBooking(userId, roomId)

    let resposta = { bookingId: createdBooking.id }

    return resposta;
}

async function updateBooking(userId: number, roomId: number, bookingId: number) {
    //booking id: id do booking que será alterado
    //roomId: id do novo quarto
    //
    let bookingPrev = await bookingRepository.findBooking(userId) 
    if(!bookingPrev ) { throw unauthorizedBookingError() }
    
    await validateRoom(roomId);

    let update = await bookingRepository.updateBooking(bookingId, roomId)

    return { bookingId: update.id }
}

export const bookingService = {
    getBooking,
    postBooking,
    updateBooking
};
