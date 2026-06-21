import { Link, useNavigate } from "react-router";
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { isAxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Heart, ArrowLeft, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { useRecuperatePassword } from '../hooks/useRecuperatePassword';
import LogoIto from '@/assets/logo-SinFondo.png'

interface Forget {
  email: string;
}

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { mutate, isPending, error, isSuccess, reset } = useRecuperatePassword();

  const { register, handleSubmit, formState: { errors } } = useForm<Forget>({
    defaultValues: { email: '' }
  });

  const handleResetPassword = async(formData: Forget) => {
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    mutate(formData.email);
    await sleep(7000);
    navigate('/auth/login');
  };

  const apiErrorMsg = isAxiosError(error) 
    ? error.response?.data?.message 
    : error instanceof Error ? error.message : null;

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      <Card className="overflow-hidden border-none shadow-lg bg-card">
        <CardContent className="grid p-0 md:grid-cols-2">
          
          <form className="p-8 md:p-12" onSubmit={handleSubmit(handleResetPassword)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight">
                  {t("login_page_recop_password")}
                </h1>
                <p className="text-sm text-muted-foreground text-balance">
                  {t("login_page_instruction_recop")}
                </p>
              </div>

              {/* Mensaje de error */}
              {error && (
                <Alert className="py-3 border-red-200 bg-red-50 text-red-800 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400 animate-in fade-in zoom-in duration-300">
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-500" />
                  <AlertDescription className="text-xs font-medium">
                    {apiErrorMsg || t("error_server")}
                  </AlertDescription>
                </Alert>
              )}

              {/* Mensaje de exito */}
              {isSuccess && (
                <Alert className="py-3 border-green-200 bg-green-50 text-green-800 dark:bg-green-500/10 dark:border-green-500/20 dark:text-green-400 animate-in fade-in zoom-in duration-300">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
                  <AlertDescription className="text-xs font-medium">
                    {t("forget_password_success")}
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">{t("email")}</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="tu-correo@itoaxaca.edu.mx" 
                    {...register("email", {
                      onChange: () => { if(error || isSuccess) reset() },
                      required: t("requerid_email"),
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: t("requerid_email_format")
                      }
                    })}
                    className={`h-11 ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  />
                  {errors.email && (
                    <span className="text-[11px] text-destructive font-semibold tracking-wide mt-1 uppercase">
                      {errors.email.message}
                    </span>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11 mt-2 font-semibold" 
                  disabled={isPending || isSuccess}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("forget_password_sending")}
                    </>
                  ) : (
                    t("login_page_send_email_recop")
                  )}
                </Button>

                <div className="text-center mt-2">
                  <Link 
                    to="/auth/login" 
                    className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors hover:underline underline-offset-4"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    {t("login_page_back_to_login")}
                  </Link>
                </div>
              </div>
            </div>
          </form>
          

          <div className="relative hidden md:flex md:items-center md:justify-center p-12 lg:p-16">
            <img
              src={LogoIto} 
              alt="Centro de Cómputo"
              className="w-full max-w-70 h-auto object-contain transition-transform hover:scale-105 duration-500 mix-blend-multiply dark:mix-blend-plus-lighter"
            />
          </div>

        </CardContent>
      </Card>

      <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground pb-4">
        <span>{t("made_with")}</span>
        <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500 animate-pulse" />
        <span className="font-medium">{t("by_made_center_computer_department")}</span>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;