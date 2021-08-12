import { SlotLevel } from ".";

/**
 * This is a generic term for Spell Slots, Ki Points, Sorcery Points,
 * Lay on Hands, Healing Light, etc.  
 * It also could work for Material Spell Components, but I don't 
 * want to worry about that right now.
 * level is for spell slots (and pact slots), 
 * and it's what level the slot is.
 * total is the total number of that resource they have.
 * used is how many of them are currently used.
 * refreshRule is when this refreshes (generally short or long).
 */
export class CharacterSlot {
  type_id: string; // ID of the table it connects to
  level: SlotLevel;
  true_total: number;
  true_used: number;
  true_created: number;
  slot_name: string;

  constructor(obj?: any) {
    this.type_id = obj ? obj.type_id : "";
    this.level = obj ? new SlotLevel(+obj.level) : new SlotLevel(1);
    this.true_total = obj ? +obj.total : 0;
    this.true_used = obj ? +obj.used : 0;
    this.true_created = obj && obj.created ? +obj.created : 0;
    this.slot_name = obj && obj.slot_name ? obj.slot_name : "";
  }

  toDBObj = () => {
    return {
      type_id: this.type_id,
      level: this.level.value,
      total: this.true_total,
      used: this.true_used,
      created: this.true_created
    };
  }

  get total(): number {
    return this.true_total + this.created;
  }

  set total(value: number) {
    this.true_total = value;
  }

  get created(): number {
    return this.true_created;
  }

  set created(value: number) {
    if (this.true_used > 0) {
      this.true_used -= value;
      if (this.true_used < 0) {
        this.true_created = -1 * this.true_used;
        this.true_used = 0;
      }
    } else {
      this.true_created = value;
    }
  }

  get used(): number {
    return this.true_used;
  }

  set used(value: number) {
    if (this.true_created > 0) {
      this.true_created -= value;
      if (this.true_created < 0) {
        this.true_used = -1 * this.true_created;
        this.true_created = 0;
      }
    } else {
      this.true_used = value;
    }
  }
}