
import { 
  ResourceFeature,
  Character
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
  true_total: number;
  true_used: number;
  true_created: number;
  name: string;
  resource_feature: ResourceFeature | null;
  class_id: string;

  constructor(obj?: any) {
    this.type_id = obj ? obj.type_id : "";
    this.level = obj ? obj.level : 1;
    this.size = obj ? obj.size : 1;
    this.true_total = obj ? +obj.total : 0;
    this.true_used = obj ? +obj.used : 0;
    this.true_created = obj && obj.created ? +obj.created : 0;
    this.name = obj && obj.name ? obj.name : "";
    this.resource_feature = null;
    this.class_id = "";
  }

  toDBObj = () => {
    return {
      type_id: this.type_id,
      level: this.level,
      size: this.size,
      total: this.true_total,
      used: this.true_used,
      created: this.true_created
    };
  }

  copyResource(copyMe: ResourceFeature, char: Character, class_id: string) {
    this.resource_feature = copyMe;
    this.class_id = class_id;
    if (copyMe.type_id) {
      this.type_id = copyMe.type_id;
      this.true_total = copyMe.total.value(char, class_id, -1, -1);
      this.name = copyMe.resource ? copyMe.resource.name : "";
    }
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