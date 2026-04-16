import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { KeyRound, Eye, EyeOff, ShieldAlert, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useChangedPassword } from "../hooks/useChangedPassword";
import { useAuthStore } from "@/auth/store/auth.store";

interface ChangePasswordInputs {
  password: string;
  confirmPassword: string;
}

export const CustomPasswordConfiguration = () => {
  const { t } = useTranslation();
  
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); 
  
  const { mutate, isPending } = useChangedPassword();
  const { user, logout } = useAuthStore();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ChangePasswordInputs>({
    defaultValues: { 
      password: '',
      confirmPassword: ''
    },
    mode: "onChange" // Opcional: para validar mientras el usuario escribe
  });

  const passwordValue = watch("password");

  // Expresión regular traída de tu Backend
  const passwordRegex = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

  const handleResetPassword = async(formData: ChangePasswordInputs) => {
    if(!user?.id) return;
    
    mutate(formData.password, {
      onSuccess: () => {
        logout();
      }
    });
  };

  return (
    <Card className="shadow-sm overflow-hidden">
      <CardHeader className="border-b bg-muted/30 pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-muted-foreground" />
          {t("custom_password_configuration_title")}
        </CardTitle>
        <CardDescription>
          {t("custom_password_configuration_description")}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-5 md:p-6">
        <form id="password-form" className="max-w-md space-y-5" onSubmit={handleSubmit(handleResetPassword)}>
          
          <div className="grid gap-2">
            <Label className="text-sm font-medium" htmlFor="password">
              {t("custom_password_configuration_new_password")}
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showNew ? "text" : "password"}
                className={`pr-10 h-11 bg-muted/20 transition-colors ${
                  errors.password ? "border-destructive focus-visible:ring-destructive" : "focus:bg-background"
                }`}
                {...register("password", {
                  required: t("custom_password_configuration_required_new_password"),
                  minLength: {
                    value: 8, // Actualizado a 8 según tu DTO
                    message: t("custom_password_configuration_min_length_new_password")
                  },
                  maxLength: {
                    value: 50,
                    message: t("custom_password_configuration_max_length_new_password")
                  },
                  pattern: {
                    value: passwordRegex,
                    message: t("custom_password_configuration_not_match_with_regex")
                  }
                })}
              />
              <button
                type="button"
                className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <span className="text-[10px] text-destructive font-bold uppercase tracking-wider">
                {errors.password.message}
              </span>
            )}
          </div>

          <div className="grid gap-2">
            <Label className="text-sm font-medium" htmlFor="confirmPassword">
              {t("custom_password_configuration_confirm_new_password")}
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"} 
                className={`pr-10 h-11 bg-muted/20 transition-colors ${
                  errors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : "focus:bg-background"
                }`}
                {...register("confirmPassword", {
                  required: t("custom_password_configuration_confirm_new_password"),
                  validate: (value) => 
                    value === passwordValue || t("custom_password_configuration_not_match_new_password")
                })}
              />
              <button
                type="button"
                className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="text-[10px] text-destructive font-bold uppercase tracking-wider">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
        </form>
      </CardContent>

      <div className="px-5 md:px-6 py-4 bg-muted/30 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-xs text-muted-foreground flex items-center gap-1.5 w-full sm:w-auto">
          <ShieldAlert className="h-4 w-4 shrink-0 text-amber-500" /> 
          {t("custom_password_configuration_requireds")}
        </p>

        <Button 
          type="submit" 
          form="password-form" 
          className="w-full sm:w-auto shadow-sm"
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <KeyRound className="mr-2 h-4 w-4" />
          )}
          {t("custom_password_configuration_new_password")}
        </Button>
      </div>
    </Card>
  );
};