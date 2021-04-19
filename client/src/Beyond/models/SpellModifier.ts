

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
  formula: string;

  constructor(obj?: any) {
    this.spell_id = obj ? obj.spell_id : "";
    this.modifies = obj ? obj.modifies : "";
    this.formula = obj ? obj.formula : "";
  }

  toDBObj = () => {
    return {
      spell_id: this.spell_id,
      modifies: this.modifies,
      formula: this.formula
    };
  }
}