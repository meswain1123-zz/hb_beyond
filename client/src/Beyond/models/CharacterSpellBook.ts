
import {
  SpellBook,
  CharacterSpell
} from ".";

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
export class CharacterSpellBook {
  spells: CharacterSpell[];
  spell_book: SpellBook | null;
  unused_free_spells: number;


  constructor(obj?: any) {
    this.spells = [];
    if (obj && obj.spells) {
      obj.spells.forEach((spell: any) => {
        this.spells.push(new CharacterSpell(spell));
      });
    }
    this.unused_free_spells = obj && obj.unused_free_spells ? obj.unused_free_spells : 0;
    this.spell_book = obj && obj.spell_book ? new SpellBook(obj.spell_book) : null;
  }

  toDBObj = () => {
    const spells: any[] = [];
    this.spells.forEach(obj => {
      spells.push(obj.toDBObj());
    });
    return {
      spells,
      unused_free_spells: this.unused_free_spells
    };
  }

  clone(): CharacterSpellBook {
    return new CharacterSpellBook(this);
  }

  copy(copyMe: CharacterSpellBook): void {
    this.spells = [...copyMe.spells];
    this.spell_book = copyMe.spell_book;
    this.unused_free_spells = copyMe.unused_free_spells;
  }
}