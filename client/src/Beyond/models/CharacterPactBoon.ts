
import { PactBoon } from "./PactBoon";
import { CharacterFeature } from "./CharacterFeature";

export class CharacterPactBoon {
  id: number;
  pact_boon_id: string;
  pact_boon: PactBoon | null;
  features: CharacterFeature[];
  level: number;

  constructor(obj?: any) {
    this.id = obj ? obj.id : 0;
    this.pact_boon_id = obj ? obj.pact_boon_id : "";
    this.features = [];
    if (obj && obj.features && obj.features.length > 0) {
      obj.features.forEach((o: any) => {
        this.features.push(new CharacterFeature(o));
      });
    }
    this.level = obj ? obj.level : 0;
    this.pact_boon = obj && obj.pact_boon ? new PactBoon(obj.pact_boon) : null;
  }

  toDBObj = () => {
    const features: any[] = [];
    this.features.forEach(f => {
      features.push(f.toDBObj());
    });
    return {
      id: this.id,
      pact_boon_id: this.pact_boon_id,
      features
    };
  }

  copyPactBoon = (pact_boon: PactBoon | null) => {
    this.pact_boon = pact_boon;
    this.features = [];
    if (pact_boon) {
      this.pact_boon_id = pact_boon._id;
      pact_boon.features.forEach(f => {
        const char_feature = new CharacterFeature();
        char_feature.copyFeature(f);
        this.features.push(char_feature);
      });
    }
  }

  connectPactBoon = (pact_boon: PactBoon) => {
    this.pact_boon = pact_boon;
    this.features.forEach(f => {
      const objFinder = pact_boon.features.filter(f2 => f2.true_id === f.true_id);
      if (objFinder.length === 1) {
        f.connectFeature(objFinder[0]);
      }
    });
  }
}