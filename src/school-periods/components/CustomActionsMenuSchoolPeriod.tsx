import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Ban, CircleCheck, Eye, MoreHorizontal, Pencil } from 'lucide-react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next';
import type { SchoolPeriod } from '../interfaces/school-period.interface';

interface Props {
  schoolPeriod: SchoolPeriod;
  handleActivateClick: (schoolPeriod: SchoolPeriod) => void;
  handleDeactivateClick: (schoolPeriod: SchoolPeriod) => void;
}

export const CustomActionsMenuSchoolPeriod = (
  { schoolPeriod, handleActivateClick, handleDeactivateClick }: Props
) => {

  const { t } = useTranslation();

  return (
    <>
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

          <DropdownMenuItem className="gap-2" asChild>
            <Link to={`/school-period/${schoolPeriod.id}`}>
              <Eye className="h-4 w-4" />
              {t('custom_actions_menu_school_period_watch')}
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem className="gap-2" asChild>
            <Link to={`/school-period/${schoolPeriod.id}/edit`}>
              <Pencil className="h-4 w-4" />
              {t('custom_actions_menu_school_period_edit')}
            </Link>
          </DropdownMenuItem>

          {schoolPeriod.is_active === false && <DropdownMenuItem className="gap-2"
            onClick={() => handleActivateClick(schoolPeriod)}>
            <CircleCheck className="h-4 w-4" />
            {t('custom_actions_menu_school_period_activate')}
          </DropdownMenuItem>}

          <DropdownMenuSeparator />
          {schoolPeriod.is_active === true && <DropdownMenuItem className="gap-2 text-amber-600 focus:text-amber-600"
            onClick={() => handleDeactivateClick(schoolPeriod)}>
            <Ban className="h-4 w-4" />
            {t('custom_actions_menu_school_period_deactivate')}
          </DropdownMenuItem>}

          {/* <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive"
            onClick={() => handleDeleteClick(schoolPeriod)}>
            <Trash2 className="h-4 w-4" />
            {t('custom_actions_menu_school_period_delete')}
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
