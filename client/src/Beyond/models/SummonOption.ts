
import { v4 as uuidv4 } from "uuid";
import {
  SummonStatBlock
} from ".";

export class SummonOption {
  true_id: string;
  specific: boolean;
  specific_id: string;
  creature_type: string; // beast, fey, etc
  subtype: string; // 
  challenge_rating: number;
  count: number;
  size: string;
  flying: boolean;
  swimming: boolean;
  custom: boolean;
  custom_stat_block: SummonStatBlock | null;
  
  
  constructor(obj?: any) {
    this.true_id = obj ? obj.true_id : uuidv4().toString();
    this.specific = obj && obj.specific ? obj.specific : false;
    this.specific_id = obj && obj.specific_id ? obj.specific_id : "";
    this.creature_type = obj ? (obj.creature_type ? obj.creature_type : obj.type) : "Any";
    this.subtype = obj ? obj.subtype : "Any";
    if (this.creature_type === "") {
      this.creature_type = "Any";
    }
    if (this.subtype === "") {
      this.subtype = "Any";
    }
    this.challenge_rating = obj ? obj.challenge_rating : 0;
    this.count = obj ?  obj.count : 1;
    this.size = obj ? obj.size : "Any";
    this.flying = obj ? obj.flying : false;
    this.swimming = obj ? obj.swimming : false;
    this.custom = obj ? obj.custom : false;
    this.custom_stat_block = obj && obj.custom_stat_block ? new SummonStatBlock(obj.custom_stat_block) : null;
  }

  toDBObj = () => {
    return {
      true_id: this.true_id,
      specific: this.specific,
      specific_id: this.specific_id,
      creature_type: this.creature_type,
      subtype: this.subtype,
      challenge_rating: this.challenge_rating,
      count: this.count,
      size: this.size,
      custom: this.custom,
      flying: this.flying,
      swimming: this.swimming,
      custom_stat_block: this.custom_stat_block ? this.custom_stat_block.toDBObj() : null
    };
  }
}