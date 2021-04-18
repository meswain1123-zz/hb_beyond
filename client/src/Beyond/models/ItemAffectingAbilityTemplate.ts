
import { TemplateBase } from "./TemplateBase";
// import { Skill } from "./Skill";
// import { AbilityEffect } from "./AbilityEffect";
import { ItemAffectingAbility } from "./ItemAffectingAbility";


export class ItemAffectingAbilityTemplate extends TemplateBase {
  item_types: string[];
  weapon_keyword_ids: string[];
  armor_type_ids: string[];
  resource_consumed: string | null; // Slot-X, Ki, Lay on Hands, Charge, etc.
  amount_consumed: number | null;
  special_resource_amount: string;
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
    this.amount_consumed = obj?.amount_consumed;
    this.special_resource_amount = obj ? `${obj.special_resource_amount}` : "0";
    this.special_resource_refresh_rule = obj ? `${obj.special_resource_refresh_rule}` : "";
    this.max_count = obj ? obj.max_count : 1;
    this.item_ability_type = obj ? `${obj.item_ability_type}` : "Create";
  }

  toDBObj = () => {
    return {
      _id: this._id,
      name: this.name,
      description: this.description,
      type: "ItemAffectingAbility",
      category: this.category,
      item_types: this.item_types,
      weapon_keyword_ids: this.weapon_keyword_ids,
      armor_type_ids: this.armor_type_ids,
      resource_consumed: this.resource_consumed,
      amount_consumed: this.amount_consumed,
      special_resource_amount: this.special_resource_amount,
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
    this.special_resource_amount = copyMe.special_resource_amount;
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
    this.special_resource_amount = copyMe.special_resource_amount;
    this.special_resource_refresh_rule = copyMe.special_resource_refresh_rule;
    this.max_count = copyMe.max_count;
    this.item_ability_type = copyMe.item_ability_type;
  }
}