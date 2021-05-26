
import { ModelBase } from "./ModelBase";

export class SourceBook extends ModelBase {
  static data_type: string = "source_book";
  owner_id: string;
  abbreviation: string;

  constructor(obj?: any) {
    super(obj);
    this.owner_id = obj ? obj.owner_id : "";
    this.abbreviation = obj ? obj.abbreviation : "";
  }

  toDBObj = () => {
    return {
      _id: this._id,
      name: this.name,
      description: this.description,
      source_type: this.source_type,
      source_id: this.source_id,
      owner_id: this.owner_id,
      abbreviation: this.abbreviation
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
    this.abbreviation = copyMe.abbreviation;
  }
}