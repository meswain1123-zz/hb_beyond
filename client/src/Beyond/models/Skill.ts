
import { ModelBase } from "./ModelBase";

export class Skill extends ModelBase {
  static data_type: string = "skill";
  use_ability_score: string;

  constructor(obj?: any) {
    super(obj);
    this.use_ability_score = obj ? `${obj.use_ability_score}` : "";
  }

  toDBObj = () => {
    return {
      _id: this._id,
      name: this.name,
      description: this.description,
      use_ability_score: this.use_ability_score
    };
  }

  clone(): Skill {
    return new Skill(this);
  }

  copy(copyMe: Skill): void {
    this._id = copyMe._id;
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.use_ability_score = copyMe.use_ability_score;
  }

  copy5e(copyMe: any): void {
    this.name = copyMe.name;
    this.description = "";
    if (copyMe.desc) {
      copyMe.desc.forEach((d: string) => {
        this.description += d + "\n ";
      });
    }
    if (copyMe.ability_score) {
      this.use_ability_score = copyMe.ability_score.name;
    } else {
      this.use_ability_score = "None";
    }
  }
}