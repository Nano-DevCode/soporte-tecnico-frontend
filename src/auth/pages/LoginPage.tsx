import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, AlertCircle, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { useAuthStore } from "../store/auth.store";
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Alert, AlertDescription } from "@/components/ui/alert"; 

interface Inputs {
  email: string;
  password: string;
}

export const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuthStore();
  
  const [posting, setPosting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null); 

  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({
    defaultValues: { email: '', password: '' }
  });

  const handleLogin = async (data: Inputs) => {
    setPosting(true);
    setErrorMsg(null);

    try {
      const isValid = await login(data.email, data.password);
      if (isValid) {
        navigate('/');
        return;
      }
      setErrorMsg(t("login_page_invalid_credentials"));
    } catch {
      setErrorMsg(t("error_server"));
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      <Card className="overflow-hidden border-none shadow-lg">
        <CardContent className="grid p-0 md:grid-cols-2">
          
          <form className="p-6 md:p-10" onSubmit={handleSubmit(handleLogin)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight">{t("title_app")}</h1>
                <p className="text-sm text-muted-foreground">{t("login_page_welcom")}</p>
              </div>

              {/* Mensaje de Error Superior */}
              {errorMsg && (
                <Alert variant="destructive" className="py-3 animate-in fade-in zoom-in duration-300">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs font-medium">
                    {errorMsg}
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">{t("email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="correo@example.com"
                    autoComplete="email"
                    className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                    {...register("email", {
                      required: t("requerid_email"),
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: t("requerid_email_format")
                      }
                    })}
                  />
                  {errors.email && (
                    <span className="text-[10px] text-destructive font-bold uppercase tracking-wider">
                      {errors.email.message}
                    </span>
                  )}
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">{t("password")}</Label>
                    <Link 
                      to='/auth/forgot-password' 
                      className="text-xs text-primary hover:underline underline-offset-4"
                    >
                      {t("login_page_recop_password")}
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    className={errors.password ? "border-destructive focus-visible:ring-destructive" : ""}
                    {...register("password", {
                      required: t("requerid_password")
                    })}
                  />
                  {errors.password && (
                    <span className="text-[10px] text-destructive font-bold uppercase tracking-wider">
                      {errors.password.message}
                    </span>
                  )}
                </div>

                <Button type="submit" className="w-full mt-2" disabled={posting}>
                  {posting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("login_page_login_loading")}
                    </>
                  ) : (
                    t("login")
                  )}
                </Button>
              </div>
            </div>
          </form>

          <div className="relative hidden bg-muted md:block">
            <img
              src="../public/logo.png"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <span>{t("made_with")}</span>
        <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500 animate-pulse" />
        <span className="font-medium">{t("by_made_center_computer_department")}</span>
      </div>
    </div>
  );
};