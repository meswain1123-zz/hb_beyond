
import { EldritchInvocation } from "./EldritchInvocation";
import { CharacterFeature } from "./CharacterFeature";

export class CharacterEldritchInvocation {
  id: number;
  eldritch_invocation_id: string;
  eldritch_invocation: EldritchInvocation | null;
  features: CharacterFeature[];
  level: number;

  constructor(obj?: any) {
    this.id = obj ? obj.id : 0;
    this.eldritch_invocation_id = obj ? obj.eldritch_invocation_id : "";
    this.features = [];
    if (obj && obj.features && obj.features.length > 0) {
      obj.features.forEach((o: any) => {
        this.features.push(new CharacterFeature(o));
      });
    }
    this.level = obj ? obj.level : 0;
    this.eldritch_invocation = obj && obj.eldritch_invocation ? new EldritchInvocation(obj.eldritch_invocation) : null;
  }

  toDBObj = () => {
    const features: any[] = [];
    this.features.forEach(f => {
      features.push(f.toDBObj());
    });
    return {
      id: this.id,
      eldritch_invocation_id: this.eldritch_invocation_id,
      features
    };
  }

  copyEldritchInvocation = (eldritch_invocation: EldritchInvocation | null) => {
    this.eldritch_invocation = eldritch_invocation;
    this.features = [];
    if (eldritch_invocation) {
      this.eldritch_invocation_id = eldritch_invocation._id;
      eldritch_invocation.features.forEach(f => {
        const char_feature = new CharacterFeature();
        char_feature.copyFeature(f);
        this.features.push(char_feature);
      });
    }
  }

  connectEldritchInvocation = (eldritch_invocation: EldritchInvocation) => {
    this.eldritch_invocation = eldritch_invocation;
    this.features.forEach(f => {
      const objFinder = eldritch_invocation.features.filter(f2 => f2.true_id === f.true_id);
      if (objFinder.length === 1) {
        f.connectFeature(objFinder[0]);
      }
    });
  }
}