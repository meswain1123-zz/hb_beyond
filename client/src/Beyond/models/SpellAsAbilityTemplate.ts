
import { TemplateBase } from "./TemplateBase";
import { SpellAsAbility } from "./SpellAsAbility";


export class SpellAsAbilityTemplate extends TemplateBase {
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

  constructor(obj?: any) {
    super(obj);
    this.type = "SpellAsAbility";
    this.spell_id = obj ? obj.spell_id : null;
    this.components_override = obj ? [...obj.components_override] : [];
    this.material_component_override = obj ? obj.material_component_override : "";
    this.casting_time_override = obj ? obj.casting_time_override : "Normal";
    this.slot_override = obj ? obj.slot_override : "Normal";
    this.resource_consumed = obj ? obj.resource_consumed : "";
    this.amount_consumed = obj?.amount_consumed;
    this.special_resource_amount = obj ? obj.special_resource_amount : "0";
    this.special_resource_refresh_rule = obj ? obj.special_resource_refresh_rule : "";
    this.spellcasting_ability = obj && obj.spellcasting_ability ? obj.spellcasting_ability : "CON";
  }

  toDBObj = () => {
    return {
      _id: this._id,
      name: this.name,
      description: this.description,
      type: "SpellAsAbility",
      category: this.category,
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
    this.special_resource_amount = copyMe.special_resource_amount;
    this.special_resource_refresh_rule = copyMe.special_resource_refresh_rule;
    this.spellcasting_ability = copyMe.spellcasting_ability;
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
    this.special_resource_amount = copyMe.special_resource_amount;
    this.special_resource_refresh_rule = copyMe.special_resource_refresh_rule;
    this.spellcasting_ability = copyMe.spellcasting_ability;
  }
}