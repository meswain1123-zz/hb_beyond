
import {
  PotenceUpgradable,
} from ".";

export class AbilityEffectUpgradable {
  type: string; // damage type or 'Control', 'Utility', 'Healing', 'Max HP', or 'Temp HP'
  potence_type: string; // Character, Class, or Slot (Level)
  add_modifier: string; // boolean or condition
  attack_type: string; // melee, ranged, melee spell, ranged spell, bonus, save, or none
  potences: PotenceUpgradable[]; 
  use_formula: boolean;
  potence_formula: string;
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
    this.use_formula = obj && obj.use_formula ? obj.use_formula : false;
    this.potence_formula = obj && obj.potence_formula ? obj.potence_formula : "";
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
      use_formula: this.use_formula,
      potence_formula: this.potence_formula,
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
    this.use_formula = copyMe.use_formula;
    this.potence_formula = copyMe.potence_formula;
    this.conditions_applied = copyMe.conditions_applied;
  }
}