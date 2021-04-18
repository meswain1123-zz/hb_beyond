
import { INumHash } from "./Hashes";

/**
 * This is how I make the table of spell slots for
 * the various magical classes/subclasses.
 * 
 */

export class SpellSlotTableEntry {
  level: number;
  slots_per_level: INumHash;
  
  
  constructor(obj?: any) {
    this.level = obj ? obj.level : 1;
    this.slots_per_level = obj ? obj.slots_per_level : {};
  }

  toDBObj = () => {
    return {
      level: this.level,
      slots_per_level: this.slots_per_level
    };
  }

  clone(): SpellSlotTableEntry {
    return new SpellSlotTableEntry(this);
  }

  copy(copyMe: SpellSlotTableEntry): void {
    this.level = copyMe.level;
    this.slots_per_level = copyMe.slots_per_level;
  }
}