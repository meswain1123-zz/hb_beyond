
import { ASIBaseFeature } from "./ASIBaseFeature";
import { CharacterASIFeature } from "./CharacterASIFeature";
import { CharacterFeat } from "./CharacterFeat";

/**
 * 
 */
export class CharacterASIBaseFeature {
  asi_base_feature: ASIBaseFeature | null;
  id: number;
  feat_option: boolean;
  use_feat: boolean | null;
  feat: CharacterFeat;
  asi_features: CharacterASIFeature[];
  source_type: string = "";

  constructor(obj?: any) {
    this.id = obj && obj.id ? obj.id : -1;
    this.feat_option = obj ? obj.feat_option : false;
    this.use_feat = obj ? obj.use_feat : null;
    this.feat = obj && obj.feat ? new CharacterFeat(obj.feat) : new CharacterFeat();
    this.asi_features = [];
    if (obj && obj.asi_features) {
      obj.asi_features.forEach((o: any) => {
        const feature = new CharacterASIFeature(o);
        feature.id = this.asi_features.length;
        this.asi_features.push(feature);
      });
    }
    this.asi_base_feature = obj && obj.asi_base_feature ? new ASIBaseFeature(obj.asi_base_feature) : null;
  }

  toDBObj = () => {
    const asi_features: any[] = [];
    this.asi_features.forEach(f => {
      asi_features.push(f.toDBObj());
    });
    return {
      feat_option: this.feat_option,
      use_feat: this.use_feat,
      feat: this.feat.toDBObj(),
      asi_features
    };
  }

  copy(copyMe: CharacterASIBaseFeature): void {
    this.asi_base_feature = new ASIBaseFeature(copyMe.asi_base_feature);
    this.id = copyMe.id;
    this.feat_option = copyMe.feat_option;
    this.use_feat = copyMe.use_feat;
    this.feat = copyMe.feat;
    this.asi_features = [...copyMe.asi_features];
  }

  copyASIBaseFeature(copyMe: ASIBaseFeature): void {
    this.asi_base_feature = new ASIBaseFeature(copyMe);
    this.feat_option = copyMe.feat_option;
    this.use_feat = null;
    this.feat = new CharacterFeat();
    this.asi_features = [];
    copyMe.asi_features.forEach(o => {
      const feature = new CharacterASIFeature();
      feature.copyASIFeature(o);
      feature.id = this.asi_features.length;
      this.asi_features.push(feature);
    });
  }

  connectASIBaseFeature(copyMe: ASIBaseFeature): void {
    console.log(copyMe);
    this.asi_base_feature = new ASIBaseFeature(copyMe);
    this.asi_features.forEach(f => {
      const objFinder = copyMe.asi_features.filter(f2 => f2.id === f.id);
      if (objFinder.length === 1) {
        f.connectASIFeature(objFinder[0]);
      }
    });
  }
}