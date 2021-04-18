
import { ModelBase } from "./ModelBase";

export class Sense extends ModelBase {

  constructor(obj?: any) {
    super(obj);
    this.data_type = "sense";
  }

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