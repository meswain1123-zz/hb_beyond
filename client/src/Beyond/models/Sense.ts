
import { ModelBase } from "./ModelBase";

export class Sense extends ModelBase {
  static data_type: string = "sense";

  toDBObj = () => {
    return {
      _id: this._id,
      name: this.name,
      description: this.description,
      source_type: this.source_type,
      source_id: this.source_id,
    };
  }

  clone(): Sense {
    return new Sense(this);
  }

  copy(copyMe: Sense): void {
    this._id = copyMe._id;
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.source_type = copyMe.source_type;
    this.source_id = copyMe.source_id;
  }
}