
import {
  Potence,
  RollPlus,
  UpgradableNumber
} from ".";

export class AbilityEffect {
  type: string; // damage type or 'Control', 'Utility', 'Healing', 'Max HP', or 'Temp HP'
  potence_type: string; // Character, Class, or Slot (Level)
  add_modifier: string; // boolean or condition
  attack_type: string; // melee, ranged, melee spell, ranged spell, bonus, save, or none
  potences: Potence[]; 
  bonus: UpgradableNumber;
  conditions_applied: string[];
  create_resource_type: string;
  create_resource_level: number;
  create_resource_amount: UpgradableNumber;

  
  constructor(obj?: any) {
    this.type = obj ? `${obj.type}` : "None";
    this.potence_type = obj ? `${obj.potence_type}` : "Slot";
    this.add_modifier = obj ? `${obj.add_modifier}` : "false";
    this.attack_type = obj ? `${obj.attack_type}` : "Ranged Spell";
    this.potences = [];
    if (obj && obj.potences) {
      if (obj.potences.length) {
        obj.potences.forEach((p: any) => {
          this.potences.push(new Potence(p));
        });
      } else {
        // It's an object from before I changed the structure.
        Object.keys(obj.potences).forEach((key: string) => {
          const potence_obj = obj.potences[key];
          const potence = new Potence();
          potence.level = +key;
          const dr = new RollPlus();
          dr.count = +potence_obj.dice_count;
          dr.size = +potence_obj.dice_size;
          dr.type = this.type;
          potence.rolls = dr;
          this.potences.push(potence);
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
    this.create_resource_type = obj && obj.create_resource_type ? obj.create_resource_type : "None";
    this.create_resource_level = obj && obj.create_resource_level ? obj.create_resource_level : 1;
    this.create_resource_amount = new UpgradableNumber();
    if (obj && obj.create_resource_amount) {
      if (obj.create_resource_amount.base !== undefined) {
        this.create_resource_amount = new UpgradableNumber(obj.create_resource_amount);
      } else {
        this.create_resource_amount.base = obj.create_resource_amount;
      }
    }
  }

  toDBObj = () => {
    // Old way.  Saving for some info
    // const potences: any = {};
    // this.potences.forEach(p => {
    //   potences[p.level] = { dice_count: p.dice_count, dice_size: p.dice_size };
    // });
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
      conditions_applied: this.conditions_applied,
      create_resource_type: this.create_resource_type,
      create_resource_level: this.create_resource_level,
      create_resource_amount: this.create_resource_amount.toDBObj()
    };
  }

  clone(): AbilityEffect {
    return new AbilityEffect(this);
  }

  copy(copyMe: AbilityEffect): void {
    this.type = copyMe.type;
    this.potence_type = copyMe.potence_type;
    this.add_modifier = copyMe.add_modifier;
    this.attack_type = copyMe.attack_type;
    this.potences = copyMe.potences;
    this.bonus = copyMe.bonus;
    this.conditions_applied = copyMe.conditions_applied;
    this.create_resource_type = copyMe.create_resource_type;
    this.create_resource_level = copyMe.create_resource_level;
    this.create_resource_amount = copyMe.create_resource_amount;
  }
}