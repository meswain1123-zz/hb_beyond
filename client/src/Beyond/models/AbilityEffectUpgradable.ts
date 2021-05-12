
import {
  PotenceUpgradable,
  Potence,
  AbilityEffect,
  Character,
  RollPlus,
  UpgradableNumber
} from ".";

export class AbilityEffectUpgradable {
  type: string; // damage type or 'Control', 'Utility', 'Healing', 'Max HP', or 'Temp HP'
  potence_type: string; // Character, Class, or Slot (Level)
  add_modifier: string; // boolean or condition
  attack_type: string; // melee, ranged, melee spell, ranged spell, bonus, save, or none
  potences: PotenceUpgradable[]; 
  bonus: UpgradableNumber;
  conditions_applied: string[];

  
  constructor(obj?: any) {
    this.type = obj ? obj.type : "None";
    this.potence_type = obj ? obj.potence_type : "Slot";
    this.add_modifier = obj ? obj.add_modifier : "false";
    this.attack_type = obj ? obj.attack_type : "Ranged Spell";
    this.potences = [];
    if (obj && obj.potences) {
      if (obj.potences.length) {
        obj.potences.forEach((p: any) => {
          this.potences.push(new PotenceUpgradable(p));
        });
      }
    }
    this.bonus = new UpgradableNumber();
    if (obj && obj.bonus) {
      if (obj.bonus.base !== undefined) {
        this.bonus = new UpgradableNumber(obj.bonus);
      }
    }
    this.conditions_applied = obj && obj.conditions_applied ? obj.conditions_applied : [];
  }

  toDBObj = () => {
    const potences: any[] = [];
    this.potences.forEach(p => {
      potences.push(p.toDBObj());
    });
    return {
      type: this.type,
      potence_type: this.potence_type,
      add_modifier: this.add_modifier,
      attack_type: this.attack_type,
      potences,
      bonus: this.bonus.toDBObj(),
      conditions_applied: this.conditions_applied
    };
  }

  clone(): AbilityEffectUpgradable {
    return new AbilityEffectUpgradable(this);
  }

  copy(copyMe: AbilityEffectUpgradable): void {
    this.type = copyMe.type;
    this.potence_type = copyMe.potence_type;
    this.add_modifier = copyMe.add_modifier;
    this.attack_type = copyMe.attack_type;
    this.potences = copyMe.potences;
    this.bonus = copyMe.bonus;
    this.conditions_applied = copyMe.conditions_applied;
  }

  convert_to_ability_effect(char: Character, class_id: string, base_slot_level: number, slot_level: number): AbilityEffect {
    const ability_effect = new AbilityEffect();
    ability_effect.add_modifier = this.add_modifier;
    ability_effect.attack_type = this.attack_type;
    ability_effect.conditions_applied = this.conditions_applied;
    ability_effect.bonus = this.bonus;
    ability_effect.potence_type = this.potence_type;
    ability_effect.potences = [];
    this.potences.forEach(p => {
      const potence = new Potence();
      potence.extra = p.extra;
      potence.level = p.level;
      potence.rolls = new RollPlus();
      potence.rolls.ability_score = p.rolls.ability_score;
      potence.rolls.count = p.rolls.count.value(char, class_id, base_slot_level, slot_level);
      potence.rolls.flat = p.rolls.flat.value(char, class_id, base_slot_level, slot_level);
      potence.rolls.size = p.rolls.size.value(char, class_id, base_slot_level, slot_level);
      if (potence.rolls.count > 0) {
        if (potence.rolls.flat > 0) {
          potence.rolls.as_string = `${potence.rolls.count}d${potence.rolls.size}+${potence.rolls.flat}`;
        } else {
          potence.rolls.as_string = `${potence.rolls.count}d${potence.rolls.size}`;
        }
      } else if (potence.rolls.flat > 0) {
        potence.rolls.as_string = `${potence.rolls.flat}`;
      }
      potence.rolls.type = p.rolls.type;
      potence.rolls.true_id = p.rolls.true_id;
      potence.true_id = p.true_id;
      ability_effect.potences.push(potence);
    });
    ability_effect.type = this.type;
    return ability_effect;
  }
}