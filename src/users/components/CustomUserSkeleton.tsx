import { Skeleton } from "@/components/ui/skeleton"

export const CustomUserSkeleton = () => {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-8">
            <Skeleton className="h-16 w-64" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
        </div>
    </div>
  )
}
