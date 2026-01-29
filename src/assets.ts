import { Assets } from "pixi.js";

export const manifest = {
    background: { alias: 'background', src: '/assets/background.webp' },
    spritesheet: '/assets/spritesheet.json', 
};

export async function getAssets(): Promise<boolean> {
    await Assets.load([manifest.spritesheet, manifest.background]);

    return true;
}

export const SLOT_KEYS = ['bear', 'elk', 'fox', 'hare', 'hedgehog', 'wolf'];