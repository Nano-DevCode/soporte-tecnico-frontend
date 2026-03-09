import { Skeleton } from '../ui/skeleton'

export const CustomSkeletonTableCard = () => {
  return (
    <>
        <div className="space-y-6">
          {/* Skeleton para (Tabla) */}
          <div className="hidden md:block rounded-xl border border-border bg-card overflow-hidden">
            <div className="p-4 border-b bg-muted/30">
              <Skeleton className="h-6 w-full max-w-[800px]" />
            </div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border-b last:border-0">
                <Skeleton className="h-4 w-16" />
                <div className="flex items-center gap-3 flex-1">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <Skeleton className="h-4 w-24" /> 
                <Skeleton className="h-4 w-20" /> 
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            ))}
          </div>

          {/* Skeleton para (Cards) */}
          <div className="md:hidden space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-4 flex gap-4">
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>    
    </>
  )
}
