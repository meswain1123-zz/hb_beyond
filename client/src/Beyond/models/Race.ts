
import { ModelBase } from "./ModelBase";
import { FeatureBase } from "./FeatureBase";
import { Feature } from "./Feature";
import { Subrace } from "./Subrace";
import { ASIBaseFeature } from "./ASIBaseFeature";
import { ASIFeature } from "./ASIFeature";
import { Language } from "./Language";
import { LanguageFeature } from "./LanguageFeature";


export class Race extends ModelBase {
  static data_type: string = "race";
  features: FeatureBase[];
  age: string;
  alignment: string;
  size: string;
  size_description: string;
  speed: number;
  subraces: Subrace[];

  constructor(obj?: any) {
    super(obj);
    this.features = [];
    if (obj && obj.features && obj.features.length > 0) {
      for (let i = 0; i < obj.features.length; i++) {
        const feature_base = new FeatureBase(obj.features[i]);
        feature_base.id = this.features.length;
        this.features.push(feature_base);
      };
    }
    this.age = obj ? `${obj.age}` : "";
    this.alignment = obj ? `${obj.alignment}` : "";
    this.size = obj ? `${obj.size}` : "Medium";
    this.size_description = obj ? `${obj.size_description}` : "";
    this.speed = obj ? obj.speed : 30;
    this.subraces = [];
  }

  toDBObj = () => {
    const features: any[] = [];
    this.features.forEach(feature => {
      features.push(feature.toDBObj());
    });
    return {
      _id: this._id,
      name: this.name,
      description: this.description,
      features,
      age: this.age,
      alignment: this.alignment,
      size: this.size,
      size_description: this.size_description,
      speed: this.speed
    };
  }

  clone(): Race {
    return new Race(this);
  }

  copy(copyMe: Race): void {
    this._id = copyMe._id;
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.features = [...copyMe.features];
    this.age = copyMe.age;
    this.alignment = copyMe.alignment;
    this.size = copyMe.size;
    this.size_description = copyMe.size_description;
    this.speed = copyMe.speed;
  }

  copy5e(copyMe: any, languages: Language[]): void {
    this.name = copyMe.name;
    this.age = copyMe.age;
    this.alignment = copyMe.alignment;
    this.size = copyMe.size;
    this.size_description = copyMe.size_description;
    this.speed = copyMe.speed;
    this.features = [];
    if ((copyMe.ability_bonuses && copyMe.ability_bonuses.length > 0) || copyMe.ability_bonus_options) {
      const feature_base = new FeatureBase();
      feature_base.name = "Ability Score Increase";
      const feature = new Feature();
      feature.name = "Ability Score Increase";
      feature.feature_type = "Ability Score Improvement";
      feature.the_feature = new ASIBaseFeature();
      feature.the_feature.allow_duplicates = true;
      feature.the_feature.feat_option = false;
      
      const asi_features: ASIFeature[] = [];
      if (copyMe.ability_bonuses) {
        copyMe.ability_bonuses.forEach((ab: any) => {
          const asi_feature = new ASIFeature();
          asi_feature.id = asi_features.length;
          asi_feature.amount = ab.bonus;
          asi_feature.options = [];
          asi_feature.options.push(ab.ability_score.name);
          asi_features.push(asi_feature);
        });
      }
      if (copyMe.ability_bonus_options) {
        const options = copyMe.ability_bonus_options;
        for (let i = 0; i < options.choose; i++) {
          const asi_feature = new ASIFeature();
          asi_feature.id = asi_features.length;
          asi_feature.options = [];
          options.from.forEach((ab: any) => {
            asi_feature.amount = ab.bonus;
            asi_feature.options.push(ab.ability_score.name);
          });
          asi_features.push(asi_feature);
        }
      }
      feature.the_feature.asi_features = asi_features;

      feature_base.features.push(feature);
      this.features.push(feature_base);
    }
    if ((copyMe.languages && copyMe.languages.length > 0) || copyMe.language_options) {
      const feature_base = new FeatureBase();
      feature_base.name = "Languages";
      if (copyMe.languages) {
        copyMe.languages.forEach((l: any) => {
          const objFinder = languages.filter(o => o.name === l.name);
          if (objFinder.length === 1) {
            const feature = new Feature();
            feature.name = l.name;
            feature.feature_type = "Language";
            feature.the_feature = new LanguageFeature();
            feature.the_feature.type = "Specific";
            feature.the_feature.language_id = objFinder[0]._id;
            feature_base.features.push(feature);
          }
        });
      }
      if (copyMe.language_options) {
        for (let i = 0; i < copyMe.language_options.choose; i++) {
          const feature = new Feature();
          feature.name = `Language Option ${ i + 1 }`;
          feature.feature_type = "Language";
          feature.the_feature = new LanguageFeature();
          feature.the_feature.type = "Standard";
          feature_base.features.push(feature);
        }
      }
      this.features.push(feature_base);
    }
  }
}