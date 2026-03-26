import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router'; 

export interface CustomBackToListProps {
  backLabel?: string;
  onBack: () => void;
  actionLabel?: string;
  actionUrl?: string;
  ActionIcon?: React.ElementType; 
}

export const CustomBackToList = ({ 
  onBack, 
  backLabel = 'Regresar', 
  actionLabel, 
  actionUrl, 
  ActionIcon 
}: CustomBackToListProps) => {
  return (
    <div className="flex items-center justify-between pb-4 mb-4 border-b border-border/50">
      <button 
        onClick={onBack}
        className="group flex items-center gap-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
        
        <span>{backLabel}</span>
      </button>

      {actionLabel && actionUrl && ActionIcon && (
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 h-8 text-xs rounded-md" 
          asChild
        >
          <Link to={actionUrl}>
            <ActionIcon className="h-3.5 w-3.5" />
            {actionLabel}
          </Link>
        </Button>
      )}
    </div>
  );
};