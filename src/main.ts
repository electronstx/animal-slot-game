import * as PIXI from 'pixi.js';
import Scene from './view/scene.js';
import { initManifest } from './assets.js';
import { Assets } from 'pixi.js';

const app = new PIXI.Application();

async function init() {
    const container = document.getElementById('pixi-container');
    if (!container) return;

    container.innerHTML = ''; 

    await app.init({
        width: 1200,
        height: 900,
        background: '#1099bb', 
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
        resizeTo: container as HTMLElement
    });
    container.appendChild(app.canvas);

    await initManifest(); 
    await Assets.loadBundle('main');

    const scene = new Scene(app);
    app.stage.addChild(scene);
    await scene.create();
}

init();