import { Button } from "@/components/ui/button";
import type { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

export const SortableHeader = <TData, TValue>(column: Column<TData, TValue>, title: string) => {
  const isSorted = column.getIsSorted();

  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(isSorted === "asc")}
      className="-ml-4 h-8 data-[state=open]:bg-accent"
    >
      <span>{title}</span>
      {isSorted === "desc" ? (
        <ArrowDown className="ml-2 h-4 w-4 text-muted-foreground" />
      ) : isSorted === "asc" ? (
        <ArrowUp className="ml-2 h-4 w-4 text-muted-foreground" />
      ) : (
        <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
      )}
    </Button>
  );
};