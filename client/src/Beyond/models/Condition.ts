
import { ModelBase } from "./ModelBase";
import { Feature } from "./Feature";

/**
 * Conditions are any state that can be 
 * applied to a character: 
 * Prone, Exhausted, Blessed, Raging, etc.
 * 
 * Lots of them have associated Features.
 * Prone - Disadvantage on Attacks, Advantage on Incoming Attacks, Half Movement Speed
 * Blessed - +1d4 on Attacks and Saving Throws
 * Raging - +2 to damage rolls, Resistances, etc.
 * 
 * There are also features that can be on 
 * other things which are only active when
 * certain conditions are present.
 * 
 * There are also abilities and spells which
 * automatically apply Conditions (Rage). 
 * (Low Priority)
 */

export class Condition extends ModelBase {
  static data_type: string = "condition";
  immunity_exists: boolean;
  level: number;
  class_ids: string[];
  subclass_ids: string[];
  features: Feature[];
  
  constructor(obj?: any) {
    super(obj);
    this.immunity_exists = obj && obj.immunity_exists ? obj.immunity_exists : false;
    this.level = obj && obj.level ? obj.level : -1;
    this.class_ids = obj && obj.class_ids ? obj.class_ids : [];
    this.subclass_ids = obj && obj.subclass_ids ? obj.subclass_ids : [];
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
      immunity_exists: this.immunity_exists,
      level: this.level,
      class_ids: this.class_ids,
      subclass_ids: this.subclass_ids,
      features,
    };
  }

  clone(): Condition {
    return new Condition(this);
  }

  copy(copyMe: Condition): void {
    this._id = copyMe._id;
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.source_type = copyMe.source_type;
    this.source_id = copyMe.source_id;
    this.immunity_exists = copyMe.immunity_exists;
    this.level = copyMe.level;
    this.class_ids = copyMe.class_ids;
    this.subclass_ids = copyMe.subclass_ids;
    this.features = [...copyMe.features];
  }
}