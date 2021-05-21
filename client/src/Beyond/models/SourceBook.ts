
import { ModelBase } from "./ModelBase";

export class SourceBook extends ModelBase {
  static data_type: string = "source_book";
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
      owner_id: this.owner_id,
    };
  }

  clone(): SourceBook {
    return new SourceBook(this);
  }

  copy(copyMe: SourceBook): void {
    this._id = copyMe._id;
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.owner_id = copyMe.owner_id;
  }
}