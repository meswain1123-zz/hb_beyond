
import { CharacterFeatureBase } from "./CharacterFeatureBase";
import { Lineage } from "./Lineage";

/**
 * This represents a race with the options chosen for a character.
 */
export class CharacterLineage {
  lineage_id: string;
  features: CharacterFeatureBase[];
  lineage: Lineage | null;

  constructor(obj?: any) {
    this.lineage_id = obj ? `${obj.lineage_id}` : "";
        this.features = [];
    if (obj && obj.features && obj.features.length > 0) {
      for (let i = 0; i < obj.features.length; i++) {
        this.features.push(new CharacterFeatureBase(obj.features[i]));
      }
    }
    this.lineage = obj && obj.lineage ? new Lineage(obj.lineage) : null;
  }

  get name(): string {
    if (this.lineage) {
      return this.lineage.name;
    }
    return "";
  }

  toDBObj = () => {
    const features: any[] = [];
    for (let i = 0; i < this.features.length; i++) {
      features.push(this.features[i].toDBObj());
    }
    return {
      lineage_id: this.lineage_id,
      features
    };
  }

  copyLineage = (lineage: Lineage) => {
    this.lineage_id = lineage._id;
    this.lineage = lineage;
    this.features = [];
    for (let i = 0; i < lineage.features.length; i++) {
      const fb = lineage.features[i];
      if (!fb.optional) {
        const char_feature_base = new CharacterFeatureBase();
        char_feature_base.copyFeatureBase(fb);
        this.features.push(char_feature_base);
      }
    }
  }

  connectLineage = (lineage: Lineage) => {
    this.lineage = lineage;
    for (let i = 0; i < this.features.length; i++) {
      const fb = this.features[i];
      const objFinder = lineage.features.filter(fb2 => fb2.true_id === fb.true_id);
      if (objFinder.length === 1) {
        fb.connectFeatureBase(objFinder[0]);
      }
    }
  }
}