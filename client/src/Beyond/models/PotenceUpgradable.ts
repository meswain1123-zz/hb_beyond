
import { v4 as uuidv4 } from "uuid";
import {
  RollPlusUpgradable,
  SummonOption
} from ".";

/**
 * These are spells and other abilities.  
 * I wanted to call them Abilities to make them more generic,
 * because I want to use this for things that aren't spells
 * (like Battlemaster Maneuvers, Weapon Attacks, Sneak Attack, etc).
 * 
 * bonus is a string, but it's complicated, so I'm going to 
 * define how it works here.
 * To help me make sure I understand it myself, I'm going to start
 * with some examples:
 * 
 * Weapon(die, bonus): 1 * {die} + {STR} + {bonus}
 * Range(die, bonus): 1 * {die} + {DEX} + {bonus}
 * Finesse(die, bonus): 1 * {die} + Max({STR},{DEX}) + {bonus}
 * SecondWeapon(die, bonus): 1 * {die} + {bonus}
 * SneakAttack(): Ceil({ClassLevel}/2) * {d6} 
 * 
 * EldritchBlast(): {d10} + ({Features[EldritchInvocations]}.includes("Agonizing Blast") ? {CHA} : 0)
 * Hex(): {d6}
 * BurningHands(slotLevel): (2 + {slotLevel}) * {d6}
 * CureWounds(slotLevel): {slotLevel} * {d8} + {SPM}
 * Note: Multiplier on a die roll doesn't mean roll once 
 * and then multiply.  
 * It means roll that many of it and sum.
 * Spells will each need their own formula.
 * And some will need two formulae, like Ice Knife.
 * Also Versatile weapons will pass different die based on 
 * one and two handed strikes.
 * 
 */
export class PotenceUpgradable {
  true_id: string;
  level: number;
  rolls: RollPlusUpgradable;
  extra: string;
  summon_options: SummonOption[];

  constructor(obj?: any) {
    this.true_id = obj && obj.true_id ? obj.true_id : uuidv4().toString();
    this.level = obj ? obj.level : 1;
    this.rolls = obj ? new RollPlusUpgradable(obj.rolls) : new RollPlusUpgradable();
    this.extra = obj && obj.extra ? obj.extra : "";
    this.summon_options = [];
    if (obj && obj.summon_options && obj.summon_options.length) {
      obj.summon_options.forEach((p: any) => {
        this.summon_options.push(new SummonOption(p));
      });
    }
  }

  toDBObj = () => {
    const summon_options: any[] = [];
    this.summon_options.forEach(p => {
      summon_options.push(p.toDBObj());
    });
    return {
      true_id: this.true_id,
      level: this.level,
      rolls: this.rolls.toDBObj(),
      extra: this.extra,
      summon_options
    };
  }
}
