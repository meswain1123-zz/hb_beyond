
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
  immunity_exists: boolean;
  level: number;
  features: Feature[];
  
  constructor(obj?: any) {
    super(obj);
    this.data_type = "condition";
    this.immunity_exists = obj && obj.immunity_exists ? obj.immunity_exists : false;
    this.level = obj && obj.level ? obj.level : -1;
    if (obj && obj.features && obj.features.length > 0) {
      if (obj.features[0] instanceof Feature) {
        this.features = obj ? [...obj.features] : [];
      } else {
        this.features = [];
        obj.features.forEach((o: any) => {
          this.features.push(new Feature(o));
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
      immunity_exists: this.immunity_exists,
      level: this.level,
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
    this.immunity_exists = copyMe.immunity_exists;
    this.level = copyMe.level;
    this.features = [...copyMe.features];
  }
}