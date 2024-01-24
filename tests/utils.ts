export const removeMillis = (date?: Date) => date?.toISOString().split('.')[0];
