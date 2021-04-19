
import {
  DiceRollUpgradable,
  UpgradableNumber
} from ".";

export class RollPlusUpgradable extends DiceRollUpgradable {
  flat: UpgradableNumber;
  ability_score: string;
  as_string: string;
  type: string;

  constructor(obj?: any) {
    super(obj);
    this.flat = obj && obj.flat ? new UpgradableNumber(obj.flat) : new UpgradableNumber();
    this.ability_score = obj && obj.ability_score ? obj.ability_score : "";
    this.type = obj && obj.type ? obj.type : "";
    this.as_string = "";
  }

  toDBObj = () => {
    return {
      true_id: this.true_id,
      size: this.size,
      count: this.count,
      flat: this.flat,
      ability_score: this.ability_score,
      type: this.type
    };
  }
}