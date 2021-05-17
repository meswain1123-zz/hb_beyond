
import { ModelBase } from "./ModelBase";

/**
 * This is a type of Feature with a little more
 * dynamics to it.  
 * Think Feature that has Features.  
 * Like a FeatureBase, but an extra level.
 * 
 * Also it gets saved to its own collection,
 * and generally when it's used as a Feature 
 * the_feature will just contain the type.
 * CharacterFeature will let the user choose
 * the specific option they want based on the type.
 * 
 * Part of why it's going to its own collection
 * is that some of these can show up in different 
 * places (like class features and feats).
 * 
 * Eldritch Invocations and Pact Boons could
 * be shoehorned into this, but I think it's best
 * not to because of how Invocations often have
 * Boons as prereqs.
 * 
 * I am going to use this for Totem Attunements,
 * Maneuvers, and Metamagic.  
 * I'll probably find other uses as well.
 */

export class Tool extends ModelBase {
  static data_type: string = "tool";
  type: string;

  constructor(obj?: any) {
    super(obj);
    this.type = obj ? `${obj.type}` : "";
  }

  toDBObj = () => {
    return {
      _id: this._id,
      name: this.name,
      description: this.description,
      type: this.type
    };
  }

  clone(): Tool {
    return new Tool(this);
  }

  copy(copyMe: Tool): void {
    this._id = copyMe._id;
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.type = copyMe.type;
  }
}