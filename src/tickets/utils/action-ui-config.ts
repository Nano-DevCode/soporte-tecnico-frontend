import type { PermissionsTypes } from "@/common/permission/permissions";
import { Archive, Edit3, Flag, Inbox, Lock, MessageSquareReply, Send, UserPlus, Wrench, XCircle, type LucideIcon } from "lucide-react";
import { TicketActions, type TicketActionsType } from "./ticket-state-machine";

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
    | 'intervene'
    | 'watch_response';

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

export const ACTION_UI_CONFIG: Partial<Record<TicketActionsType, ActionUIConfig>> = {
    [TicketActions.RECIBIR]: {
        label: 'tickets.actions.create.label',
        icon: Inbox,
        variant: 'default',
        permission: 'CREATE_TICKET',
        behavior: 'navigate',
        route: () => '/tickets/create'
    },
    [TicketActions.CORREGIR]: {
        label: 'tickets.actions.edit.label',
        icon: Edit3,
        variant: 'secondary',
        permission: 'EDIT_TICKET',
        behavior: 'navigate',
        route: (id) => `/tickets/${id}/edit`
    },
    [TicketActions.RECHAZAR]: {
        label: 'tickets.actions.reject.label',
        icon: XCircle,
        variant: 'destructive',
        permission: 'REJECT_TICKET',
        behavior: 'navigate',
        route: (id) => `/tickets/${id}/reject`
    },
    [TicketActions.CANALIZAR]: {
        label: 'tickets.actions.route.label',
        icon: Send,
        variant: 'default',
        permission: 'ROUTE_TICKET',
        behavior: 'navigate',
        route: (id) => `/tickets/${id}/route`
    },
    [TicketActions.ASIGNAR]: {
        label: 'tickets.actions.assign.label',
        icon: UserPlus,
        variant: 'default',
        permission: 'ASSIGN_TICKET',
        behavior: 'navigate',
        route: (id) => `/tickets/${id}/assign`
    },
    [TicketActions.ATENDER]: {
        label: 'tickets.actions.attend.label',
        icon: Wrench,
        variant: 'default',
        permission: 'ATTEND_TICKET',
        behavior: 'confirm',
        confirmTitle: 'tickets.actions.attend.confirm_title',
        confirmMessage: 'tickets.actions.attend.confirm_message'
    },
    [TicketActions.FINALIZAR]: {
        label: 'tickets.actions.finish.label',
        icon: Flag,
        variant: 'default',
        permission: 'FINISH_TICKET',
        behavior: 'navigate',
        route: (id) => `/tickets/${id}/finish`
    },
    [TicketActions.CERRAR]: {
        label: 'tickets.actions.close.label',
        icon: Lock,
        variant: 'default',
        permission: 'CLOSE_TICKET',
        behavior: 'confirm',
        confirmTitle: 'tickets.actions.close.confirm_title',
        confirmMessage: 'tickets.actions.close.confirm_message'
    },
    [TicketActions.ARCHIVAR]: {
        label: 'tickets.actions.archive.label',
        icon: Archive,
        variant: 'default',
        permission: 'ARCHIVE_TICKET',
        behavior: 'confirm',
        confirmTitle: 'tickets.actions.archive.confirm_title',
        confirmMessage: 'tickets.actions.archive.confirm_message'
    },
    [TicketActions.INTERVENIR]: {
        label: 'tickets.actions.intervene.label',
        icon: Edit3,
        variant: 'default',
        permission: 'INTERVENE_TICKET',
        behavior: 'navigate',
        route: (id) => `/tickets/${id}/intervene`
    },
    [TicketActions.WATCH_RESPONSE_REPORT]: {
        label: 'tickets.actions.watch_response.label',
        icon: MessageSquareReply,
        variant: 'outline',
        permission: 'WATCH_RESPONSE_REPORT',
        behavior: 'navigate',
        route: (id) => `/tickets/${id}/response`
    },
};

