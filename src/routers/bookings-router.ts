import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getBooking, postBooking, updateBooking } from '@/controllers';
import { postBookingSchema } from '@/schemas';

const bookingRouter = Router();

bookingRouter
    .all("/*", authenticateToken)
    .get("/", getBooking)
    .post("/", validateBody(postBookingSchema) , postBooking)
    .put("/:bookingId", updateBooking);

export { bookingRouter };
