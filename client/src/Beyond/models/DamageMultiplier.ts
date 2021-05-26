
import { v4 as uuidv4 } from "uuid";

export class DamageMultiplier {
  true_id: string;
  damage_types: string[];
  multiplier: number; // Immunity = 0, Resistance = 0.5, Vulnerability = 2
  details: string;

  constructor(obj?: any) {
    this.true_id = obj ? obj.true_id : uuidv4().toString();
    this.damage_types = obj ? obj.damage_types : [];
    this.multiplier = obj ? obj.multiplier : 0;
    this.details = obj && obj.details ? obj.details : "";
  }

  toDBObj = () => {
    return {
      damage_types: this.damage_types,
      multiplier: this.multiplier,
      details: this.details
    };
  }

  toString(): string {
    let return_me = "";
    this.damage_types.forEach(dt => {
      if (return_me.length > 0) {
        return_me += ", ";
      }
      return_me += dt;
    });
    if (this.details !== "") {
      return_me += ` (${this.details})`;
    }
    return return_me;
  }
}

export class DamageMultiplierSimple {
  true_id: string;
  damage_type: string;
  multiplier: number;
  details: string;
  from_feature: boolean;

  constructor(obj?: any) {
    this.true_id = obj ? obj.true_id : uuidv4().toString();
    this.damage_type = obj ? obj.damage_type : "";
    this.multiplier = obj ? obj.multiplier : 0;
    this.details = obj && obj.details ? obj.details : "";
    this.from_feature = obj ? obj.from_feature : false;
  }

  toDBObj = () => {
    return {
      damage_type: this.damage_type,
      multiplier: this.multiplier,
      details: this.details,
      from_feature: this.from_feature
    };
  }
}