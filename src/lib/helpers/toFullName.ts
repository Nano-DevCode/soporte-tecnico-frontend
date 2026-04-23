export const getFullName = (
    names: string,
    firstLastName: string,
    secondLastName?: string | null
): string => {
    return `${names} ${firstLastName} ${secondLastName || ''}`.trim();
};