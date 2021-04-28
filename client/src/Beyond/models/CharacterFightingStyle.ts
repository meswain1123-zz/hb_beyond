
import { FightingStyle } from "./FightingStyle";
import { CharacterFeature } from "./CharacterFeature";

export class CharacterFightingStyle {
  id: number;
  fighting_style_id: string;
  fighting_style: FightingStyle | null;
  features: CharacterFeature[];
  source_id: string;
  source_name: string;
  source_type: string;
  // level: number;

  constructor(obj?: any) {
    this.id = obj ? obj.id : 0;
    this.fighting_style_id = obj ? obj.fighting_style_id : "";
    this.features = [];
    if (obj && obj.features && obj.features.length > 0) {
      obj.features.forEach((o: any) => {
        this.features.push(new CharacterFeature(o));
      });
    }
    this.source_id = obj && obj.source_id ? obj.source_id : "";
    this.source_name = obj && obj.source_name ? obj.source_name : "";
    this.source_type = obj && obj.source_type ? obj.source_type : "";
    // this.level = obj ? obj.level : 0;
    this.fighting_style = obj && obj.fighting_style ? new FightingStyle(obj.fighting_style) : null;
  }

  toDBObj = () => {
    const features: any[] = [];
    this.features.forEach(f => {
      features.push(f.toDBObj());
    });
    return {
      id: this.id,
      fighting_style_id: this.fighting_style_id,
      features
    };
  }

  copyFightingStyle = (fighting_style: FightingStyle | null) => {
    this.fighting_style = fighting_style;
    this.features = [];
    if (fighting_style) {
      this.fighting_style_id = fighting_style._id;
      fighting_style.features.forEach(f => {
        const char_feature = new CharacterFeature();
        char_feature.copyFeature(f);
        this.features.push(char_feature);
      });
    }
  }

  connectFightingStyle = (fighting_style: FightingStyle) => {
    this.fighting_style = fighting_style;
    this.features.forEach(f => {
      const objFinder = fighting_style.features.filter(f2 => f2.true_id === f.true_id);
      if (objFinder.length === 1) {
        f.connectFeature(objFinder[0]);
      }
    });
  }
}