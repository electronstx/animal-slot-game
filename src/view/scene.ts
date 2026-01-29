import * as PIXI from 'pixi.js';
import Reel from './animations/reel';
import HUD from './ui/hud';

export default class Scene extends PIXI.Container {
    app: PIXI.Application;
    #background?: PIXI.Sprite;
    #reelController?: Reel;
    #hud?: HUD;

    constructor(app: PIXI.Application) {
        super();
        this.app = app;
    }

    async create(): Promise<void> {
        const bgTexture = PIXI.Assets.get('background');
        this.#background = new PIXI.Sprite(bgTexture);
        this.addChild(this.#background);

        this.#reelController = new Reel(this);
        await this.#reelController?.create();

        this.#hud = new HUD(this, () => this.#reelController?.spin());
        this.#hud.create();

        this.#resize();

        this.app.renderer.on('resize', this.#resize, this);
    }

    #resize(): void {
        if (!this.#background) return;

        this.#background.width = this.app.screen.width;
        this.#background.height = this.app.screen.height;

        const bgScale = Math.max(
            this.app.screen.width / this.#background.texture.width,
            this.app.screen.height / this.#background.texture.height
        );
        this.#background.scale.set(bgScale);
        this.#background.x = (this.app.screen.width - this.#background.width) / 2;
        this.#background.y = (this.app.screen.height - this.#background.height) / 2;
    }
}