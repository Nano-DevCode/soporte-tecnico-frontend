import { useState, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UploadCloud, X} from "lucide-react";
import { Button } from "@/components/ui/button";

export const ImageUploadField = ({ disabled }: { disabled?: boolean }) => {
  const { control } = useFormContext();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (val: File | null) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      // Guardamos el archivo en el formulario de React Hook Form
      onChange(file);
      // Creamos una URL local para mostrar la vista previa
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemove = (onChange: (val: File | null) => void) => {
    onChange(null);
    setPreviewUrl(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <FormField
      control={control}
      name="imageFile"
      render={({ field }) => (
        <FormItem className="w-full md:col-span-2">
          <FormLabel>Fotografía del Activo <span className="text-red-500">*</span></FormLabel>
          <FormControl>
            <div className="flex flex-col items-center justify-center w-full">
              {/* INPUT INVISIBLE */}
              <input
                type="file"
                accept="image/jpeg, image/png, image/webp"
                className="hidden"
                ref={inputRef}
                disabled={disabled}
                onChange={(e) => handleFileChange(e, field.onChange)}
              />

              {!previewUrl ? (
                // ZONA DE SUBIDA
                <div 
                  onClick={() => !disabled && inputRef.current?.click()}
                  className={`w-full flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                    disabled ? "bg-muted cursor-not-allowed opacity-60" : "border-primary/30 bg-primary/5 hover:bg-primary/10"
                  }`}
                >
                  <UploadCloud className="h-10 w-10 text-primary mb-3" />
                  <p className="text-sm font-medium text-foreground mb-1">
                    Haz clic para subir una imagen
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG o WEBP (Máx. 5MB)
                  </p>
                </div>
              ) : (
                // VISTA PREVIA DE LA IMAGEN
                <div className="relative w-full sm:w-1/2 rounded-lg overflow-hidden border border-border bg-muted/30 group">
                  <img 
                    src={previewUrl} 
                    alt="Vista previa" 
                    className="w-full h-auto object-contain max-h-60"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="sm"
                      disabled={disabled}
                      onClick={() => handleRemove(field.onChange)}
                      className="gap-2"
                    >
                      <X className="h-4 w-4" /> Eliminar foto
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};