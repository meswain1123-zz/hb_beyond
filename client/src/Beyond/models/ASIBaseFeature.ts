
// import { Map } from "./Subclass";
// import { PlayToken } from "./Ability";
import { ASIFeature } from "./ASIFeature";

/**
 * This is a type of Feature that increases an Ability Score. 
 *  
 * It comes in a few varieties:
 * 
 * There are the ones you get as Class Features at numerous levels. 
 * Those ones give you the choice of taking 
 * two ASIs on any Ability Score,
 * or one Feat.
 * 
 * There are also the ones you get in Feats, which either automatically
 * increase a single Ability Score by one, or give you a choice, 
 * usually from three options.
 * 
 * There are also racial ones, which itself comes in a number of 
 * varieties.  
 * 
 * Human gets +1 to all, but that can easily be represented by +1 to 
 * each.
 * 
 * V Human gets a +1 to 2 choices, but they can't be the same one.
 * 
 * Half Elf gets +2 to Charisma, 
 * and +1 to 2 choices that can't be Charisma and can't be the same.
 * 
 * Most others don't give choices, but give some combination of +2 to one
 * and +1 to a different one.
 * 
 * 
 */
export class ASIBaseFeature {
  feat_option: boolean; // Can they take a Feat instead?
  asi_features: ASIFeature[];
  allow_duplicates: boolean;

  constructor(obj?: any) {
    this.feat_option = obj ? obj.feat_option : false;
    this.asi_features = [];
    if (obj && obj.asi_features && obj.asi_features.length > 0) {
      obj.asi_features.forEach((o: any) => {
        const asi_feature = new ASIFeature(o);
        asi_feature.id = this.asi_features.length;
        this.asi_features.push(asi_feature);
      });
    }
    this.allow_duplicates = obj ? obj.allow_duplicates : false;
  }

  toDBObj = () => {
    const asi_features: any[] = [];
    this.asi_features.forEach(asi => {
      asi_features.push(asi.toDBObj());
    });
    return {
      feat_option: this.feat_option,
      asi_features,
      allow_duplicates: this.allow_duplicates
    };
  }
}