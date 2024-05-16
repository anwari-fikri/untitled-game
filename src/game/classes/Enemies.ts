import Phaser from "phaser";
import Enemy from "../classes/Enemy";
import Player from "../classes/Player";

export default class Enemies {
    private scene: Phaser.Scene;
    private enemies: Phaser.Physics.Arcade.Group;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.enemies = this.scene.physics.add.group();
    }

    createEnemy(enemy: Enemy, wallLayer: any) {
        this.enemies.add(enemy);
        if (enemy && wallLayer) {
            this.scene.physics.add.collider(enemy, wallLayer);
        }
    }

    update(player: Player) {
        this.enemies.children.iterate(
            (gameObject: Phaser.GameObjects.GameObject) => {
                const enemy = gameObject as Enemy;
                if (enemy && enemy instanceof Enemy) {
                    enemy.update(player);
                }
                return true;
            },
        );
    }

    getNuked() {
        this.enemies.clear(true, true);
    }

    getTimeStopped() {
        this.enemies.children.iterate(
            (gameObject: Phaser.GameObjects.GameObject) => {
                const enemy = gameObject as Enemy;
                if (enemy && enemy instanceof Enemy) {
                    enemy.setChaseSpeed(0);
                }
                return true;
            },
        );
    }

    resumeMovement() {
        this.enemies.children.iterate(
            (gameObject: Phaser.GameObjects.GameObject) => {
                const enemy = gameObject as Enemy;
                if (enemy && enemy instanceof Enemy) {
                    enemy.setChaseSpeed(100);
                }
                return true;
            },
        );
    }

    getGroup() {
        return this.enemies;
    }
}
