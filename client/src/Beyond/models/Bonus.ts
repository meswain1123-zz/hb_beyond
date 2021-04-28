
import {
  RollPlus
} from ".";

export class Bonus {
  rolls: RollPlus;
  types: string[];
  subtypes: string[];
  source: string;
  excluded: string[];
  required: string[];
  excluded2: string[];
  required2: string[];

  constructor(obj?: any) {
    this.rolls = obj ? new RollPlus(obj.rolls) : new RollPlus();
    this.types = obj ? obj.types : [];
    this.subtypes = obj ? obj.subtypes : [];
    this.source = obj ? obj.source : "";
    this.excluded = obj ? obj.excluded : [];
    this.required = obj ? obj.required : [];
    this.excluded2 = obj ? obj.excluded2 : [];
    this.required2 = obj ? obj.required2 : [];
  }
}