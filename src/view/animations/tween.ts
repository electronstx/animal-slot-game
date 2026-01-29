import type { Tween } from "./types";

export const tweening: Tween[] = [];

export function tweenTo(
    object: any, 
    property: string, 
    target: number, 
    time: number, 
    easing: (t: number) => number, 
    onComplete: (() => void) | null = null
): void {
    tweening.push({
        object,
        property,
        propertyBeginValue: object[property],
        target,
        easing,
        time,
        complete: onComplete,
        start: Date.now(),
    });
}

export function updateTweens(): void {
    const now = Date.now();
    for (let i = tweening.length - 1; i >= 0; i--) {
        const t = tweening[i];
        const phase = Math.min(1, (now - t.start) / t.time);

        t.object[t.property] = t.propertyBeginValue + (t.target - t.propertyBeginValue) * t.easing(phase);

        if (phase === 1) {
            t.object[t.property] = t.target;
            if (t.complete) t.complete();
            tweening.splice(i, 1);
        }
    }
}

export const backout = (amount: number) => (t: number) => --t * t * ((amount + 1) * t + amount) + 1;