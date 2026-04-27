export const TicketStatus = {
    IDLE: 'IDLE',
    RECIBIDA: 'RECIBIDA',
    RECHAZADA: 'RECHAZADA',
    CANALIZADA: 'CANALIZADA',
    ASIGNADA: 'ASIGNADA',
    ATENDIENDO: 'ATENDIENDO',
    SOLUCIONADA: 'SOLUCIONADA',
    NO_SOLUCIONADA: 'NO_SOLUCIONADA',
    // PAUSADA: 'PAUSADA',
    FINALIZADA: 'FINALIZADA',
    CERRADA: 'CERRADA',
    ARCHIVADA: 'ARCHIVADA',
} as const;

export type TicketStatus = typeof TicketStatus[keyof typeof TicketStatus];

export const TicketEvent = {
    RECIBIR: 'RECIBIR',
    CORREGIR: 'CORREGIR',
    RECHAZAR: 'RECHAZAR',
    CANALIZAR: 'CANALIZAR',
    ASIGNAR: 'ASIGNAR',
    ATENDER: 'ATENDER',
    INTERVENIR: 'INTERVENIR',
    // SOLUCIONAR: 'SOLUCIONAR',
    // NO_SOLUCIONAR: 'NO_SOLUCIONAR',
    // PAUSAR: 'PAUSAR',
    FINALIZAR: 'FINALIZAR',
    CERRAR: 'CERRAR',
    ARCHIVAR: 'ARCHIVAR',
    WATCH_TECHNICAL_REPORT: 'WATCH_TECHNICAL_REPORT',
    WATCH_REJECTION_REPORT: 'WATCH_REJECTION_REPORT',
    WATCH_RESPONSE_REPORT: 'WATCH_RESPONSE_REPORT'
} as const;

export type TicketEvent = typeof TicketEvent[keyof typeof TicketEvent];

export const machine: Record<
    TicketStatus,
    Partial<Record<TicketEvent, TicketStatus | TicketStatus[]>>
> = {
    [TicketStatus.IDLE]: {
        [TicketEvent.RECIBIR]: TicketStatus.RECIBIDA,
    },
    [TicketStatus.RECIBIDA]: {
        [TicketEvent.RECHAZAR]: TicketStatus.RECHAZADA,
        [TicketEvent.CANALIZAR]: TicketStatus.CANALIZADA,
        [TicketEvent.CORREGIR]: TicketStatus.RECIBIDA,
    },
    [TicketStatus.RECHAZADA]: {
        [TicketEvent.CORREGIR]: TicketStatus.RECIBIDA,
        [TicketEvent.WATCH_REJECTION_REPORT]: TicketStatus.RECHAZADA,
    },
    [TicketStatus.CANALIZADA]: {
        [TicketEvent.ASIGNAR]: TicketStatus.ASIGNADA,
    },
    [TicketStatus.ASIGNADA]: {
        [TicketEvent.ATENDER]: TicketStatus.ATENDIENDO,
        [TicketEvent.ASIGNAR]: TicketStatus.ASIGNADA,
    },
    [TicketStatus.ATENDIENDO]: {
        [TicketEvent.INTERVENIR]: [TicketStatus.SOLUCIONADA, TicketStatus.NO_SOLUCIONADA],
    },
    [TicketStatus.SOLUCIONADA]: {
        [TicketEvent.FINALIZAR]: TicketStatus.FINALIZADA,
        [TicketEvent.WATCH_TECHNICAL_REPORT]: TicketStatus.SOLUCIONADA,
    },
    [TicketStatus.NO_SOLUCIONADA]: {
        // [TicketEvent.PAUSAR]: TicketStatus.PAUSADA,
        [TicketEvent.ASIGNAR]: TicketStatus.ASIGNADA,
        [TicketEvent.WATCH_TECHNICAL_REPORT]: TicketStatus.NO_SOLUCIONADA,
    },
    // [TicketStatus.PAUSADA]: {
    //     [TicketEvent.ASIGNAR]: TicketStatus.ASIGNADA,
    // },
    [TicketStatus.FINALIZADA]: {
        [TicketEvent.CERRAR]: TicketStatus.CERRADA,
        [TicketEvent.WATCH_TECHNICAL_REPORT]: TicketStatus.FINALIZADA,
        [TicketEvent.WATCH_RESPONSE_REPORT]: TicketStatus.FINALIZADA,
    },
    [TicketStatus.CERRADA]: {
        [TicketEvent.ARCHIVAR]: TicketStatus.ARCHIVADA,
        [TicketEvent.WATCH_TECHNICAL_REPORT]: TicketStatus.CERRADA,
        [TicketEvent.WATCH_RESPONSE_REPORT]: TicketStatus.CERRADA,
    },
    [TicketStatus.ARCHIVADA]: {
        [TicketEvent.WATCH_TECHNICAL_REPORT]: TicketStatus.ARCHIVADA,
        [TicketEvent.WATCH_RESPONSE_REPORT]: TicketStatus.ARCHIVADA,
    },
};

export const getAvailableActions = (currentState: TicketStatus): TicketEvent[] => {
    const stateConfig = machine[currentState];
    return stateConfig ? (Object.keys(stateConfig) as TicketEvent[]) : [];
};