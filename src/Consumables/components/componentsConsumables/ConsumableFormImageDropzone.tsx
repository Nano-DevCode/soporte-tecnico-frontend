import React from "react";
import type { UseFormRegister, FieldValues } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ImageIcon, AlertCircle, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";
import { t } from "i18next";

interface ImageDropzoneProps {
    register: UseFormRegister<FieldValues>;
    previewUrl: string | null;
    isEditMode: boolean;
    disabled?: boolean;
    error?: { message?: string };
}

export const ConsumableImageDropzone: React.FC<ImageDropzoneProps> = ({
    register,
    previewUrl,
    // isEditMode,
    disabled,
    error
}) => (
    <div className="lg:col-span-1 flex flex-col justify-start space-y-2.5">
        <Label className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-2">
            {/* <ImageIcon className="h-3.5 w-3.5" /> {t("consumables.form.label_image")} {!isEditMode && <span className="text-destructive">*</span>} */}
            <ImageIcon className="h-3.5 w-3.5" /> {t("consumables.form.label_image")}
        </Label>

        <div className="relative group w-full aspect-square max-w-[260px] mx-auto lg:max-w-none">
            <Label
                htmlFor="image-upload"
                className={cn(
                    "relative flex flex-col h-full w-full cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/20 bg-muted/30 p-4 text-center transition-all hover:bg-muted/50 hover:border-primary/40 overflow-hidden select-none",
                    previewUrl && "border-solid border-border bg-background p-1.5 shadow-sm hover:bg-background",
                    // error && "border-destructive bg-destructive/5 text-destructive",
                    disabled && "opacity-50 cursor-not-allowed pointer-events-none"
                )}
            >
                {previewUrl ? (
                    <div className="relative h-full w-full rounded-lg overflow-hidden bg-zinc-50 flex items-center justify-center">
                        <img src={previewUrl} alt="Preview" className="h-full w-full object-contain p-1 transition-transform group-hover:scale-[1.02] duration-200" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 text-white text-xs font-medium transition-opacity duration-200">
                            <UploadCloud size={20} className="transition-transform duration-200 group-hover:-translate-y-1 ease-out" />
                            <span>{t("consumables.form.image_replace")}</span>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground py-6">
                        <div className="p-3 rounded-full bg-background border shadow-xs text-muted-foreground/70 group-hover:text-primary transition-colors">
                            <UploadCloud size={22} className="transition-transform duration-200 group-hover:-translate-y-0.5" />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-xs font-bold text-foreground">{t("consumables.form.image_upload")}</p>
                            <p className="text-[10px] text-muted-foreground/80 font-normal">{t("consumables.form.image_formats")}</p>
                        </div>
                    </div>
                )}

                <Input
                    id="image-upload"
                    type="file"
                    // accept="image/*"
                    accept="image/jpeg, image/png, image/webp"
                    disabled={disabled}
                    className="hidden"
                    {...register("consumable.imageUrl", 
                        // {required: !isEditMode ? t("consumables.form.error_required_image") : false}
                )}
                />
            </Label>
        </div>

        {error?.message && (
            <p className="text-xs font-medium text-destructive mt-1 flex items-center gap-1.5 justify-center lg:justify-start">
                <AlertCircle size={13} /> {error.message}
            </p>
        )}
    </div>
);