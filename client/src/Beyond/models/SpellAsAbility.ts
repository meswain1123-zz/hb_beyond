
import { v4 as uuidv4 } from "uuid";
import { 
  Spell,
  UpgradableNumber,
  AbilityEffect
} from ".";
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
  amount_consumed: number;
  slot_level: number; // If it consumes slots then this is the minimum level of the slot
  slot_type: string; // If it consumes a specific type of slot (usually Pact) then this holds that
  special_resource_amount: UpgradableNumber;
  special_resource_refresh_rule: string; // Short Rest, Long Rest, Dawn, 1 Hour, 8 Hours, 24 Hours
  spellcasting_ability: string;
  ritual: boolean;
  ritual_only: boolean;
  at_will: boolean;
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
    this.amount_consumed = obj && obj.amount_consumed ? +obj.amount_consumed : 0;
    this.slot_level = obj && obj.slot_level ? obj.slot_level : 1;
    this.slot_type = obj && obj.slot_type ? obj.slot_type : "";
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
    this.spellcasting_ability = obj && obj.spellcasting_ability ? obj.spellcasting_ability : "CHA";
    this.ritual = obj && obj.ritual ? obj.ritual : false;
    this.ritual_only = this.ritual && obj && obj.ritual_only ? obj.ritual_only : false;
    this.at_will = obj && obj.at_will ? obj.at_will : false;
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

  get level(): number {
    if (this.spell) {
      return this.spell.level;
    }
    return -1;
  }

  get effect(): AbilityEffect {
    if (this.spell) {
      return this.spell.effect;
    }
    return new AbilityEffect();
  }

  get casting_time(): string {
    if (this.spell) {
      return this.spell.casting_time;
    }
    return "";
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
      slot_level: this.slot_level,
      slot_type: this.slot_type,
      special_resource_amount: this.special_resource_amount.toDBObj(),
      special_resource_refresh_rule: this.special_resource_refresh_rule,
      spellcasting_ability: this.spellcasting_ability,
      ritual: this.ritual,
      ritual_only: this.ritual_only,
      at_will: this.at_will
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
    this.slot_level = copyMe.slot_level;
    this.slot_type = copyMe.slot_type;
    this.special_resource_amount = new UpgradableNumber(copyMe.special_resource_amount);
    this.special_resource_refresh_rule = copyMe.special_resource_refresh_rule;
    this.spellcasting_ability = copyMe.spellcasting_ability;
    this.ritual = copyMe.ritual;
    this.ritual_only = copyMe.ritual_only;
    this.at_will = copyMe.at_will;
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
    this.slot_level = copyMe.slot_level;
    this.slot_type = copyMe.slot_type;
    this.special_resource_amount = new UpgradableNumber(copyMe.special_resource_amount);
    this.special_resource_refresh_rule = copyMe.special_resource_refresh_rule;
    this.spellcasting_ability = copyMe.spellcasting_ability;
    this.ritual = copyMe.ritual;
    this.ritual_only = copyMe.ritual_only;
    this.at_will = copyMe.at_will;
  }

  connectSpell(spell: Spell) {
    this.spell = spell;
  }
}