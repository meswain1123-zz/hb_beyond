
import { FeatureBase } from "./FeatureBase";
import { ModelBase } from "./ModelBase";
import { StartEquipmentChoice } from "./StartEquipment";

export class Background extends ModelBase {
  static data_type: string = "background";
  features: FeatureBase[];
  start_equipment: StartEquipmentChoice[];

  constructor(obj?: any) {
    super(obj);
    this.features = [];
    if (obj && obj.features && obj.features.length > 0) {
      for (let i = 0; i < obj.features.length; i++) {
        const feature_base = new FeatureBase(obj.features[i]);
        feature_base.id = this.features.length;
        this.features.push(feature_base);
      };
    }
    this.start_equipment = [];
    if (obj && obj.start_equipment) {
      obj.start_equipment.forEach((o: any) => {
        const choice = new StartEquipmentChoice(o);
        choice.id = this.start_equipment.length;
        this.start_equipment.push(choice);
      });
    }
  }


  toDBObj = () => {
    const features: any[] = [];
    this.features.forEach(feature => {
      features.push(feature.toDBObj());
    });
    const start_equipment: any[] = [];
    this.start_equipment.forEach(choice => {
      start_equipment.push(choice.toDBObj());
    });
    return {
      _id: this._id,
      name: this.name,
      description: this.description,
      source_type: this.source_type,
      source_id: this.source_id,
      features,
      start_equipment
    };
  }

  clone(): Background {
    return new Background(this);
  }

  copy(copyMe: Background): void {
    this._id = copyMe._id;
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.features = [...copyMe.features];
    this.start_equipment = [...copyMe.start_equipment];
    this.source_type = copyMe.source_type;
    this.source_id = copyMe.source_id;
  }

  copy5e(copyMe: any) {
    console.log(copyMe);
  }
}