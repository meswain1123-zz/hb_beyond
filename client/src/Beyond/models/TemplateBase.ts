
import { ModelBase } from "./ModelBase";


export abstract class TemplateBase extends ModelBase {
  static data_type: string = "template";
  type: string;
  category: string;

  constructor(obj?: any) {
    super(obj);
    this.type = obj ? `${obj.type}` : "";
    this.category = obj ? `${obj.category}` : "None";
  }
  abstract copyObj(copyMe: any): void;
}