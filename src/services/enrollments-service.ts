import { Address, Enrollment } from '@prisma/client';
import { request } from '@/utils/request';
import { notFoundError, invalidCepError } from '@/errors';
import { addressRepository, CreateAddressParams, enrollmentRepository, CreateEnrollmentParams } from '@/repositories';
import { exclude } from '@/utils/prisma-utils';
import { AxiosResponse } from 'axios';
import { CepCompleto, CepFatorado } from '@/protocols';

function tratamentoCep(cep: number | string) {
  let novoCep = String(cep);
  while (novoCep.length < 8) {
    novoCep = "0" + novoCep
  }
  return novoCep;
}

async function getAddressFromCEP(cep: number) {

  //Check para formato do cep recebido sem uso de requisição
  if (String(cep).length > 8 || isNaN(cep)) {
    throw invalidCepError();
  }

  let formatedCep = tratamentoCep(cep)

  const requestResult = await request.get(`${process.env.VIA_CEP_API}/${formatedCep}/json/`) as AxiosResponse;
  let result: CepCompleto = requestResult.data;

  //Check para existencia do cep recebido no banco da API
  if (result.erro === true || result.erro === "true") {
    throw invalidCepError();
  }

  //Uma vez que o cep existe, formatação e envio dos campos desejados
  let factoredResult: CepFatorado = {
    logradouro: result.logradouro,
    complemento: result.complemento,
    bairro: result.bairro,
    cidade: result.localidade,
    uf: result.uf
  }

  return factoredResult;
}

async function getOneWithAddressByUserId(userId: number): Promise<GetOneWithAddressByUserIdResult> {
  const enrollmentWithAddress = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollmentWithAddress) throw { name: "InvalidDataError", message:"Inscrição não possui o endereço!"};

  const [firstAddress] = enrollmentWithAddress.Address;
  const address = getFirstAddress(firstAddress);

  return {
    ...exclude(enrollmentWithAddress, 'userId', 'createdAt', 'updatedAt', 'Address'),
    ...(!!address && { address }),
  };
}

type GetOneWithAddressByUserIdResult = Omit<Enrollment, 'userId' | 'createdAt' | 'updatedAt'>;

function getFirstAddress(firstAddress: Address): GetAddressResult {
  if (!firstAddress) return null;

  return exclude(firstAddress, 'createdAt', 'updatedAt', 'enrollmentId');
}

type GetAddressResult = Omit<Address, 'createdAt' | 'updatedAt' | 'enrollmentId'>;

async function createOrUpdateEnrollmentWithAddress(params: CreateOrUpdateEnrollmentWithAddress) {
  const enrollment = exclude(params, 'address');
  enrollment.birthday = new Date(enrollment.birthday);
  const address = getAddressForUpsert(params.address);

  //Checks do cep:

  const requestResult = await request.get(`${process.env.VIA_CEP_API}/${address.cep}/json/`) as AxiosResponse;
  let result: CepCompleto = requestResult.data;
  if (result.erro === true || result.erro === "true") { throw invalidCepError() }

  const newEnrollment = await enrollmentRepository.upsert(params.userId, enrollment, exclude(enrollment, 'userId'));

  await addressRepository.upsert(newEnrollment.id, address, address);
}

function getAddressForUpsert(address: CreateAddressParams) {
  return {
    ...address,
    ...(address?.addressDetail && { addressDetail: address.addressDetail }),
  };
}

export type CreateOrUpdateEnrollmentWithAddress = CreateEnrollmentParams & {
  address: CreateAddressParams;
};

export const enrollmentsService = {
  getOneWithAddressByUserId,
  createOrUpdateEnrollmentWithAddress,
  getAddressFromCEP,
};
