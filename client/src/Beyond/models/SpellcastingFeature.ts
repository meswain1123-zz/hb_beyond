

export class SpellcastingFeature {
  ability: string;
  table: string;
  level: number; // Full, Half, Third, etc
  spell_list_id: string;
  knowledge_type: string; // Prepared, Known, Spell Book
  // These can be increased through other features.
  cantrips_max: number;
  spell_count_per_level: number;
  extra_prepared_from_ability: string; // This increases the number of spells Prepared/Known
  // These can be granted through other features
  ritual_casting: boolean;
  focus: string;
  

  constructor(obj?: any) {
    this.ability = obj ? obj.ability : "";
    this.table = obj ? obj.table : "Spellcasting";
    this.level = obj ? obj.level : 0;
    this.spell_list_id = obj ? obj.spell_list_id : "";
    this.knowledge_type = obj ? obj.knowledge_type : "Known";
    this.cantrips_max = obj ? obj.cantrips_max : 0;
    this.spell_count_per_level = obj ? obj.spell_count_per_level : 0;
    this.extra_prepared_from_ability = obj ? obj.extra_prepared_from_ability : "None";
    this.ritual_casting = obj ? obj.ritual_casting : false;
    this.focus = obj ? obj.focus : "";
  }

  toDBObj = () => {
    return {
      ability: this.ability,
      table: this.table,
      level: this.level,
      spell_list_id: this.spell_list_id,
      knowledge_type: this.knowledge_type,
      cantrips_max: this.cantrips_max,
      spell_count_per_level: this.spell_count_per_level,
      extra_prepared_from_ability: this.extra_prepared_from_ability,
      ritual_casting: this.ritual_casting,
      focus: this.focus
    };
  }
}