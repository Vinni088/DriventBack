import supertest from 'supertest';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import * as jwt from 'jsonwebtoken';
import {
    TicketStatus
} from '@prisma/client';
import {
    createEnrollmentWithAddress,
    createPayment,
    createTicket,
    createTicketType,
    createUser,
    createBooking,
    createHotel,
    createRoomWithHotelId
} from '../factories';
import {
    cleanDb,
    generateValidToken
} from '../helpers';
import app, { init } from '@/app';

beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb();
});

const server = supertest(app);

describe('GET /booking', () => {
    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 404 if user has no reservation', async () => {

        const user = await createUser();

        const token = await generateValidToken(user);

        const enrollment = await createEnrollmentWithAddress(user);

        const ticketType = await createTicketType(false, true);

        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

        await createPayment(ticket.id, ticketType.price);

        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 200 and correct info', async () => {

        const user = await createUser();

        const token = await generateValidToken(user);

        const enrollment = await createEnrollmentWithAddress(user);

        const ticketType = await createTicketType(false, true);

        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

        await createPayment(ticket.id, ticketType.price);

        const createdHotel = await createHotel();

        const createdRoom = await createRoomWithHotelId(createdHotel.id);

        /* linha fundamental: */
        const booking = await createBooking(user.id, createdRoom.id)

        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toEqual(httpStatus.OK);
    });
});

describe('POST /booking', () => {
    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 403 when user ticket is remote ', async () => {
        const user = await createUser();

        const token = await generateValidToken(user);

        const enrollment = await createEnrollmentWithAddress(user);

        /* linha fundamental: */
        const ticketType = await createTicketType(true);

        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

        await createPayment(ticket.id, ticketType.price);

        const createdHotel = await createHotel();

        const createdRoom = await createRoomWithHotelId(createdHotel.id);

        const body = { roomId: createdRoom.id }

        const response = await server.post(`/booking`).set('Authorization', `Bearer ${token}`).send(body);

        expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 when user ticket does not includes hotel ', async () => {
        const user = await createUser();

        const token = await generateValidToken(user);

        const enrollment = await createEnrollmentWithAddress(user);

        /* linha fundamental: */
        const ticketType = await createTicketType(false, false);

        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

        await createPayment(ticket.id, ticketType.price);

        const createdHotel = await createHotel();

        const createdRoom = await createRoomWithHotelId(createdHotel.id);

        const body = { roomId: createdRoom.id }

        const response = await server.post(`/booking`).set('Authorization', `Bearer ${token}`).send(body);

        expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 when user ticket is unpaid ', async () => {
        const user = await createUser();

        const token = await generateValidToken(user);

        const enrollment = await createEnrollmentWithAddress(user);

        const ticketType = await createTicketType(false, true);
        
        /* linha fundamental: */
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

        const createdHotel = await createHotel();

        const createdRoom = await createRoomWithHotelId(createdHotel.id);

        const body = { roomId: createdRoom.id }

        const response = await server.post(`/booking`).set('Authorization', `Bearer ${token}`).send(body);

        expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 when room has no more capacity ', async () => {
        const user = await createUser();

        const token = await generateValidToken(user);

        const enrollment = await createEnrollmentWithAddress(user);

        const ticketType = await createTicketType(false, true);

        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        
        await createPayment(ticket.id, ticketType.price);

        const createdHotel = await createHotel();

        const createdRoom = await createRoomWithHotelId(createdHotel.id);

        /* linhas fundamentais: */
        const user2 = await createUser();
        await createBooking(user2.id, createdRoom.id)
        const user3 = await createUser();
        await createBooking(user3.id, createdRoom.id)
        const user4 = await createUser();
        await createBooking(user4.id, createdRoom.id)

        const body = { roomId: createdRoom.id }

        const response = await server.post(`/booking`).set('Authorization', `Bearer ${token}`).send(body);

        expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 when room does not exist ', async () => {
        const user = await createUser();

        const token = await generateValidToken(user);

        const enrollment = await createEnrollmentWithAddress(user);

        const ticketType = await createTicketType(false, true);

        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        
        await createPayment(ticket.id, ticketType.price);

        const createdHotel = await createHotel();

        /* linha fundamental: */
        /*const createdRoom = await createRoomWithHotelId(createdHotel.id);*/

        const body = { roomId: 1 }

        const response = await server.post(`/booking`).set('Authorization', `Bearer ${token}`).send(body);

        expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 200 and bookingId ', async () => {
        const user = await createUser();

        const token = await generateValidToken(user);

        const enrollment = await createEnrollmentWithAddress(user);

        const ticketType = await createTicketType(false, true);

        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        
        await createPayment(ticket.id, ticketType.price);

        const createdHotel = await createHotel();

        const createdRoom = await createRoomWithHotelId(createdHotel.id);

        const body = { roomId: createdRoom.id }

        const response = await server.post(`/booking`).set('Authorization', `Bearer ${token}`).send(body);

        expect(response.status).toEqual(httpStatus.OK);
    });
});

