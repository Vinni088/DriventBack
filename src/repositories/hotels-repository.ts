import { prisma } from '@/config';


async function getHotels() {
    let resposta = await prisma.hotel.findMany()

    return resposta
}
async function getHotelWithRooms(id: number) {
    let resposta = await prisma.hotel.findFirst({
        where: {
            id
        },
        include: {
            Rooms: true
        }
    })

    return resposta
}

export const hotelsRepository = {
    getHotels,
    getHotelWithRooms
}
