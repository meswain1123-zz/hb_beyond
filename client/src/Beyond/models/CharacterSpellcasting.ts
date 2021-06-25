
import { SpellBook } from "./SpellBook";
import { BonusSpells } from "./BonusSpells";
import { SpellcastingFeature } from "./SpellcastingFeature";
import { CharacterFeature } from "./CharacterFeature";

export class CharacterSpellcasting {
  id: number;
  source_id: string;
  source_type: string;
  feature_type: string; 
  the_feature: SpellcastingFeature | SpellBook | BonusSpells | string | number | null;

  constructor(obj?: any) {
    this.id = obj ? obj.id : 0;
    this.source_id = obj && obj.source_id ? obj.source_id : (obj ? obj.class_id : "");
    this.source_type = obj && obj.source_type ? obj.source_type : (obj && obj.class_id ? "Class" : "");
    this.feature_type = obj ? obj.feature_type : "";
    if (this.feature_type === "Spell Book") {
      this.the_feature = obj ? new SpellBook(obj.the_feature) : new SpellBook();
    } else {
      this.the_feature = obj && obj.the_feature ? obj.the_feature : null;
    }
  }

  toDBObj = () => {
    let the_feature: any = null;
    if (this.feature_type === "Spell Book") {
      the_feature = (this.the_feature as SpellBook).toDBObj();
    } else {
      the_feature = this.the_feature
    }
    return {
      id: this.id,
      source_id: this.source_id,
      source_type: this.source_type,
      feature_type: this.feature_type,
      the_feature
    };
  }

  copyFeature = (feature: CharacterFeature) => {
    if ((feature.feature_type === "Spell Book" && feature.feature.the_feature instanceof SpellBook) ||
      (feature.feature_type === "Bonus Spells" && feature.feature.the_feature instanceof BonusSpells) ||
      (feature.feature_type === "Spellcasting" && feature.feature.the_feature instanceof SpellcastingFeature) ||
      ((feature.feature_type === "Spell List" || 
        feature.feature_type === "Ritual Casting") && typeof feature.feature.the_feature === "string") ||
      ((feature.feature_type === "Cantrips" ||
        feature.feature_type === "Spells" ||
        feature.feature_type === "Mystic Arcanum" ||
        feature.feature_type === "Spell Mastery") && (typeof feature.feature.the_feature === "number" || typeof feature.feature.the_feature === "string"))) {
      this.feature_type = feature.feature.feature_type;
      this.the_feature = feature.feature.the_feature;
    }
  }

  connectFeature = (feature: CharacterFeature) => {
    this.copyFeature(feature);
  }
}