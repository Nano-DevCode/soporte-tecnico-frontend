import { useMutation, useQueryClient } from "@tanstack/react-query";
import { otFoliosQueryKeys } from "../keys/folios-query.keys";
import { updateOTFolioAction } from "../actions/update-ot-folio.action";
import type { OTFolio } from "../interfaces/get-folios.interface";

export const useEditOTFolio = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateOTFolioAction,
        onSuccess: (updatedFolio: OTFolio) => {
            queryClient.invalidateQueries({
                queryKey: otFoliosQueryKeys.lists()
            });
            queryClient.setQueryData(
                otFoliosQueryKeys.details(),
                updatedFolio
            );
        },
    });
};
