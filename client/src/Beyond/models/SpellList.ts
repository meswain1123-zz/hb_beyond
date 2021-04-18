
import { ModelBase } from "./ModelBase";
// import { Ability } from "./Ability";

/**
 * 
 */
export class SpellList extends ModelBase {
  spell_ids: string[];

  constructor(obj?: any) {
    super(obj);
    this.data_type = "spell_list";
    // if (obj && obj.spells && obj.spells.length > 0) {
    //   if (obj.spells[0] instanceof Ability) {
    //     this.spells = obj ? [...obj.spells] : [];
    //   } else {
    //     this.spells = [];
    //     obj.spells.forEach((o: any) => {
    //       this.spells.push(new Ability(o));
    //     });
    //   }
    // } else {
    //   this.spells = [];
    // }
    this.spell_ids = obj ? [...obj.spell_ids] : [];
  }

  toDBObj = () => {
    // const spell_ids: any[] = [];
    // this.spells.forEach(o => {
    //   spell_ids.push(o._id);
    // });
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