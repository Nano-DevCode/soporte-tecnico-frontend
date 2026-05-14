import { useCatalogFactory } from "./use-catalog-factory";

// --- IMPORTACIONES DE ACCIONES ---
import { getBrandsAction } from "../actions/get-brand.action";
import { getModelsByBrandAction } from "../actions/get-model.action";
import { getResponsiblesAction } from "../actions/get-responsables.action";
import { getEquipmentTypesAction } from "../actions/get-equipmentType.action";
import { getProcessorsAction } from "../actions/get-processor.action";
import { getComputerTypeEquipmentsAction } from "../actions/get-computertypeequipment.action";
import { getOperatingSystemsAction } from "../actions/get-operatingsystem.action";
import { getTypeStoragesAction } from "../actions/get-typestorage.action";
import { getPrinterTypeFunctionAction } from "../actions/get-printertypefuction.action";
import { getTypePrintingsAction } from "../actions/get-typeprinting.action";
import { getNetworkTypesAction } from "../actions/get-networktype.action";
import { getDepartmentsAction } from "../actions/get-departaments.action";

import { createBrandAction } from "../actions/post-brand.action";
import { createModelAction } from "../actions/get-model.action"; 
import { createResponsibleAction } from "../actions/post-responsable.action";
import { createProcessorAction } from "../actions/post-processor.action";
import { createComputerTypeEquipmentAction } from "../actions/post-computertypeequipment.action";
import { createOperatingSystemAction } from "../actions/post-operatingsystem.action";
import { createTypeStorageAction } from "../actions/post-typestorage.action";
import { createPrinterTypeFunctionAction } from "../actions/post-printertypefunction.action";
import { createTypePrintingAction } from "../actions/post-typeprinting.action";
import { createNetworkTypeAction } from "../actions/post-networktype.action";
import { createTypeEquipmentAction} from "../actions/post-typeequipment.action";


// 1. Catálogos Base (Simplificados: pasamos la acción directamente)
export const useBrands = () =>
    useCatalogFactory({ queryKey: "brands", fetchFn: getBrandsAction, createFn: createBrandAction });

export const useResponsibles = () =>
    useCatalogFactory({ queryKey: "responsibles", fetchFn: getResponsiblesAction, createFn: createResponsibleAction });

export const useProcessors = () =>
    useCatalogFactory({ queryKey: "processors", fetchFn: getProcessorsAction, createFn: createProcessorAction });

// 2. Modelos (Mantiene el closure para el brandId)
export const useModels = (brandId: string) =>
    useCatalogFactory({ 
        queryKey: `models-${brandId}`, 
        fetchFn: () => getModelsByBrandAction(brandId), 
        createFn: (data) => createModelAction(data, brandId),
        enabled: !!brandId
    });

// 3. Catálogos de Cómputo
export const useComputerTypes = () =>
    useCatalogFactory({ queryKey: "computer-types", fetchFn: getComputerTypeEquipmentsAction, createFn: createComputerTypeEquipmentAction });

export const useOperatingSystems = () =>
    useCatalogFactory({ queryKey: "os", fetchFn: getOperatingSystemsAction, createFn: createOperatingSystemAction });

export const useStorageTypes = () =>
    useCatalogFactory({ queryKey: "storage-types", fetchFn: getTypeStoragesAction, createFn: createTypeStorageAction });

// 4. Catálogos de Impresión y Red
export const usePrinterFunctions = () =>
    useCatalogFactory({ queryKey: "printer-functions", fetchFn: getPrinterTypeFunctionAction, createFn: createPrinterTypeFunctionAction });

export const usePrintingTypes = () =>
    useCatalogFactory({ queryKey: "printing-types", fetchFn: getTypePrintingsAction, createFn: createTypePrintingAction });

export const useNetworkTypes = () =>
    useCatalogFactory({ queryKey: "network-types", fetchFn: getNetworkTypesAction, createFn: createNetworkTypeAction });

// 5. Otros
export const useEquipmentTypes = () =>
    useCatalogFactory({ queryKey: "equipment-types", fetchFn: getEquipmentTypesAction, createFn: createTypeEquipmentAction});

export const useDepartments = () =>
    useCatalogFactory({ queryKey: "departments", fetchFn: getDepartmentsAction });