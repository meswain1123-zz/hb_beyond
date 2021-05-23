
import { TemplateBase } from "./TemplateBase";
import { ItemAffectingAbility } from "./ItemAffectingAbility";
import { UpgradableNumber } from ".";


export class ItemAffectingAbilityTemplate extends TemplateBase {
  item_types: string[];
  weapon_keyword_ids: string[];
  armor_type_ids: string[];
  resource_consumed: string | null; // Slot-X, Ki, Lay on Hands, Charge, etc.
  amount_consumed: number;
  slot_level: number; // If it consumes slots then this is the minimum level of the slot
  slot_type: string; // If it consumes a specific type of slot (usually Pact) then this holds that
  special_resource_amount: UpgradableNumber;
  special_resource_refresh_rule: string; // Short Rest, Long Rest, Dawn, 1 Hour, 8 Hours, 24 Hours
  max_count: number;
  item_ability_type: string;

  constructor(obj?: any) {
    super(obj);
    this.type = "ItemAffectingAbility";
    this.item_types = obj ? obj.item_types : [];
    this.weapon_keyword_ids = obj ? obj.weapon_keyword_ids : [];
    this.armor_type_ids = obj ? obj.armor_type_ids : [];
    this.resource_consumed = obj ? `${obj.resource_consumed}` : null;
    this.amount_consumed = obj && obj.amount_consumed ? obj.amount_consumed : 0;
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
    this.special_resource_refresh_rule = obj ? `${obj.special_resource_refresh_rule}` : "";
    this.max_count = obj ? obj.max_count : 1;
    this.item_ability_type = obj ? `${obj.item_ability_type}` : "Create";
  }

  toDBObj = () => {
    return {
      _id: this._id,
      name: this.name,
      description: this.description,
      source_type: this.source_type,
      source_id: this.source_id,
      type: "ItemAffectingAbility",
      category: this.category,
      item_types: this.item_types,
      weapon_keyword_ids: this.weapon_keyword_ids,
      armor_type_ids: this.armor_type_ids,
      resource_consumed: this.resource_consumed,
      amount_consumed: this.amount_consumed,
      slot_level: this.slot_level,
      slot_type: this.slot_type,
      special_resource_amount: this.special_resource_amount.toDBObj(),
      special_resource_refresh_rule: this.special_resource_refresh_rule,
      max_count: this.max_count,
      item_ability_type: this.item_ability_type
    };
  }

  clone(): ItemAffectingAbilityTemplate {
    return new ItemAffectingAbilityTemplate(this);
  }

  copy(copyMe: ItemAffectingAbilityTemplate): void {
    this._id = copyMe._id;
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.type = "ItemAffectingAbility";
    this.category = copyMe.category;
    this.item_types = copyMe.item_types;
    this.weapon_keyword_ids = copyMe.weapon_keyword_ids;
    this.armor_type_ids = copyMe.armor_type_ids;
    this.resource_consumed = copyMe.resource_consumed;
    this.amount_consumed = copyMe.amount_consumed;
    this.slot_level = copyMe.slot_level;
    this.slot_type = copyMe.slot_type;
    this.special_resource_amount = new UpgradableNumber(copyMe.special_resource_amount);
    this.special_resource_refresh_rule = copyMe.special_resource_refresh_rule;
    this.max_count = copyMe.max_count;
    this.item_ability_type = copyMe.item_ability_type;
  }

  copyObj(copyMe: ItemAffectingAbility): void {
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.type = "ItemAffectingAbility";
    this.item_types = copyMe.item_types;
    this.weapon_keyword_ids = copyMe.weapon_keyword_ids;
    this.armor_type_ids = copyMe.armor_type_ids;
    this.resource_consumed = copyMe.resource_consumed;
    this.amount_consumed = copyMe.amount_consumed;
    this.slot_level = copyMe.slot_level;
    this.slot_type = copyMe.slot_type;
    this.special_resource_amount = new UpgradableNumber(copyMe.special_resource_amount);
    this.special_resource_refresh_rule = copyMe.special_resource_refresh_rule;
    this.max_count = copyMe.max_count;
    this.item_ability_type = copyMe.item_ability_type;
  }
}