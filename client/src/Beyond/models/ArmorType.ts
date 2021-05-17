
import { ModelBase } from "./ModelBase";


export class ArmorType extends ModelBase {
  static data_type: string = "armor_type";
  dex_bonus_max: number | null; // Light = null, Medium = 2, Heavy = 0
  stealth_disadvantage: boolean;

  constructor(obj?: any) {
    super(obj);
    this.dex_bonus_max = obj?.dex_bonus_max;
    this.stealth_disadvantage = obj && obj.stealth_disadvantage ? obj.stealth_disadvantage : true;
  }

  toDBObj = () => {
    return {
      _id: this._id,
      name: this.name,
      description: this.description,
      dex_bonus_max: this.dex_bonus_max,
      stealth_disadvantage: this.stealth_disadvantage
    };
  }
  
  clone(): ArmorType {
    return new ArmorType(this);
  }

  copy(copyMe: ArmorType): void {
    this._id = copyMe._id;
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.dex_bonus_max = copyMe.dex_bonus_max;
    this.stealth_disadvantage = copyMe.stealth_disadvantage;
  }
}