
import { v4 as uuidv4 } from "uuid";
import { 
  AbilityEffect 
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
export class CreatureAbility {
  parent_type: string;
  parent_id: string;
  base_id: number;
  feature_id: number;
  id: number;
  true_id: string;
  name: string;
  description: string;
  saving_throw_ability_score: string | null; // Ability Score saving throw the target(s) have to make
  effect: AbilityEffect; // Formula for how much damage/healing to do
  effect_2: AbilityEffect; // Some abilities have a second (like Ice Knife or Booming Blade or things that do different types of damage)
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
  special_resource_amount: string;
  special_resource_refresh_rule: string; // Short Rest, Long Rest, Dawn, 1 Hour, 8 Hours, 24 Hours
  attack_bonus: number;
  dc: number;
  
  
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
    this.effect = obj ? new AbilityEffect(obj.effect) : new AbilityEffect();
    this.effect_2 = obj ? new AbilityEffect(obj.effect_2) : new AbilityEffect();
    this.range = obj ? obj.range : null;
    this.range_2 = obj ? obj.range_2 : null;
    this.concentration = obj ? obj.concentration : false;
    this.notes = obj?.notes;
    this.duration = obj ? obj.duration : "Instantaneous";
    this.components = obj ? [...obj.components] : [];
    this.material_component = obj ? obj.material_component : "";
    this.casting_time = obj ? obj.casting_time : "A";
    this.resource_consumed = obj ? obj.resource_consumed : "None";
    this.amount_consumed = obj && obj.amount_consumed ? obj.amount_consumed : 0;
    this.special_resource_amount = obj ? obj.special_resource_amount : "0";
    this.special_resource_refresh_rule = obj ? obj.special_resource_refresh_rule : "";
    this.attack_bonus = obj && obj.attack_bonus ? obj.attack_bonus : 0;
    this.dc = obj && obj.dc ? obj.dc : 0;
  }

  toDBObj = () => {
    return {
      true_id: this.true_id,
      name: this.name,
      description: this.description,
      saving_throw_ability_score: this.saving_throw_ability_score,
      effect: this.effect.toDBObj(),
      effect_2: this.effect_2.toDBObj(),
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
      special_resource_amount: this.special_resource_amount,
      special_resource_refresh_rule: this.special_resource_refresh_rule,
      attack_bonus: this.attack_bonus,
      dc: this.dc
    };
  }

  clone(): CreatureAbility {
    return new CreatureAbility(this);
  }

  copy(copyMe: CreatureAbility): void {
    this.true_id = copyMe.true_id;
    this.id = copyMe.id;
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.saving_throw_ability_score = copyMe.saving_throw_ability_score;
    this.effect = copyMe.effect;
    this.effect_2 = copyMe.effect_2;
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
    this.special_resource_amount = copyMe.special_resource_amount;
    this.special_resource_refresh_rule = copyMe.special_resource_refresh_rule;
    this.attack_bonus = copyMe.attack_bonus;
    this.dc = copyMe.dc;
  }
}