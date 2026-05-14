import { useCatalogFactory } from "./use-catalog-factory";

// --- IMPORTACIONES DE ACCIONES ---
import { getBrandsAction, getBrandByIdAction } from "../actions/get-brand.action";
import { getModelsByBrandAction, getModelByIdAction,  } from "../actions/get-model.action"; // Asegúrate de tener getModelByIdAction
import { getResponsiblesAction, getResponsibleByIdAction } from "../actions/get-responsables.action";
import { getEquipmentTypesAction, getEquipmentTypeByIdAction } from "../actions/get-equipmentType.action";
import { getProcessorsAction, getProcessorByIdAction } from "../actions/get-processor.action";
import { getComputerTypeEquipmentsAction, getComputerTypeEquipmentByIdAction } from "../actions/get-computertypeequipment.action";
import { getOperatingSystemsAction, getOperatingSystemByIdAction } from "../actions/get-operatingsystem.action";
import { getTypeStoragesAction, getTypeStorageByIdAction } from "../actions/get-typestorage.action";
import { getPrinterTypeFunctionAction, getPrintertypeFunctionByIdAction } from "../actions/get-printertypefuction.action";
import { getTypePrintingsAction, getTypePrintingByIdAction } from "../actions/get-typeprinting.action";
import { getNetworkTypesAction, getNetworkTypeByIdAction } from "../actions/get-networktype.action";
import { getDepartmentsAction, getDepartmentByIdAction } from "../actions/get-departaments.action";

import { createBrandAction } from "../actions/post-brand.action";
import { createModelAction } from "../actions/post-model.action"; // Corregido el path si era diferente
import { createResponsibleAction } from "../actions/post-responsable.action";
import { createProcessorAction } from "../actions/post-processor.action";
import { createComputerTypeEquipmentAction } from "../actions/post-computertypeequipment.action";
import { createOperatingSystemAction } from "../actions/post-operatingsystem.action";
import { createTypeStorageAction } from "../actions/post-typestorage.action";
import { createPrinterTypeFunctionAction } from "../actions/post-printertypefunction.action";
import { createTypePrintingAction } from "../actions/post-typeprinting.action";
import { createNetworkTypeAction } from "../actions/post-networktype.action";
import { createTypeEquipmentAction } from "../actions/post-typeequipment.action";

// 1. Catálogos Base
export const useBrands = () =>
    useCatalogFactory({ queryKey: "brands", fetchFn: getBrandsAction, createFn: createBrandAction, getByIdFn: getBrandByIdAction });

export const useResponsibles = () =>
    useCatalogFactory({ queryKey: "responsibles", fetchFn: getResponsiblesAction, createFn: createResponsibleAction, getByIdFn: getResponsibleByIdAction });

export const useProcessors = () =>
    useCatalogFactory({ queryKey: "processors", fetchFn: getProcessorsAction, createFn: createProcessorAction, getByIdFn: getProcessorByIdAction });

// 2. Modelos (Ajuste en fetchFn y getByIdFn)
export const useModels = (brandId: string) =>
    useCatalogFactory({ 
        queryKey: `models-${brandId}`, 
        fetchFn: () => getModelsByBrandAction(brandId), 
        createFn: (data) => createModelAction(data, brandId),
        getByIdFn: getModelByIdAction, // Debe ser una acción que reciba solo el ID del modelo
        enabled: !!brandId,
    });

// 3. Catálogos de Cómputo
export const useComputerTypes = () =>
    useCatalogFactory({ queryKey: "computer-types", fetchFn: getComputerTypeEquipmentsAction, createFn: createComputerTypeEquipmentAction, getByIdFn: getComputerTypeEquipmentByIdAction });

export const useOperatingSystems = () =>
    useCatalogFactory({ queryKey: "os", fetchFn: getOperatingSystemsAction, createFn: createOperatingSystemAction, getByIdFn: getOperatingSystemByIdAction });

export const useStorageTypes = () =>
    useCatalogFactory({ queryKey: "storage-types", fetchFn: getTypeStoragesAction, createFn: createTypeStorageAction, getByIdFn: getTypeStorageByIdAction });

// 4. Catálogos de Impresión y Red
export const usePrinterFunctions = () =>
    useCatalogFactory({ queryKey: "printer-functions", fetchFn: getPrinterTypeFunctionAction, createFn: createPrinterTypeFunctionAction, getByIdFn: getPrintertypeFunctionByIdAction });

export const usePrintingTypes = () =>
    useCatalogFactory({ queryKey: "printing-types", fetchFn: getTypePrintingsAction, createFn: createTypePrintingAction, getByIdFn: getTypePrintingByIdAction });

export const useNetworkTypes = () =>
    useCatalogFactory({ queryKey: "network-types", fetchFn: getNetworkTypesAction, createFn: createNetworkTypeAction, getByIdFn: getNetworkTypeByIdAction });

// 5. Otros
export const useEquipmentTypes = () =>
    useCatalogFactory({ queryKey: "equipment-types", fetchFn: getEquipmentTypesAction, createFn: createTypeEquipmentAction, getByIdFn: getEquipmentTypeByIdAction });

export const useDepartments = () =>
    useCatalogFactory({ queryKey: "departments", fetchFn: getDepartmentsAction, getByIdFn: getDepartmentByIdAction });