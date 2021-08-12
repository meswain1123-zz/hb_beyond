
import { TemplateBase } from "./TemplateBase";
import { SpellAsAbility } from "./SpellAsAbility";
import { UpgradableNumber, SlotLevel } from ".";


export class SpellAsAbilityTemplate extends TemplateBase {
  spell_id: string | null;
  components_override: string[]; // VSM
  material_component_override: string;
  casting_time_override: string; // A, BA, RA, X minute(s), etc
  slot_override: string;
  resource_consumed: string | null; // Slot-X, Ki, Lay on Hands, Charge, etc.
  amount_consumed: number;
  slot_level: SlotLevel; // If it consumes slots then this is the minimum level of the slot
  slot_type: string; // If it consumes a specific type of slot (usually Pact) then this holds that
  special_resource_amount: UpgradableNumber;
  special_resource_refresh_rule: string; // Short Rest, Long Rest, Dawn, 1 Hour, 8 Hours, 24 Hours
  spellcasting_ability: string;
  ritual: boolean;
  ritual_only: boolean;
  at_will: boolean;
  cast_at_level: SlotLevel;

  constructor(obj?: any) {
    super(obj);
    this.type = "SpellAsAbility";
    this.spell_id = obj ? obj.spell_id : null;
    this.components_override = obj ? [...obj.components_override] : [];
    this.material_component_override = obj ? obj.material_component_override : "";
    this.casting_time_override = obj ? obj.casting_time_override : "Normal";
    this.slot_override = obj ? obj.slot_override : "Normal";
    this.resource_consumed = obj ? obj.resource_consumed : "";
    this.amount_consumed = obj && obj.amount_consumed ? +obj.amount_consumed : 0;
    this.slot_level = obj && obj.slot_level ? new SlotLevel(obj.slot_level) : new SlotLevel(1);
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
    this.spellcasting_ability = obj && obj.spellcasting_ability ? obj.spellcasting_ability : "CON";
    this.ritual = obj && obj.ritual ? obj.ritual : false;
    this.ritual_only = this.ritual && obj && obj.ritual_only ? obj.ritual_only : false;
    this.at_will = obj && obj.at_will ? obj.at_will : false;
    this.cast_at_level = obj && obj.cast_at_level ? new SlotLevel(obj.cast_at_level) : new SlotLevel(-1);
  }

  toDBObj = () => {
    return {
      _id: this._id,
      name: this.name,
      description: this.description,
      source_type: this.source_type,
      source_id: this.source_id,
      type: "SpellAsAbility",
      category: this.category,
      spell_id: this.spell_id,
      components_override: this.components_override,
      material_component_override: this.material_component_override,
      casting_time_override: this.casting_time_override,
      slot_override: this.slot_override,
      resource_consumed: this.resource_consumed,
      amount_consumed: this.amount_consumed,
      slot_level: this.slot_level.value,
      slot_type: this.slot_type,
      special_resource_amount: this.special_resource_amount.toDBObj(),
      special_resource_refresh_rule: this.special_resource_refresh_rule,
      spellcasting_ability: this.spellcasting_ability,
      ritual: this.ritual,
      ritual_only: this.ritual_only,
      at_will: this.at_will,
      cast_at_level: this.cast_at_level
    };
  }

  clone(): SpellAsAbilityTemplate {
    return new SpellAsAbilityTemplate(this);
  }

  copy(copyMe: SpellAsAbilityTemplate): void {
    this._id = copyMe._id;
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.type = "SpellAsAbility";
    this.category = copyMe.category;
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
    this.cast_at_level = copyMe.cast_at_level;
  }

  copyObj(copyMe: SpellAsAbility): void {
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.type = "SpellAsAbility";
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
    this.cast_at_level = copyMe.cast_at_level;
  }
}