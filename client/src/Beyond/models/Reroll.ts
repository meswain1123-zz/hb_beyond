
/**
 * Triggers a reroll of damage dice 
 * when they roll below a threshold
 * 
 */
export class Reroll {
  threshold: number;
  allowed_damage_types: string[];
  allowed_armor_types: string[];
  required_armor_types: string[];
  excluded_weapon_keywords: string[];
  required_weapon_keywords: string[];

  constructor(obj?: any) {
    this.threshold = obj ? obj.threshold : 1;
    this.allowed_damage_types = obj && obj.allowed_damage_types ? [...obj.allowed_damage_types] : ["ALL"];
    this.allowed_armor_types = obj && obj.allowed_armor_types ? [...obj.allowed_armor_types] : ["ALL"];
    this.required_armor_types = obj && obj.required_armor_types ? [...obj.required_armor_types] : ["None"];
    this.excluded_weapon_keywords = obj && obj.excluded_weapon_keywords ? [...obj.excluded_weapon_keywords] : ["None"];
    this.required_weapon_keywords = obj && obj.required_weapon_keywords ? [...obj.required_weapon_keywords] : ["None"];
  }

  toDBObj = () => {
    return {
      threshold: this.threshold,
      allowed_damage_types: this.allowed_damage_types,
      allowed_armor_types: this.allowed_armor_types,
      required_armor_types: this.required_armor_types,
      excluded_weapon_keywords: this.excluded_weapon_keywords,
      required_weapon_keywords: this.required_weapon_keywords
    };
  }
}