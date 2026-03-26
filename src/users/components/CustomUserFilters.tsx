import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilterX, Search } from "lucide-react";
import { useSearchParams } from "react-router";
import { useDepartments } from "../hooks/useDepartment";
import { useRef } from "react";

export const CustomUserFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: departments } = useDepartments();

  const inputRef = useRef<HTMLInputElement>(null);

  const searchTerm = searchParams.get("search") || "";
  const deptFilter = searchParams.get("dept") || "all";
  const statusFilter = searchParams.get("status") || "all";

  const updateFilters = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);

    if (!value || value === "all") {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }

    newParams.set("page", "1");

    setSearchParams(newParams);
  };

  const resetFilters = () => {
    setSearchParams({});
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    updateFilters("search", inputRef.current?.value || "");
  }

  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-card/50 shadow-sm md:flex-row md:items-center">
      
      {/* Buscador */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
        <Input
          placeholder="Buscar usuario..."
          className="pl-9 h-10 bg-background/60"
          defaultValue={searchTerm}
          ref={inputRef}
          onKeyDown={ handleSearch }
        />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        {/* Filtro Depto */}
        <Select value={deptFilter} onValueChange={(v) => updateFilters("dept", v)}>
          <SelectTrigger className="w-full sm:w-[160px] h-10 bg-background/60">
            <SelectValue placeholder="Departamento" />
          </SelectTrigger>
          
          <SelectContent>
            <SelectItem value="all">Todos los Deptos</SelectItem>

            {
              departments?.map(department => (
                <SelectItem key={department.id} value={department.id}>{department.name}</SelectItem>
              ))
            }
          </SelectContent>
        </Select>

        {/* Filtro Estado */}
        <Select value={statusFilter} onValueChange={(v) => updateFilters("status", v)}>
          <SelectTrigger className="w-full sm:w-[130px] h-10 bg-background/60">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="1">Activos</SelectItem>
            <SelectItem value="0">Inactivos</SelectItem>
          </SelectContent>
        </Select>

        {/* Botón Limpiar */}
        {(searchTerm || deptFilter !== "all" || statusFilter !== "all") && (
          <Button 
            variant="ghost" 
            onClick={resetFilters}
            className="h-10 px-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
          >
            <FilterX className="h-4 w-4 mr-2" />
            <span className="sm:hidden lg:inline">Limpiar</span>
          </Button>
        )}
      </div>
    </div>
  );
};