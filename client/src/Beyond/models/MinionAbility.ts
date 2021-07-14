
import { v4 as uuidv4 } from "uuid";
import { 
  UpgradableNumber,
  AbilityEffectUpgradable,
  Character,
  CreatureAbility
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
export class MinionAbility {
  parent_type: string;
  parent_id: string;
  base_id: number;
  feature_id: number;
  id: number;
  true_id: string;
  name: string;
  description: string;
  saving_throw_ability_score: string | null; // Ability Score saving throw the target(s) have to make
  effects: AbilityEffectUpgradable[]; // Formula for how much damage/healing to do
  // effect_2: AbilityEffectUpgradable; // Some abilities have a second (like Ice Knife or Booming Blade or things that do different types of damage)
  range: string | null; // Self, Touch, or a number
  range_2: string | null; // For some there are multiple ranges.  It can be an AoE size, or sometimes something else.
  concentration: boolean;
  notes: string | null;
  duration: string;
  components: string[]; // VSM
  material_component: string;
  casting_time: string; // A, BA, RA, X minute(s), etc
  resource_consumed: string | null; // Slot-X, Ki, Lay on Hands, Charge, etc.
  amount_consumed: number;
  special_resource_amount: UpgradableNumber;
  special_resource_refresh_rule: string; // Short Rest, Long Rest, Dawn, 1 Hour, 8 Hours, 24 Hours
  attack_bonus: UpgradableNumber;
  dc: UpgradableNumber;
  
  
  constructor(obj?: any) {
    this.true_id = obj && obj.true_id ? obj.true_id : uuidv4().toString();
    this.parent_type = obj ? obj.parent_type : "";
    this.parent_id = obj ? obj.parent_id : "";
    this.base_id = obj ? obj.base_id : 0;
    this.id = obj ? obj.id : 0;
    this.feature_id = obj ? obj.feature_id : 0;
    this.name = obj ? obj.name : "";
    this.description = obj ? obj.description : "";
    this.saving_throw_ability_score = obj ? obj.saving_throw_ability_score : "";
    this.effects = []; 
    if (obj && obj.effects && obj.effects.length) {
      obj.effects.forEach((effect: any) => {
        this.effects.push(new AbilityEffectUpgradable(effect));
      });
    } else if (obj && obj.effect) {
      this.effects.push(new AbilityEffectUpgradable(obj.effect));
    }
    // this.effect = obj ? new AbilityEffectUpgradable(obj.effect) : new AbilityEffectUpgradable();
    // this.effect_2 = obj ? new AbilityEffectUpgradable(obj.effect_2) : new AbilityEffectUpgradable();
    this.range = obj ? obj.range : null;
    this.range_2 = obj ? obj.range_2 : null;
    this.concentration = obj ? obj.concentration : false;
    this.notes = obj?.notes;
    this.duration = obj ? obj.duration : "Instantaneous";
    this.components = obj ? [...obj.components] : [];
    this.material_component = obj ? obj.material_component : "";
    this.casting_time = obj ? obj.casting_time : "A";
    this.resource_consumed = obj ? obj.resource_consumed : "None";
    this.amount_consumed = obj && obj.amount_consumed ? +obj.amount_consumed : 0;
    if (obj && obj.special_resource_amount && obj.special_resource_amount.base === undefined) {
      // Translate old set up to new
      this.special_resource_amount = new UpgradableNumber();
      this.special_resource_amount.base = obj.special_resource_amount;
    } else if (obj && obj.special_resource_amount) {
      this.special_resource_amount = new UpgradableNumber(obj.special_resource_amount);
    } else {
      this.special_resource_amount = new UpgradableNumber();
    }
    this.special_resource_refresh_rule = obj ? obj.special_resource_refresh_rule : "";
    this.attack_bonus = obj && obj.attack_bonus ? new UpgradableNumber(obj.attack_bonus) : new UpgradableNumber();
    this.dc = obj && obj.dc ? new UpgradableNumber(obj.dc) : new UpgradableNumber();
  }

  toDBObj = () => {
    const effects: any[] = [];
    for (let i = 0; i < this.effects.length; i++) {
      effects.push(this.effects[i].toDBObj());
    }
    return {
      true_id: this.true_id,
      name: this.name,
      description: this.description,
      saving_throw_ability_score: this.saving_throw_ability_score,
      effects,
      range: this.range,
      range_2: this.range_2,
      concentration: this.concentration,
      notes: this.notes,
      duration: this.duration,
      components: this.components,
      material_component: this.material_component,
      casting_time: this.casting_time,
      resource_consumed: this.resource_consumed,
      amount_consumed: this.amount_consumed,
      special_resource_amount: this.special_resource_amount.toDBObj(),
      special_resource_refresh_rule: this.special_resource_refresh_rule,
      attack_bonus: this.attack_bonus,
      dc: this.dc
    };
  }

  get effect(): AbilityEffectUpgradable {
    if (this.effects.length > 0) {
      return this.effects[0];
    } else {
      return new AbilityEffectUpgradable();
    }
  }

  clone(): MinionAbility {
    return new MinionAbility(this);
  }

  copy(copyMe: MinionAbility): void {
    this.true_id = copyMe.true_id;
    this.id = copyMe.id;
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.saving_throw_ability_score = copyMe.saving_throw_ability_score;
    this.effects = [...copyMe.effects];
    this.range = copyMe.range;
    this.range_2 = copyMe.range_2;
    this.concentration = copyMe.concentration;
    this.notes = copyMe.notes;
    this.duration = copyMe.duration;
    this.components = [...copyMe.components];
    this.material_component = copyMe.material_component;
    this.casting_time = copyMe.casting_time;
    this.resource_consumed = copyMe.resource_consumed;
    this.amount_consumed = copyMe.amount_consumed;
    this.special_resource_amount = new UpgradableNumber(copyMe.special_resource_amount);
    this.special_resource_refresh_rule = copyMe.special_resource_refresh_rule;
    this.attack_bonus = copyMe.attack_bonus;
    this.dc = copyMe.dc;
  }

  convert_to_creature_ability(char: Character, class_id: string, base_slot_level: number, slot_level: number): CreatureAbility {
    const creature_ability = new CreatureAbility();
    creature_ability.amount_consumed = this.amount_consumed;
    creature_ability.attack_bonus = this.attack_bonus.value(char, class_id, base_slot_level, slot_level);
    creature_ability.base_id = this.base_id;
    creature_ability.casting_time = this.casting_time;
    creature_ability.components = this.components;
    creature_ability.concentration = this.concentration;
    creature_ability.dc = this.dc.value(char, class_id, base_slot_level, slot_level);
    creature_ability.description = this.description;
    creature_ability.duration = this.duration;
    creature_ability.effects = [];
    this.effects.forEach(effect => {
      creature_ability.effects.push(effect.convert_to_ability_effect(char, class_id, base_slot_level, slot_level));
    });
    // creature_ability.effect_2 = this.effect_2.convert_to_ability_effect(char, class_id, base_slot_level, slot_level);
    creature_ability.feature_id = this.feature_id;
    creature_ability.material_component = this.material_component;
    creature_ability.name = this.name;
    creature_ability.notes = this.notes;
    creature_ability.parent_id = this.parent_id;
    creature_ability.parent_type = this.parent_type;
    creature_ability.range = this.range;
    creature_ability.range_2 = this.range_2;
    creature_ability.resource_consumed = this.resource_consumed;
    creature_ability.saving_throw_ability_score = this.saving_throw_ability_score;
    this.special_resource_amount = new UpgradableNumber(this.special_resource_amount);
    creature_ability.special_resource_refresh_rule = this.special_resource_refresh_rule;
    creature_ability.true_id = this.true_id;
    return creature_ability;
  }
}