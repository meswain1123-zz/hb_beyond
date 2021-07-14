
import { v4 as uuidv4 } from "uuid";
import { 
  UpgradableNumber
} from ".";


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
export class SpecialSpellFeature {
  true_id: string;
  spell_list: string; // Any, Class, or spell_list_id
  level: number;
  slot_override: string; // Slot-X, Ki, Lay on Hands, Charge, etc.
  // TODO: Change slot_override so it actually takes resources as well as the strings it has now, 
  // and also make a functionality to make it so specific slot types can be chosen (some Eldritch Invocations are Special Resource and Pact Slot)
  amount_consumed: number;
  special_resource_amount: UpgradableNumber;
  special_resource_refresh_rule: string; // Short Rest, Long Rest, Dawn, 1 Hour, 8 Hours, 24 Hours
  always_known: boolean;
  
  
  constructor(obj?: any) {
    this.true_id = obj && obj.true_id ? obj.true_id : uuidv4().toString();
    this.spell_list = obj ? obj.spell_list : "Class";
    this.level = obj ? obj.level : 0;
    this.slot_override = obj ? obj.slot_override : "At Will";
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
    this.always_known = obj && obj.always_known ? obj.always_known : false;
  }

  toDBObj = () => {
    return {
      true_id: this.true_id,
      spell_list: this.spell_list,
      level: this.level,
      slot_override: this.slot_override,
      amount_consumed: this.amount_consumed,
      special_resource_amount: this.special_resource_amount.toDBObj(),
      special_resource_refresh_rule: this.special_resource_refresh_rule,
      always_known: this.always_known
    };
  }

  clone(): SpecialSpellFeature {
    return new SpecialSpellFeature(this);
  }

  copy(copyMe: SpecialSpellFeature): void {
    this.true_id = copyMe.true_id;
    this.slot_override = copyMe.slot_override;
    this.amount_consumed = copyMe.amount_consumed;
    this.special_resource_amount = new UpgradableNumber(copyMe.special_resource_amount);
    this.special_resource_refresh_rule = copyMe.special_resource_refresh_rule;
  }

  get at_will(): boolean {
    if (this.slot_override) {
      return this.slot_override === "At Will";
    } else {
      return false;
    }
  }
}