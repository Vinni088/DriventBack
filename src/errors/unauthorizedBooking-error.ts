import { ApplicationError } from '@/protocols';

export function unauthorizedBookingError(string?: string): ApplicationError {
  return {
    name: 'unauthorizedBooking',
    message: `Cannot realize booking${ string ? `: ${string}` : ``}`,
  };
}
