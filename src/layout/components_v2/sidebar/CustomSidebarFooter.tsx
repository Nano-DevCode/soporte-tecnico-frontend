import { useAuthStore } from "@/auth/store/auth.store"

export const CustomSidebarFooter = () => {
  const { user } = useAuthStore();
  return (
    <>
      {/* Footer - User Info */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
            { (user?.staff?.name || "US").substring(0,2) }
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground"> {user?.staff?.name || "Cargando..."} </p>
            <p className="truncate text-xs text-muted-foreground"> {user?.role?.name || "Cargando..." } </p>
          </div>
        </div>
      </div>
    </>
  )
}
  