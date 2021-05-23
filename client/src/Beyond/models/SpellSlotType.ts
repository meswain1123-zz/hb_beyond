
import { ModelBase, SpellSlotTableEntry } from ".";

/**
 * This is how I make the table of spell slots for
 * the various magical classes/subclasses.
 * 
 */

export class SpellSlotType extends ModelBase {
  static data_type: string = "spell_slot_type";
  refresh_rule: string;
  slot_name: string;
  entries: SpellSlotTableEntry[];
  
  
  constructor(obj?: any) {
    super(obj);
    this.refresh_rule = obj ? obj.refresh_rule : "Long Rest";
    this.slot_name = obj && obj.slot_name ? obj.slot_name : "Slots";
    this.entries = [];
    if (obj) {
      obj.entries.forEach((entry: any) => {
        this.entries.push(new SpellSlotTableEntry(entry));
      });
    }
  }

  toDBObj = () => {
    const entries: any[] = [];
    this.entries.forEach(entry => {
      entries.push(entry.toDBObj());
    });
    return {
      _id: this._id,
      name: this.name,
      description: this.description,
      source_type: this.source_type,
      source_id: this.source_id,
      refresh_rule: this.refresh_rule,
      slot_name: this.slot_name,
      entries
    };
  }

  clone(): SpellSlotType {
    return new SpellSlotType(this);
  }

  copy(copyMe: SpellSlotType): void {
    this._id = copyMe._id;
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.source_type = copyMe.source_type;
    this.source_id = copyMe.source_id;
    this.refresh_rule = copyMe.refresh_rule;
    this.slot_name = copyMe.slot_name;
    this.entries = [...copyMe.entries];
  }
}