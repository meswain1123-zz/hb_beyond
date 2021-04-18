
// import { Map } from "./Map";
// import { PlayToken } from "./PlayToken";
// import { Mask } from "./Mask";
// import { Class } from "./Class";
import { ModelBase } from "./ModelBase";

export class Campaign extends ModelBase {
  owner_id: string;
  // classes: Class[];
  // subclasses: Subclass[];

  constructor(obj?: any) {
    super(obj);
    this.data_type = "campaign";
    this.owner_id = obj ? obj.owner_id : "";
    // this.classes = classes;
    // this.subclasses = subclasses;
  }

  toDBObj = () => {
    // const class_ids: string[] = [];
    // this.classes.forEach(c => {
    //   class_ids.push(c._id);
    // });
    // const subclass_ids: string[] = [];
    // this.subclasses.forEach(c => {
    //   subclass_ids.push(c._id);
    // });
    return {
      _id: this._id,
      name: this.name,
      description: this.description,
      owner_id: this.owner_id,
      // class_ids,
      // subclass_ids
    };
  }

  clone(): Campaign {
    return new Campaign(this);
  }

  copy(copyMe: Campaign): void {
    this._id = copyMe._id;
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.owner_id = copyMe.owner_id;
  }
}