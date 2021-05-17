
import { ModelBase } from "./ModelBase";

/**
 * This is used for creating starting equipment for new 
 * characters.  
 * StartItems go on GameClass and on Background.
 */
export class StartEquipmentChoice {
  id: number;
  options: StartEquipmentOption[];
  selected_option: number;


  constructor(obj?: any) {
    this.id = obj && obj.id ? obj.id : 0;
    this.options = [];
    if (obj && obj.options) {
      obj.options.forEach((opt: any) => {
        const option = new StartEquipmentOption(opt);
        option.id = this.options.length;
        this.options.push(option);
      });
    }
    this.selected_option = this.options.length === 1 ? 0 : -1;
  }

  toDBObj = () => {
    const options: any[] = [];
    this.options.forEach(opt => {
      options.push(opt.toDBObj());
    });
    return {
      options
    };
  }
}

export class StartEquipmentOption {
  id: number;
  items: StartEquipmentItem[];


  constructor(obj?: any) {
    this.id = obj && obj.id ? obj.id : 0;
    this.items = [];
    if (obj && obj.items) {
      obj.items.forEach((i: any) => {
        const item = new StartEquipmentItem(i);
        item.id = this.items.length;
        this.items.push(item);
      });
    }
  }

  toDBObj = () => {
    return {
      items: this.items
    };
  }
}

export class StartEquipmentItem {
  id: number;
  item_type: string; // Item, Item Type, Pack, Money
  item: string;
  detail: string;
  item_count: number;
  selected_item_id: string;


  constructor(obj?: any) {
    this.id = obj && obj.id ? obj.id : 0;
    this.item_type = obj ? obj.item_type : "Item";
    this.item = obj ? obj.item : "";
    this.item_count = obj && obj.item_count ? obj.item_count : 1;
    this.detail = obj && obj.detail ? obj.detail : "";
    this.selected_item_id = "";
  }

  toDBObj = () => {
    return {
      item_type: this.item_type,
      item: this.item,
      item_count: this.item_count,
      detail: this.detail
    };
  }
}

export class EquipmentPack extends ModelBase {
  static data_type: string = "equipment_pack";
  cost: string;
  items: EquipmentPackItem[];
  
  constructor(obj?: any) {
    super(obj);
    this.cost = obj ? obj.cost : "";
    this.items = [];
    if (obj && obj.items) {
      obj.items.forEach((o: any) => {
        const item = new EquipmentPackItem(o);
        item.id = this.items.length;
        this.items.push(item);
      });
    }
  }

  toDBObj = () => {
    const items: any[] = [];
    this.items.forEach(item => {
      items.push(item.toDBObj());
    })
    return {
      _id: this._id,
      name: this.name,
      cost: this.cost,
      description: this.description,
      items
    };
  }

  clone() {
    return new EquipmentPack(this);
  }

  copy(copyMe: EquipmentPack) {
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.cost = copyMe.cost;
    this.items = [...copyMe.items];
  }
}

export class EquipmentPackItem {
  id: number;
  item_id: string; // items, type, pack, money
  count: number;


  constructor(obj?: any) {
    this.id = obj ? obj.id : 0;
    this.item_id = obj ? obj.item_id : "";
    this.count = obj ? obj.count : 1;
  }

  toDBObj = () => {
    return {
      item_id: this.item_id,
      count: this.count
    };
  }
}
