import { soporteTecnicoApi } from '@/api/soporteTecnicoApi';
import type { UpdateInternalFolioFormOutput } from '../schemas/UpdateInternalFolio.schema';

export interface UpdateInternalFolioParams {
    id: string;
    updateInternalFolioPayload: UpdateInternalFolioFormOutput;
}

export const updateInternalFolioAction = async ({
    id,
    updateInternalFolioPayload,
}: UpdateInternalFolioParams): Promise<void> => {
    await soporteTecnicoApi.patch(
        `/tickets/${id}/internal-folio`,
        updateInternalFolioPayload
    );
};
