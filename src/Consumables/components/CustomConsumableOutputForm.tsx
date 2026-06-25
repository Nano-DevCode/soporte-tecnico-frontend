
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useConsumableMovements } from "../hooks/useConsumableMovements";
import { useTicketsConsumables, useDepartmentsConsumables } from "../hooks/useConsumableCatalog";
import { SelectedConsumablesCard } from "./componentsConsumables/OutputMovementSelectedConsumablesCard";
import { ConsumableDetailsFormCard } from "./componentsConsumables/OutputMovementTypeDetailsCard";
import { MovementConfirmDialog } from "./componentsConsumables/OutputMovementConfirmDialog";
import type { ConsumableItemDto, CreateConsumableMovementDto } from "../interfaces/consumable-movement.interfaces";
import type { Consumable } from "../interfaces/consumable.interfaces";
import { sileo } from "sileo";
import { handleBackendErrors } from "../utils/handleBackendErrors";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

interface CatalogOption {
    id: string | number;
    name: string;
}

interface OutputFormValues {
    id_movement_type: number | string;
    id_movement_aplication: number;
    selectedTicket: CatalogOption | null;
    selectedDepartment: CatalogOption | null;
    observations: string;
    quantities: Record<string, number>;
}

interface Props {
    selectedItems: Consumable[];
    onSuccess: () => void;
    onRemoveItem: (id: string) => void;
}

export const ConsumableOutputForm: React.FC<Props> = ({ selectedItems, onSuccess, onRemoveItem }) => {
    const { t } = useTranslation();
    const { executeOutputMovement, isSubmitting } = useConsumableMovements();
    const navigate = useNavigate();
    const ticketsHook = useTicketsConsumables();
    const departmentsHook = useDepartmentsConsumables();

    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const pendingDataRef = useRef<OutputFormValues | null>(null);

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        setError,
        reset,
        formState: { errors }
    } = useForm<OutputFormValues>({
        defaultValues: {
            id_movement_type: 2,
            id_movement_aplication: 2,
            selectedTicket: null,
            selectedDepartment: null,
            observations: "",
            quantities: {},
        }
    });

    const currentQuantities = watch("quantities");

    const handleApplicationChange = (targetId: number) => {
        setValue("id_movement_aplication", targetId);
        if (targetId === 3 || targetId === 4) {
            const departmentsList: CatalogOption[] = departmentsHook.options || [];
            const defaultDept = departmentsList.find(
                (dept) => dept.name.trim().toLowerCase() === "departamento de centro de cómputo" ||
                    dept.name.trim().toLowerCase() === "departamento de centro de computo"
            );
            if (defaultDept) {
                setValue("selectedDepartment", defaultDept);
            } else {
                setValue("selectedDepartment", { id: "", name: "Departamento de Centro de Cómputo" });
            }
            setValue("selectedTicket", null);
        } else if (targetId === 2) {
            setValue("selectedDepartment", null);
            setValue("observations", "");
        }
    };

    useEffect(() => {
        const updatedQuantities = { ...currentQuantities };
        let changed = false;
        selectedItems.forEach((item) => {
            if (!updatedQuantities[item.id]) {
                updatedQuantities[item.id] = 1;
                changed = true;
            }
        });
        if (changed) {
            setValue("quantities", updatedQuantities);
        }
    }, [selectedItems, setValue, currentQuantities]);

    const onSubmitForm = (data: OutputFormValues) => {
        if (selectedItems.length === 0) return;
        pendingDataRef.current = data;
        setShowConfirmDialog(true);
    };

    const handleConfirmMovement = async () => {
        const pendingData = pendingDataRef.current;
        if (!pendingData) return;

        const itemsDto: ConsumableItemDto[] = selectedItems.map((item) => ({
            id_consumable: item.id,
            quantity_consumable: pendingData.quantities[item.id] || 1,
        }));

        const payload: CreateConsumableMovementDto = {
            id_movement_aplication: pendingData.id_movement_aplication,
            id_departament_consumable: pendingData.selectedDepartment?.id ? String(pendingData.selectedDepartment.id) : undefined,
            id_ticket: pendingData.id_movement_aplication === 2 ? String(pendingData.selectedTicket?.id) : undefined,
            observations: pendingData.observations.trim() || undefined,
            items: itemsDto,
        };

        try {
            await sileo.promise(
                new Promise((resolve, reject) => {
                    executeOutputMovement(payload, () => resolve(true)).catch(reject);
                }),
                {
                    loading: { title: t("consumableForm.loadingTitle") },
                    success: { title: t("consumableForm.successTitle") },
                    error: (err) => {
                        let dynamicDescription = t("consumableForm.errorUnexpected");
                        handleBackendErrors(
                            err,
                            setError,
                            [
                                { backendKeyword: "ticket", fieldPath: "selectedTicket" },
                                { backendKeyword: "departament", fieldPath: "selectedDepartment" },
                                { backendKeyword: "observations", fieldPath: "observations" },
                                { backendKeyword: "quantity", fieldPath: "quantities" },
                                { backendKeyword: "aplication", fieldPath: "id_movement_aplication" }
                            ],
                            (cleanMessage) => {
                                dynamicDescription = cleanMessage;
                            }
                        );
                        setShowConfirmDialog(false);
                        return {
                            title: t("consumableForm.errorInventoryTitle"),
                            description: dynamicDescription,
                            duration: 6000
                        };
                    }
                }
            );

            reset({
                id_movement_aplication: 2,
                selectedTicket: null,
                selectedDepartment: null,
                observations: "",
                quantities: {},
            });
            setShowConfirmDialog(false);
            pendingDataRef.current = null;
            onSuccess();
        } catch (e) {
            void e;
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmitForm)} className="w-full space-y-6">
                <div className="w-full rounded-xl overflow-hidden space-y-6">
                    <SelectedConsumablesCard
                        selectedItems={selectedItems}
                        currentQuantities={currentQuantities}
                        onRemoveItem={onRemoveItem}
                        onQuantityChange={(id, val) => setValue("quantities", { ...currentQuantities, [id]: val })}
                        onQuantityBlur={(id, item, val) => {
                            if (String(val).trim() === "" || val === undefined || val === null) {
                                setValue("quantities", {
                                    ...currentQuantities,
                                    [id]: item.available_stock > 0 ? 1 : 0
                                });
                            }
                        }}
                    />

                    <ConsumableDetailsFormCard
                        control={control}
                        watch={watch}
                        errors={errors}
                        ticketsHook={ticketsHook}
                        departmentsHook={departmentsHook}
                        isSubmitting={isSubmitting}
                        isItemsEmpty={selectedItems.length === 0}
                        onApplicationChange={handleApplicationChange}
                        onCancel={() => navigate("/consumables")}
                    />
                </div>
            </form>

            <MovementConfirmDialog
                isOpen={showConfirmDialog}
                onOpenChange={setShowConfirmDialog}
                selectedItems={selectedItems}
                quantities={currentQuantities}
                isSubmitting={isSubmitting}
                onConfirm={handleConfirmMovement}
            />
        </>
    );
};