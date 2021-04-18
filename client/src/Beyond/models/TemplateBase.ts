
import { ModelBase } from "./ModelBase";


export abstract class TemplateBase extends ModelBase {
  type: string;
  category: string;
  constructor(obj?: any) {
    super(obj);
    this.data_type = "template";
    this.type = obj ? `${obj.type}` : "";
    this.category = obj ? `${obj.category}` : "None";
  }
  abstract copyObj(copyMe: any): void;
}