import Player from "./Player";
import Inventory from "./Inventory";
import Weapon from "./Weapon";
import { ZombieGroup } from "./ZombieGroup";

export function AttackWeapon(
    scene: Phaser.Scene,
    player: Player,
    inventory: Inventory,
    zombies: ZombieGroup,
) {
    const keyboardPlugin = scene.input.keyboard;
    const attackKey = keyboardPlugin?.addKey(Phaser.Input.Keyboard.KeyCodes.J);
    let isAttacking = false;

    // Function to define custom hitboxes
    const createHitBox = (
        weapon: Weapon,
        width: number,
        height: number,
        originX: number = 0,
        originY: number = 0,
    ) => {
        if (weapon.body instanceof Phaser.Physics.Arcade.Body) {
            weapon.body.setSize(width, height);
            const offsetX = (weapon.width - width) * originX;
            const offsetY = (weapon.height - height) * originY;
            weapon.body.setOffset(offsetX, offsetY);
        }
    };

    attackKey?.on("down", () => {
        if (isAttacking) return;
        const equippedWeapon = inventory.getEquippedWeapon();
        if (!equippedWeapon) {
            console.log("No weapon equipped.");
            return;
        }

        if (equippedWeapon instanceof Weapon) {
            equippedWeapon.setPosition(player.x, player.y);
            equippedWeapon.setVisible(true);
            equippedWeapon.setActive(true);
            equippedWeapon.enableBody();

            if (!scene.children.list.includes(equippedWeapon)) {
                scene.add.existing(equippedWeapon);
                scene.physics.add.existing(equippedWeapon);
                if (equippedWeapon.body instanceof Phaser.Physics.Arcade.Body) {
                    equippedWeapon.body.enable = false; // Initially disable physics body
                }
            }

            console.log(
                "Performing melee attack with",
                equippedWeapon.texture.key,
            );

            const handleAttackComplete = () => {
                if (scene.physics.overlap(equippedWeapon, zombies)) {
                    console.log("OOF");
                }
                equippedWeapon.setVisible(false);
                equippedWeapon.setActive(false);
                equippedWeapon.disableBody(true, true);
                if (equippedWeapon.body instanceof Phaser.Physics.Arcade.Body) {
                    equippedWeapon.body.enable = false;
                    equippedWeapon.body.setVelocity(0);
                    equippedWeapon.body.rotation = 0;
                }
                isAttacking = false;
            };

            const handleShortRangeAttack = () => {
                const thrustDistance = 10;
                equippedWeapon.setOrigin(0.5, 1);
                let targetX: number;
                let targetY: number;

                if (player.facing === "left") {
                    equippedWeapon.setAngle(-90);
                    targetX = player.x - thrustDistance;
                } else {
                    equippedWeapon.setAngle(90);
                    targetX = player.x + thrustDistance;
                }

                targetY = player.y;

                createHitBox(equippedWeapon, 150, 50); // Example hit box size for short range
                if (equippedWeapon.body instanceof Phaser.Physics.Arcade.Body) {
                    equippedWeapon.body.enable = true;
                }

                scene.tweens.add({
                    targets: equippedWeapon,
                    x: targetX,
                    y: targetY,
                    duration: 100,
                    ease: "power1",
                    onComplete: handleAttackComplete,
                });
            };

            const handleMediumRangeAttack = () => {
                const rotationAngle = 90;
                const rotationDuration = 300;
                const swingDistance = 5;

                let initialX =
                    player.facing === "left"
                        ? player.x - swingDistance
                        : player.x + swingDistance;
                let initialY = player.y + 15;

                equippedWeapon.setPosition(initialX, initialY);
                equippedWeapon.setAngle(player.facing === "left" ? -45 : 45);
                equippedWeapon.setOrigin(0.5, 1);

                createHitBox(equippedWeapon, 150, 100, 0.5, 0.5); // Example hitbox size for medium range
                if (equippedWeapon.body instanceof Phaser.Physics.Arcade.Body) {
                    equippedWeapon.body.enable = true;
                }

                scene.tweens.add({
                    targets: equippedWeapon,
                    x: initialX,
                    y: initialY,
                    angle: player.facing === "left" ? -135 : 135,
                    duration: rotationDuration,
                    ease: "linear",
                    onComplete: handleAttackComplete,
                });
            };

            const handleLongRangeAttack = () => {
                const rotationAngle = 180;
                const rotationDuration = 500;
                const swingDistance = 5;

                let initialX =
                    player.facing === "left"
                        ? player.x - swingDistance
                        : player.x + swingDistance;
                let initialY = player.y + 15;

                equippedWeapon.setPosition(initialX, initialY);
                equippedWeapon.setAngle(player.facing === "left" ? 0 : 0);
                equippedWeapon.setOrigin(0.5, 1);

                createHitBox(equippedWeapon, 150, 300, 0.5, 0.01); // Example hitbox size for medium range
                if (equippedWeapon.body instanceof Phaser.Physics.Arcade.Body) {
                    equippedWeapon.body.enable = true;
                }

                scene.tweens.add({
                    targets: equippedWeapon,
                    x: initialX,
                    y: initialY,
                    angle: player.facing === "left" ? -180 : 180,
                    duration: rotationDuration,
                    ease: "linear",
                    onComplete: handleAttackComplete,
                });
            };

            isAttacking = true;

            if (equippedWeapon.getIsMelee()) {
                switch (equippedWeapon.getMeleeRange()) {
                    case "short":
                        handleShortRangeAttack();
                        break;
                    case "medium":
                        handleMediumRangeAttack();
                        break;
                    case "long":
                        handleLongRangeAttack();
                        break;
                    default:
                        console.log("Unknown melee range.");
                }
            } else {
                // Handle ranged weapon logic here if needed
            }
        } else {
            console.log("Equipped item is not a valid weapon.");
        }
    });

    // Update the weapon's position to follow the player
    scene.events.on("update", () => {
        const equippedWeapon = inventory.getEquippedWeapon();
        if (equippedWeapon && !isAttacking) {
            equippedWeapon.setPosition(player.x, player.y);
        }
    });
}
