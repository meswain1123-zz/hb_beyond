
import { ModelBase } from "./ModelBase";
import { Feature } from "./Feature";

/**
 * Pact Boons are a lot like Feats, 
 * but it's a different set, and in 5e
 * only go to Warlocks.
 */

export class PactBoon extends ModelBase {
  static data_type: string = "pact_boon";
  features: Feature[];

  constructor(obj?: any) {
    super(obj);
    if (obj && obj.features && obj.features.length > 0) {
      if (obj.features[0] instanceof Feature) {
        this.features = obj ? [...obj.features] : [];
      } else {
        this.features = [];
        obj.features.forEach((o: any) => {
          const feature = new Feature(o);
          if (feature.description.length === 0) {
            feature.fake_description = this.description;
          }
          this.features.push(feature);
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
      source_type: this.source_type,
      source_id: this.source_id,
      features,
    };
  }

  clone(): PactBoon {
    return new PactBoon(this);
  }

  copy(copyMe: PactBoon): void {
    this._id = copyMe._id;
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.source_type = copyMe.source_type;
    this.source_id = copyMe.source_id;
    this.features = [...copyMe.features];
  }

  copy5e(copyMe: any): void {
    console.log(copyMe);
  }
}