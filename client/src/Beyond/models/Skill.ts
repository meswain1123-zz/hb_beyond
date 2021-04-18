
import { ModelBase } from "./ModelBase";
// import { PlayToken } from "./Ability";
// import { Mask } from "./Mask";

export class Skill extends ModelBase {
  use_ability_score: string;

  constructor(obj?: any) {
    super(obj);
    this.data_type = "skill";
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
    // console.log(copyMe);
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