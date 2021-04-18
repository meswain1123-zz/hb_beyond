
import { Character } from ".";

export class UpgradableNumber {
  base: number; // the base number
  add_char_level_mult: number; // add a multiple of the character level
  add_class_level_mult: number; // multiply the class level by this when adding
  add_prof_bonus_mult: number;
  // base_slot_level: number;
  add_slot_level_mult: number;
  
  
  constructor(obj?: any) {
    this.base = obj ? obj.base : 0;
    this.add_char_level_mult = obj ? obj.add_char_level_mult : 0;
    this.add_class_level_mult = obj ? obj.add_class_level_mult : 0;
    this.add_prof_bonus_mult = obj ? obj.add_prof_bonus_mult : 0;
    // this.base_slot_level = obj ? obj.base_slot_level : 0;
    this.add_slot_level_mult = obj ? obj.add_slot_level_mult : 0;
  }

  toDBObj = () => {
    return {
      base: this.base,
      add_char_level_mult: this.add_char_level_mult,
      add_class_level_mult: this.add_class_level_mult,
      add_prof_bonus_mult: this.add_prof_bonus_mult,
      // base_slot_level: this.base_slot_level,
      add_slot_level_mult: this.add_slot_level_mult
    };
  }

  clone(): UpgradableNumber {
    return new UpgradableNumber(this);
  }

  copy(copyMe: UpgradableNumber): void {
    this.base = copyMe.base;
    this.add_char_level_mult = copyMe.add_char_level_mult;
    this.add_class_level_mult = copyMe.add_class_level_mult;
    this.add_prof_bonus_mult = copyMe.add_prof_bonus_mult;
    // this.base_slot_level = copyMe.base_slot_level;
    this.add_slot_level_mult = copyMe.add_slot_level_mult;
  }

  value(char: Character, class_id: string = "", base_slot_level: number | null = null, slot_level: number | null = null) {
    let value = this.base;
    value += this.add_char_level_mult * char.character_level;
    if (class_id.length > 0) {
      const obj_finder = char.classes.filter(o => o.game_class_id === class_id);
      if (obj_finder.length === 1) {
        value += this.add_class_level_mult * obj_finder[0].level;
      }
    }
    value += this.add_prof_bonus_mult * char.proficiency_modifier;
    if (base_slot_level && slot_level) {
      value += this.add_slot_level_mult * (slot_level - base_slot_level);
    }
    return value;
  }

  // copyTemplate(copyMe: AbilityTemplate): void {
  //   // this.name = copyMe.name;
  // }
}