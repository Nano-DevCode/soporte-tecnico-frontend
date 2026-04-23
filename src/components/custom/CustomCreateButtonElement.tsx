import { Plus } from 'lucide-react';
import { Link } from 'react-router';
import { buttonVariants } from '../ui/button';
import { cn } from '@/lib/utils';

interface Props {
    label: string;
    to: string;
}

export const CustomCreateButtonElement = ({ label, to }: Props) => {
    return (
        <Link
            to={to}
            className={cn(
                buttonVariants({ variant: "default" }),
                "w-full sm:w-auto bg-blue-200/95 border-blue-300 dark:bg-blue-950/80 dark:border-blue-900/80 text-blue-950 dark:text-blue-100"
            )}
        >
            <Plus className="h-4 w-4" />
            {label}
        </Link>
    )
}