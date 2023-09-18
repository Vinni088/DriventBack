import { ApplicationError } from '@/protocols';

export function invalidCepError(): ApplicationError {
  return {
    name: 'InvalidDataError',
    message: 'Cep invalido digitado!',
  };
}
