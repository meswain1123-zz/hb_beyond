
import {
  RollPlus
} from ".";

export class Bonus {
  rolls: RollPlus;
  types: string[];
  subtypes: string[];
  source: string;

  constructor(obj?: any) {
    this.rolls = obj ? new RollPlus(obj.rolls) : new RollPlus();
    this.types = obj ? obj.types : [];
    this.subtypes = obj ? obj.subtypes : [];
    this.source = obj ? obj.source : "";
  }
}