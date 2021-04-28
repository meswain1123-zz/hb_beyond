
import { ModelBase } from "./ModelBase";
import { Feature } from "./Feature";

export class FightingStyle extends ModelBase {
  features: Feature[];

  constructor(obj?: any) {
    super(obj);
    this.data_type = "fighting_style";
    this.features = [];
    if (obj && obj.features && obj.features.length > 0) {
      obj.features.forEach((o: any) => {
        this.features.push(new Feature(o));
      });
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
      features
    };
  }

  clone(): FightingStyle {
    return new FightingStyle(this);
  }

  copy(copyMe: FightingStyle): void {
    this._id = copyMe._id;
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.features = [...copyMe.features];
  }

  copy5e(copyMe: any): void {
    this.name = copyMe.name.substring(21);
    this.description = "";
    copyMe.desc.forEach((d: any) => {
      this.description += d + "\n ";
    });
  }
}