
import { 
  ModelBase,
  RollPlus,
} from ".";

export class BaseItem extends ModelBase {
  item_type: string;
  weight: number; // in lbs
  cost: number;
  worn_type: string; 

  armor_type_id: string;
  base_armor_class: number;
  armor_type_name: string;

  weapon_keyword_ids: string[];
  attack_damages: RollPlus[];
  versatile_attack_damages: RollPlus[];
  damage_type: string;
  range: number;
  range2: number;
  weapon_keyword_names: string[];

  tool_id: string;

  stackable: boolean;
  bundle_size: number;
  
  // If it is worn and can't be worn with something else 
  // of the same type then put it here.  
  // Hat, Goggles, Gloves, Armor, Boots, Clothing, Cape/Cloak


  constructor(obj?: any) {
    super(obj);
    this.data_type = "base_item";
    this.item_type = obj ? `${obj.item_type}` : "Other";
    this.weight = obj ? +obj.weight : 0;
    this.cost = obj && obj.cost ? +obj.cost : 0;
    this.worn_type = obj ? `${obj.worn_type}` : "None";

    this.armor_type_id = obj && obj.armor_type_id ? `${obj.armor_type_id}` : "";
    this.base_armor_class = obj ? obj.base_armor_class : 10;
    this.armor_type_name = "";

    this.weapon_keyword_ids = obj ? [...obj.weapon_keyword_ids] : [];
    this.damage_type = obj && obj.damage_type ? `${obj.damage_type}` : "Bludgeoning";
    this.attack_damages = []; 
    if (obj && obj.attack_damages) {
      obj.attack_damages.forEach((d: any) => {
        this.attack_damages.push(new RollPlus(d));
      });
    } else if (obj && obj.base_attack_damage_formula) {
      const formula_split = obj.base_attack_damage_formula.split("d");
      const damage = new RollPlus();
      damage.count = formula_split[0];
      if (formula_split.length > 1) {
        damage.size = formula_split[1];
      } else {
        damage.size = 1;
      }
      damage.type = this.damage_type;
      this.attack_damages.push(damage);
    }
    
    this.versatile_attack_damages = [];
    if (obj && obj.versatile_attack_damages) {
      obj.versatile_attack_damages.forEach((d: any) => {
        this.versatile_attack_damages.push(new RollPlus(d));
      });
    } else if (obj && obj.versatile_attack_damage_formula) {
      const formula_split = obj.versatile_attack_damage_formula.split("d");
      const damage = new RollPlus();
      damage.count = formula_split[0];
      if (formula_split.length > 1) {
        damage.size = formula_split[1];
      } else {
        damage.size = 1;
      }
      damage.type = this.damage_type;
      this.versatile_attack_damages.push(damage);
    }
    this.range = obj ? obj.range : 0;
    this.range2 = obj ? obj.range2 : 0;
    this.weapon_keyword_names = [];

    this.tool_id = obj && obj.tool_id ? `${obj.tool_id}` : "";
    
    this.stackable = obj ? obj.stackable : false;
    this.bundle_size = obj ? obj.bundle_size : 0;
  }

  toDBObj = () => {
    const attack_damages: any[] = [];
    this.attack_damages.forEach(damage => {
      attack_damages.push(damage.toDBObj());
    });
    const versatile_attack_damages: any[] = [];
    this.versatile_attack_damages.forEach(damage => {
      versatile_attack_damages.push(damage.toDBObj());
    });
    return {
      _id: this._id,
      name: this.name,
      description: this.description,
      item_type: this.item_type,
      weight: this.weight,
      armor_type_id: this.armor_type_id,
      base_armor_class: this.base_armor_class,
      weapon_keyword_ids: this.weapon_keyword_ids,
      attack_damages,
      versatile_attack_damages,
      damage_type: this.damage_type,
      range: this.range,
      range2: this.range2,
      tool_id: this.tool_id,
      stackable: this.stackable,
      bundle_size: this.bundle_size,
      cost: this.cost,
      worn_type: this.worn_type
    };
  }

  clone(): BaseItem {
    return new BaseItem(this);
  }

  copy(copyMe: BaseItem): void {
    this._id = copyMe._id;
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.item_type = copyMe.item_type;
    this.weight = copyMe.weight;
    this.armor_type_id = copyMe.armor_type_id;
    this.base_armor_class = copyMe.base_armor_class;
    this.armor_type_name = copyMe.armor_type_name;
    this.weapon_keyword_ids = [...copyMe.weapon_keyword_ids];
    this.attack_damages = copyMe.attack_damages;
    this.versatile_attack_damages = copyMe.versatile_attack_damages;
    this.damage_type = copyMe.damage_type;
    this.range = copyMe.range;
    this.range2 = copyMe.range2;
    this.weapon_keyword_names = copyMe.weapon_keyword_names;
    this.tool_id = copyMe.tool_id;
    this.stackable = copyMe.stackable;
    this.bundle_size = copyMe.bundle_size;
    this.cost = copyMe.cost;
    this.worn_type = copyMe.worn_type;
  }
}