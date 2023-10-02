import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getAllHotels, getHotelWithRooms } from '@/controllers';

const hotelsRouter = Router();

hotelsRouter
  .all('/*', authenticateToken)
  .get('/', getAllHotels)
  .get('/:hotelId', getHotelWithRooms);

export { hotelsRouter };
