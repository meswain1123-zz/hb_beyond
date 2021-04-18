
import { v4 as uuidv4 } from "uuid";
import { Spell } from ".";
import { SpellAsAbilityTemplate } from "./SpellAsAbilityTemplate";


/**
 * These are Abilities granted by features 
 * which give you slightly modified versions
 * of spells.  
 * 
 * Easy examples of this are Eldritch 
 * Invocations which let you cast specific
 * low level spells without components or 
 * spell slots.
 * 
 */
export class SpellAsAbility {
  true_id: string;
  parent_type: string;
  parent_id: string;
  base_id: number;
  feature_id: number;
  id: number;
  _name: string;
  description: string;
  spell_id: string | null;
  // saving_throw_ability_score: string | null; // SpellAsAbility Score saving throw the target(s) have to make
  // effect: AbilityEffect; // Formula for how much damage/healing to do
  // effect_2: AbilityEffect; // Some abilities have a second (like Ice Knife or Booming Blade or things that do different types of damage)
  // range: string | null; // Self, Touch, or a number
  // range_2: string | null; // For some there are multiple ranges.  It can be an AoE size, or sometimes something else.
  // concentration: boolean;
  // notes: string | null;
  // duration: string;
  components_override: string[]; // VSM
  material_component_override: string;
  casting_time_override: string; // A, BA, RA, X minute(s), etc
  slot_override: string;
  resource_consumed: string | null; // Slot-X, Ki, Lay on Hands, Charge, etc.
  amount_consumed: number | null;
  special_resource_amount: string;
  special_resource_refresh_rule: string; // Short Rest, Long Rest, Dawn, 1 Hour, 8 Hours, 24 Hours
  spellcasting_ability: string;
  spell: Spell | null;
  
  
  constructor(obj?: any) {
    this.true_id = obj && obj.true_id ? obj.true_id : uuidv4().toString();
    this.parent_type = obj ? obj.parent_type : "";
    this.parent_id = obj ? obj.parent_id : "";
    this.base_id = obj ? obj.base_id : 0;
    this.id = obj ? obj.id : 0;
    this.feature_id = obj ? obj.feature_id : 0;
    this._name = obj ? obj.name : "";
    this.description = obj ? obj.description : "";
    this.spell_id = obj ? obj.spell_id : "";
    // this.saving_throw_ability_score = obj?.saving_throw_ability_score;
    // this.effect = obj ? new AbilityEffect(obj.effect) : new AbilityEffect();
    // this.effect_2 = obj ? new AbilityEffect(obj.effect_2) : new AbilityEffect();
    // this.range = obj?.range;
    // this.range_2 = obj?.range_2;
    // this.concentration = obj ? obj.concentration : false;
    // this.notes = obj?.notes;
    // this.duration = obj ? obj.duration : "Instantaneous";
    this.components_override = obj ? [...obj.components_override] : [];
    this.material_component_override = obj ? obj.material_component_override : "";
    this.casting_time_override = obj ? obj.casting_time_override : "Normal";
    this.slot_override = obj ? obj.slot_override : "Normal";
    this.resource_consumed = obj ? obj.resource_consumed : "None";
    this.amount_consumed = obj?.amount_consumed;
    this.special_resource_amount = obj ? obj.special_resource_amount : "0";
    this.special_resource_refresh_rule = obj ? obj.special_resource_refresh_rule : "";
    this.spellcasting_ability = obj && obj.spellcasting_ability ? obj.spellcasting_ability : "CON";
    this.spell = null;
  }

  get name(): string {
    if (this._name === "") {
      if (this.spell) {
        return this.spell.name;
      }
    }
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get concentration(): boolean {
    if (this.spell) {
      return this.spell.concentration;
    }
    return false;
  }

  get ritual(): boolean {
    if (this.spell) {
      return this.spell.ritual;
    }
    return false;
  }

  get level(): number {
    if (this.spell) {
      return this.spell.level;
    }
    return -1;
  }

  toDBObj = () => {
    return {
      true_id: this.true_id,
      name: this._name,
      description: this.description,
      spell_id: this.spell_id,
      // saving_throw_ability_score: this.saving_throw_ability_score,
      // effect: this.effect.toDBObj(),
      // effect_2: this.effect_2.toDBObj(),
      // range: this.range,
      // range_2: this.range_2,
      // concentration: this.concentration,
      // notes: this.notes,
      // duration: this.duration,
      components_override: this.components_override,
      material_component_override: this.material_component_override,
      casting_time_override: this.casting_time_override,
      slot_override: this.slot_override,
      resource_consumed: this.resource_consumed,
      amount_consumed: this.amount_consumed,
      special_resource_amount: this.special_resource_amount,
      special_resource_refresh_rule: this.special_resource_refresh_rule,
      spellcasting_ability: this.spellcasting_ability
    };
  }

  clone(): SpellAsAbility {
    return new SpellAsAbility(this);
  }

  copy(copyMe: SpellAsAbility): void {
    this.true_id = copyMe.true_id;
    this.id = copyMe.id;
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.spell_id = copyMe.spell_id;
    // this.saving_throw_ability_score = copyMe.saving_throw_ability_score;
    // this.effect = copyMe.effect;
    // this.effect_2 = copyMe.effect_2;
    // this.range = copyMe.range;
    // this.range_2 = copyMe.range_2;
    // this.concentration = copyMe.concentration;
    // this.notes = copyMe.notes;
    // this.duration = copyMe.duration;
    this.components_override = [...copyMe.components_override];
    this.material_component_override = copyMe.material_component_override;
    this.casting_time_override = copyMe.casting_time_override;
    this.slot_override = copyMe.slot_override;
    this.resource_consumed = copyMe.resource_consumed;
    this.amount_consumed = copyMe.amount_consumed;
    this.special_resource_amount = copyMe.special_resource_amount;
    this.special_resource_refresh_rule = copyMe.special_resource_refresh_rule;
    this.spellcasting_ability = copyMe.spellcasting_ability;
    this.spell = copyMe.spell;
  }

  copyTemplate(copyMe: SpellAsAbilityTemplate): void {
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.spell_id = copyMe.spell_id;
    // this.saving_throw_ability_score = copyMe.saving_throw_ability_score;
    // this.effect = copyMe.effect;
    // this.effect_2 = copyMe.effect_2;
    // this.range = copyMe.range;
    // this.range_2 = copyMe.range_2;
    // this.concentration = copyMe.concentration;
    // this.notes = copyMe.notes;
    // this.duration = copyMe.duration;
    this.components_override = [...copyMe.components_override];
    this.material_component_override = copyMe.material_component_override;
    this.casting_time_override = copyMe.casting_time_override;
    this.slot_override = copyMe.slot_override;
    this.resource_consumed = copyMe.resource_consumed;
    this.amount_consumed = copyMe.amount_consumed;
    this.special_resource_amount = copyMe.special_resource_amount;
    this.special_resource_refresh_rule = copyMe.special_resource_refresh_rule;
    this.spellcasting_ability = copyMe.spellcasting_ability;
  }

  connectSpell(spell: Spell) {
    this.spell = spell;
  }
}