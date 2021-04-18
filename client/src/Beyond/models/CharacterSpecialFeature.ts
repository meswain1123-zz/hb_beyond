
import { SpecialFeature } from "./SpecialFeature";
import { CharacterFeature } from "./CharacterFeature";
// import { Mask } from "./Mask";

export class CharacterSpecialFeature {
  id: number;
  special_feature_id: string;
  special_feature: SpecialFeature | null;
  features: CharacterFeature[];
  level: number;

  constructor(obj?: any) {
    this.id = obj ? obj.id : 0;
    this.special_feature_id = obj ? obj.special_feature_id : "";
    this.features = [];
    if (obj && obj.features && obj.features.length > 0) {
      obj.features.forEach((o: any) => {
        this.features.push(new CharacterFeature(o));
      });
    }
    this.level = obj ? obj.level : 0;
    this.special_feature = obj && obj.special_feature ? new SpecialFeature(obj.special_feature) : null;
  }

  toDBObj = () => {
    const features: any[] = [];
    this.features.forEach(f => {
      features.push(f.toDBObj());
    });
    return {
      id: this.id,
      special_feature_id: this.special_feature_id,
      features
    };
  }

  copySpecialFeature = (special_feature: SpecialFeature | null) => {
    this.features = [];
    this.special_feature_id = special_feature ? special_feature._id : "";
    if (special_feature) {
      this.special_feature = special_feature;
      special_feature.features.forEach(f => {
        const char_feature = new CharacterFeature();
        char_feature.copyFeature(f);
        this.features.push(char_feature);
      });
    }
  }

  connectSpecialFeature = (special_feature: SpecialFeature) => {
    this.special_feature = special_feature;
    this.features.forEach(f => {
      const objFinder = special_feature.features.filter(f2 => f2.true_id === f.true_id);
      if (objFinder.length === 1) {
        f.connectFeature(objFinder[0]);
      }
    });
  }
}