import * as PIXI from 'pixi.js';
import Scene from './view/scene.js';
import { getAssets } from './assets.js';

const app = new PIXI.Application();

async function init() {
    const container = document.getElementById('pixi-container');
    if (!container) return;

    await app.init({ 
        background: '#1099bb', 
        resizeTo: container as HTMLElement
    });
    container.appendChild(app.canvas);

    await getAssets();

    const scene = new Scene(app);
    app.stage.addChild(scene);
    await scene.create();
}

init();