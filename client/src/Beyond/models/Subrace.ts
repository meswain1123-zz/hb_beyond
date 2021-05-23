
import { ModelBase } from "./ModelBase";
import { FeatureBase } from "./FeatureBase";
import { Feature } from "./Feature";
import { ASIBaseFeature } from "./ASIBaseFeature";
import { ASIFeature } from "./ASIFeature";
import { Language } from "./Language";
import { LanguageFeature } from "./LanguageFeature";


export class Subrace extends ModelBase {
  static data_type: string = "subrace";
  features: FeatureBase[];
  race_id: string;

  constructor(obj?: any) {
    super(obj);
    this.features = [];
    if (obj && obj.features && obj.features.length > 0) {
      obj.features.forEach((o: any) => {
        const fb = new FeatureBase(o);
        fb.id = this.features.length;
        this.features.push(fb);
      });
    }
    this.race_id = obj ? `${obj.race_id}` : "";
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
      source_type: this.source_type,
      source_id: this.source_id,
      features,
      race_id: this.race_id
    };
  }

  clone(): Subrace {
    return new Subrace(this);
  }

  copy(copyMe: Subrace): void {
    this._id = copyMe._id;
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.source_type = copyMe.source_type;
    this.source_id = copyMe.source_id;
    this.features = [...copyMe.features];
    this.race_id = copyMe.race_id;
  }

  copy5e(copyMe: any, race_id: string, languages: Language[]): void {
    console.log(copyMe);
    this.race_id = race_id;
    this.name = copyMe.name;
    this.description = copyMe.desc;
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