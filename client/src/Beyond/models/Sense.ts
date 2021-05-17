
import { ModelBase } from "./ModelBase";

export class Sense extends ModelBase {
  static data_type: string = "sense";

  toDBObj = () => {
    return {
      _id: this._id,
      name: this.name,
      description: this.description
    };
  }

  clone(): Sense {
    return new Sense(this);
  }

  copy(copyMe: Sense): void {
    this._id = copyMe._id;
    this.name = copyMe.name;
    this.description = copyMe.description;
  }
}