import { useCatalogFactory } from "./use-catalog-factory";

// Acciones de Marcas
import { getBrandConsumablesAction, getBrandConsumableByIdAction } from "../actions/get-brand-consumable.actions";
import { createBrandConsumableAction } from "../actions/post-brand-consumable.action copy";
// Acciones de Tipos
import { getTypeConsumablesAction, getTypeConsumableByIdAction } from "../actions/get-type-consumable.actions";
import { createTypeConsumableAction } from "../actions/post-type-consumable.action";

// Acciones de Ubicaciones
import { getUbicationConsumablesAction, getUbicationConsumableByIdAction } from "../actions/get-ubication-consumable.actions";
import { createUbicationConsumableAction } from "../actions/post-ubication-consumable.action";

import { getUnitMeasurementConsumablesAction, getUnitMeasurementConsumableByIdAction } from '../actions/get-unitMeasurement-consumable.actions';
import { getMovementTypesAction, getMovementTypeByIdAction } from "../actions/get-movement-type.actions";
import { getMovementAplicationsAction, getMovementApplicationByIdAction } from "../actions/get-movement-aplication.actions";
import { getTicketsAction, getTicketsByIdAction } from "../actions/get-ticket.actions";
import { getDepartmentsActions, getDepartmentByIdAction } from "../actions/get-departament.actions";
export const useUnitMeasurementConsumables = () =>
    useCatalogFactory({
        queryKey: "unit-measurements",
        dataKey: "units", // Mapea exactamente con el JSON de tu backend
        fetchFn: getUnitMeasurementConsumablesAction,
        getByIdFn: getUnitMeasurementConsumableByIdAction,
    })
export const useBrandConsumables = () =>
    useCatalogFactory({
        queryKey: "brands-cosumable",
        dataKey: "brands", // Mapea exactamente con el JSON de tu backend
        fetchFn: getBrandConsumablesAction,
        createFn: createBrandConsumableAction,
        getByIdFn: getBrandConsumableByIdAction,
    });

export const useTypeConsumables = () =>
    useCatalogFactory({
        queryKey: "types-consumable",
        dataKey: "types", // Mapea exactamente con el JSON de tu backend
        fetchFn: getTypeConsumablesAction,
        createFn: createTypeConsumableAction,
        getByIdFn: getTypeConsumableByIdAction,
    });

export const useUbicationConsumables = () =>
    useCatalogFactory({
        queryKey: "ubication-consumables",
        dataKey: "ubications", // Mapea exactamente con el JSON de tu backend
        fetchFn: getUbicationConsumablesAction,
        createFn: createUbicationConsumableAction,
        getByIdFn: getUbicationConsumableByIdAction,
    });

export const useMovementTypesConsumables = () =>
    useCatalogFactory({
        queryKey: "movement-types",
        dataKey: "movementTypes", // Mapea exactamente con el JSON de tu backend
        fetchFn: getMovementTypesAction,
        getByIdFn: getMovementTypeByIdAction,
    });

export const useMovementAplicationsConsumables = () =>
    useCatalogFactory({
        queryKey: "movement-aplications",
        dataKey: "aplications", // Mapea exactamente con el JSON de tu backend
        fetchFn: getMovementAplicationsAction,
        getByIdFn: getMovementApplicationByIdAction,
    });

export const useTicketsConsumables = () =>
    useCatalogFactory({
        queryKey: "tickets-comsumables",
        dataKey: "data", // Mapea exactamente con el JSON de tu backend
        fetchFn: getTicketsAction,
        getByIdFn: getTicketsByIdAction,
    });

export const useDepartmentsConsumables = () =>
    useCatalogFactory({
        queryKey: "departments",
        dataKey: "data", // Mapea exactamente con el JSON de tu backend
        fetchFn: getDepartmentsActions,
        getByIdFn: getDepartmentByIdAction,
    });
