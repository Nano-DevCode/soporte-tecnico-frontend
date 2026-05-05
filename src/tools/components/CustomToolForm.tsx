import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { sileo } from "sileo";
import { useNavigate } from "react-router";
import { isAxiosError } from "axios";

// Iconos y UI
import { Wrench, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Hooks y Componentes
import { useToolBrands } from "../hooks/useToolBrands";
import { useToolModels } from "../hooks/useToolModels";
import { useToolTypes } from "../hooks/useToolTypes";
import { InfiniteScrollSelect } from "./infinite-scroll-select";

// Interfaces
import type { Tool } from "../interfaces/toolsResponse"; 
import type { BackendError } from "@/interfaces/backendError.interfaces";

export interface ToolFormValues {
  type: { id: string; name: string } | null;
  brand: { id: string; name: string } | null;
  model: { id: string; name: string } | null;
  quantity: number;
  description: string;
}

interface CustomToolFormProps {
  mode: "create" | "update";
  initialData?: Tool;
  onSubmitCallback: (data: ToolFormValues) => Promise<void>;
  isMutating: boolean;
}

export const CustomToolForm = ({ mode, initialData, onSubmitCallback, isMutating }: CustomToolFormProps) => {
  const navigate = useNavigate();
  const isEditMode = mode === "update";

  // Estados de Búsqueda
  const [searchBrand, setSearchBrand] = useState("");
  const [debouncedBrand, setDebouncedBrand] = useState("");
  const [searchModel, setSearchModel] = useState("");
  const [debouncedModel, setDebouncedModel] = useState("");
  const [searchType, setSearchType] = useState("");
  const [debouncedType, setDebouncedType] = useState("");

  const { control, handleSubmit, setValue, watch, register, formState: { errors } } = useForm<ToolFormValues>({
    defaultValues: { 
      type: initialData?.type ? { id: initialData.type.id, name: initialData.type.name } : null,
      brand: initialData?.model?.brand ? { id: initialData.model.brand.id, name: initialData.model.brand.name } : null,
      model: initialData?.model ? { id: initialData.model.id, name: initialData.model.name } : null,
      quantity: initialData?.quantity ?? 1, 
      description: initialData?.description ?? "" 
    },
  });

  const selectedBrand = watch("brand");

  // Debounces
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedBrand(searchBrand), 250);
    return () => clearTimeout(handler);
  }, [searchBrand]);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedModel(searchModel), 250);
    return () => clearTimeout(handler);
  }, [searchModel]);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedType(searchType), 250);
    return () => clearTimeout(handler);
  }, [searchType]);

  // Hooks de Catálogos
  const { toolBrands, fetchNextPage: fetchNextBrandPage, hasNextPage: hasNextBrandPage, isFetchingNextPage: isFetchingNextBrand, isLoading: isLoadingBrands, createBrand } = useToolBrands(debouncedBrand);
  const { toolModels, fetchNextPage: fetchNextModelPage, hasNextPage: hasNextModelPage, isFetchingNextPage: isFetchingNextModel, isLoading: isLoadingModels, createModel } = useToolModels(debouncedModel, selectedBrand?.id || "");
  const { toolTypes, fetchNextPage: fetchNextTypePage, hasNextPage: hasNextTypePage, isFetchingNextPage: isFetchingNextType, isLoading: isLoadingTypes, createType } = useToolTypes(debouncedType);

  // --- Handlers de Creación Rápida ---
  const handleCreateBrand = async (newBrandName: string) => {
    const payload = { name: newBrandName.trim() };
    try {
      const newBrandFromDB = await sileo.promise(createBrand(payload), {
        loading: { title: "Creando marca..." },
        success: { title: "¡Marca creada!", description: `La marca "${payload.name}" se guardó correctamente.`, duration: 4000 },
        error: (err) => { 
          let backendMessage = "Revisa los datos e intenta de nuevo.";
          if (isAxiosError<BackendError>(err) && err.response?.data?.message) {
            backendMessage = Array.isArray(err.response.data.message) ? err.response.data.message[0] : err.response.data.message;
          }
          return { title: "Error al crear", description: backendMessage, duration: 5000 };
        }
      });
      setValue("brand", newBrandFromDB, { shouldValidate: true });
      setValue("model", null);
      setSearchBrand("");
    } catch (error) { console.error(error); }
  };

  const handleCreateModel = async (newModelName: string) => {
    if (!selectedBrand) return sileo.error({ title: "Error", description: "Debes seleccionar una marca primero." });
    const payload = { name: newModelName.trim(), brandId: selectedBrand.id };
    try {
      const newModelFromDB = await sileo.promise(createModel(payload), {
        loading: { title: "Creando modelo..." },
        success: { title: "¡Modelo creado!", description: `El modelo "${payload.name}" se guardó correctamente.`, duration: 4000 },
        error: (err) => { 
          let backendMessage = "Revisa los datos e intenta de nuevo.";
          if (isAxiosError<BackendError>(err) && err.response?.data?.message) {
            backendMessage = Array.isArray(err.response.data.message) ? err.response.data.message[0] : err.response.data.message;
          }
          return { title: "Error al crear", description: backendMessage, duration: 5000 };
        }
      });
      setValue("model", newModelFromDB, { shouldValidate: true });
      setSearchModel("");
    } catch (error) { console.error(error); }
  };

  const handleCreateType = async (newTypeName: string) => {
    const payload = { name: newTypeName.trim() };
    try {
      const newTypeFromDB = await sileo.promise(createType(payload), {
        loading: { title: "Creando tipo..." },
        success: { title: "¡Tipo creado!", description: `El tipo de herramienta "${payload.name}" se guardó correctamente.`, duration: 4000 },
        error: (err) => { 
          let backendMessage = "Revisa los datos e intenta de nuevo.";
          if (isAxiosError<BackendError>(err) && err.response?.data?.message) {
            backendMessage = Array.isArray(err.response.data.message) ? err.response.data.message[0] : err.response.data.message;
          }
          return { title: "Error al crear", description: backendMessage, duration: 5000 };
        }
      });
      setValue("type", newTypeFromDB, { shouldValidate: true });
      setSearchType(""); 
    } catch (error) { console.error(error); }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitCallback)} className="rounded-xl border border-border bg-card p-6 shadow-sm">
      
      {/* ENCABEZADO DINÁMICO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Wrench className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-foreground leading-none">
              {isEditMode ? "Editar Herramienta" : "Nueva Herramienta"}
            </h3>
            <p className="text-sm font-medium text-muted-foreground">
              {isEditMode 
                ? "Modifica los detalles de la herramienta seleccionada."
                : "Ingresa los datos para registrar una nueva herramienta."}
            </p>
          </div>
        </div>
      </div>

      {/* CAMPOS DEL FORMULARIO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
        
        {/* Tipo */}
        <div className="space-y-2">
          <Label className={cn("text-xs font-bold uppercase tracking-wider text-muted-foreground", errors.type && "text-red-500")}>
            Tipo <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="type"
            control={control}
            rules={{ required: "Selecciona un tipo de herramienta" }}
            render={({ field }) => (
              <InfiniteScrollSelect
                options={toolTypes}
                value={field.value}
                onChange={field.onChange}
                onSearch={setSearchType}
                fetchNextPage={fetchNextTypePage}
                hasNextPage={!!hasNextTypePage}
                isFetchingNextPage={isFetchingNextType}
                isLoading={isLoadingTypes}
                placeholder="Buscar o crear tipo..."
                allowCreate={true}
                onCreate={handleCreateType}
              />
            )}
          />
          {errors.type && <p className="text-xs font-medium text-red-500">{errors.type.message}</p>}
        </div>

        {/* Marca */}
        <div className="space-y-2">
          <Label className={cn("text-xs font-bold uppercase tracking-wider text-muted-foreground", errors.brand && "text-red-500")}>
            Marca <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="brand"
            control={control}
            rules={{ required: "Selecciona una marca" }}
            render={({ field }) => (
              <InfiniteScrollSelect
                options={toolBrands}
                value={field.value}
                onChange={(val) => {
                  field.onChange(val);
                  setValue("model", null); // Limpieza segura
                }}
                onSearch={setSearchBrand}
                fetchNextPage={fetchNextBrandPage}
                hasNextPage={!!hasNextBrandPage}
                isFetchingNextPage={isFetchingNextBrand}
                isLoading={isLoadingBrands}
                placeholder="Buscar o crear marca..."
                allowCreate={true}
                onCreate={handleCreateBrand}
              />
            )}
          />
          {errors.brand && <p className="text-xs font-medium text-red-500">{errors.brand.message}</p>}
        </div>

        {/* Modelo */}
        <div className="space-y-2">
          <Label className={cn("text-xs font-bold uppercase tracking-wider text-muted-foreground", errors.model && "text-red-500")}>
            Modelo <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="model"
            control={control}
            rules={{ required: "Selecciona un modelo" }}
            render={({ field }) => (
              <InfiniteScrollSelect
                disabled={!selectedBrand} 
                options={toolModels}
                value={field.value}
                onChange={field.onChange}
                onSearch={setSearchModel}
                fetchNextPage={fetchNextModelPage}
                hasNextPage={!!hasNextModelPage}
                isFetchingNextPage={isFetchingNextModel}
                isLoading={isLoadingModels}
                placeholder={selectedBrand ? "Buscar o crear modelo..." : "Selecciona una marca primero"}
                allowCreate={true}
                onCreate={handleCreateModel}
              />
            )}
          />
          {errors.model && <p className="text-xs font-medium text-red-500">{errors.model.message}</p>}
        </div>

        {/* Cantidad */}
        <div className="space-y-2">
          <Label htmlFor="quantity" className={cn("text-xs font-bold uppercase tracking-wider text-muted-foreground", errors.quantity && "text-red-500")}>
            Cantidad <span className="text-red-500">*</span>
          </Label>
          <Input 
            id="quantity"
            type="number"
            min={1}
            className={cn("bg-muted/10", errors.quantity && "border-red-500 focus-visible:ring-red-500")}
            {...register("quantity", { 
              required: "La cantidad es obligatoria", 
              min: { value: 1, message: "La cantidad debe ser al menos 1" } 
            })}
            placeholder="Ej. 5"
          />
          {errors.quantity && <p className="text-xs font-medium text-red-500">{errors.quantity.message}</p>}
        </div>

        {/* Descripción / Notas */}
        <div className="sm:col-span-2 space-y-2">
          <Label htmlFor="description" className={cn("text-xs font-bold uppercase tracking-wider text-muted-foreground", errors.description && "text-red-500")}>
            Descripción / Notas <span className="text-red-500">*</span>
          </Label>
          <Textarea 
            id="description"
            className={cn("bg-muted/10 resize-none", errors.description && "border-red-500 focus-visible:ring-red-500")}
            {...register("description", { required: "Añade una breve descripción" })}
            placeholder="Estado general de la herramienta, color, etc."
            rows={3}
          />
          {errors.description && <p className="text-xs font-medium text-red-500">{errors.description.message}</p>}
        </div>

      </div>

      {/* BOTONES FINALES */}
      <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3 border-t border-border pt-6">
        <Button  
          type="button" 
          variant="outline" 
          onClick={() => navigate('/tools')}
          className="w-full sm:w-auto"
          disabled={isMutating}
        >
          <X className="mr-2 h-4 w-4" /> Cancelar
        </Button>
        
        <Button 
          type="submit" 
          className="w-full sm:w-auto bg-blue-700 hover:bg-blue-800 text-white"
          disabled={isMutating} 
        >
          <Save className="mr-2 h-4 w-4" />
          {isMutating 
            ? (isEditMode ? "Actualizando..." : "Guardando...") 
            : (isEditMode ? "Guardar Cambios" : "Guardar Herramienta")}
        </Button>
      </div>
    </form>
  );
};