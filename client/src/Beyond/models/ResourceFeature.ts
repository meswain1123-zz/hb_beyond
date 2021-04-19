
import { Resource } from ".";

/**
 * This is a generic term for Spell Slots, Ki Points, Sorcery Points,
 * Lay on Hands, Healing Light, etc.  
 * It also could work for Material Spell Components, but I don't 
 * want to worry about that right now.
 * level is for spell slots (and pact slots), 
 * and it's what level the slot is.
 * total is the total number of that resource they have.
 */
export class ResourceFeature {
  type_id: string | null;
  total: number;
  // If this is true then this 
  // gets added to others of the same type
  // instead of replacing it
  extra: boolean; 
  resource: Resource | null;

  constructor(obj?: any) {
    this.type_id = obj ? obj.type_id : null;
    this.total = obj ? obj.total : 0;
    this.extra = obj ? obj.extra : false;
    this.resource = null;
  }

  toDBObj = () => {
    return {
      type_id: this.type_id,
      total: this.total,
      extra: this.extra
    };
  }
}