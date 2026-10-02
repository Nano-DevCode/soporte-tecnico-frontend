import { soporteTecnicoApi } from "../../api/soporteTecnicoApi";
// import { t } from "i18next";

// --- INTERFACES ---
export interface PrinterTypeFunction {
    id: string;
    name: string;
    created_at?: string;
    updated_at?: string;
}

export interface PrinterTypeFunctionsResponse {
    printerFunctions: PrinterTypeFunction[];
    printerTypeFunctions?: PrinterTypeFunction[];
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

export const getPrinterTypeFunctionAction = async (
    options: Options = {}
): Promise<PrinterTypeFunctionsResponse> => {
    const { limit = 10, offset = 0, query = undefined } = options;

    try {
        const { data } = await soporteTecnicoApi.get<{
            printerFunctions?: PrinterTypeFunction[];
            printerTypeFunctions?: PrinterTypeFunction[];
            meta: { total: number; page: number; lastPage: number };
        }>('/printerfunctiontypes', {
            params: {
                limit: isNaN(Number(limit)) ? 10 : Number(limit),
                offset: isNaN(Number(offset)) ? 0 : Number(offset),
                // Reemplazamos los símbolos '+' por espacios en blanco por consistencia con el buscador del Front
                query: query?.replaceAll('+', ' '),
            },
        });

        const list = data.printerFunctions || data.printerTypeFunctions || [];
        return {
            printerFunctions: list,
            printerTypeFunctions: list,
            meta: data.meta,
        };
    } catch (error) {
        // console.error(t("api_printer_functions_fetch_error"), error);
        void error;
        return {
            printerFunctions: [],
            printerTypeFunctions: [],
            meta: {
                total: 0,
                page: 1,
                lastPage: 1,
            },
        };
    }
};

export const getPrinterTypeFunctionByIdAction = async (
    idOrObject: string | { id: string }
): Promise<PrinterTypeFunction | null> => {
    const id = typeof idOrObject === 'object' ? idOrObject?.id : idOrObject;

    if (!id) return null;

    try {
        const { data } = await soporteTecnicoApi.get<PrinterTypeFunction>(`/printerfunctiontypes/${id}`);
        return data;
    } catch (error) {
        // console.error(`${t("api_printer_function_by_id_error")} ${id}:`, error);
        void error;
        return null;
    }
};