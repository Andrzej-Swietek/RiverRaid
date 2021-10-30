/**
 * Returns Random Number from range <min,max>
 * @param min : number
 * @param max : number
 * @return {number}
 */
export function randomNumber(min: number, max: number): number {
    const r = Math.random()*(max-min) + min
    return Math.floor(r)
}
