
import { 
  ModelBase, 
  FeatureBase, 
  BaseItem,
  RollPlus
} from ".";


export class MagicItem extends ModelBase {
  static data_type: string = "magic_item";
  base_item_id: string | null;
  rarity: string; // Common, Uncommon, Rare, Very-Rare, Legendary
  attunement: boolean;
  charges: number;
  charge_refresh_rule: string;
  features: FeatureBase[];
  base_item: BaseItem | null;
  bonus_damages: RollPlus[];
  _range: number;

  constructor(obj?: any) {
    super(obj);
    this.base_item_id = obj?.base_item_id;
    this.rarity = obj ? obj.rarity : "Common";
    this.attunement = obj ? obj.attunement : false;
    this.charges = obj ? obj.charges : 0;
    this.charge_refresh_rule = obj ? obj.charge_refresh_rule : "";
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
      source_type: this.source_type,
      source_id: this.source_id,
      base_item_id: this.base_item_id,
      rarity: this.rarity,
      attunement: this.attunement,
      charges: this.charges,
      charge_refresh_rule: this.charge_refresh_rule,
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
    this.source_type = copyMe.source_type;
    this.source_id = copyMe.source_id;
    this.base_item_id = copyMe.base_item_id;
    this.rarity = copyMe.rarity;
    this.attunement = copyMe.attunement;
    this.charges = copyMe.charges;
    this.charge_refresh_rule = copyMe.charge_refresh_rule;
    this.features = [...copyMe.features];
    this.bonus_damages = [...copyMe.bonus_damages];
  }

  copy5e(copyMe: any): void {
    console.log(copyMe);
    this.name = copyMe.name;
    this.description = copyMe.equipment_category.name + "\n ";
    copyMe.desc.forEach((d: string) => {
      this.description += d + "\n";
    });
  }
}