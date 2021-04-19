
import { ModelBase } from "./ModelBase";

/**
 * 
 */
export class SpellList extends ModelBase {
  spell_ids: string[];

  constructor(obj?: any) {
    super(obj);
    this.data_type = "spell_list";
    this.spell_ids = obj ? [...obj.spell_ids] : [];
  }

  toDBObj = () => {
    return {
      _id: this._id,
      name: this.name,
      description: this.description,
      spell_ids: this.spell_ids
    };
  }

  clone(): SpellList {
    return new SpellList(this);
  }

  copy(copyMe: SpellList): void {
    this._id = copyMe._id;
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.spell_ids = [...copyMe.spell_ids];
  }
}