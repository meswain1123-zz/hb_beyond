
import { v4 as uuidv4 } from "uuid";
import {
  UpgradableNumber
} from ".";

export class DiceRollUpgradable {
  true_id: string;
  size: UpgradableNumber;
  count: UpgradableNumber;

  constructor(obj?: any) {
    this.true_id = obj && obj.true_id ? obj.true_id : uuidv4().toString();
    this.size = obj ? new UpgradableNumber(obj.size) : new UpgradableNumber();
    this.count = obj ? new UpgradableNumber(obj.count) : new UpgradableNumber();
  }

  toDBObj = () => {
    return {
      true_id: this.true_id,
      size: this.size,
      count: this.count,
    };
  }
}