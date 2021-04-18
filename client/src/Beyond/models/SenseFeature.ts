
import { Sense } from "./Sense";

export class SenseFeature {
  sense_id: string;
  range: number;
  or_add: number;

  sense: Sense | null;

  constructor(obj?: any) {
    this.sense_id = obj ? obj.sense_id : "";
    this.range = obj ? obj.range : 0;
    this.or_add = obj ? obj.or_add : 0;

    this.sense = obj && obj.sense ? obj.sense : null;
  }

  toDBObj = () => {
    return {
      sense_id: this.sense_id,
      range: this.range,
      or_add: this.or_add
    };
  }

  clone(): SenseFeature {
    return new SenseFeature(this);
  }

  copy(copyMe: SenseFeature): void {
    this.sense_id = copyMe.sense_id;
    this.range = copyMe.range;
    this.or_add = copyMe.or_add;
  }

  copySense(copyMe: Sense): void {
    this.sense_id = copyMe._id;
    this.sense = copyMe;
  }
}