describe('PUT /booking', () => {
    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const body = { roomId: 1}

        const response = await server.put('/booking/1').set('Authorization', `Bearer ${token}`).send(body);


        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 404 if user has no booking', async () => {

        const user = await createUser();

        const token = await generateValidToken(user);

        const enrollment = await createEnrollmentWithAddress(user);

        const ticketType = await createTicketType(false, true);

        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        
        await createPayment(ticket.id, ticketType.price);

        const createdHotel = await createHotel();

        const createdRoom = await createRoomWithHotelId(createdHotel.id);

        const body = { roomId: createdRoom.id }

        /* linha fundamental: */
        /*const booking = await createBooking(user.id, createdRoom.id)*/

        const response = await server.put(`/booking/1`).set('Authorization', `Bearer ${token}`).send(body);

        expect(response.status).toEqual(httpStatus.FORBIDDEN);

    });

    it('should respond with status 403 when the new room has no more capacity ', async () => {
        const user = await createUser();

        const token = await generateValidToken(user);

        const enrollment = await createEnrollmentWithAddress(user);

        const ticketType = await createTicketType(false, true);

        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        
        await createPayment(ticket.id, ticketType.price);

        const createdHotel = await createHotel();

        const createdRoom = await createRoomWithHotelId(createdHotel.id);
        const createdRoom2 = await createRoomWithHotelId(createdHotel.id);

        const booking = await createBooking(user.id, createdRoom.id)
        /* linhas fundamentais: */
        const user2 = await createUser();
        await createBooking(user2.id, createdRoom2.id)
        const user3 = await createUser();
        await createBooking(user3.id, createdRoom2.id)
        const user4 = await createUser();
        await createBooking(user4.id, createdRoom2.id)

        const body = { roomId: createdRoom2.id }

        const response = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${token}`).send(body);

        expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 when the new room does not exist ', async () => {
        const user = await createUser();

        const token = await generateValidToken(user);

        const enrollment = await createEnrollmentWithAddress(user);

        const ticketType = await createTicketType(false, true);

        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        
        await createPayment(ticket.id, ticketType.price);

        const createdHotel = await createHotel();

        const createdRoom = await createRoomWithHotelId(createdHotel.id);

        const createdRoom2 = await createRoomWithHotelId(createdHotel.id);

        const booking = await createBooking(user.id, createdRoom.id)

        const body = { roomId: createdRoom2.id+100 }

        const response = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${token}`).send(body);

        expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 200 and correct info', async () => {

        const user = await createUser();

        const token = await generateValidToken(user);

        const enrollment = await createEnrollmentWithAddress(user);

        const ticketType = await createTicketType(false, true);

        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

        await createPayment(ticket.id, ticketType.price);

        const createdHotel = await createHotel();

        const createdRoom = await createRoomWithHotelId(createdHotel.id);
        const secondRoom = await createRoomWithHotelId(createdHotel.id)
        
        const booking = await createBooking(user.id, createdRoom.id)

        const body = { roomId: secondRoom.id}

        const response = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${token}`).send(body);

        expect(response.status).toEqual(httpStatus.OK);
    });
});