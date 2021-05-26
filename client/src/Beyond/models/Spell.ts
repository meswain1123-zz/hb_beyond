
import { 
  ModelBase, 
  AbilityEffect, 
  SpellTemplate 
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
export class Spell extends ModelBase {
  static data_type: string = "spell";
  static always_store: boolean = false;
  saving_throw_ability_score: string | null; // Ability Score saving throw the target(s) have to make
  effects: AbilityEffect[]; // Formula for how much damage/healing to do
  // effect_2: AbilityEffect; // Some abilities have a second (like Ice Knife or Booming Blade or things that do different types of damage)
  range: string | null; // Self, Touch, or a number
  range_2: string | null; // For some there are multiple ranges.  It can be an AoE size, or sometimes something else.
  concentration: boolean;
  ritual: boolean;
  notes: string | null;
  duration: string;
  components: string[]; // VSM
  material_component: string;
  casting_time: string; // A, BA, RA, X minute(s), etc
  school: string | null;
  level: number;
  
  
  constructor(obj?: any) {
    super(obj);
    this.saving_throw_ability_score = obj ? obj.saving_throw_ability_score : null;
    this.effects = []; 
    if (obj && obj.effects && obj.effects.length) {
      obj.effects.forEach((effect: any) => {
        this.effects.push(new AbilityEffect(effect));
      });
    } else if (obj && obj.effect) {
      this.effects.push(new AbilityEffect(obj.effect));
    }
    // this.effect = obj ? new AbilityEffect(obj.effect) : new AbilityEffect();
    // this.effect_2 = obj ? new AbilityEffect(obj.effect_2) : new AbilityEffect();
    this.range = obj ? obj.range : null;
    this.range_2 = obj ? obj.range_2 : null;
    this.concentration = obj ? obj.concentration : false;
    this.ritual = obj ? obj.ritual : false;
    this.notes = obj ? obj.notes : null;
    this.duration = obj ? obj.duration : "Instantaneous";
    this.components = obj ? [...obj.components] : [];
    this.material_component = obj ? obj.material_component : "";
    this.casting_time = obj ? obj.casting_time : "A";
    this.school = obj ? obj.school : "";
    this.level = obj ? obj.level : 0;
  }

  toDBObj = () => {
    const effects: any[] = [];
    for (let i = 0; i < this.effects.length; i++) {
      effects.push(this.effects[i].toDBObj());
    }
    return {
      _id: this._id,
      name: this.name,
      description: this.description,
      source_type: this.source_type,
      source_id: this.source_id,
      saving_throw_ability_score: this.saving_throw_ability_score,
      effects,
      range: this.range,
      range_2: this.range_2,
      concentration: this.concentration,
      ritual: this.ritual,
      notes: this.notes,
      duration: this.duration,
      components: this.components,
      material_component: this.material_component,
      casting_time: this.casting_time,
      school: this.school,
      level: this.level
    };
  }

  get effect(): AbilityEffect {
    if (this.effects.length > 0) {
      return this.effects[0];
    } else {
      return new AbilityEffect();
    }
  }

  clone(): Spell {
    return new Spell(this);
  }

  copy(copyMe: Spell): void {
    this._id = copyMe._id;
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.source_type = copyMe.source_type;
    this.source_id = copyMe.source_id;
    this.saving_throw_ability_score = copyMe.saving_throw_ability_score;
    this.effects = [...copyMe.effects];
    this.range = copyMe.range;
    this.range_2 = copyMe.range_2;
    this.concentration = copyMe.concentration;
    this.ritual = copyMe.ritual;
    this.notes = copyMe.notes;
    this.duration = copyMe.duration;
    this.components = [...copyMe.components];
    this.material_component = copyMe.material_component;
    this.casting_time = copyMe.casting_time;
    this.school = copyMe.school;
    this.level = copyMe.level;
  }

  copyTemplate(copyMe: SpellTemplate): void {
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.source_type = copyMe.source_type;
    this.source_id = copyMe.source_id;
    this.saving_throw_ability_score = copyMe.saving_throw_ability_score;
    this.effects = [...copyMe.effects];
    this.range = copyMe.range;
    this.range_2 = copyMe.range_2;
    this.concentration = copyMe.concentration;
    this.ritual = copyMe.ritual;
    this.notes = copyMe.notes;
    this.duration = copyMe.duration;
    this.components = [...copyMe.components];
    this.material_component = copyMe.material_component;
    this.casting_time = copyMe.casting_time;
    this.school = copyMe.school;
    this.level = copyMe.level;
  }

  copy5e(copyMe: any): void {
    console.log(copyMe);
    // this.name = copyMe.name;
    // this.description = "";
    // copyMe.desc.forEach((d: string) => {
    //   this.description += d + " \n";
    // });
    // this.saving_throw_ability_score = null; // copyMe.saving_throw_ability_score;
    // this.effect = new AbilityEffect();
    // if (copyMe.dc) {
    //   this.saving_throw_ability_score = copyMe.dc.dc_type.name;
    // }
    // let m: any = null;
    // if (copyMe.heal_at_slot_level) {
    //   this.effect.type = "Healing";
    //   this.effect.potence_type = "Slot";
    //   m = copyMe.heal_at_slot_level;
    // } else if (copyMe.damage) {
    //   m = copyMe.damage;
    //   if (m.damage_type && m.damage_type.name) {
    //     this.effect.type = m.damage_type.name;
    //   }
    //   if (m.damage_at_character_level) {
    //     this.effect.potence_type = "Character";
    //     m = m.damage_at_character_level;
    //   } else if (m.damage_at_slot_level) {
    //     this.effect.potence_type = "Slot";
    //     m = m.damage_at_slot_level;
    //   }
    // }
    // this.effect.potences = [];
    // if (m) {
    //   Object.keys(m).forEach((key: string) => {
    //     if (this.effect && m[+key]) {
    //       const bonus_mod = m[+key].split(" + ");
    //       const bonus = bonus_mod[0].split("d");
    //       if (bonus_mod.length > 1) {
    //         this.effect.add_modifier = "true";
    //       }
    //       const dice_count: number = +bonus[0];
    //       const dice_size: number = bonus.length === 2 ? +bonus[1] : 1;
    //       this.effect.potences.push(new AbilityPotence(this.effect.potences.length, +key, dice_count, dice_size));
    //     }
    //   });
    // }
    // this.effect_2 = new AbilityEffect();
    // // this.potence = copyMe.damage?.damage_type?.name;
    // // this.bonus_2 = null; // copyMe.bonus_2;
    // // this.damage_type_2 = null; // copyMe.damage_type_2;
    // this.range = copyMe.range;
    // this.range_2 = null; // copyMe.range_2;
    // this.concentration = copyMe.concentration;
    // this.ritual = copyMe.ritual;
    // this.notes = null; // copyMe.notes;
    // if (copyMe.duration.includes("Up to")) {
    //   copyMe.duration = copyMe.duration.substring(6);
    // }
    // this.duration = copyMe.duration;
    // switch (copyMe.duration) {
    //   case "1 minute":
    //     this.duration = "1 Minute";
    //     break;
    //   case "10 minutes":
    //     this.duration = "10 Minutes";
    //     break;
    //   case "1 hour":
    //     this.duration = "1 Hour";
    //     break;
    //   case "8 hours":
    //     this.duration = "8 Hours";
    //     break;
    //   case "24 hours":
    //     this.duration = "24 Hours";
    //     break;
    //   case "1 round":
    //     this.duration = "1 Round";
    //     break;
    //   case "2 rounds":
    //     this.duration = "2 Rounds";
    //     break;
    //   default:
    //     this.duration = copyMe.duration;
    //     break;
    // }
    // this.components = [...copyMe.components];
    // this.material_component = copyMe.material;
    // switch (copyMe.casting_time) {
    //   case "1 action":
    //     this.casting_time = "A";
    //     break;
    //   case "1 bonus action":
    //     this.casting_time = "BA";
    //     break;
    //   case "1 reaction":
    //     this.casting_time = "RA";
    //     break;
    //   default:
    //     this.casting_time = "Special";
    //     break;
    // }
    // this.school = copyMe.school.name;
    // this.level = copyMe.level;
  }
}