import { CheckCircle2, FileClock, Zap } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from 'react-i18next';

export const CustomBenefitsCards = () => {
  const { t } = useTranslation();
  
  return (
    <section className="border-t border-border/40 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        
        {/* Encabezado */}
        <div className="mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("custom_benefits_card_main_caracteristics", "Características Principales")}
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3 lg:gap-10">

          <Card className="border-border/50 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900/50 bg-card">
            <CardHeader className="pb-4">
              <div className="mb-3 w-fit rounded-xl bg-blue-100/80 p-3 dark:bg-blue-900/40 shadow-sm">
                <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-xl font-semibold text-foreground">
                {t("custom_benefits_card_ez_fast", "Fácil y Rápido")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                {t("custom_benefist_card_create_solicitud", "Crea tus solicitudes de soporte técnico en cuestión de segundos.")}
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900/50 bg-card">
            <CardHeader className="pb-4">
              <div className="mb-3 w-fit rounded-xl bg-blue-100/80 p-3 dark:bg-blue-900/40 shadow-sm">
                <CheckCircle2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-xl font-semibold text-foreground">
                {t("custom_benefist_card_follow_trasnparent", "Seguimiento Transparente")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                {t("custom_benefist_card_monitoring_progress", "Monitorea el progreso de tus reportes en tiempo real sin complicaciones.")}
              </p>
            </CardContent>
          </Card>

          {/* Tarjeta 3 */}
          <Card className="border-border/50 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900/50 bg-card">
            <CardHeader className="pb-4">
              <div className="mb-3 w-fit rounded-xl bg-blue-100/80 p-3 dark:bg-blue-900/40 shadow-sm">
                <FileClock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-xl font-semibold text-foreground">
                {t("custom_benefist_card_historial", "Historial Completo")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                {t("custom_benefist_card_register_follow", "Mantén un registro detallado de todas tus interacciones y soluciones.")}
              </p>
            </CardContent>
          </Card>

        </div>
      </div>
    </section>
  )
}