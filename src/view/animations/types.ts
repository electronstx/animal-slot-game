import * as PIXI from 'pixi.js';

export type ReelType = {
    container: PIXI.Container;
    symbols: PIXI.Sprite[];
    position: number;
    previousPosition: number;
    blur: PIXI.BlurFilter;
}

export type Tween = {
    object: any;
    property: string;
    propertyBeginValue: number;
    target: number;
    easing: (t: number) => number;
    time: number;
    start: number;
    complete: (() => void) | null;
}