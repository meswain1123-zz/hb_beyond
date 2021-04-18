
// import { Map } from "./Subclass";
// import { PlayToken } from "./Ability";
import { 
  // Resource, 
  ResourceFeature 
} from ".";

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
export class CharacterResource {
  type_id: string;
  level: number;
  size: number;
  total: number;
  used: number;
  name: string;
  // type: ResourceFeature | null;

  constructor(obj?: any) {
    this.type_id = obj ? obj.type_id : "";
    this.level = obj ? obj.level : 1;
    this.size = obj ? obj.size : 1;
    this.total = obj ? obj.total : 0;
    this.used = obj ? obj.used : 0;
    this.name = obj && obj.name ? obj.name : "";
    
    // this.type = obj && obj.type ? obj.type : null;
  }

  toDBObj = () => {
    return {
      type_id: this.type_id,
      level: this.level,
      size: this.size,
      total: this.total,
      used: this.used
    };
  }

  copyResource(copyMe: ResourceFeature) {
    if (copyMe.type_id) {
      this.type_id = copyMe.type_id;
      this.total = copyMe.total;
      this.name = copyMe.resource ? copyMe.resource.name : "";
      // this.type = copyMe;
    }
  }
}