import { SYMBOL_SIZE } from '../constants';

export interface LayoutData {
    width: number;
    height: number;
    gameScale: number;
    margin: number;
    reelsHeight: number;
    reelsWidth: number;
}

export function getLayout(screenWidth: number, screenHeight: number): LayoutData {
    const baseWidth = SYMBOL_SIZE * 5;
    const baseHeight = SYMBOL_SIZE * 3;

    const scaleX = screenWidth / baseWidth;
    const scaleY = screenHeight / baseHeight;

    let gameScale: number;

    if (screenWidth < screenHeight) {
        gameScale = Math.min(scaleX, scaleY); 
    } else {
        gameScale = Math.min(scaleX, (screenHeight * 0.75) / baseHeight);
    }

    const reelsHeight = baseHeight * gameScale;
    const reelsWidth = baseWidth * gameScale;
    const margin = (screenHeight - reelsHeight) / 2;

    return {
        width: screenWidth,
        height: screenHeight,
        gameScale,
        margin,
        reelsHeight,
        reelsWidth
    };
}