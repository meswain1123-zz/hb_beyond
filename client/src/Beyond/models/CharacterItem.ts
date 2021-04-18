
import { v4 as uuidv4 } from "uuid";
import { BaseItem } from "./BaseItem";
import { MagicItem } from "./MagicItem";
import { MagicItemKeyword } from "./MagicItemKeyword";
import { CharacterFeatureBase } from "./CharacterFeatureBase";
import { IStringNumOrStringHash } from "./Hashes";
import { 
  WeaponKeyword, Attack
} from ".";

export class CharacterItem {
  true_id: string;
  magic: boolean;
  base_item_id: string;
  magic_item_id: string;
  magic_item_keyword_ids: string[];
  base_item: BaseItem | null;
  magic_item: MagicItem | null;
  magic_item_keywords: MagicItemKeyword[];
  weapon_keywords: WeaponKeyword[];
  _name: string;
  attuned: boolean;
  equipped: boolean;
  current_charges: number;
  customizations: IStringNumOrStringHash;
  count: number;
  features: CharacterFeatureBase[];
  attacks: Attack[];
  use_ability_score: string;

  constructor(obj?: any) {
    this.true_id = obj && obj.true_id ? obj.true_id : uuidv4().toString();
    this.magic = obj ? obj.magic : false;
    this.base_item_id = obj ? obj.base_item_id : "";
    this.magic_item_id = obj ? obj.magic_item_id : "";
    this.magic_item_keyword_ids = obj ? obj.magic_item_keyword_ids : [];
    this.base_item = obj && obj.base_item ? new BaseItem(obj.base_item) : null;
    this.magic_item = obj && obj.magic_item ? new MagicItem(obj.magic_item) : null;
    this.magic_item_keywords = [];
    if (obj && obj.magic_item_keywords) {
      obj.magic_item_keywords.forEach((keyword: any) => {
        this.magic_item_keywords.push(new MagicItemKeyword(keyword));
      });
    }
    this._name = obj ? `${obj.name}` : "";
    this.attuned = obj ? obj.attuned : false;
    this.equipped = obj && obj.equipped ? obj.equipped : false;
    this.current_charges = obj ? obj.current_charges : 0;
    this.customizations = obj ? obj.customizations : {};
    this.count = obj ? obj.count : 1;
    this.features = [];
    if (obj && obj.features && obj.features.length > 0) {
      obj.features.forEach((o: any) => {
        this.features.push(new CharacterFeatureBase(o));
      });
    }
    this.attacks = [];
    this.weapon_keywords = [];
    this.use_ability_score = "";
  }

  get name(): string {
    if (this._name === "") {
      if (this.magic_item) {
        return this.magic_item.name;
      } else if (this.base_item) {
        return this.base_item.name;
      }
    }
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get cost(): number {
    if (this.customizations.cost) {
      return +this.customizations.cost;
    } else if (this.magic_item) {
      return -1;
    } else if (this.base_item) {
      return this.base_item.cost;
    }
    return -1;
  }

  get weight(): number {
    if (this.customizations.weight) {
      return +this.customizations.weight;
    } else if (this.base_item) {
      return this.base_item.weight;
    }
    return -1;
  }

  get range(): number {
    if (this.customizations.range) {
      return +this.customizations.range;
    } else if (this.magic_item) {
      return this.magic_item.range;
    } else if (this.base_item) {
      return this.base_item.range;
    }
    return 0;
  }

  toDBObj = () => {
    return {
      true_id: this.true_id,
      magic: this.magic,
      base_item_id: this.base_item_id,
      magic_item_id: this.magic_item_id,
      magic_item_keyword_ids: this.magic_item_keyword_ids,
      name: this._name,
      attuned: this.attuned,
      equipped: this.equipped,
      current_charges: this.current_charges,
      customizations: this.customizations,
      count: this.count
    };
  }

  copyBaseItem(copyMe: BaseItem) {
    this.base_item_id = copyMe._id;
    this.base_item = copyMe;
  }

  copyMagicItem(copyMe: MagicItem) {
    this.magic = true;
    this.magic_item_id = copyMe._id;
    this.magic_item = copyMe;
    if (copyMe.base_item && copyMe.base_item_id) {
      this.base_item_id = copyMe.base_item_id;
      this.base_item = copyMe.base_item;
    }
  }

  connectBaseItem = (base_item: BaseItem) => {
    this.base_item = base_item;
  }

  connectMagicItem = (magic_item: MagicItem) => {
    if (magic_item.base_item) {
      this.base_item = magic_item.base_item;
    }
    this.magic_item = magic_item;
    this.features.forEach(fb => {
      const objFinder = magic_item.features.filter(fb2 => fb2.true_id === fb.true_id);
      if (objFinder.length === 1) {
        fb.connectFeatureBase(objFinder[0]);
      }
    });
  }

  // applyMagicItemKeyword(copyMe: MagicItemKeyword) {
  //   this.magic = true;
  //   this.magic_item_keyword_ids.push(copyMe._id);
  //   this.magic_item_keywords.push(copyMe);

  // }
}