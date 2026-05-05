"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className={cn(
        "relative w-full overflow-auto rounded-lg border shadow-sm",
        // Fondo base de la tabla
        "bg-white border-blue-200", 
        "dark:bg-slate-950 dark:border-blue-900/50"
      )}
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn(
        "sticky top-0 z-10 backdrop-blur-sm border-b",
        // ¡Aquí regresamos a tu azul vibrante para el día!
        "bg-blue-200/95 border-blue-300", 
        // Y mantenemos el azul noche para la oscuridad
        "dark:bg-blue-950/80 dark:border-blue-900/80", 
        className
      )}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t font-medium [&>tr]:last:border-b-0",
        // Pie de tabla que combina con la cabecera
        "bg-blue-100/90 border-blue-200", 
        "dark:bg-blue-950/60 dark:border-blue-900/60", 
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b transition-colors data-[state=selected]:bg-muted",
        // Un hover azul cielo para el día
        "border-slate-100 hover:bg-blue-50/80", 
        "dark:border-slate-800/50 dark:hover:bg-blue-900/30", 
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-11 px-4 text-left align-middle font-bold whitespace-nowrap [&:has([role=checkbox])]:pr-0",
        // Texto oscuro para que contraste bien con el bg-blue-200
        "text-blue-950", 
        "dark:text-blue-100", 
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-4 align-middle [&:has([role=checkbox])]:pr-0",
        "whitespace-normal break-words",
        "max-w-0", 
        className
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}