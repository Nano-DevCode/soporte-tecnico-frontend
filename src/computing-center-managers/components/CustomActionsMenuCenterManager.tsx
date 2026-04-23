import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Ban, CircleCheck, Eye, MoreHorizontal, Pencil } from 'lucide-react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next';
import type { CenterManager } from '../interfaces/center-manager.interface';

interface Props {
  centerManager: CenterManager;
  handleActivateClick: (centerManager: CenterManager) => void;
  handleDeactivateClick: (centerManager: CenterManager) => void;
}

export const CustomActionsMenuCenterManagers = (
  { centerManager, handleActivateClick, handleDeactivateClick }: Props
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
          <Link to={`/center-managers/${centerManager.id}`}>
            <Eye className="h-4 w-4" />
            {t('common.buttons.view')}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link to={`/center-managers/${centerManager.id}/edit`}>
            <Pencil className="h-4 w-4" />
            {t('common.buttons.edit')}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {!centerManager.is_active && (
          <DropdownMenuItem onClick={() => handleActivateClick(centerManager)}>
            <CircleCheck className="h-4 w-4" />
            {t('center_managers.list_page.actions.activate')}
          </DropdownMenuItem>
        )}

        {centerManager.is_active && (
          <DropdownMenuItem
            variant="destructive"
            onClick={() => handleDeactivateClick(centerManager)}
          >
            <Ban className="h-4 w-4" />
            {t('center_managers.list_page.actions.deactivate')}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
