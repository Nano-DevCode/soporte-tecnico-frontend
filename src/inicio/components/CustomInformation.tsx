import { Link } from "react-router";
import { ArrowRight, Headset, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';
import { Can } from "@/common/permission/Can";

export const CustomInformation = () => {
  const { t } = useTranslation();

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-11 sm:px-6 lg:px-8 animate-in fade-in duration-500">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-8">

        {/* === Textos Hero === */}
        <div className="space-y-8">
          <div className="space-y-4">
            {/* Cambiado text-slate-900 a text-foreground */}
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {t("custom_information_welcome")}
            </h1>
            {/* Cambiado text-slate-600 a text-muted-foreground */}
            <p className="text-xl font-medium text-muted-foreground">
              {t("custom_information_departament")}
            </p>
          </div>

          <p className="text-lg leading-8 text-muted-foreground">
            {t("custom_information_description")}
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            {/* Mover la clase w-full al Link ayuda a que el botón tome el tamaño correcto en móvil */}
            <Can permission="WATCH_TICKET_LIST">
              <Link to="/tickets" className="w-full sm:w-auto">
                <Button size="lg" className="w-full shadow-sm">
                  {t("custom_information_see_solicitud")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </Can>

            <Can permission="CREATE_TICKET">
              <Link to="/tickets/new" className="w-full sm:w-auto">
                {/* Quitamos bg-transparent para que use el fondo adaptativo del outline */}
                <Button size="lg" variant="outline" className="w-full shadow-sm">
                  <Plus className="h-4 w-4" />
                  {t("tickets.actions.create.label")}
                </Button>
              </Link>
            </Can>

            <Can permission="CREATE_TICKET_ON_BEHALF">
              <Link to="/tickets/on-behalf" className="w-full sm:w-auto">
                {/* Quitamos bg-transparent para que use el fondo adaptativo del outline */}
                <Button size="lg" variant="outline" className="w-full shadow-sm">
                  <Plus className="h-4 w-4" />
                  {t("tickets.actions.on_behalf.label")}
                </Button>
              </Link>
            </Can>
          </div>
        </div>

        {/* === Área de Imagen / Gráfico === */}
        <div className="relative">
          {/* Brillo sutil de fondo (Glow Effect) */}
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 opacity-20 blur-lg dark:opacity-40 transition-opacity duration-500" />

          {/* Tarjeta con gradiente adaptativo */}
          <div className="relative aspect-square rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-700 dark:to-indigo-950 p-8 text-white shadow-xl border border-white/10 dark:border-white/5">
            <div className="flex h-full flex-col items-center justify-center space-y-6">

              {/* Ícono dentro de un círculo efecto cristal */}
              <div className="rounded-full bg-white/10 p-6 backdrop-blur-md shadow-inner border border-white/20">
                <Headset className="h-20 w-20 text-white" />
              </div>

              <div className="space-y-3 text-center">
                <p className="text-2xl font-bold tracking-tight">
                  {t("custom_information_profesional_support")}
                </p>
                <p className="text-sm font-medium text-blue-50/90 max-w-[250px] mx-auto leading-relaxed">
                  {t("custom_information_info_departament")}
                </p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  )
}