import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { Tag } from "../interfaces/tag.interface";


export const getTagsAction = async (): Promise<Tag[]> => {
    const { data } = await soporteTecnicoApi.get<Tag[]>('/tags');
    return data;
}