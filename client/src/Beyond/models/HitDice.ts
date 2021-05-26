
import { v4 as uuidv4 } from "uuid";

export class HitDice {
  true_id: string;
  size: number;
  used: number;
  count: number;

  constructor(obj?: any) {
    this.true_id = uuidv4().toString();
    this.size = obj ? +obj.size : 8;
    this.used = obj && obj.used ? +obj.used : 0;
    this.count = obj ? +obj.count : 0;
  }

  toDBObj = () => {
    return {
      size: this.size,
      used: this.used,
      count: this.count
    };
  }
}