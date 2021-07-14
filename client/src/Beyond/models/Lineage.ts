
import { ModelBase } from "./ModelBase";
import { 
  FeatureBase,
  Race,
  Subrace 
} from ".";
import { Subclass } from "./Subclass";


export class Lineage extends ModelBase {
  static data_type: string = "lineage";
  features: FeatureBase[];
  race_id: string;

  constructor(obj?: any) {
    super(obj);
    this.features = [];
    if (obj && obj.features && obj.features.length > 0) {
      obj.features.forEach((o: any) => {
        const fb = new FeatureBase(o);
        fb.id = this.features.length;
        this.features.push(fb);
      });
    }
    this.race_id = obj ? `${obj.race_id}` : "";
  }

  toDBObj = () => {
    const features: any[] = [];
    this.features.forEach(feature => {
      features.push(feature.toDBObj());
    });
    return {
      _id: this._id,
      name: this.name,
      description: this.description,
      source_type: this.source_type,
      source_id: this.source_id,
      features,
      race_id: this.race_id
    };
  }

  clone(): Lineage {
    return new Lineage(this);
  }

  copy(copyMe: Lineage): void {
    this._id = copyMe._id;
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.source_type = copyMe.source_type;
    this.source_id = copyMe.source_id;
    this.features = [...copyMe.features];
    this.race_id = copyMe.race_id;
  }

  copyRace(copyMe: Race): void {
    this._id = copyMe._id;
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.source_type = copyMe.source_type;
    this.source_id = copyMe.source_id;
    this.features = [...copyMe.features];
    this.features = this.features.filter(o => !o.name.includes("Ability Score"));
  }

  copySubrace(copyMe: Subrace): void {
    this._id = copyMe._id;
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.source_type = copyMe.source_type;
    this.source_id = copyMe.source_id;
    this.features = [...copyMe.features];
    this.features = this.features.filter(o => !o.name.includes("Ability Score"));
    this.race_id = copyMe.race_id;
  }

  // I think these will need to be managed on a case by case basis.  
  // The ASI's are the only ones we know for sure we don't want.
  copySubclass(copyMe: Subclass): void {
    this._id = copyMe._id;
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.source_type = copyMe.source_type;
    this.source_id = copyMe.source_id;
    this.features = [...copyMe.features];
    this.features = this.features.filter(o => !o.name.includes("Ability Score"));
  }

}