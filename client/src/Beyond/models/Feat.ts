
// import { Map } from "./Subclass";
import { ModelBase } from "./ModelBase";
import { FeatureBase } from "./FeatureBase";

export class Feat extends ModelBase {
  features: FeatureBase[];
  race_ids: string[];

  constructor(obj?: any) {
    super(obj);
    this.data_type = "feat";
    this.features = [];
    if (obj && obj.features && obj.features.length > 0) {
      obj.features.forEach((o: any) => {
        const feature_base = new FeatureBase(o);
        feature_base.id = this.features.length;
        this.features.push(feature_base);
      });
    }
    this.race_ids = obj ? obj.race_ids : [];
  }

  toDBObj = () => {
    return {
      _id: this._id,
      name: this.name,
      description: this.description,
      features: this.features,
      race_ids: this.race_ids
    };
  }

  clone(): Feat {
    return new Feat(this);
  }

  copy(copyMe: Feat): void {
    this._id = copyMe._id;
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.features = [...copyMe.features];
    this.race_ids = [...copyMe.race_ids];
  }

  copy5e(copyMe: any): void {
    console.log(copyMe);
  }
}