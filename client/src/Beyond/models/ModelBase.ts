
export abstract class ModelBase {
  _id: string;
  name: string;
  description: string;
  static data_type: string = "";
  static always_store: boolean = false;

  constructor(
    obj?: any) {
    this._id = obj ? obj._id : "";
    this.name = obj ? `${obj.name}` : "";
    this.description = obj ? `${obj.description}` : "";
  }

  toDBObj = () => {
    return {
      _id: this._id,
      name: this.name,
      description: this.description
    };
  }

  abstract clone(): ModelBase;
  abstract copy(copyMe: ModelBase): void;
}