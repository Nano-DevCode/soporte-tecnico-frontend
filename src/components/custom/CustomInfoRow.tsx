import React from 'react'

interface CustomInfoRowProps {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
}

export const CustomInfoRow = ({ icon, label, value }: CustomInfoRowProps) => {
    return (
        <div className="flex items-start gap-3 flex-1">
            <span className="mt-0.5 shrink-0">{icon}</span>
            <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {label}
                </span>
                <span className="text-sm font-semibold text-foreground leading-relaxed">
                    {value}
                </span>
            </div>
        </div>
    );
}
