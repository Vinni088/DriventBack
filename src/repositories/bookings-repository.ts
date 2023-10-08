import { prisma } from '@/config';

async function findBooking(userId: number) {
    let resposta = await prisma.booking.findFirst({
        where:{
            userId
        },
        include:{
            Room: true
        }
    })
    return resposta;
}

async function createBooking(userId: number, roomId: number) {
    let resposta = await prisma.booking.create({
        data:{
            userId,
            roomId
        }
    })
    return resposta;
}

async function updateBooking(bookingId: number, roomId: number) {
    let resposta = await prisma.booking.update({
        where:{
            id: bookingId
        },
        data:{
            roomId
        }
    })
    return resposta
}

export const bookingRepository = {
    findBooking,
    createBooking,
    updateBooking
};
