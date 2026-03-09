import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"

export const recuperatePasswordAction = async(email: string) => {
  const { data } = await soporteTecnicoApi.post('users/recuperate-password',{
    email
  });
  return data;
}