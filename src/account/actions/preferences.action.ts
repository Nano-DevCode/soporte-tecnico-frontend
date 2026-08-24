import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";

export const getNotificationPreferences = async (): Promise<Record<string, boolean>> => {
    const { data } = await soporteTecnicoApi.get<Record<string, boolean>>("/users/me/preferences");
    return data;
};

export const updateNotificationPreferences = async (preferences: Record<string, boolean>): Promise<Record<string, boolean>> => {
    const { data } = await soporteTecnicoApi.patch<Record<string, boolean>>("/users/me/preferences", preferences);
    return data;
};
