
import { Feat } from "./Feat";
import { CharacterFeatureBase } from "./CharacterFeatureBase";
// import { Mask } from "./Mask";

export class CharacterFeat {
  id: number;
  feat_id: string;
  feat: Feat | null;
  features: CharacterFeatureBase[];
  level: number;

  constructor(obj?: any) {
    this.id = obj ? obj.id : 0;
    this.feat_id = obj ? obj.feat_id : "";
    this.features = [];
    if (obj && obj.features && obj.features.length > 0) {
      obj.features.forEach((o: any) => {
        this.features.push(new CharacterFeatureBase(o));
      });
    }
    this.level = obj ? obj.level : 0;
    this.feat = obj && obj.feat ? new Feat(obj.feat) : null;
  }

  toDBObj = () => {
    const features: any[] = [];
    this.features.forEach(f => {
      features.push(f.toDBObj());
    });
    return {
      id: this.id,
      feat_id: this.feat_id,
      features
    };
  }

  copyFeat = (copyMe: Feat) => {
    this.feat_id = copyMe._id;
    this.feat = copyMe;
    this.features = [];
    copyMe.features.forEach(fb => {
      const char_feature_base = new CharacterFeatureBase();
      char_feature_base.copyFeatureBase(fb);
      this.features.push(char_feature_base);
    });
  }

  connectFeat = (copyMe: Feat) => {
    this.feat = copyMe;
    this.features.forEach(fb => {
      const objFinder = copyMe.features.filter(fb2 => fb2.true_id === fb.true_id);
      if (objFinder.length === 1) {
        fb.connectFeatureBase(objFinder[0]);
      }
    });
  }
}