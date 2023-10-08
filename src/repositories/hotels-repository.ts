import { prisma } from '@/config';

async function findHotels() {
  return prisma.hotel.findMany();
}

async function findRoomsByHotelId(hotelId: number) {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true,
    },
  });
}

async function findRoomsById(roomId: number) {
  let resposta = await prisma.room.findFirst({
    where: {
      id: roomId
    },
    include:{
      Booking: true
    }
  })
  return resposta
}

export const hotelRepository = {
  findHotels,
  findRoomsById,
  findRoomsByHotelId,
};
