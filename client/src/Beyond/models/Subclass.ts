
import { ModelBase } from "./ModelBase";
import { FeatureBase } from "./FeatureBase";

export class Subclass extends ModelBase {
  static data_type: string = "subclass";
  game_class_id: string | null;
  features: FeatureBase[];

  constructor(obj?: any) {
    super(obj);
    this.game_class_id = obj ? `${obj.game_class_id}` : null;
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
      source_type: this.source_type,
      source_id: this.source_id,
      game_class_id: this.game_class_id,
      features
    };
  }

  clone(): Subclass {
    return new Subclass(this);
  }

  copy(copyMe: Subclass): void {
    this._id = copyMe._id;
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.source_type = copyMe.source_type;
    this.source_id = copyMe.source_id;
    this.game_class_id = copyMe.game_class_id;
    this.features = [...copyMe.features];
  }

  copy5e(copyMe: any): void {
    console.log(copyMe);
    this.name = copyMe.name;
    this.description = "";
    copyMe.desc.forEach((d: string) => {
      this.description += d + "\n ";
    });
  }
}