import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";

export interface CreateUserDTO {
  email: string;
  password: string;
  name: string;
  paternalSurname: string;
  maternalSurname: string;
  avatar?: string;
  roleId: string;
  idTelegram?: string;
  num_control: string;
  rfc?: string;
  departmentId: string;
  coordinationId?: string;
}

export const createUserAction = async (user: CreateUserDTO) => {
  const { data } = await soporteTecnicoApi.post('/users', user);
  return data; 
};