import * as PIXI from 'pixi.js';
import { ReelType } from './types';
import Scene from '../scene';
import { SLOT_KEYS } from '../../assets';
import { Assets } from 'pixi.js';
import { backout, tweenTo, updateTweens } from './tween';
import { REEL_WIDTH, SYMBOL_SIZE } from '../../constants';
import { getLayout } from '../../utils/layout';

export default class Reel {
    #scene?: Scene;
    #reels: ReelType[] = [];
    #textureKeys: string[] = [];
    #running = false;
    #reelContainer?: PIXI.Container;

    constructor(scene: Scene) {
        this.#scene = scene;

        this.#textureKeys = SLOT_KEYS; 
    }

    async create(): Promise<void> {
        if (!this.#scene) return;

        this.#reelContainer = new PIXI.Container();

        for (let i = 0; i < 5; i++) {
            const rc = new PIXI.Container();
            rc.x = i * REEL_WIDTH;
            this.#reelContainer.addChild(rc);

            const reel: ReelType = {
                container: rc,
                symbols: [],
                position: 0,
                previousPosition: 0,
                blur: new PIXI.BlurFilter(),
            };
            reel.blur.strengthX = 0;
            reel.blur.strengthY = 0;

            for (let j = 0; j < 4; j++) {
                const symbol = this.#createSymbol(j);
                reel.symbols.push(symbol);
                rc.addChild(symbol);
            }
            this.#reels.push(reel);
        }

        const margin = (this.#scene.app.screen.height - SYMBOL_SIZE * 3) / 2;
        this.#reelContainer.y = margin;
        this.#reelContainer.x = Math.round(this.#scene.app.screen.width - REEL_WIDTH * 5);

        this.#scene.addChild(this.#reelContainer);

        this.#resize();

        this.#scene.app.renderer.on('resize', this.#resize, this);

        this.#scene.app.ticker.add(this.update, this);
    }

    #resize(): void {
        if (!this.#reelContainer || !this.#scene) return;

        const layout = getLayout(this.#scene.app.screen.width, this.#scene.app.screen.height);

        this.#reelContainer.scale.set(layout.gameScale);
        this.#reelContainer.x = (layout.width - layout.reelsWidth) / 2;
        this.#reelContainer.y = layout.margin;
    }

    #createSymbol(index: number): PIXI.Sprite {
        const randomKey = this.#textureKeys[Math.floor(Math.random() * this.#textureKeys.length)];
        const texture = Assets.get(randomKey);
        const symbol = new PIXI.Sprite(texture);
        
        symbol.y = index * SYMBOL_SIZE;
        const scale = Math.min(SYMBOL_SIZE / symbol.width, SYMBOL_SIZE / symbol.height);
        symbol.scale.set(scale);
        symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
        
        return symbol;
    }

    update(): void {
        updateTweens();

        for (const r of this.#reels) {
            const speed = r.position - r.previousPosition;
            r.blur.strengthY = (r.position - r.previousPosition) * 8;
            r.previousPosition = r.position;

            if (Math.abs(speed) < 0.001 && r.container.filters) {
                r.container.filters = null;
            }

            for (let j = 0; j < r.symbols.length; j++) {
                const s = r.symbols[j];
                const prevY = s.y;
                
                s.y = ((r.position + j) % r.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;

                if (s.y < 0 && prevY > SYMBOL_SIZE) {
                    const randomKey = this.#textureKeys[Math.floor(Math.random() * this.#textureKeys.length)];
                    s.texture = Assets.get(randomKey);
                }
            }
        }
    }

    spin(): void {
        if (this.#running) return;
        this.#running = true;
    
        this.#reels.forEach((r, i) => {
            const extra = Math.floor(Math.random() * 3);
            const target = r.position + 10 + i * 5 + extra;
            const time = 2500 + i * 600;

            r.container.filters = [r.blur];
    
            tweenTo(
                r, 
                'position', 
                target, 
                time, 
                backout(0.5), 
                i === this.#reels.length - 1 ? () => { this.#running = false; } : null
            );
        });
    }
}