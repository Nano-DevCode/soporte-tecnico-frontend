import type { LucideIcon } from "lucide-react";
import { TableCell, TableRow } from "../ui/table"

interface Props {
    title: string;
    description: string;
    icon: LucideIcon;
}

const CustomNotFoundTable = ({ title, description, icon: Icon}: Props) => {
  return (
    <TableRow>
        <TableCell 
        colSpan={6} 
        className="h-75 text-center text-muted-foreground"
        >
        <div className="flex flex-col items-center gap-3">
            <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center border border-border">
            <Icon className="h-6 w-6 text-muted-foreground opacity-50" />
            </div>
            <div className="space-y-1">
            <p className="text-base font-semibold text-foreground">
                {title}
            </p>
            <p className="text-sm">
                {description}
            </p>
            </div>
        </div>
        </TableCell>
    </TableRow>
  )
}

export default CustomNotFoundTable