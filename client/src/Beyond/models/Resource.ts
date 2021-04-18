
// import { Map } from "./Subclass";
// import { PlayToken } from "./Ability";
import { ModelBase } from "./ModelBase";

/**
 * This is a generic term for Spell Slots, Ki Points, Sorcery Points,
 * Lay on Hands, Healing Light, etc.  
 * refresh_rule is when this refreshes (generally short or long).
 */
export class Resource extends ModelBase {
  refresh_rule: string;
  default_dice_size: number;

  constructor(obj?: any) {
    super(obj);
    this.data_type = "resource";
    this.refresh_rule = obj ? `${obj.refresh_rule}` : "";
    this.default_dice_size = obj ? obj.default_dice_size : 1;
  }

  toDBObj = () => {
    return {
      _id: this._id,
      name: this.name,
      description: this.description,
      refresh_rule: this.refresh_rule,
      default_dice_size: this.default_dice_size
    };
  }

  clone(): Resource {
    return new Resource(this);
  }

  copy(copyMe: Resource): void {
    this._id = copyMe._id;
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.refresh_rule = copyMe.refresh_rule;
    this.default_dice_size = copyMe.default_dice_size;
  }
}