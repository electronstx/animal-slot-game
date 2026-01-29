import * as PIXI from 'pixi.js';
import Scene from '../scene';
import { SYMBOL_SIZE } from '../../constants';
import { getLayout } from '../../utils/layout';

export default class HUD {
    #scene?: Scene;
    #overlays?: PIXI.Graphics;
    #headerText?: PIXI.Text;
    #playText?: PIXI.Text;
    #spinButton?: PIXI.Container;
    #onSpin?: () => void;

    constructor(scene: Scene, onSpin: () => void) {
        this.#scene = scene;
        this.#onSpin = onSpin;
    }

    create(): void {
        if (!this.#scene) return;

        const { width, height } = this.#scene.app.screen;
        const margin = (height - SYMBOL_SIZE * 3) / 2;

        const hudContainer = new PIXI.Container();
        this.#scene.app.stage.addChild(hudContainer);

        this.#overlays = new PIXI.Graphics();
        this.#overlays
            .rect(0, 0, width, margin)
            .fill({ color: 0x000000, alpha: 1 })
            .rect(0, SYMBOL_SIZE * 3 + margin, width, margin)
            .fill({ color: 0x000000, alpha: 1 });
        
        hudContainer.addChild(this.#overlays);

        const style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 36,
            fontWeight: 'bold',
            fill: 0xff5500,
        });

        this.#headerText = new PIXI.Text({ text: 'Animal Slot Game', style });
        this.#headerText.anchor.set(0.5);
        this.#headerText.x = width / 2;
        this.#headerText.y = margin / 2;
        hudContainer.addChild(this.#headerText);

        this.#spinButton = new PIXI.Container();
        
        const btnBg = new PIXI.Graphics()
            .roundRect(-120, -25, 240, 50, 15)
            .fill({ color: 0x444444 });

        this.#playText = new PIXI.Text({ text: 'SPIN!', style });
        this.#playText.anchor.set(0.5);

        this.#spinButton.addChild(btnBg, this.#playText);
        
        this.#spinButton.x = width / 2;
        this.#spinButton.y = height - margin / 2;

        this.#spinButton.eventMode = 'static';
        this.#spinButton.cursor = 'pointer';
        
        this.#spinButton.on('pointerdown', () => {
            this.#spinButton?.scale.set(0.95);
            this.#onSpin?.();
        });

        this.#spinButton.on('pointerup', () => this.#spinButton?.scale.set(1));
        this.#spinButton.on('pointerupoutside', () => this.#spinButton?.scale.set(1));

        hudContainer.addChild(this.#spinButton);

        this.#resize();

        this.#scene.app.renderer.on('resize', this.#resize, this);
    }

    #resize(): void {
        if (!this.#scene || !this.#overlays || !this.#headerText || !this.#spinButton) return;

        const layout = getLayout(this.#scene.app.screen.width, this.#scene.app.screen.height);

        this.#overlays.clear()
            .rect(0, 0, layout.width, layout.margin)
            .fill({ color: 0x000000, alpha: 1 })
            .rect(0, layout.margin + layout.reelsHeight, layout.width, layout.margin)
            .fill({ color: 0x000000, alpha: 1 });

        this.#headerText.x = layout.width / 2;
        this.#headerText.y = layout.margin / 2;

        this.#spinButton.x = layout.width / 2;
        this.#spinButton.y = layout.height - layout.margin / 2;
    }
}