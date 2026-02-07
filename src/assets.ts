import { Assets } from "pixi.js";

export async function initManifest() {
    await Assets.init({ 
        manifest: "/assets/manifest.json",
        basePath: "/assets"
    });
}