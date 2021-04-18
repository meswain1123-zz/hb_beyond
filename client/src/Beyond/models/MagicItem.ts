
import { 
  ModelBase, 
  // MagicItemTemplate, 
  FeatureBase, 
  BaseItem,
  // Damage 
  RollPlus
} from ".";


export class MagicItem extends ModelBase {
  base_item_id: string | null;
  rarity: string; // Common, Uncommon, Rare, Very-Rare, Legendary
  attunement: boolean;
  // modifies: string[]; // AC, DC, STR (etc), Hit-All, Hit-This, Hit-Spell, SavingThrow-STR (etc) 
  // modifier: number;
  charges: number;
  charge_refresh_rule: string;
  // ability_ids: string[];
  features: FeatureBase[];
  base_item: BaseItem | null;
  bonus_damages: RollPlus[];
  _range: number;

  constructor(obj?: any) {
    super(obj);
    this.data_type = "magic_item";
    this.base_item_id = obj?.base_item_id;
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
    this._range = obj && obj.range ? obj.range : -1;
    this.bonus_damages = []; 
    if (obj && obj.bonus_damages) {
      obj.bonus_damages.forEach((d: any) => {
        this.bonus_damages.push(new RollPlus(d));
      });
    }
    
    this.base_item = null;
  }

  get range(): number {
    if (this._range > -1) {
      return this._range;
    } else if (this.base_item) {
      return this.base_item.range;
    }
    return -1;
  }

  toDBObj = () => {
    const features: any[] = [];
    this.features.forEach(feature => {
      features.push(feature.toDBObj());
    });
    const bonus_damages: any[] = [];
    this.bonus_damages.forEach(damage => {
      bonus_damages.push(damage.toDBObj());
    });
    return {
      _id: this._id,
      name: this.name,
      description: this.description,
      base_item_id: this.base_item_id,
      rarity: this.rarity,
      attunement: this.attunement,
      // modifies: this.modifies,
      // modifier: this.modifier,
      charges: this.charges,
      charge_refresh_rule: this.charge_refresh_rule,
      // ability_ids: this.ability_ids,
      features,
      bonus_damages,
      range: this._range
    };
  }

  clone(): MagicItem {
    return new MagicItem(this);
  }

  copy(copyMe: MagicItem): void {
    this._id = copyMe._id;
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.base_item_id = copyMe.base_item_id;
    this.rarity = copyMe.rarity;
    this.attunement = copyMe.attunement;
    // this.modifies = [...copyMe.modifies];
    // this.modifier = copyMe.modifier;
    this.charges = copyMe.charges;
    this.charge_refresh_rule = copyMe.charge_refresh_rule;
    // this.ability_ids = [...copyMe.ability_ids];
    this.features = [...copyMe.features];
    this.bonus_damages = [...copyMe.bonus_damages];
  }

  // copyTemplate(copyMe: MagicItemTemplate): void {
  //   this.name = copyMe.name;
  //   this.description = copyMe.description;
  //   this.base_item_id = copyMe.base_item_id;
  //   this.rarity = copyMe.rarity;
  //   this.attunement = copyMe.attunement;
  //   // this.modifies = [...copyMe.modifies];
  //   // this.modifier = copyMe.modifier;
  //   this.charges = copyMe.charges;
  //   this.charge_refresh_rule = copyMe.charge_refresh_rule;
  //   // this.ability_ids = [...copyMe.ability_ids];
  //   this.features = [...copyMe.features];
  //   this.bonus_damages = [...copyMe.bonus_damages];
  // }

  copy5e(copyMe: any): void {
    console.log(copyMe);
    this.name = copyMe.name;
    this.description = copyMe.equipment_category.name + "\n ";
    copyMe.desc.forEach((d: string) => {
      this.description += d + "\n";
    });
  }
}