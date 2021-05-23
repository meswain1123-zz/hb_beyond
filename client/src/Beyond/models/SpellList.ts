
import { ModelBase } from "./ModelBase";

/**
 * 
 */
export class SpellList extends ModelBase {
  static data_type: string = "spell_list";
  spell_ids: string[];

  constructor(obj?: any) {
    super(obj);
    this.spell_ids = obj ? [...obj.spell_ids] : [];
  }

  toDBObj = () => {
    return {
      _id: this._id,
      name: this.name,
      description: this.description,
      source_type: this.source_type,
      source_id: this.source_id,
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
    this.source_type = copyMe.source_type;
    this.source_id = copyMe.source_id;
    this.spell_ids = [...copyMe.spell_ids];
  }
}