
export abstract class ModelBase {
  static data_type: string = "model_base";
  static always_store: boolean = true;
  _id: string;
  name: string;
  description: string;
  source_type: string;
  source_id: string;

  constructor(
    obj?: any) {
    this._id = obj ? obj._id : "";
    this.name = obj ? obj.name : "";
    this.description = obj && obj.description && obj.description !== "undefined" ? obj.description : "";
    this.source_type = obj && obj.source_type ? obj.source_type : "";
    this.source_id = obj && obj.source_id ? obj.source_id : "";
  }

  toDBObj = () => {
    return {
      _id: this._id,
      name: this.name,
      description: this.description,
      source_type: this.source_type,
      source_id: this.source_id
    };
  }

  abstract clone(): ModelBase;
  abstract copy(copyMe: ModelBase): void;
}