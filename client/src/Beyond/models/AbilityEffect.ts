
import {
  Potence,
  RollPlus,
  // SummonOption
} from ".";

export class AbilityEffect {
  type: string; // damage type or 'Control', 'Utility', 'Healing', 'Max HP', or 'Temp HP'
  potence_type: string; // Character, Class, or Slot (Level)
  add_modifier: string; // boolean or condition
  attack_type: string; // melee, ranged, melee spell, ranged spell, bonus, save, or none
  potences: Potence[]; 
  use_formula: boolean;
  potence_formula: string;
  conditions_applied: string[];
  // summon_options: SummonOption[];

  
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
    // this.summon_options = [];
    // if (obj && obj.summon_options && obj.summon_options.length) {
    //   obj.summon_options.forEach((p: any) => {
    //     this.summon_options.push(new SummonOption(p));
    //   });
    // }
    this.use_formula = obj && obj.use_formula ? obj.use_formula : false;
    this.potence_formula = obj && obj.potence_formula ? obj.potence_formula : "";
    this.conditions_applied = obj && obj.conditions_applied ? obj.conditions_applied : [];
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
    // const summon_options: any[] = [];
    // this.summon_options.forEach(p => {
    //   summon_options.push(p.toDBObj());
    // });
    return {
      type: this.type,
      potence_type: this.potence_type,
      add_modifier: this.add_modifier,
      attack_type: this.attack_type,
      potences,
      // summon_options,
      use_formula: this.use_formula,
      potence_formula: this.potence_formula,
      conditions_applied: this.conditions_applied
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
    // this.summon_options = copyMe.summon_options;
    this.use_formula = copyMe.use_formula;
    this.potence_formula = copyMe.potence_formula;
    this.conditions_applied = copyMe.conditions_applied;
  }

  // copyTemplate(copyMe: AbilityTemplate): void {
  //   // this.name = copyMe.name;
  // }
}