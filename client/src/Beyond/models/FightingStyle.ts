
import { ModelBase } from "./ModelBase";
import { Feature } from "./Feature";

export class FightingStyle extends ModelBase {
  static data_type: string = "fighting_style";
  features: Feature[];

  constructor(obj?: any) {
    super(obj);
    this.features = [];
    if (obj && obj.features && obj.features.length > 0) {
      obj.features.forEach((o: any) => {
        const feature = new Feature(o);
        if (feature.description.length === 0) {
          feature.fake_description = this.description;
        }
        this.features.push(feature);
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
      source_type: this.source_type,
      source_id: this.source_id,
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
    this.source_type = copyMe.source_type;
    this.source_id = copyMe.source_id;
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