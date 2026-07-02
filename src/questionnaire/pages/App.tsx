import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquarePlus } from "lucide-react";
import { SurveyDialog, type SurveyAnswers } from '../components/SurveyDialog';

export default function App() {
  const [isSurveyOpen, setIsSurveyOpen] = useState<boolean>(false);

  const handleSurveySubmit = (data: SurveyAnswers): void => {
    console.log("🚀 Payload listo para el backend en NestJS:", data);
    
    // Aquí irá tu fetch a NestJS
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-8">
      <div className="max-w-md text-center space-y-6">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Dashboard
        </h1>
        <p className="text-muted-foreground text-lg">
          Ayúdanos a evaluar nuestro sistema de tickets para ofrecerte un mejor servicio.
        </p>
        
        <Button 
          size="lg" 
          onClick={() => setIsSurveyOpen(true)}
          className="rounded-full shadow-xl shadow-primary/20 gap-2 font-semibold text-md"
        >
          <MessageSquarePlus className="w-5 h-5" />
          Dejar Feedback
        </Button>
      </div>

      <SurveyDialog 
        open={isSurveyOpen} 
        onOpenChange={setIsSurveyOpen} 
        onSubmit={handleSurveySubmit}
      />
    </div>
  ); // <-- Asegúrate de que tu return cierra con este paréntesis y punto y coma
} // <-- Esta es la llave que Vite estaba buscando (EOF)