import { Scene } from "phaser";
import { Zombie } from "./Zombie";
import Player from "./Player";

export class ZombieGroup extends Phaser.GameObjects.Group {
    private spawnRate: number;
    private enemiesPerSpawn: number;
    private elapsedMinutes: number;

    constructor(scene: Scene) {
        super(scene, {
            classType: Zombie,
            maxSize: 100,
        });

        scene.add.existing(this);

        this.spawnRate = 1000;
        this.enemiesPerSpawn = 10;
        this.elapsedMinutes = 0;

        this.startSpawnTimer();
        this.startMinuteTracker();

        // for (let i = 0; i < 100; i++) {
        //     const zombie = this.get() as Zombie;
        //     if (zombie) {
        //         zombie.activateZombie();
        //     }
        // }
    }

    private startSpawnTimer() {
        this.scene.time.addEvent({
            delay: this.spawnRate,
            loop: true,
            callback: () => {
                this.spawnEnemies();
            },
            callbackScope: this,
        });
    }

    private startMinuteTracker() {
        this.scene.time.addEvent({
            delay: 60000,
            loop: true,
            callback: () => {
                this.elapsedMinutes++;
                this.adjustSpawnRate();
            },
            callbackScope: this,
        });
    }

    private adjustSpawnRate() {
        // Adjust spawn rate and enemies per spawn based on elapsed minutes
        this.enemiesPerSpawn = this.elapsedMinutes + 1; // Increase enemies per spawn each minute
        this.spawnRate = 2000 / (this.elapsedMinutes + 1); // Decrease spawn interval
    }

    private spawnEnemies() {
        for (let i = 0; i < this.enemiesPerSpawn; i++) {
            this.addZombie();
        }
    }

    exampleInfiniteZombie() {
        this.scene.time.addEvent({
            delay: 50,
            loop: true,
            callback: () => {
                this.addZombie();
            },
            callbackScope: this,
        });
    }

    addZombie() {
        const zombie = this.get() as Zombie;
        if (zombie) {
            zombie.activateZombie();
        }
    }

    // PowerUps
    getNuked() {
        this.children.iterate((zombie: Phaser.GameObjects.GameObject) => {
            if (zombie instanceof Zombie) {
                zombie.die();
            }
            return true;
        });
    }

    getFreezed(isTimeStopped: boolean) {
        const action = isTimeStopped ? "freeze" : "unfreeze";

        this.children.iterate((zombie: Phaser.GameObjects.GameObject) => {
            if (zombie instanceof Zombie) {
                (zombie as Zombie)[action]();
            }
            return true;
        });
    }

    update(player: Player) {
        this.children.iterate((zombie: Phaser.GameObjects.GameObject) => {
            if (zombie instanceof Zombie) {
                zombie.update(player);
            }
            return true;
        });
    }
}

