
import { ModelBase } from "./ModelBase";
import { FeatureBase } from "./FeatureBase";
import { StartEquipmentChoice } from "./StartEquipment";

export class GameClass extends ModelBase {
  hit_die: number;
  subclass_level: number;
  subclasses_called: string;
  subclass_description: string;
  features: FeatureBase[];
  primary_ability: string;
  secondary_ability: string;
  start_equipment: StartEquipmentChoice[];

  constructor(obj?: any) {
    super(obj);
    this.data_type = "game_class";
    this.hit_die = obj ? obj.hit_die : 6;
    this.subclass_level = obj ? obj.subclass_level : 1;
    this.subclasses_called = obj ? `${obj.subclasses_called}` : "Subclass";
    this.subclass_description = obj && obj.subclass_description ? obj.subclass_description : "";
    this.features = [];
    if (obj && obj.features && obj.features.length > 0) {
      obj.features.forEach((o: any) => {
        const feature_base = new FeatureBase(o);
        feature_base.id = this.features.length;
        this.features.push(feature_base);
      });
    }
    this.primary_ability = obj && obj.primary_ability ? obj.primary_ability : "";
    this.secondary_ability = obj && obj.secondary_ability ? obj.secondary_ability : "None";
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
      hit_die: this.hit_die,
      subclass_level: this.subclass_level,
      subclasses_called: this.subclasses_called,
      subclass_description: this.subclass_description,
      features,
      primary_ability: this.primary_ability,
      secondary_ability: this.secondary_ability,
      start_equipment
    };
  }

  clone(): GameClass {
    return new GameClass(this);
  }

  copy(copyMe: GameClass): void {
    this._id = copyMe._id;
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.hit_die = copyMe.hit_die;
    this.subclass_level = copyMe.subclass_level;
    this.subclasses_called = copyMe.subclasses_called;
    this.subclass_description = copyMe.subclass_description;
    this.features = [...copyMe.features];
    this.primary_ability = copyMe.primary_ability;
    this.secondary_ability = copyMe.secondary_ability;
    this.start_equipment = [...copyMe.start_equipment];
  }

  copy5e(copyMe: any): void {
    console.log(copyMe);
    this.name = copyMe.name;
    // this.description = copyMe.description;
    this.hit_die = copyMe.hit_die;
    this.subclass_level = 3; // copyMe.subclass_level;
    // this.subclasses_called = copyMe.subclasses_called;
    // this.features = [];
    // copyMe.proficiencies.forEach((p: any) => {
    //   this.features.push(new FeatureBase(

    //   ));
    // });
  }
}