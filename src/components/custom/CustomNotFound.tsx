
// Hacemos que title y description sean opcionales (?) 

import { SearchX } from "lucide-react";

// por si a veces no los quieres mandar
interface Props {
  title: string;
  description?: string;
}

export const CustomToolNotFound = ({ 
  title,
  description 
}: Props) => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[80vh] w-full px-4 text-center">
      
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-[40vh] w-[40vh] rounded-full bg-destructive/5 blur-[100px]" />
      </div>

      <div className="relative mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10 ring-8 ring-destructive/5">
        <SearchX className="h-10 w-10 text-destructive" />
      </div>

      <span className="mb-4 rounded-full bg-muted px-4 py-1.5 text-sm font-medium text-muted-foreground">
        Error de recurso
      </span>

      <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
        {title}
      </h1>
      
      <p className="mb-10 max-w-xl text-lg text-muted-foreground sm:text-xl">
        {description || "Lo sentimos, parece que el recurso que buscas ha sido eliminado, movido a otra sección o la dirección URL es incorrecta."}
      </p>

      {/* <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
        <Button 
          size="lg"
          variant="default" 
          className="w-full sm:w-auto group"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Regresar a la página
        </Button>
        
        <Button 
          size="lg" 
          variant="outline" 
          className="w-full sm:w-auto"
        >
          <Home className="mr-2 h-4 w-4" />
          Ir al inicio
        </Button>
      </div> */}
    </div>
  );
}