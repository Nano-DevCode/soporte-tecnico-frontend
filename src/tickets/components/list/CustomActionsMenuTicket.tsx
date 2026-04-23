import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Eye, MoreHorizontal, Pencil } from 'lucide-react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next';
import type { Ticket } from '@/tickets/interfaces/ticket.interface';

interface Props {
    ticket: Ticket;
}

export const CustomActionsMenuTicket = (
    { ticket }: Props
) => {

    const { t } = useTranslation();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">

                <DropdownMenuItem asChild>
                    <Link to={`/tickets/${ticket.id}`}>
                        <Eye className="h-4 w-4" />
                        {t('common.buttons.view')}
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <Link to={`/tickets/${ticket.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                        {t('tickets.list_page.actions.edit')}
                    </Link>
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    )
}
