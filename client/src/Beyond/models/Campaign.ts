
import { ModelBase } from "./ModelBase";

export class Campaign extends ModelBase {
  owner_id: string;

  constructor(obj?: any) {
    super(obj);
    this.data_type = "campaign";
    this.owner_id = obj ? obj.owner_id : "";
  }

  toDBObj = () => {
    return {
      _id: this._id,
      name: this.name,
      description: this.description,
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
    this.owner_id = copyMe.owner_id;
  }
}