
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