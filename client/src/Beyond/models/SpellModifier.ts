
// import { Map } from "./Subclass";
// import { PlayToken } from "./Ability";
// import { Mask } from "./Mask";

/**
 * This is for some features which allow the 
 * modification of specific spells.
 * Particularly it's for the numerous 
 * Eldritch Invocations which modify 
 * Eldritch Blast.
 */
export class SpellModifier {
  spell_id: string;
  modifies: string;
  // modifies_detail: string;
  // modifies_detail_2: string;
  formula: string;

  constructor(obj?: any) {
    this.spell_id = obj ? obj.spell_id : "";
    this.modifies = obj ? obj.modifies : "";
    // this.modifies_detail = obj ? obj.modifies_detail : "";
    // this.modifies_detail_2 = obj ? obj.modifies_detail_2 : "";
    this.formula = obj ? obj.formula : "";
  }

  toDBObj = () => {
    return {
      spell_id: this.spell_id,
      modifies: this.modifies,
      // modifies_detail: this.modifies_detail,
      // modifies_detail_2: this.modifies_detail_2,
      formula: this.formula
    };
  }
}