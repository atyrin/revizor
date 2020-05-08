export const sleep = async (timeMs: number) => {
    await new Promise(r => {
        setTimeout(r, timeMs)
    })
}