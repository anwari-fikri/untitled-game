import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import Player from "../classes/Player";
import PowerUps, { PowerUpType } from "../classes/PowerUps";
import { PickUp } from "../classes/PickUp";
import Weapon from "../classes/Weapon";
import { createPause } from "../classes/PauseResume";
import Enemy from "../classes/Enemy";

export class Game extends Scene {
    private player: Player;
    private enemy1: Enemy;
    private weapon: Weapon;
    private speedBoost: PowerUps;
    private speedBoost2: PowerUps;
    private background: Phaser.GameObjects.Image;

    constructor() {
        super("Game");
    }

    create() {
        this.background = this.add
            .image(400, 300, "bg-bridge")
            .setScrollFactor(1);
        this.cameras.main.setZoom(1.5);

        this.weapon = new Weapon(this, 200, 200, "katana");

        this.player = new Player(this, 100, 450, "dude");
        this.enemy1 = new Enemy(this, 100, 650, "dude", 100.0, 5);

        this.speedBoost = new PowerUps(
            this,
            400,
            450,
            "star",
            PowerUpType.SPEED_BOOST,
        );
        this.speedBoost2 = new PowerUps(
            this,
            0,
            450,
            "star",
            PowerUpType.SPEED_BOOST,
        );
        PickUp(this, this.player, this.weapon);
        PickUp(this, this.player, this.speedBoost);
        PickUp(this, this.player, this.speedBoost2);

        EventBus.emit("current-scene-ready", this);
    }

    update() {
        this.player.update();
        this.enemy1.chase(this.player);
        this.enemy1.performAttack(this.player);
    }

    changeScene() {
        this.scene.start("GameOver");
    }
}
