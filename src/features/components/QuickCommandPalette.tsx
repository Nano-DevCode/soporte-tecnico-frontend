import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Home, LayoutDashboard, Settings, Tickets, Users, Terminal } from "lucide-react";
import { 
  CommandDialog, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList,
  CommandSeparator,
  CommandShortcut
} from "@/components/ui/command";
import { useFeatureFlag } from "../hooks/useFeatureFlags";

export const QuickCommandPalette = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  
  // Solo se monta/activa si la feature flag está encendida
  const isEnabled = useFeatureFlag('quick_command_palette');

  useEffect(() => {
    if (!isEnabled) return;
    
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isEnabled]);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  if (!isEnabled) return null;

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Escribe un comando o busca algo..." />
        <CommandList>
          <CommandEmpty>No se encontraron resultados.</CommandEmpty>
          
          <CommandGroup heading="Navegación Rápida">
            <CommandItem onSelect={() => runCommand(() => navigate("/"))}>
              <Home className="mr-2 h-4 w-4" />
              <span>Inicio</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/dashboard"))}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/tickets/currents"))}>
              <Tickets className="mr-2 h-4 w-4" />
              <span>Tickets Actuales</span>
              <CommandShortcut>⌘T</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          
          <CommandSeparator />
          
          <CommandGroup heading="Ajustes y Sistema">
            <CommandItem onSelect={() => runCommand(() => navigate("/users"))}>
              <Users className="mr-2 h-4 w-4" />
              <span>Usuarios</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/features"))}>
              <Terminal className="mr-2 h-4 w-4" />
              <span>Laboratorio de Funciones</span>
              <CommandShortcut>⌘L</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/account/configuration"))}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configuración</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};
