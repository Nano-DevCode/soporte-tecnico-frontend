import { cn } from "@/lib/utils"
import { CustomNavContent } from "./CustomNavContent"
import { CustomMobilHeader } from "./CustomMobilHeader"
import { CustomFooterSidebar } from "./CustomFooterSidebar"

interface MobileSidebarProps {
  open: boolean
  onClose: () => void
}

export function CustomMobileSidebar({ open, onClose }: MobileSidebarProps) {
  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar drawer */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-card transition-transform duration-300 ease-in-out md:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        
        <CustomMobilHeader onClose={onClose}/>

        {/* Navigation */}
        <CustomNavContent/>

        <CustomFooterSidebar/>
      </div>
    </>
  )
}
