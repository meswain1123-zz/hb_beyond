
export abstract class ModelBase {
  _id: string;
  name: string;
  description: string;
  data_type: string;

  constructor(
    obj?: any) {
    this._id = obj ? obj._id : "";
    this.name = obj ? `${obj.name}` : "";
    this.description = obj ? `${obj.description}` : "";
    this.data_type = "";
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