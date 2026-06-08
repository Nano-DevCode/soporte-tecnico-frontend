import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { sileo } from "sileo";
import { useNavigate } from "react-router";
import { isAxiosError } from "axios";
import { Wrench, Save, X, Image as ImageIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

import { useToolBrands } from "../hooks/useToolBrands";
import { useToolModels } from "../hooks/useToolModels";
import { useToolTypes } from "../hooks/useToolTypes";
import { InfiniteScrollSelect } from "../../components/custom/InfiniteScrollSelect";
import type { Tool } from "../interfaces/toolsResponse"; 
import type { BackendError } from "@/interfaces/backendError.interfaces";

export interface ToolFormValues {
  type: { id: string; name: string } | null;
  brand: { id: string; name: string } | null;
  model: { id: string; name: string } | null;
  idInternal: string;
  description: string;
  image: FileList | null;
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

  const [searchBrand, setSearchBrand] = useState("");
  const [debouncedBrand, setDebouncedBrand] = useState("");
  const [searchModel, setSearchModel] = useState("");
  const [debouncedModel, setDebouncedModel] = useState("");
  const [searchType, setSearchType] = useState("");
  const [debouncedType, setDebouncedType] = useState("");

  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.imageUrl || null);

  const form = useForm<ToolFormValues>({
    defaultValues: { 
      type: initialData?.type ? { id: initialData.type.id, name: initialData.type.name } : null,
      brand: initialData?.model?.brand ? { id: initialData.model.brand.id, name: initialData.model.brand.name } : null,
      model: initialData?.model ? { id: initialData.model.id, name: initialData.model.name } : null,
      idInternal: initialData?.idInternal ?? "",
      description: initialData?.description ?? "",
      image: null
    },
  });

  const selectedBrand = form.watch("brand");
  const selectedImage = form.watch("image");

  useEffect(() => {
    if (selectedImage && selectedImage.length > 0) {
      const file = selectedImage[0];
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (initialData?.imageUrl) {
      setPreviewUrl(initialData.imageUrl);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedImage, initialData]);

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

  const { toolBrands, fetchNextPage: fetchNextBrandPage, hasNextPage: hasNextBrandPage, isFetchingNextPage: isFetchingNextBrand, isLoading: isLoadingBrands, createBrand } = useToolBrands(debouncedBrand);
  const { toolModels, fetchNextPage: fetchNextModelPage, hasNextPage: hasNextModelPage, isFetchingNextPage: isFetchingNextModel, isLoading: isLoadingModels, createModel } = useToolModels(debouncedModel, selectedBrand?.id || "");
  const { toolTypes, fetchNextPage: fetchNextTypePage, hasNextPage: hasNextTypePage, isFetchingNextPage: isFetchingNextType, isLoading: isLoadingTypes, createType } = useToolTypes(debouncedType);

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
      form.setValue("brand", newBrandFromDB, { shouldValidate: true });
      form.setValue("model", null);
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
      form.setValue("model", newModelFromDB, { shouldValidate: true });
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
      form.setValue("type", newTypeFromDB, { shouldValidate: true });
      setSearchType(""); 
    } catch (error) { console.error(error); }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitCallback)} className="rounded-xl border border-border bg-card p-6 shadow-sm">
        
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
          
          <FormField
            control={form.control}
            name="type"
            rules={{ required: "Selecciona un tipo de herramienta" }}
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Tipo <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
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
                </FormControl>
                <FormMessage className="text-xs font-medium text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="brand"
            rules={{ required: "Selecciona una marca" }}
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Marca <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <InfiniteScrollSelect
                    options={toolBrands}
                    value={field.value}
                    onChange={(val) => {
                      field.onChange(val);
                      form.setValue("model", null);
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
                </FormControl>
                <FormMessage className="text-xs font-medium text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="model"
            rules={{ required: "Selecciona un modelo" }}
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Modelo <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
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
                </FormControl>
                <FormMessage className="text-xs font-medium text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="idInternal"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  ID Interno <span className="text-muted-foreground/50 font-normal normal-case ml-1">(Opcional)</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    {...field}
                    className="bg-muted/10 font-mono"
                    placeholder="Ej. HER-001"
                  />
                </FormControl>
                <FormMessage className="text-xs font-medium text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={() => (
              <FormItem className="space-y-2 sm:col-span-2">
                <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" /> Imagen de la Herramienta {!isEditMode && <span className="text-red-500">*</span>}
                </FormLabel>
                <FormControl>
                  <Label 
                    htmlFor="image-upload" 
                    className={cn(
                      "flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-primary/50 bg-primary/5 px-3 py-2 text-sm text-primary font-medium hover:bg-primary/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      form.formState.errors.image && "border-red-500 text-red-500 bg-red-500/5 border-solid"
                    )}
                  >
                    <ImageIcon className="h-4 w-4" />
                    Seleccionar foto de la herramienta
                    <Input 
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden" 
                      {...form.register("image", { 
                        required: !isEditMode ? "La imagen es obligatoria" : false,
                        validate: {
                          maxSize: (files) => {
                            if (!files || files.length === 0) return true;
                            return files[0].size <= 5 * 1024 * 1024 || "La imagen no puede superar los 5MB";
                          }
                        }
                      })}
                    />
                  </Label>
                </FormControl>
                <div className="flex flex-col gap-1">
                  <FormDescription className="text-[11px] text-muted-foreground">
                    Formatos soportados: JPG, PNG, WEBP (Máx. 5MB).
                  </FormDescription>
                  <FormMessage className="text-xs font-medium text-red-500" />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            rules={{ required: "Añade una breve descripción" }}
            render={({ field }) => (
              <FormItem className="sm:col-span-2 space-y-2">
                <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Descripción / Notas <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea 
                    {...field}
                    className="bg-muted/10 resize-none"
                    placeholder="Estado general de la herramienta, color, etc."
                    rows={3}
                  />
                </FormControl>
                <FormMessage className="text-xs font-medium text-red-500" />
              </FormItem>
            )}
          />

          {previewUrl && (
            <div className="sm:col-span-2 flex flex-col items-center justify-center pt-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Vista Previa de la Imagen
              </span>
              <div className={cn(
                "relative h-56 w-56 overflow-hidden rounded-xl border-2 border-dashed bg-muted/30 shadow-sm flex items-center justify-center p-2",
                form.formState.errors.image 
                  ? "border-red-500 bg-red-500/5" 
                  : "border-primary/20"
              )}>
                <img 
                  src={previewUrl} 
                  alt="Previsualización de herramienta" 
                  className="h-full w-full object-contain" 
                />
              </div>
            </div>
          )}

        </div>

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
    </Form>
  );
};