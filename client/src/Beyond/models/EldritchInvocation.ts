
import { ModelBase } from "./ModelBase";
import { Feature } from "./Feature";

/**
 * Eldritch Invocations are a lot like Feats, 
 * but it's a different set, and they generally
 * only go to Warlocks.
 */

export class EldritchInvocation extends ModelBase {
  static data_type: string = "eldritch_invocation";
  features: Feature[];
  level: number;
  pact: string;

  constructor(obj?: any) {
    super(obj);
    this.features = [];
    if (obj && obj.features && obj.features.length > 0) {
      obj.features.forEach((o: any) => {
        const feature = new Feature(o);
        if (feature.description.length === 0) {
          feature.fake_description = this.description;
        }
        this.features.push(feature);
      });
    }
    this.level = obj ? obj.level : 0;
    this.pact = obj ? obj.pact : "None";
    if (this.pact === "undefined") {
      this.pact = "None";
    }
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
      features,
      level: this.level,
      pact: this.pact
    };
  }

  clone(): EldritchInvocation {
    return new EldritchInvocation(this);
  }

  copy(copyMe: EldritchInvocation): void {
    this._id = copyMe._id;
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.features = [...copyMe.features];
    this.level = copyMe.level;
    this.pact = copyMe.pact;
  }

  copy5e(copyMe: any): void {
    this.name = copyMe.name.substring(21);
    this.description = "";
    copyMe.desc.forEach((d: any) => {
      this.description += d + "\n ";
    });
  }
}