export const TicketStatus = {
    IDLE: 'IDLE',
    RECIBIDA: 'RECIBIDA',
    RECHAZADA: 'RECHAZADA',
    CANALIZADA: 'CANALIZADA',
    ASIGNADA: 'ASIGNADA',
    ATENDIENDO: 'ATENDIENDO',
    SOLUCIONADA: 'SOLUCIONADA',
    NO_SOLUCIONADA: 'NO_SOLUCIONADA',
    FINALIZADA: 'FINALIZADA',
    CERRADA: 'CERRADA',
    ARCHIVADA: 'ARCHIVADA',
} as const;

export type TicketStatusType = typeof TicketStatus[keyof typeof TicketStatus];

export const TicketActions = {
    RECIBIR: 'RECIBIR',
    CORREGIR: 'CORREGIR',
    RECHAZAR: 'RECHAZAR',
    CANALIZAR: 'CANALIZAR',
    ASIGNAR: 'ASIGNAR',
    ATENDER: 'ATENDER',
    INTERVENIR: 'INTERVENIR',
    FINALIZAR: 'FINALIZAR',
    CERRAR: 'CERRAR',
    ARCHIVAR: 'ARCHIVAR',
    WATCH_TECHNICAL_REPORT: 'WATCH_TECHNICAL_REPORT',
    WATCH_REJECTION_REPORT: 'WATCH_REJECTION_REPORT',
    WATCH_RESPONSE_REPORT: 'WATCH_RESPONSE_REPORT'
} as const;

export type TicketActionsType = typeof TicketActions[keyof typeof TicketActions];

export const allowedActionsByStatus: Record<TicketStatusType, TicketActionsType[]> = {
    [TicketStatus.IDLE]: [TicketActions.RECIBIR],
    [TicketStatus.RECIBIDA]: [
        TicketActions.RECHAZAR,
        TicketActions.CANALIZAR,
        TicketActions.CORREGIR
    ],
    [TicketStatus.RECHAZADA]: [TicketActions.CORREGIR, TicketActions.WATCH_REJECTION_REPORT],
    [TicketStatus.CANALIZADA]: [TicketActions.ASIGNAR],
    [TicketStatus.ASIGNADA]: [TicketActions.ATENDER, TicketActions.ASIGNAR],
    [TicketStatus.ATENDIENDO]: [TicketActions.INTERVENIR],
    [TicketStatus.SOLUCIONADA]: [TicketActions.FINALIZAR, TicketActions.WATCH_TECHNICAL_REPORT],
    [TicketStatus.NO_SOLUCIONADA]: [TicketActions.ASIGNAR, TicketActions.WATCH_TECHNICAL_REPORT],
    [TicketStatus.FINALIZADA]: [
        TicketActions.CERRAR,
        TicketActions.WATCH_TECHNICAL_REPORT,
        TicketActions.WATCH_RESPONSE_REPORT
    ],
    [TicketStatus.CERRADA]: [
        TicketActions.ARCHIVAR,
        TicketActions.WATCH_TECHNICAL_REPORT,
        TicketActions.WATCH_RESPONSE_REPORT
    ],
    [TicketStatus.ARCHIVADA]: [
        TicketActions.WATCH_TECHNICAL_REPORT,
        TicketActions.WATCH_RESPONSE_REPORT
    ],
};

export const getAvailableActions = (currentState: TicketStatusType): TicketActionsType[] => {
    return allowedActionsByStatus[currentState] || [];
};