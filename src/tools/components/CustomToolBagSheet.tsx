import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Trash2, Wrench, ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router"; 
import { sileo } from "sileo";

// Ajusta las importaciones según tu estructura
import { TOOL_BAG_EVENT, removeFromToolBag } from "../components/CustomToolBag"; 
import { useTools } from "../hooks/useTools"; // <-- Importamos tu super hook
import { CustomSkeletonInformation } from "@/components/custom/CustomSkeletonInformation";

export function ToolBagPage() {
  const navigate = useNavigate();

  // 1. Mantenemos el estado de los IDs leyendo el localStorage
  const [bagIds, setBagIds] = useState<string[]>(() => {
    const savedBag = localStorage.getItem("custom_tool_bag");
    return savedBag ? JSON.parse(savedBag) : [];
  });

  // 2. Le pasamos los IDs al hook. React Query hace toda la magia de traer los datos.
  const { bagTools, isBagLoading } = useTools(bagIds);

  // 3. Sincronizar el estado cuando la bolsa cambie desde otros lados de la app
  useEffect(() => {
    const handleBagUpdate = () => {
      const savedBag = JSON.parse(localStorage.getItem("custom_tool_bag") || "[]");
      setBagIds(savedBag);
    };

    window.addEventListener(TOOL_BAG_EVENT, handleBagUpdate);
    return () => window.removeEventListener(TOOL_BAG_EVENT, handleBagUpdate);
  }, []);

  // Limpai automaticamente: Si el backend nos mandó menos herramientas de las 
  // que teníamos en localStorage (ej. una se puso inactiva), actualizamos la bolsa.
  useEffect(() => {
    if (!isBagLoading && bagIds.length > 0 && bagTools.length < bagIds.length) {
      
      // Usamos setTimeout para salir del ciclo síncrono de React.
      // Esto elimina el error de "cascading renders" y es totalmente seguro.
      setTimeout(() => {
        const validIds = bagTools.map(t => t.id);
        
        localStorage.setItem("custom_tool_bag", JSON.stringify(validIds));
        setBagIds(validIds); // ¡Ahora a React ya no le molesta!
        
        sileo.info({
          title: "Bolsa actualizada",
          description: "Algunas herramientas ya no están disponibles y fueron retiradas de tu bolsa.",
        });
        
        window.dispatchEvent(new Event(TOOL_BAG_EVENT));
      }, 0);
      
    }
  // Cambiamos bagIds a bagIds.length en las dependencias para mayor estabilidad
  }, [bagTools, bagIds.length, isBagLoading]);

  const clearBag = () => {
    localStorage.setItem("custom_tool_bag", "[]");
    window.dispatchEvent(new Event(TOOL_BAG_EVENT));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* HEADER DE LA PÁGINA */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)} className="text-muted-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al catálogo
        </Button>
      </div>

      <div className="flex items-center gap-3 border-b border-border pb-4">
        <Briefcase className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Tu Bolsa de Herramientas</h1>
        <span className="ml-2 bg-primary/10 text-primary text-sm font-bold px-3 py-1 rounded-full">
          {bagTools.length} {bagTools.length === 1 ? 'artículo' : 'artículos'}
        </span>
      </div>

      {/* CONTENIDO DEL CARRITO */}
      {isBagLoading ? (
        <CustomSkeletonInformation />
      ) : bagTools.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
          <div className="h-24 w-24 bg-secondary/50 rounded-full flex items-center justify-center mb-6">
            <Wrench className="h-12 w-12 text-primary/30" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Tu bolsa está vacía</h2>
          <p className="text-muted-foreground mb-6">Aún no has agregado ninguna herramienta para solicitar.</p>
          <Button onClick={() => navigate(-1)}>Ir a buscar herramientas</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* LISTA DE ITEMS REALES (Ocupa 2 columnas) */}
          <div className="md:col-span-2 space-y-4">
            {/* AHORA MAPEAMOS SOBRE bagTools EN LUGAR DE bagIds */}
            {bagTools.map((tool) => (
              <Card key={tool.id} className="overflow-hidden">
                <CardContent className="p-4 flex items-center gap-4">
                  
                  {/* FOTO DE LA HERRAMIENTA */}
                  <div className="h-20 w-20 bg-muted/40 rounded-lg flex items-center justify-center shrink-0 border border-border/50 overflow-hidden">
                    {tool.imageUrl ? (
                      <img src={tool.imageUrl} alt={tool.model?.name} className="h-full w-full object-cover" />
                    ) : (
                      <Wrench className="h-8 w-8 text-muted-foreground/50" />
                    )}
                  </div>
                  
                  {/* INFORMACIÓN DE LA HERRAMIENTA */}
                  <div className="flex-1 flex flex-col justify-center">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider mb-1">
                      {tool.type?.name}
                    </span>
                    <h3 className="text-lg font-semibold text-foreground">
                      {tool.model?.brand?.name} {tool.model?.name}
                    </h3>
                    {tool.idInternal && (
                      <span className="text-xs text-muted-foreground mt-0.5">
                        ID: {tool.idInternal}
                      </span>
                    )}
                  </div>

                  <Button 
                    variant="ghost" 
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => removeFromToolBag(tool.id)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* PANEL DE RESUMEN (Ocupa 1 columna) */}
          <div className="md:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6 space-y-6">
                <h3 className="text-lg font-semibold border-b pb-4">Resumen de solicitud</h3>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Total de herramientas</span>
                  <span className="font-bold text-lg">{bagTools.length}</span>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <Button className="w-full h-12 text-base shadow-sm">
                    Proceder con la solicitud
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10" 
                    onClick={clearBag}
                  >
                    Vaciar bolsa
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      )}
    </div>
  );
}