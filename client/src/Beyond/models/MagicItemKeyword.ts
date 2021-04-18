
import { ModelBase } from "./ModelBase";
// import { MagicItemTemplate } from "./MagicItemTemplate";
import { FeatureBase } from "./FeatureBase";
import { BaseItem } from "./BaseItem";
import { MagicItem } from "./MagicItem";


export class MagicItemKeyword extends ModelBase {
  name_formula: string; // example: {base_item.name} of {feature_bases[0].feature_choices[0].selected_option.name} Resistance
  uses_specific: boolean;
  base_item_type: string;
  base_item_details: string[];
  base_item_id: string | null;
  exclusions: string;
  rarity: string; // Common, Uncommon, Rare, Very-Rare, Legendary
  attunement: boolean;
  // modifies: string[]; // AC, DC, STR (etc), Hit-All, Hit-This, Hit-Spell, SavingThrow-STR (etc) 
  // modifier: number;
  charges: number;
  charge_refresh_rule: string;
  // ability_ids: string[];
  features: FeatureBase[];
  base_item: BaseItem | null;

  constructor(obj?: any) {
    super(obj);
    this.data_type = "magic_item_keyword";
    this.name_formula = obj && obj.name_formula ? `${obj.name_formula}` : "";
    this.uses_specific = obj && obj.uses_specific ? obj.uses_specific : false;
    this.base_item_type = obj ? `${obj.base_item_type}` : "None";
    this.base_item_details = obj ? obj.base_item_details : [];
    this.base_item_id = obj && obj.base_item_id ? obj.base_item_id : null;
    this.base_item = null;
    this.exclusions = obj ? `${obj.exclusions}` : "";
    this.rarity = obj ? `${obj.rarity}` : "Common";
    this.attunement = obj ? obj.attunement : false;
    // this.modifies = obj ? [...obj.modifies] : [];
    // this.modifier = obj ? obj.modifier : 0;
    this.charges = obj ? obj.charges : 0;
    this.charge_refresh_rule = obj ? `${obj.charge_refresh_rule}` : "";
    // this.ability_ids = obj ? obj.ability_ids : [];
    if (obj && obj.features && obj.features.length > 0) {
      if (obj.features[0] instanceof FeatureBase) {
        this.features = obj ? [...obj.features] : [];
      } else {
        this.features = [];
        obj.features.forEach((o: any) => {
          this.features.push(new FeatureBase(o));
        });
      }
    } else {
      this.features = [];
    }
  }

  toDBObj = () => {
    const features: any[] = [];
    this.features.forEach(feature => {
      features.push(feature.toDBObj());
    });
    return {
      _id: this._id,
      name: this.name,
      description: this.description,
      name_formula: this.name_formula,
      uses_specific: this.uses_specific,
      base_item_type: this.base_item_type,
      base_item_details: this.base_item_details,
      base_item_id: this.base_item_id,
      exclusions: this.exclusions,
      rarity: this.rarity,
      attunement: this.attunement,
      // modifies: this.modifies,
      // modifier: this.modifier,
      charges: this.charges,
      charge_refresh_rule: this.charge_refresh_rule,
      // ability_ids: this.ability_ids,
      features
    };
  }

  clone(): MagicItemKeyword {
    return new MagicItemKeyword(this);
  }

  copy(copyMe: MagicItemKeyword): void {
    this._id = copyMe._id;
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.name_formula = copyMe.name_formula;
    this.uses_specific = copyMe.uses_specific;
    this.base_item_type = copyMe.base_item_type;
    this.base_item_details = copyMe.base_item_details;
    this.base_item_id = copyMe.base_item_id;
    this.base_item = copyMe.base_item;
    this.exclusions = copyMe.exclusions;
    this.rarity = copyMe.rarity;
    this.attunement = copyMe.attunement;
    // this.modifies = [...copyMe.modifies];
    // this.modifier = copyMe.modifier;
    this.charges = copyMe.charges;
    this.charge_refresh_rule = copyMe.charge_refresh_rule;
    // this.ability_ids = [...copyMe.ability_ids];
    this.features = [...copyMe.features];
  }

  copyFromItem(copyMe: MagicItem): void {
    console.log(copyMe);
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.base_item_type = copyMe.base_item ? copyMe.base_item.item_type : "Any";
    this.uses_specific = copyMe.base_item_id ? true : false;
    this.base_item_id = copyMe.base_item_id;
    this.rarity = copyMe.rarity;
    this.attunement = copyMe.attunement;
    // this.modifies = [...copyMe.modifies];
    // this.modifier = copyMe.modifier;
    this.charges = copyMe.charges;
    this.charge_refresh_rule = copyMe.charge_refresh_rule;
    // this.ability_ids = [...copyMe.ability_ids];
    this.features = [...copyMe.features];
  }
}