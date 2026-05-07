import { cn } from "@/lib/utils"
import { CustomSidebarHeader } from "./sidebar/CustomSidebarHeader"
import { CustomSidebarNavContent } from "./sidebar/CustomSidebarNavContent"
import { CustomSidebarFooter } from "./sidebar/CustomSidebarFooter"

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function CustomAppSidebar({ isOpen, onClose }: MobileSidebarProps) {
  return (
    <aside className={cn(
      "h-screen shrink-0 border-r bg-card transition-all duration-300 ease-in-out overflow-hidden",

      "fixed inset-y-0 left-0 z-50",
      isOpen ? "translate-x-0" : "-translate-x-full",
      "lg:static lg:translate-x-0",
      isOpen
        ? "lg:w-64 lg:min-w-64 lg:max-w-64 lg:border-r"
        : "lg:w-0 lg:min-w-0 lg:max-w-0 lg:border-none"
    )}>
      <div className="flex flex-col h-full w-72 lg:w-64 lg:min-w-64 lg:max-w-64">
        <CustomSidebarHeader onClose={onClose} />

        <CustomSidebarNavContent />

        <CustomSidebarFooter />
      </div>
    </aside>
  )
}
