
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
  level: number;
  total: number;
  used: number;
  slot_name: string;

  constructor(obj?: any) {
    this.type_id = obj ? obj.type_id : "";
    this.level = obj ? obj.level : 1;
    this.total = obj ? obj.total : 0;
    this.used = obj ? obj.used : 0;
    this.slot_name = obj && obj.slot_name ? obj.slot_name : "";
  }

  toDBObj = () => {
    return {
      type_id: this.type_id,
      level: this.level,
      total: this.total,
      used: this.used
    };
  }
}