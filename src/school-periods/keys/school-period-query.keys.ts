export const schoolPeriodQueryKeys = {
    all: ['schoolPeriods'] as const,

    // 2. RAMA DE LISTAS (Para la tabla)
    // Invalidar esto recarga TODAS las tablas sin borrar los detalles cacheados
    lists: () => [...schoolPeriodQueryKeys.all, 'list'] as const,

    // Lista específica con filtros (La que usas en tu hook useSchoolPeriods)
    list: (filters: Record<string, unknown>) => [...schoolPeriodQueryKeys.lists(), filters] as const,

    // 3. RAMA DE DETALLES (Para la vista de "Solo Lectura" y "Edición")
    // Invalidar esto recarga TODOS los detalles sin tocar la tabla
    details: () => [...schoolPeriodQueryKeys.all, 'detail'] as const,

    // Detalle específico por ID (El que usas en tu hook useSchoolPeriod)
    detail: (id: string) => [...schoolPeriodQueryKeys.details(), id] as const,

    // SchoolPeriods
    //  - Lists
    //d     - {limit= 5 , page - 1} 
    //      - { state = false}
    //      - { query = 2021}
    //  - details
    //      - id: 123198371293
    //      - id: 67487322838
    // 
};