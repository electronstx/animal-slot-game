import { Assets } from "pixi.js";

export const manifest = {
    background: '/assets/background.jpg',
    bear: '/assets/bear.jpg',
    elk: '/assets/elk.jpg',
    fox: '/assets/fox.png',
    hare: '/assets/hare.png',
    hedgehog: '/assets/hedgehog.jpg',
    wolf: '/assets/wolf.jpg',
};

export async function getAssets(): Promise<boolean> {
    const assetUrls = Object.values(manifest);
    await Assets.load(assetUrls);

    for (const [key, url] of Object.entries(manifest)) {
        const texture = Assets.get(url);
        if (texture) {
            Assets.cache.set(key, texture);
        }
    }

    return true;
}

export const SLOT_KEYS = ['bear', 'elk', 'fox', 'hare', 'hedgehog', 'wolf'];