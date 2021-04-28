
import { v4 as uuidv4 } from "uuid";
import { UpgradableNumber } from ".";
import { ItemAffectingAbilityTemplate } from "./ItemAffectingAbilityTemplate";


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
export class ItemAffectingAbility {
  true_id: string;
  parent_type: string;
  parent_id: string;
  base_id: number;
  feature_id: number;
  id: number;
  name: string;
  description: string;
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
  item_ability_type: string; // Create, Edit, or Both
  
  
  constructor(obj?: any) {
    this.true_id = obj && obj.true_id ? obj.true_id : uuidv4().toString();
    this.parent_type = obj ? obj.parent_type : "";
    this.parent_id = obj ? obj.parent_id : "";
    this.base_id = obj ? obj.base_id : 0;
    this.id = obj ? obj.id : 0;
    this.feature_id = obj ? obj.feature_id : 0;
    this.name = obj ? `${obj.name}` : "";
    this.description = obj ? `${obj.description}` : "";
    this.item_types = obj ? obj.item_types : [];
    this.weapon_keyword_ids = obj ? obj.weapon_keyword_ids : [];
    this.armor_type_ids = obj ? obj.armor_type_ids : [];
    this.resource_consumed = obj ? `${obj.resource_consumed}` : "None";
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
      true_id: this.true_id,
      name: this.name,
      description: this.description,
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

  clone(): ItemAffectingAbility {
    return new ItemAffectingAbility(this);
  }

  copy(copyMe: ItemAffectingAbility): void {
    this.true_id = copyMe.true_id;
    this.id = copyMe.id;
    this.name = copyMe.name;
    this.description = copyMe.description;
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

  copyTemplate(copyMe: ItemAffectingAbilityTemplate): void {
    this.name = copyMe.name;
    this.description = copyMe.description;
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