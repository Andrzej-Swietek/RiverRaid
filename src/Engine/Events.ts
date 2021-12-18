/**
 * This event is fired whenever player places a ball
 * @eventProperty
 * @example
 * ```ts
 * document.body.dispatchEvent(planeCrush)
 * ```
 */
export const planeCrush: Event = new Event('plane-crush');
export const gaveOver: Event = new Event('game-over');
planeCrush.initEvent('plane-crush', true, true);
gaveOver.initEvent('game-over', true, true);
