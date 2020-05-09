export const isValidGuid = (guid: string): boolean => {
    return guid && guid.length === 36
}