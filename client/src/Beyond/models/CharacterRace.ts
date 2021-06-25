
import { CharacterFeatureBase } from "./CharacterFeatureBase";
import { CharacterSubRace } from "./CharacterSubRace";
import { Race } from "./Race";
import { Subrace } from "./Subrace";

/**
 * This represents a race with the options chosen for a character.
 */
export class CharacterRace {
  race_id: string;
  features: CharacterFeatureBase[];
  subrace: CharacterSubRace | null;
  race: Race | null;

  constructor(obj?: any) {
    this.race_id = obj ? `${obj.race_id}` : "";
    this.features = [];
    if (obj && obj.features && obj.features.length > 0) {
      for (let i = 0; i < obj.features.length; i++) {
        this.features.push(new CharacterFeatureBase(obj.features[i]));
      }
    }
    this.subrace = obj && obj.subrace ? new CharacterSubRace(obj.subrace) : null;
    this.race = obj && obj.race ? new Race(obj.race) : null;
  }

  get name(): string {
    if (this.race) {
      return this.race.name;
    }
    return "";
  }

  toDBObj = () => {
    const features: any[] = [];
    for (let i = 0; i < this.features.length; i++) {
      features.push(this.features[i].toDBObj());
    }
    return {
      race_id: this.race_id,
      subrace: this.subrace,
      features
    };
  }

  copyRace = (race: Race, subrace: Subrace | null = null) => {
    this.race_id = race._id;
    this.race = race;
    this.features = [];
    for (let i = 0; i < race.features.length; i++) {
      const fb = race.features[i];
      if (!fb.optional) {
        const char_feature_base = new CharacterFeatureBase();
        char_feature_base.copyFeatureBase(fb);
        this.features.push(char_feature_base);
      }
    }
    if (subrace) {
      this.subrace = new CharacterSubRace();
      this.subrace.copySubrace(subrace);
    }
  }

  connectRace = (race: Race, subrace: Subrace | null = null) => {
    this.race = race;
    for (let i = 0; i < this.features.length; i++) {
      const fb = this.features[i];
      const objFinder = race.features.filter(fb2 => fb2.true_id === fb.true_id);
      if (objFinder.length === 1) {
        fb.connectFeatureBase(objFinder[0]);
      }
    }
    if (this.subrace && subrace) {
      this.subrace.connectSubrace(subrace);
    }
  }
}