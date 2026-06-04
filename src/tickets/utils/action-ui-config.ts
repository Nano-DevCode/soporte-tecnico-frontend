import type { PermissionsTypes } from "@/common/permission/permissions";
import { Archive, Edit3, Flag, Inbox, Lock, Send, UserPlus, Wrench, XCircle, type LucideIcon } from "lucide-react";
import { TicketEvent } from "./ticket-state-machine";

export type ActionBehavior = 'navigate' | 'direct' | 'confirm';
export type Variants = 'default' | 'destructive' | 'outline' | 'secondary';

type ActionTranslationKey =
    | 'create'
    | 'edit'
    | 'reject'
    | 'route'
    | 'assign'
    | 'attend'
    | 'finish'
    | 'close'
    | 'archive'
    | 'intervene';

type ConfirmActionTranslationKey = 'attend' | 'close' | 'archive';

export type TicketActionLabelKey = `tickets.actions.${ActionTranslationKey}.label`;

export type TicketActionConfirmKey = `tickets.actions.${ConfirmActionTranslationKey}.confirm_${'title' | 'message'}`;

interface ActionUIConfig {
    label: TicketActionLabelKey;
    icon: LucideIcon;
    variant: Variants;
    permission: PermissionsTypes;
    behavior: ActionBehavior;
    route?: (id: string) => string;
    confirmTitle?: TicketActionConfirmKey;
    confirmMessage?: TicketActionConfirmKey;
}

export const ACTION_UI_CONFIG: Partial<Record<TicketEvent, ActionUIConfig>> = {
    [TicketEvent.RECIBIR]: {
        label: 'tickets.actions.create.label',
        icon: Inbox,
        variant: 'default',
        permission: 'CREATE_TICKET',
        behavior: 'navigate',
        route: () => '/tickets/create'
    },
    [TicketEvent.CORREGIR]: {
        label: 'tickets.actions.edit.label',
        icon: Edit3,
        variant: 'outline',
        permission: 'EDIT_TICKET',
        behavior: 'navigate',
        route: (id) => `/tickets/${id}/edit`
    },
    [TicketEvent.RECHAZAR]: {
        label: 'tickets.actions.reject.label',
        icon: XCircle,
        variant: 'destructive',
        permission: 'REJECT_TICKET',
        behavior: 'navigate',
        route: (id) => `/tickets/${id}/reject`
    },
    [TicketEvent.CANALIZAR]: {
        label: 'tickets.actions.route.label',
        icon: Send,
        variant: 'default',
        permission: 'ROUTE_TICKET',
        behavior: 'navigate',
        route: (id) => `/tickets/${id}/route`
    },
    [TicketEvent.ASIGNAR]: {
        label: 'tickets.actions.assign.label',
        icon: UserPlus,
        variant: 'default',
        permission: 'ASSIGN_TICKET',
        behavior: 'navigate',
        route: (id) => `/tickets/${id}/assign`
    },
    [TicketEvent.ATENDER]: {
        label: 'tickets.actions.attend.label',
        icon: Wrench,
        variant: 'default',
        permission: 'ATTEND_TICKET',
        behavior: 'confirm',
        confirmTitle: 'tickets.actions.attend.confirm_title',
        confirmMessage: 'tickets.actions.attend.confirm_message'
    },
    [TicketEvent.FINALIZAR]: {
        label: 'tickets.actions.finish.label',
        icon: Flag,
        variant: 'default',
        permission: 'FINISH_TICKET',
        behavior: 'navigate',
        route: (id) => `/tickets/${id}/finish`
    },
    [TicketEvent.CERRAR]: {
        label: 'tickets.actions.close.label',
        icon: Lock,
        variant: 'outline',
        permission: 'CLOSE_TICKET',
        behavior: 'confirm',
        confirmTitle: 'tickets.actions.close.confirm_title',
        confirmMessage: 'tickets.actions.close.confirm_message'
    },
    [TicketEvent.ARCHIVAR]: {
        label: 'tickets.actions.archive.label',
        icon: Archive,
        variant: 'secondary',
        permission: 'ARCHIVE_TICKET',
        behavior: 'confirm',
        confirmTitle: 'tickets.actions.archive.confirm_title',
        confirmMessage: 'tickets.actions.archive.confirm_message'
    },
    [TicketEvent.INTERVENIR]: {
        label: 'tickets.actions.intervene.label',
        icon: Edit3,
        variant: 'default',
        permission: 'INTERVENE_TICKET',
        behavior: 'navigate',
        route: (id) => `/tickets/${id}/intervene`
    },
};

