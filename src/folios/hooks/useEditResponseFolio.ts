import { useMutation, useQueryClient } from "@tanstack/react-query";
import { responseFoliosQueryKeys } from "../keys/folios-query.keys";
import { updateResponseFolioAction } from "../actions/update-response-folio.action";
import type { ResponseFolio } from "../interfaces/get-folios.interface";

export const useEditResponseFolio = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateResponseFolioAction,
        onSuccess: (updatedFolio: ResponseFolio) => {
            queryClient.invalidateQueries({
                queryKey: responseFoliosQueryKeys.lists()
            });
            queryClient.setQueryData(
                responseFoliosQueryKeys.details(),
                updatedFolio
            );
        },
    });
};