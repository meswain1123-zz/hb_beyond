
import { Background } from "./Background";
import { CharacterFeatureBase } from "./CharacterFeatureBase";


export class CharacterBackground {
  background_id: string;
  background: Background | null;
  features: CharacterFeatureBase[];

  constructor(obj?: any) {
    this.background_id = obj ? obj.background_id : "";
    this.features = [];
    if (obj && obj.features && obj.features.length > 0) {
      for (let i = 0; i < obj.features.length; i++) {
        this.features.push(new CharacterFeatureBase(obj.features[i]));
      }
    }
    this.background = obj && obj.background ? new Background(obj.background) : null;
  }

  toDBObj = () => {
    const features: any[] = [];
    for (let i = 0; i < this.features.length; i++) {
      features.push(this.features[i].toDBObj());
    }
    return {
      background_id: this.background_id,
      features
    };
  }

  copyBackground = (background: Background) => {
    this.background_id = background._id;
    this.background = background;
    this.features = [];
    for (let i = 0; i < background.features.length; i++) {
      const char_feature_base = new CharacterFeatureBase();
      char_feature_base.copyFeatureBase(background.features[i]);
      this.features.push(char_feature_base);
    }
  }

  connectBackground = (background: Background) => {
    this.background = background;
    for (let i = 0; i < this.features.length; i++) {
      const fb = this.features[i];
      const objFinder = background.features.filter(fb2 => fb2.true_id === fb.true_id);
      if (objFinder.length === 1) {
        fb.connectFeatureBase(objFinder[0]);
      }
    }
  }
}