
export class Advantage {
  type: string; // What do they get advantage on
  disadvantage: boolean; // True if it's disadvantage instead of advantage
  type_detail: string;
  type_details: string[];
  formula: string; // When do they get advantage?  Only worry about the things we track.  Other things are just in description.
  
  constructor(obj?: any) {
    this.type = obj ? obj.type : "";
    this.disadvantage = obj && obj.disadvantage ? obj.disadvantage : false;
    this.type_detail = obj ? obj.type_detail : "";
    this.type_details = obj && obj.type_details ? obj.type_details : [];
    this.formula = obj ? obj.formula : "";
  }

  toDBObj = () => {
    return {
      type: this.type,
      disadvantage: this.disadvantage,
      type_detail: this.type_detail,
      type_details: this.type_details,
      formula: this.formula,
    };
  }
}