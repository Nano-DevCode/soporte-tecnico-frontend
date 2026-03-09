import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";

export const patchPasswordChangeAction = async ( password: string ) => {
  const { data } = await soporteTecnicoApi.patch('users/password-change', {
    password
  });
  return data;
}