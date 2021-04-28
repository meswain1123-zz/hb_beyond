
import { TemplateBase } from "./TemplateBase";
import { AbilityEffect } from "./AbilityEffect";
import { Ability } from "./Ability";
import { UpgradableNumber } from "./UpgradableNumber";


export class AbilityTemplate extends TemplateBase {
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
  slot_level: number; // If it consumes slots then this is the minimum level of the slot
  slot_type: string; // If it consumes a specific type of slot (usually Pact) then this holds that
  special_resource_amount: UpgradableNumber;
  special_resource_refresh_rule: string; // Short Rest, Long Rest, Dawn, 1 Hour, 8 Hours, 24 Hours
  attack_bonus: number;
  dc: number;

  constructor(obj?: any) {
    super(obj);
    this.type = "Ability";
    this.saving_throw_ability_score = obj?.saving_throw_ability_score;
    this.effect = obj ? new AbilityEffect(obj.effect) : new AbilityEffect();
    this.effect_2 = obj ? new AbilityEffect(obj.effect_2) : new AbilityEffect();
    this.range = obj?.range;
    this.range_2 = obj?.range_2;
    this.concentration = obj ? obj.concentration : false;
    this.notes = obj ? `${obj.notes}` : null;
    this.duration = obj ? `${obj.duration}` : "Instantaneous";
    this.components = obj ? [...obj.components] : [];
    this.material_component = obj ? `${obj.material_component}` : "";
    this.casting_time = obj ? `${obj.casting_time}` : "A";
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
    this.attack_bonus = obj && obj.attack_bonus ? obj.attack_bonus : 0;
    this.dc = obj && obj.dc ? obj.dc : 0;
  }

  toDBObj = () => {
    return {
      _id: this._id,
      name: this.name,
      description: this.description,
      type: "Ability",
      category: this.category,
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
      slot_level: this.slot_level,
      slot_type: this.slot_type,
      special_resource_amount: this.special_resource_amount.toDBObj(),
      special_resource_refresh_rule: this.special_resource_refresh_rule,
      attack_bonus: this.attack_bonus,
      dc: this.dc
    };
  }

  clone(): AbilityTemplate {
    return new AbilityTemplate(this);
  }

  copy(copyMe: AbilityTemplate): void {
    this._id = copyMe._id;
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.type = "Ability";
    this.category = copyMe.category;
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
    this.slot_level = copyMe.slot_level;
    this.slot_type = copyMe.slot_type;
    this.special_resource_amount = new UpgradableNumber(copyMe.special_resource_amount);
    this.special_resource_refresh_rule = copyMe.special_resource_refresh_rule;
    this.attack_bonus = copyMe.attack_bonus;
    this.dc = copyMe.dc;
  }

  copyObj(copyMe: Ability): void {
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.type = "Ability";
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
    this.slot_level = copyMe.slot_level;
    this.slot_type = copyMe.slot_type;
    this.special_resource_amount = new UpgradableNumber(copyMe.special_resource_amount);
    this.special_resource_refresh_rule = copyMe.special_resource_refresh_rule;
    this.attack_bonus = copyMe.attack_bonus;
    this.dc = copyMe.dc;
  }
}