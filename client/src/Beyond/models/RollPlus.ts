
import {
  DiceRoll
} from ".";

export class RollPlus extends DiceRoll {
  flat: number;
  ability_score: string;
  as_string: string;
  type: string;

  constructor(obj?: any) {
    super(obj);
    this.flat = obj && obj.flat ? +obj.flat : 0;
    this.ability_score = obj && obj.ability_score ? obj.ability_score : "";
    this.type = obj && obj.type ? obj.type : "";
    this.as_string = "";
    this.recalculate_string();
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

  recalculate_string() {
    let the_string = "";
    let the_bonus = 0;
    the_bonus += +this.flat;
    if (this.size === 1) {
      the_bonus += this.count;
    } else {
      the_string += `${this.count}d${this.size}`;
    }
    if (the_bonus > 0 && the_string.length > 0) {
      the_string += `+${the_bonus}`;
    } else if (the_bonus !== 0) {
      the_string += `${the_bonus}`;
    }
    this.as_string = the_string;
  }
}