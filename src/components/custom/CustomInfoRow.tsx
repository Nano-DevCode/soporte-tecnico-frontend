import React from 'react'
import { Skeleton } from '../ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { CircleHelp } from 'lucide-react';
import { Button } from '../ui/button';

interface CustomInfoRowProps {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
    tooltipDescription?: string;
}

export const CustomInfoRow = ({ icon, label, value, tooltipDescription }: CustomInfoRowProps) => {
    return (
        <div className="flex items-start gap-3 flex-1">
            <span className="mt-0.5 shrink-0">{icon}</span>
            <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {tooltipDescription ?
                        (<Tooltip>
                            <TooltipTrigger asChild className="w-fit cursor-help">
                                <div className='flex gap-2 items-center'>
                                    <span>{label}</span>
                                    <Button variant={'ghost'} className='h-0 w-0'>
                                        <CircleHelp className='h-4 w-4' />
                                    </Button>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="max-w-62.5 text-center">
                                <p className="text-sm">
                                    {tooltipDescription}
                                </p>
                            </TooltipContent>
                        </Tooltip>)
                        : (label)
                    }
                </span>
                <span className="text-sm font-semibold text-foreground leading-relaxed">
                    {value}
                </span>
            </div>
        </div>
    );
}

export const SkeletonInfoRow = ({ isDescription = false }: { isDescription?: boolean }) => (
    <div className="flex items-start gap-3 flex-1">
        <Skeleton className="mt-0.5 shrink-0 w-4 h-4 rounded-sm" />

        <div className="flex flex-col min-w-0 gap-2.75 w-full">
            <Skeleton className="h-3 w-20" />

            {isDescription ? (
                <div className="space-y-1.5 mt-0.5 w-full">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-[90%]" />
                    <Skeleton className="h-4 w-[60%]" />
                </div>
            ) : (
                <Skeleton className="h-4 w-3/4 max-w-50" />
            )}
        </div>
    </div>
);
