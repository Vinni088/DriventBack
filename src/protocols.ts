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