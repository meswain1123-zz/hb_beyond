
// import { Ability } from "./Ability";

export class DamageMultiplier {
  id: number;
  damage_types: string[];
  multiplier: number; // Immunity = 0, Resistance = 0.5, Vulnerability = 2

  constructor(obj?: any) {
    this.id = obj && obj.id ? obj.id : 0;
    this.damage_types = obj ? obj.damage_types : [];
    this.multiplier = obj ? obj.multiplier : 0;
  }

  toDBObj = () => {
    return {
      damage_types: this.damage_types,
      multiplier: this.multiplier,
    };
  }
}

export class DamageMultiplierSimple {
  id: number;
  damage_type: string;
  multiplier: number;
  from_feature: boolean;

  constructor(obj?: any) {
    this.id = obj && obj.id ? obj.id : 0;
    this.damage_type = obj ? obj.damage_type : "";
    this.multiplier = obj ? obj.multiplier : 0;
    this.from_feature = obj ? obj.from_feature : false;
  }

  toDBObj = () => {
    return {
      damage_type: this.damage_type,
      multiplier: this.multiplier,
      from_feature: this.from_feature
    };
  }
}