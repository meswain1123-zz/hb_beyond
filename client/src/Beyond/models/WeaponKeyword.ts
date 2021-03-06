
import { ModelBase } from "./ModelBase";

/**
 * Simple, Martial, Range, Ammunition, 
 * Finesse, Heavy, Light, 
 * Loading, Reach, Special, Thrown, 
 * Two-Handed, Versatile, Silvered, 
 * Monk, Hex-weapon, Armorer-weapon.
 */
export class WeaponKeyword extends ModelBase {
  static data_type: string = "weapon_keyword";
  use_ability_score: string | null; 
  // Simple and Martial = STR, Range = DEX, Finesse = STR|DEX, 
  // Hex-weapon = CHA, Armorer-weapon = INT 
  // Weapons that have more than one will automatically use whatever 
  // is highest for the character.
  display_in_equipment: boolean;
  can_two_weapon_fight: boolean; 
  

  constructor(obj?: any) {
    super(obj);
    this.use_ability_score = obj ? obj.use_ability_score : "";
    this.display_in_equipment = obj && obj.display_in_equipment ? obj.display_in_equipment : false;
    this.can_two_weapon_fight = obj && obj.can_two_weapon_fight ? obj.can_two_weapon_fight : false;
  }

  toDBObj = () => {
    return {
      _id: this._id,
      name: this.name,
      description: this.description,
      source_type: this.source_type,
      source_id: this.source_id,
      use_ability_score: this.use_ability_score,
      display_in_equipment: this.display_in_equipment,
      can_two_weapon_fight: this.can_two_weapon_fight
    };
  }

  clone(): WeaponKeyword {
    return new WeaponKeyword(this);
  }

  copy(copyMe: WeaponKeyword): void {
    this._id = copyMe._id;
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.source_type = copyMe.source_type;
    this.source_id = copyMe.source_id;
    this.use_ability_score = copyMe.use_ability_score;
    this.display_in_equipment = copyMe.display_in_equipment;
    this.can_two_weapon_fight = copyMe.can_two_weapon_fight;
  }
}