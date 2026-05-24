import { useCatalogFactory } from "./use-catalog-factory";

// --- IMPORTACIONES DE ACCIONES ---
import { getBrandsAction, getBrandByIdAction } from "../actions/get-brand.action";
import { getModelsByBrandAction, getModelByIdAction } from "../actions/get-model.action"; 
import { getResponsiblesAction, getResponsibleByIdAction } from "../actions/get-responsables.action";
import { getEquipmentTypesAction, getEquipmentTypeByIdAction } from "../actions/get-equipmentType.action";
import { getProcessorsAction, getProcessorByIdAction } from "../actions/get-processor.action";
import { getComputerTypeEquipmentsAction, getComputerTypeEquipmentByIdAction } from "../actions/get-computertypeequipment.action";
import { getOperatingSystemsAction, getOperatingSystemByIdAction } from "../actions/get-operatingsystem.action";
import { getTypeStoragesAction, getTypeStorageByIdAction } from "../actions/get-typestorage.action";
import { getPrinterTypeFunctionAction, getPrinterTypeFunctionByIdAction } from "../actions/get-printertypefuction.action";
import { getTypePrintingsAction, getTypePrintingByIdAction } from "../actions/get-typeprinting.action";
import { getNetworkTypesAction, getNetworkTypeByIdAction } from "../actions/get-networktype.action";
import { getDepartmentByIdAction, getDepartmentsActions } from "../actions/get-departaments.action";

import { createBrandAction } from "../actions/post-brand.action";
import { createModelAction } from "../actions/post-model.action"; 
import { createResponsibleAction } from "../actions/post-responsable.action";
import { createProcessorAction } from "../actions/post-processor.action";
import { createComputerTypeEquipmentAction } from "../actions/post-computertypeequipment.action";
import { createOperatingSystemAction } from "../actions/post-operatingsystem.action";
import { createTypeStorageAction } from "../actions/post-typestorage.action";
import { createPrinterTypeFunctionAction } from "../actions/post-printertypefunction.action";
import { createTypePrintingAction } from "../actions/post-typeprinting.action";
import { createNetworkTypeAction } from "../actions/post-networktype.action";
import { createTypeEquipmentAction } from "../actions/post-typeequipment.action";

export const useBrands = () =>
  useCatalogFactory({ queryKey: "brands", dataKey: "brands", fetchFn: getBrandsAction, createFn: createBrandAction, getByIdFn: getBrandByIdAction });

export const useResponsibles = () =>
  useCatalogFactory({ queryKey: "responsibles", dataKey: "responsibleEquipments", fetchFn: getResponsiblesAction, createFn: createResponsibleAction, getByIdFn: getResponsibleByIdAction });

export const useProcessors = () =>
  useCatalogFactory({ queryKey: "processors", dataKey: "processors", fetchFn: getProcessorsAction, createFn: createProcessorAction, getByIdFn: getProcessorByIdAction });

export const useModels = (brandId: string) =>
  useCatalogFactory({
    queryKey: `models-${brandId}`,
    dataKey: "models", 
    fetchFn: (args) => getModelsByBrandAction(brandId, args),
    createFn: (data) => {
      const modelName = typeof data === "string" ? data : data.name;
      return createModelAction({ name: modelName }, brandId);
    },
    getByIdFn: getModelByIdAction, 
    enabled: !!brandId,
  });
export const useComputerTypes = () =>
  useCatalogFactory({ queryKey: "computerequipmenttypes", dataKey: "equipmentTypes", fetchFn: getComputerTypeEquipmentsAction, createFn: createComputerTypeEquipmentAction, getByIdFn: getComputerTypeEquipmentByIdAction });

export const useOperatingSystems = () =>
  useCatalogFactory({ queryKey: "os", dataKey: "operatingSystems", fetchFn: getOperatingSystemsAction, createFn: createOperatingSystemAction, getByIdFn: getOperatingSystemByIdAction });

export const useStorageTypes = () =>
  useCatalogFactory({ queryKey: "storage-types", dataKey: "storageTypes", fetchFn: getTypeStoragesAction, createFn: createTypeStorageAction, getByIdFn: getTypeStorageByIdAction });

export const usePrinterFunctions = () =>
  useCatalogFactory({ queryKey: "printer-functions", dataKey: "printerFunctions", fetchFn: getPrinterTypeFunctionAction, createFn: createPrinterTypeFunctionAction, getByIdFn: getPrinterTypeFunctionByIdAction });

export const usePrintingTypes = () =>
  useCatalogFactory({ queryKey: "printing-types", dataKey: "printingTypes", fetchFn: getTypePrintingsAction, createFn: createTypePrintingAction, getByIdFn: getTypePrintingByIdAction });

export const useNetworkTypes = () =>
  useCatalogFactory({ queryKey: "network-types", dataKey: "typeNetworks", fetchFn: getNetworkTypesAction, createFn: createNetworkTypeAction, getByIdFn: getNetworkTypeByIdAction });

export const useEquipmentTypes = () =>
  useCatalogFactory({ queryKey: "equipment-types", dataKey: "equipmentTypes", fetchFn: getEquipmentTypesAction, createFn: createTypeEquipmentAction, getByIdFn: getEquipmentTypeByIdAction });

export const useDepartments = () =>
    useCatalogFactory({ queryKey: "departments-catalog", dataKey: "data", fetchFn: getDepartmentsActions, getByIdFn: getDepartmentByIdAction });
