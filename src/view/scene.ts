import * as PIXI from 'pixi.js';
import Reel from './animations/reel';

export default class Scene extends PIXI.Container {
    app: PIXI.Application;
    #reelController?: Reel;

    constructor(app: PIXI.Application) {
        super();
        this.app = app;
    }

    async create(): Promise<void> {
        const bgTexture = PIXI.Assets.get('background');
        const background = new PIXI.Sprite(bgTexture);
        background.width = this.app.screen.width;
        background.height = this.app.screen.height;
        this.addChild(background);

        this.#reelController = new Reel(this);
        await this.#reelController?.create();

        this.app.stage.eventMode = 'static';
        this.app.stage.on('pointerdown', () => {
            this.#reelController?.spin();
        });
    }
}