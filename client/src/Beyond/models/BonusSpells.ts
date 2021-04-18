
import { IStringNumHash } from ".";


/**
 * These are spells that aren't on the regular 
 * spell list for the class, but through some 
 * feature (usually from a Subclass) 
 * they gain access to them.  
 * If they're learned automatically, then they're
 * always_known.
 */
export class BonusSpells {
  spell_ids: IStringNumHash;
  always_known: boolean;
  count_as_class_id: string | null;

  constructor(obj?: any) {
    this.spell_ids = {};
    if (obj && obj.spell_ids) {
      if (obj.spell_ids.length) {
        obj.spell_ids.forEach((id: string) => {
          this.spell_ids[id] = 1;
        });
      } else {
        this.spell_ids = obj.spell_ids;
      }
    }
    this.always_known = obj ? obj.always_known : false;
    this.count_as_class_id = obj ? obj.count_as_class_id : null;
  }

  toDBObj = () => {
    return {
      spell_ids: this.spell_ids,
      always_known: this.always_known,
      count_as_class_id: this.count_as_class_id
    };
  }

  clone(): BonusSpells {
    return new BonusSpells(this);
  }

  copy(copyMe: BonusSpells): void {
    this.spell_ids = {...copyMe.spell_ids};
    this.always_known = copyMe.always_known;
    this.count_as_class_id = copyMe.count_as_class_id;
  }
}