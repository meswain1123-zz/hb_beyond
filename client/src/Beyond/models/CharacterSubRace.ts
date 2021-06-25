
import { CharacterFeatureBase } from "./CharacterFeatureBase";
import { Subrace } from "./Subrace";

/**
 * This represents a race with the options chosen for a character.
 */
export class CharacterSubRace {
  subrace_id: string;
  features: CharacterFeatureBase[];
  subrace: Subrace | null;

  constructor(obj?: any) {
    this.subrace_id = obj ? `${obj.subrace_id}` : "";
        this.features = [];
    if (obj && obj.features && obj.features.length > 0) {
      for (let i = 0; i < obj.features.length; i++) {
        this.features.push(new CharacterFeatureBase(obj.features[i]));
      }
    }
    this.subrace = obj && obj.subrace ? new Subrace(obj.subrace) : null;
  }

  get name(): string {
    if (this.subrace) {
      return this.subrace.name;
    }
    return "";
  }

  toDBObj = () => {
    const features: any[] = [];
    for (let i = 0; i < this.features.length; i++) {
      features.push(this.features[i].toDBObj());
    }
    return {
      subrace_id: this.subrace_id,
      features
    };
  }

  copySubrace = (subrace: Subrace) => {
    this.subrace_id = subrace._id;
    this.subrace = subrace;
    this.features = [];
    for (let i = 0; i < subrace.features.length; i++) {
      const fb = subrace.features[i];
      if (!fb.optional) {
        const char_feature_base = new CharacterFeatureBase();
        char_feature_base.copyFeatureBase(fb);
        this.features.push(char_feature_base);
      }
    }
  }

  connectSubrace = (subrace: Subrace) => {
    this.subrace = subrace;
    for (let i = 0; i < this.features.length; i++) {
      const fb = this.features[i];
      const objFinder = subrace.features.filter(fb2 => fb2.true_id === fb.true_id);
      if (objFinder.length === 1) {
        fb.connectFeatureBase(objFinder[0]);
      }
    }
  }
}