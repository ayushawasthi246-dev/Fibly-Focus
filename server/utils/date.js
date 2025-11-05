export const getMonthRange = (year, month) => {
    const start = new Date(year, month, 1)
    const end = new Date(year, month + 1, 0)
    return { start, end }
}