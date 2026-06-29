import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
// import { t } from "i18next";

// --- INTERFACES ---
export interface MovementAplication {
    id: string;
    name: string;
    acronym: string;
    created_at?: string;
    updated_at?: string;
}

export interface MovementAplicationResponse {
    movementAplications: MovementAplication[];
    meta: {
        total: number;
        page: number;
        lastPage: number;
    };
}

export interface Options {
    limit?: number | string;
    offset?: number | string;
    query?: string;
}

export const getMovementAplicationsAction = async (options: Options = {}): Promise<MovementAplicationResponse> => {
    const { limit = 10, offset = 0, query = undefined } = options;

    try {
        const { data } = await soporteTecnicoApi.get<MovementAplicationResponse>('/movement-applications', {
            params: {
                limit: isNaN(Number(limit)) ? 10 : Number(limit),
                offset: isNaN(Number(offset)) ? 0 : Number(offset),
                query: query?.replaceAll('+', ' '),
            },
        });

        return data;
    } catch {
        // console.error(t("api_movement_applications_fetch_error"), error);
        return {
            movementAplications: [],
            meta: {
                total: 0,
                page: 1,
                lastPage: 1,
            },
        };
    }
};

export const getMovementApplicationByIdAction = async (
    idOrObject: string | { id: string }
): Promise<MovementAplication | null> => {
    const id = typeof idOrObject === 'object' ? idOrObject?.id : idOrObject;

    if (!id) return null;

    try {
        const { data } = await soporteTecnicoApi.get<MovementAplication>(`/movement-applications/${id}`);
        return data;
    } catch  {
        return null;
    }
};