
/**
 * This is supposed to represent a modification to something as part
 * of a Feature.  It modifies the thing in the modifies property,
 * and uses a formula for determining how to modify it.  
 * This can modify all kinds of things, from AC, to Spell Attack, to ASI, to Racial ASI.
 * I need to rethink things that give choices.  
 * I'm thinking I'd prefer to make those work with something like Feature Choices, and then each choice can have its own Modifier.
 * 
 * Examples:
 * 
 * ASI(): 1, Modifies ChoiceAS
 * GnomeInt(): 2, Modifies IntAS
 * 
 * Monk:
 * UnarmoredDefense(): ({armor} ? (10 + {DEX}) : (10 + {DEX} + {WIS})), Modifies BaseAC 
 * MartialArtsAttack(): ({armor} || {shield} || {weapons.filter(w => w.keywords.notIncludes("Monk")).length} > 0 ? {d20} + {STR} : {d20} + MAX({STR},{DEX})), modifies Unarmed Strike Attack and Base Weapon Attack
 * MartialArtsUnarmedStrike(): ({armor} || {shield} || {weapons.filter(w => w.keywords.notIncludes("Monk")).length} > 0 ? {STR} : {d4} + MAX({STR},{DEX})), modifies Unarmed Strike Damage and Base Weapon Damage
 * 
 * Barbarian:
 * RageDamage(): ({rageActive} ? ({barbarianLevel} < 9 ? 2 : ({barbarianLevel} < 16 ? 3 : 4)))
 * UnarmoredDefence(): ({armor} ? (10 + {DEX}) : (10 + {DEX} + {CON})), Modifies BaseAC 
 * 
 */
export class Modifier {
  modifies: string;
  modifies_details: string[];
  modifies_detail_2: string;
  modifies_detail_3: string;
  type: string; // flat (default), char level, class level
  multiply: boolean;
  amount: string;
  allowed_armor_types: string[];
  required_armor_types: string[];
  excluded_weapon_keywords: string[];
  required_weapon_keywords: string[];

  constructor(obj?: any) {
    this.modifies = obj ? `${obj.modifies}` : "";
    this.modifies_details = [];
    if (obj && obj.modifies_details) {
      this.modifies_details = [...obj.modifies_details];
    } else if (obj && obj.modifies_detail) {
      this.modifies_details.push(`${obj.modifies_detail}`);
    }
    this.modifies_detail_2 = obj ? `${obj.modifies_detail_2}` : "";
    this.modifies_detail_3 = obj ? `${obj.modifies_detail_3}` : "";
    this.multiply = obj && obj.multiply ? obj.multiply : false;
    this.type = obj && obj.type ? obj.type : "Flat";
    this.amount = obj && obj.amount ? `${obj.amount}` : "0";
    this.allowed_armor_types = obj && obj.allowed_armor_types ? [...obj.allowed_armor_types] : ["ALL"];
    this.required_armor_types = obj && obj.required_armor_types ? [...obj.required_armor_types] : ["None"];
    this.excluded_weapon_keywords = obj && obj.excluded_weapon_keywords ? [...obj.excluded_weapon_keywords] : ["Any"];
    this.required_weapon_keywords = obj && obj.required_weapon_keywords ? [...obj.required_weapon_keywords] : ["Any"];
  }

  toDBObj = () => {
    return {
      modifies: this.modifies,
      modifies_details: this.modifies_details,
      modifies_detail_2: this.modifies_detail_2,
      modifies_detail_3: this.modifies_detail_3,
      multiply: this.multiply,
      type: this.type,
      amount: this.amount,
      allowed_armor_types: this.allowed_armor_types,
      required_armor_types: this.required_armor_types,
      excluded_weapon_keywords: this.excluded_weapon_keywords,
      required_weapon_keywords: this.required_weapon_keywords
    };
  }
}