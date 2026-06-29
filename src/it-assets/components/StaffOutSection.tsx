import { useEffect, useState, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";

// Hooks
import { useStaffRoleSpecific } from "@/users/hooks/useStaffRoleSpecific";

// UI Components
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

// Custom Components
import type { Staff } from "../interfaces/staffsWithSpecificsRolesResponse.interface";
import { InfiniteScrollSelect } from "@/components/custom/InfiniteScrollSelect";

interface Props {
  isDisabled: boolean;
}

export const StaffOutSection = ({ isDisabled }: Props) => {
  const { t } = useTranslation();
  const { control, watch } = useFormContext();

  // Estados para la búsqueda infinita del Staff
  const [staffSearchInput, setStaffSearchInput] = useState("");
  const [debouncedStaffSearch, setDebouncedStaffSearch] = useState("");

  // Efecto de Debounce (500ms)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedStaffSearch(staffSearchInput), 500);
    return () => clearTimeout(timer);
  }, [staffSearchInput]);

  // Hook de scroll infinito
  const { 
    staffMembers, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isLoading: isLoadingStaff 
  } = useStaffRoleSpecific(debouncedStaffSearch);

  // Opciones mapeadas
  const staffOptions = useMemo(() => {
    return staffMembers.map((staff: Staff) => ({
      id: staff.id,
      name: staff.fullName || t("itAssets.components.staffOutSection.noName"), 
    }));
  }, [staffMembers, t]);

  // Observador para el Preview
  const currentStaffId = watch("staffId");
  const selectedStaff: Staff | null | undefined = useMemo(() => {
    if (!currentStaffId) return null;
    return staffMembers.find((staff: Staff) => staff.id === currentStaffId);
  }, [staffMembers, currentStaffId]);

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      {/* CAMPO: STAFF */}
      <FormField
        control={control}
        name="staffId"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <UserRound className="h-4 w-4 text-muted-foreground" />
              {t("itAssets.components.staffOutSection.assignEmployee")} <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <InfiniteScrollSelect
                options={staffOptions}
                value={staffOptions.find((opt: { id: string | undefined }) => opt.id === field.value) || null}
                onChange={(val: { id: string } | null) => field.onChange(val?.id || "")}
                onSearch={setStaffSearchInput}
                fetchNextPage={fetchNextPage}
                hasNextPage={!!hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                isLoading={isLoadingStaff}
                placeholder={t("itAssets.components.staffOutSection.searchPlaceholder")}
                disabled={isDisabled}
              />
            </FormControl>

            {/* PREVIEW DEL USUARIO */}
            {selectedStaff && (
              <div className="mt-3 flex items-start gap-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary shadow-sm border border-primary/20 mt-1">
                  <UserRound className="h-6 w-6" />
                </div>
                <div className="flex flex-col overflow-hidden w-full">
                  
                  <span className="text-base font-bold text-foreground wrap-break-word">
                    {selectedStaff.fullName || t("itAssets.components.staffOutSection.selectedEmployee")}
                  </span>
                  
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    {selectedStaff.user?.role?.name ? (
                      <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                        {selectedStaff.user.role.name}
                      </span>
                    ) : (
                      <span className="bg-muted px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                        {t("itAssets.components.staffOutSection.staffFallback")}
                      </span>
                    )}
                    {selectedStaff.num_control && (
                      <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded text-[10px] font-mono font-medium">
                        {t("itAssets.components.staffOutSection.controlNumber")}: {selectedStaff.num_control}
                      </span>
                    )}
                  </div>

                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-muted-foreground">
                    {selectedStaff.user?.email && (
                      <span className="break-all" title={selectedStaff.user.email}>
                        📧 {selectedStaff.user.email}
                      </span>
                    )}
                    {selectedStaff.rfc && (
                      <span className="truncate font-mono" title={selectedStaff.rfc}>
                        📄 RFC: {selectedStaff.rfc}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {!selectedStaff && (
              <FormDescription>{t("itAssets.components.staffOutSection.description")}</FormDescription>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      {/* CAMPO: DESCRIPCIÓN */}
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t("itAssets.components.staffOutSection.outDescriptionLabel")} <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Textarea 
                placeholder={t("itAssets.components.staffOutSection.outDescriptionPlaceholder")} 
                className="resize-none" 
                {...field} 
                disabled={isDisabled} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};