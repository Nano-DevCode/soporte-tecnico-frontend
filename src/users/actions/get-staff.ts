import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { Staff } from "../interfaces/users.response";

export const getStaffByIdAction = async(id: string): Promise<Staff> => {
  const { data } = await soporteTecnicoApi.get<Staff>(`/staff/${id}`);  
  return data;
}