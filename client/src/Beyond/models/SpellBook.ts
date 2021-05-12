

/**
 * This represents a Book that a spellcaster is 
 * able to keep their spells in.  
 * It's primarily for Wizards, 
 * but Pact of the Tome Warlocks who take the 
 * Book of Ancient Secrets Eldritch Invocation
 * also gain access to it.
 * The Warlock one can only hold Rituals, and they
 * don't prepare from it, but they're allowed to
 * learn from ANY spell list, where Wizards can 
 * only learn from the Wizard Spell List
 * (which is the largest one by far).
 */
export class SpellBook {
  spells_at_level_1: number;
  spells_add_per_level: number;
  extra_booked_from_ability: string; // This increases the number of spells to add to the spell book, not to prepare
  limitations: string; // All, No Cantrips, Rituals Only
  spell_list: string; // All, or id of spell_list

  constructor(obj?: any) {
    this.spells_at_level_1 = obj ? obj.spells_at_level_1 : 0;
    this.spells_add_per_level = obj ? obj.spells_add_per_level : 0;
    this.extra_booked_from_ability = obj ? obj.extra_booked_from_ability : "INT";
    this.limitations = obj ? obj.limitations : "No Cantrips";
    this.spell_list = obj ? obj.spell_list : "All";
  }

  toDBObj = () => {
    return {
      spells_at_level_1: this.spells_at_level_1,
      spells_add_per_level: this.spells_add_per_level,
      extra_booked_from_ability: this.extra_booked_from_ability,
      limitations: this.limitations,
      spell_list: this.spell_list
    };
  }

  clone(): SpellBook {
    return new SpellBook(this);
  }

  copy(copyMe: SpellBook): void {
    this.spells_at_level_1 = copyMe.spells_at_level_1;
    this.spells_add_per_level = copyMe.spells_add_per_level;
    this.extra_booked_from_ability = copyMe.extra_booked_from_ability;
    this.limitations = copyMe.limitations;
    this.spell_list = copyMe.spell_list;
  }
}