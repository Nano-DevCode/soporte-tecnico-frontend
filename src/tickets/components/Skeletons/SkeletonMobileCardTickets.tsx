import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export const SkeletonMobileCardTickets = () => {
    return (
        <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="p-4 flex flex-col gap-3 shadow-sm border-muted/60">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 overflow-hidden w-full">
                            <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
                            <div className="flex flex-col gap-1.5 w-full">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 pt-1">
                            <Skeleton className="h-3 w-10" />
                            <Skeleton className="h-5 w-5 rounded-md" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 pl-10 mt-1">
                        <Skeleton className="h-4 w-2/4" />
                        <div className="space-y-1 mt-1">
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-5/6" />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2 pl-10">
                        <Skeleton className="h-5 w-16 rounded-full" />
                        <Skeleton className="h-5 w-16 rounded-full" />
                        <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                </Card>
            ))}
        </div>
    )
}
