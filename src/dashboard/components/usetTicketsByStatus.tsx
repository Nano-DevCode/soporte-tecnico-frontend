import { useTranslation } from "react-i18next";
import { Ticket } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TicketsByStatusResponse } from "../interfaces/tickets--by-status";

interface Props {
    data: TicketsByStatusResponse | undefined;
    isLoading?: boolean;
}

export const TicketsByStatusCards = ({ data, isLoading }: Props) => {
    const { t } = useTranslation();

    // Estado de carga: Mostramos "skeletons" (tarjetas grises parpadeantes)
    if (isLoading || !data) {
        return (
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 mb-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="h-24 animate-pulse bg-muted/50" />
                ))}
            </div>
        );
    }

    // Si el arreglo viene vacío
    if (data.data.length === 0) {
        return (
            <div className="mb-4 flex items-center justify-center rounded-xl border border-dashed p-4 text-center">
                <p className="text-sm text-muted-foreground">
                    {t('dashboards.metrics.no_data')}
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-wrap gap-2">
            {data.data.map((item) => (
                <Card key={item.status} className="flex-1">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle
                            className="text-sm font-medium truncate capitalize"
                            title={item.status}
                        >
                            {item.status}
                        </CardTitle>
                        <Ticket className="h-4 w-4 text-muted-foreground opacity-70" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {item.count}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};