import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { RefreshCw, Info } from "lucide-react";

import useItAssetsStatus from "../hooks/useItAssetsStatus";
import type { ItAsset } from "../interfaces/itAssetsResponse.interface";

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CustomConfirmChangeStatusItAsset } from "./CustomConfirmChangeStatusItAsset";

interface Props {
  itAsset: ItAsset;
  isDisabled: boolean;
}

export const AssetStatusSelect = ({ itAsset, isDisabled }: Props) => {
  const { control, watch } = useFormContext();
  const { itAssetsStatus, isLoading: isLoadingStatus } = useItAssetsStatus();
  
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const currentStatusId = watch("itAssetsStatusId");
  const selectedStatusDetail = itAssetsStatus.find(status => status.id === currentStatusId);

  return (
    <>
      <FormField
        control={control}
        name="itAssetsStatusId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Estado físico al momento de mover <span className="text-red-500">*</span></FormLabel>
            {!isEditingStatus ? (
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-muted/40 p-3 rounded-md border border-border/50">
                <div className="flex-1">
                  <span className="block font-medium text-sm text-foreground">
                    {itAsset.itAssetStatus?.name || "Estado Desconocido"}
                  </span>
                  {itAsset.itAssetStatus?.description && (
                    <span className="block text-xs text-muted-foreground mt-0.5 line-clamp-2" title={itAsset.itAssetStatus.description}>
                      {itAsset.itAssetStatus.description}
                    </span>
                  )}
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-xs shrink-0 self-start sm:self-auto"
                  onClick={() => setShowConfirmDialog(true)}
                  disabled={isDisabled}
                >
                  <RefreshCw className="h-3 w-3 mr-2" /> Cambiar Estado
                </Button>
              </div>
            ) : (
              <div className="space-y-2 animate-in fade-in zoom-in-95 duration-200">
                <Select onValueChange={field.onChange} value={field.value} disabled={isLoadingStatus || isDisabled}>
                  <FormControl>
                    <SelectTrigger className="border-primary/50 focus:ring-primary/20">
                      <SelectValue placeholder="Selecciona el estado físico del equipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {itAssetsStatus.map((status) => (
                      <SelectItem key={status.id} value={status.id}>
                        {status.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {selectedStatusDetail?.description && (
                  <div className="flex gap-2 items-start bg-blue-50/50 dark:bg-blue-950/20 p-2.5 rounded-md border border-blue-100 dark:border-blue-900/50">
                    <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      <strong className="text-foreground/80 block mb-0.5">Descripción del estado:</strong>
                      {selectedStatusDetail.description}
                    </p>
                  </div>
                )}
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <CustomConfirmChangeStatusItAsset 
        open={showConfirmDialog} 
        onOpenChange={setShowConfirmDialog}
        currentStatusName={itAsset.itAssetStatus?.name}
        onConfirm={() => {
          setIsEditingStatus(true);
          setShowConfirmDialog(false);
        }}
      />
    </>
  );
};