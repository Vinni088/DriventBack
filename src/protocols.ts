export type ApplicationError = {
  name: string;
  message: string;
};

export type RequestError = {
  status: number;
  data: object | null;
  statusText: string;
  name: string;
  message: string;
};

export type CepCompleto = {
  cep: string,
  logradouro: string,
  complemento: string,
  bairro: string,
  localidade: string,
  uf: string,
  ibge: string,
  gia: string,
  ddd: string,
  siafi: string
  erro: boolean | undefined | string
}

export type CepFatorado = {
  logradouro: string,
  complemento: string,
  bairro: string,
  cidade: string,
  uf: string
};

export type ViaCEPAddressError = {
  error: boolean;
};

export type AddressEnrollment = {
  logradouro: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
};

export type CEP = {
  cep: string;
};

export type userTickets = {
  id: number,
  status: string,
  ticketTypeId: number,
  enrollmentId: number,
  TicketType: {
    id: number,
    name: string,
    price: number,
    isRemote: boolean,
    includesHotel: boolean,
    createdAt: Date,
    updatedAt: Date,
  }[],
  createdAt: Date,
  updatedAt: Date,
}

export type userTicketsUnformated = {
  id: number,
  status: string,
  ticketTypeId: number,
  enrollmentId: number,
  Id_TicketType: number
  name_TicketType: string,
  price_TicketType: string,
  isRemote_TicketType: boolean,
  includesHotel_TicketType: boolean,
  createdAt_TicketType: Date,
  updatedAt_TicketType: Date,
  createdAt: Date,
  updatedAt: Date
}

export type PostPaymentInfo = {
  ticketId: number,
  cardData: {
    issuer: string,
    number: number,
    name: string,
    expirationDate: Date | string,
    cvv: number
  }
}