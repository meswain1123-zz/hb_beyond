
import { ModelBase } from "./ModelBase";


export class Language extends ModelBase {
  static data_type: string = "language";
  type: string; // Standard, Exotic, or Special
  script: string;
  typical_speakers: string[];

  constructor(obj?: any) {
    super(obj);
    this.type = obj && obj.type ? `${obj.type}` : "Standard";
    this.script = obj && obj.script ? `${obj.script}` : "";
    this.typical_speakers = obj && obj.typical_speakers ? obj.typical_speakers : [];
  }

  toDBObj = () => {
    return {
      _id: this._id,
      name: this.name,
      description: this.description,
      source_type: this.source_type,
      source_id: this.source_id,
      type: this.type,
      script: this.script,
      typical_speakers: this.typical_speakers
    };
  }
  
  clone(): Language {
    return new Language(this);
  }

  copy(copyMe: Language): void {
    this._id = copyMe._id;
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.source_type = copyMe.source_type;
    this.source_id = copyMe.source_id;
    this.type = copyMe.type;
    this.script = copyMe.script;
    this.typical_speakers = copyMe.typical_speakers;
  }

  copy5e(copyMe: any): void {
    console.log(copyMe);
    this.name = copyMe.name;
    this.description = copyMe.desc;
    this.type = copyMe.type;
    this.script = copyMe.script;
    this.typical_speakers = copyMe.typical_speakers;
  }
}