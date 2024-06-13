import { Game } from "../scenes/Game";

interface SkillLevel {
    level: number;
    bonus: number;
}

export class WeaponSkill {
    atk: SkillLevel;
    slow: SkillLevel;
    confuse: SkillLevel;
    fire: SkillLevel;

    constructor(
        atkLevel: number = 0,
        slowLevel: number = 0,
        confuseLevel: number = 0,
        fireLevel: number = 1,
    ) {
        this.atk = this.createSkillLevel(atkLevel, this.calculateAtkBonus);
        this.slow = this.createSkillLevel(slowLevel, this.calculateSlowBonus);
        this.confuse = this.createSkillLevel(
            confuseLevel,
            this.calculateConfuseBonus,
        );
        this.fire = this.createSkillLevel(fireLevel, this.calculateFireBonus);
    }

    createSkillLevel(
        level: number,
        bonusCalc: (level: number) => number,
    ): SkillLevel {
        return {
            level: level,
            bonus: bonusCalc(level),
        };
    }

    calculateAtkBonus = (level: number): number => {
        // Add flat amount of damage to weapon
        switch (level) {
            case 0:
                return 0;
            case 1:
                return 10;
            case 2:
                return 20;
            case 3:
                return 40;
            default:
                return 40;
        }
    };

    levelUpAtk(): void {
        this.atk.level++;
        this.atk.bonus = this.calculateAtkBonus(this.atk.level);
        Game.player.emit("weaponSkillLevelUp");
    }

    calculateSlowBonus = (level: number): number => {
        // Apply permanent % slow to enemy
        switch (level) {
            case 0:
                return 0;
            case 1:
                return 5;
            case 2:
                return 10;
            case 3:
                return 20;
            default:
                return 20;
        }
    };

    levelUpSlow(): void {
        this.slow.level++;
        this.slow.bonus = this.calculateSlowBonus(this.slow.level);
        Game.player.emit("weaponSkillLevelUp");
    }

    calculateConfuseBonus = (level: number): number => {
        // Apply % chance to confuse enemy per hit
        switch (level) {
            case 0:
                return 0;
            case 1:
                return 5;
            case 2:
                return 10;
            case 3:
                return 20;
            default:
                return 20;
        }
    };

    levelUpConfuse(): void {
        this.confuse.level++;
        this.confuse.bonus = this.calculateConfuseBonus(this.confuse.level);
        Game.player.emit("weaponSkillLevelUp");
    }

    calculateFireBonus = (level: number): number => {
        // Apply damage over time
        switch (level) {
            case 0:
                return 0;
            case 1:
                return 5;
            case 2:
                return 10;
            case 3:
                return 20;
            default:
                return 20;
        }
    };

    levelUpFire(): void {
        this.fire.level++;
        this.fire.bonus = this.calculateFireBonus(this.fire.level);
        Game.player.emit("weaponSkillLevelUp");
    }
}
