
import { v4 as uuidv4 } from "uuid";

export class DiceRoll {
  true_id: string;
  size: number;
  count: number;

  constructor(obj?: any) {
    this.true_id = obj && obj.true_id ? obj.true_id : uuidv4().toString();
    this.size = obj ? obj.size : 4;
    this.count = obj ? obj.count : 0;
  }

  toDBObj = () => {
    return {
      true_id: this.true_id,
      size: this.size,
      count: this.count,
    };
  }

  get_roll(): number[] {
    const results: number[] = [];
    if (this.size === 1) {
      results.push(this.count);
    } else {
      let count = this.count;
      let reverse = false;
      if (count < 0) {
        count *= -1;
        reverse = true;
      }
      for (let i = 0; i < count; ++i) {
        const roll = Math.ceil(Math.random() * this.size);
        if (reverse) {
          results.push(-1 * roll);
        } else {
          results.push(roll);
        }
      }
    }
    return results;
  }
}