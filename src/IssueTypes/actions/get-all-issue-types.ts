import { soporteTecnicoApi } from "@/api/soporteTecnicoApi"
import type { IssueType } from "../interfaces/issue-type";

export const getAllIssueTypesAction = async (): Promise<IssueType[]> => {
    const { data } = await soporteTecnicoApi.get<IssueType[]>('/issue-type');
    return data;
}