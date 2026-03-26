import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";

export interface UpdateUserDTO {
  email?: string;
  password?: string;
  name?: string;
  paternalSurname?: string;
  maternalSurname?: string;
  num_control?: string;
  rfc?: string;
  idTelegram?: string;
  roleId?: string;
  departmentId?: string;
  coordinationId?: string;
}

export const updateUserAction = async (id: string, user: UpdateUserDTO) => {
  const { data } = await soporteTecnicoApi.patch(`/users/${id}`, user);
  return data;
};