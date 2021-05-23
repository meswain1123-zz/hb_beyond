
import { ModelBase } from "./ModelBase";

export class Campaign extends ModelBase {
  static data_type: string = "campaign";
  owner_id: string;

  constructor(obj?: any) {
    super(obj);
    this.owner_id = obj ? obj.owner_id : "";
  }

  toDBObj = () => {
    return {
      _id: this._id,
      name: this.name,
      description: this.description,
      source_type: this.source_type,
      source_id: this.source_id,
      owner_id: this.owner_id,
    };
  }

  clone(): Campaign {
    return new Campaign(this);
  }

  copy(copyMe: Campaign): void {
    this._id = copyMe._id;
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.source_type = copyMe.source_type;
    this.source_id = copyMe.source_id;
    this.owner_id = copyMe.owner_id;
  }
}