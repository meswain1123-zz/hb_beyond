
import { FeatureBase } from "./FeatureBase";
import { Feature } from "./Feature";
import { FeatureChoice } from "./FeatureChoice";
import { CharacterASIBaseFeature } from "./CharacterASIBaseFeature";
import { CharacterFeature } from "./CharacterFeature";
import { CharacterFeat } from "./CharacterFeat";
import { CharacterFeatureChoice } from "./CharacterFeatureChoice";
import { CharacterLanguageFeature } from "./CharacterLanguageFeature";
import { CharacterEldritchInvocation } from "./CharacterEldritchInvocation";
import { CharacterSpecialFeature } from "./CharacterSpecialFeature";

/**
 * This represents a feature 
 * (either via race, background, class, or subclass)
 * which the character has.  
 * The FeatureBase is what it is based on, but the 
 * difference is that here we will have values for the choices.
 */
export class CharacterFeatureBase {
  true_id: string;
  name: string;
  feature_base: FeatureBase | null;
  features: CharacterFeature[];
  feature_choices: CharacterFeatureChoice[];
  needs_attention: boolean;

  constructor(obj?: any) {
    this.true_id = obj && obj.true_id ? obj.true_id : "";
    this.name = obj ? obj.name : "";
    this.features = [];
    if (obj && obj.features && obj.features.length > 0) {
      for (let i = 0; i < obj.features.length; i++) {
        this.features.push(new CharacterFeature(obj.features[i]));
      }
    }
    this.feature_choices = [];
    this.feature_base = obj && obj.feature_base ? new FeatureBase(obj.feature_base) : null;
    this.needs_attention = false;
  }

  toDBObj = () => {
    const features: any[] = [];
    this.features.forEach(f => {
      features.push(f.toDBObj());
    });
    const feature_choices: any[] = [];
    this.feature_choices.forEach(fc => {
      feature_choices.push(fc.toDBObj());
    });
    return {
      true_id: this.true_id,
      name: this.name,
      features,
      feature_choices
    };
  }

  copyFeatureBase = (copyMe: FeatureBase) => {
    this.feature_base = new FeatureBase(copyMe);
    this.true_id = copyMe.true_id;
    this.name = copyMe.name;
    this.features = [];
    copyMe.features.forEach((f: Feature) => {
      const char_feature = new CharacterFeature();
      char_feature.copyFeature(f);
      this.features.push(char_feature);
    });
    this.feature_choices = [];
    copyMe.feature_choices.forEach((fc: FeatureChoice) => {
      const char_feature_choice = new CharacterFeatureChoice();
      char_feature_choice.copyFeatureChoice(fc);
      this.feature_choices.push(char_feature_choice);
    });
    this.calcAttention();
  }

  connectFeatureBase = (copyMe: FeatureBase) => {
    this.feature_base = new FeatureBase(copyMe);
    this.features.forEach(f => {
      const objFinder = copyMe.features.filter(f2 => f2.true_id === f.true_id);
      if (objFinder.length === 1) {
        f.connectFeature(objFinder[0]);
      }
    });
    this.calcAttention();
  }

  calcAttention() {
    this.needs_attention = false;
    for (let i = 0; i < this.features.length; i++) {
      const feature = this.features[i];
      if (feature.feature.feature_type === "Skill Proficiency Choices" ||
        feature.feature.feature_type === "Expertise") {
        for (let j = 0; j < feature.feature_options.length; j++) {
          const opt: any = feature.feature_options[j];
          if (opt.skill_id === "") {
            this.needs_attention = true;
            break;
          }
        }
      } else if (feature.feature.feature_type === "Tool Proficiency") {
        for (let j = 0; j < feature.feature_options.length; j++) {
          const opt: any = feature.feature_options[j];
          if (opt.tool_id === "") {
            this.needs_attention = true;
            break;
          }
        }
      } else if (feature.feature.feature_type === "Language") {
        for (let j = 0; j < feature.feature_options.length; j++) {
          const opt = feature.feature_options[j] as CharacterLanguageFeature;
          if (opt.language_id === "") {
            this.needs_attention = true;
            break;
          }
        }
      } else if (feature.feature.feature_type === "Ability Score Improvement") {
        const opt = feature.feature_options[0] as CharacterASIBaseFeature;
        if (opt.feat_option && opt.use_feat === null) {
          this.needs_attention = true;
          break;
        } else if (opt.feat_option && opt.use_feat) {
          if (opt.feat.feat_id === "") {
            this.needs_attention = true;
            break;
          } else {
            const feat = opt.feat;
            for (let l = 0; l < feat.features.length; l++) {
              const feat_feature_base = feat.features[l];
              for (let m = 0; m < feat_feature_base.features.length; m++) {
                const feat_feature = feat_feature_base.features[m];
                if (feat_feature.feature.feature_type === "Skill Proficiency Choices" ||
                  feat_feature.feature.feature_type === "Expertise") {
                  for (let j = 0; j < feat_feature.feature_options.length; j++) {
                    const feat_opt: any = feat_feature.feature_options[j];
                    if (feat_opt.skill_id === "") {
                      this.needs_attention = true;
                      break;
                    }
                  }
                } else if (feat_feature.feature.feature_type === "Tool Proficiency") {
                  for (let j = 0; j < feat_feature.feature_options.length; j++) {
                    const feat_opt: any = feat_feature.feature_options[j];
                    if (feat_opt.tool_id === "") {
                      this.needs_attention = true;
                      break;
                    }
                  }
                } else if (feat_feature.feature.feature_type === "Language") {
                  for (let j = 0; j < feat_feature.feature_options.length; j++) {
                    const feat_opt = feat_feature.feature_options[j] as CharacterLanguageFeature;
                    if (feat_opt.language_id === "") {
                      this.needs_attention = true;
                      break;
                    }
                  }
                } else if (feat_feature.feature.feature_type === "Ability Score Improvement") {
                  for (let j = 0; j < feat_feature.feature_options.length; j++) {
                    const feat_opt = feat_feature.feature_options[j] as CharacterASIBaseFeature;
                    for (let k = 0; k < feat_opt.asi_features.length; k++) {
                      const asi = feat_opt.asi_features[k];
                      if (asi.selected_option === "") {
                        this.needs_attention = true;
                        break;
                      }
                    }
                    if (this.needs_attention) {
                      break;
                    }
                  }
                } else {
                  for (let j = 0; j < feat_feature.feature_options.length; j++) {
                    const feat_opt: any = feat_feature.feature_options[j];
                    if (feat_opt === "") {
                      this.needs_attention = true;
                      break;
                    }
                  }
                }
                if (this.needs_attention) {
                  break;
                }
              }
              if (this.needs_attention) {
                break;
              }
            }
          }
        } else {
          for (let k = 0; k < opt.asi_features.length; k++) {
            const asi = opt.asi_features[k];
            if (asi.selected_option === "") {
              this.needs_attention = true;
              break;
            }
          }
          if (this.needs_attention) {
            break;
          }
        }
      } else if (feature.feature.feature_type === "Feat") {
        const feat: CharacterFeat = feature.feature_options[0];
        if (feat.feat_id === "") {
          this.needs_attention = true;
          break;
        } else {
          for (let l = 0; l < feat.features.length; l++) {
            const feat_feature_base = feat.features[l];
            for (let m = 0; m < feat_feature_base.features.length; m++) {
              const feat_feature = feat_feature_base.features[m];
              if (feat_feature.feature.feature_type === "Skill Proficiency Choices" ||
                feat_feature.feature.feature_type === "Expertise") {
                for (let j = 0; j < feat_feature.feature_options.length; j++) {
                  const opt: any = feat_feature.feature_options[j];
                  if (opt.skill_id === "") {
                    this.needs_attention = true;
                    break;
                  }
                }
              } else if (feat_feature.feature.feature_type === "Tool Proficiency") {
                for (let j = 0; j < feat_feature.feature_options.length; j++) {
                  const opt: any = feat_feature.feature_options[j];
                  if (opt.tool_id === "") {
                    this.needs_attention = true;
                    break;
                  }
                }
              } else if (feat_feature.feature.feature_type === "Language") {
                for (let j = 0; j < feat_feature.feature_options.length; j++) {
                  const opt = feat_feature.feature_options[j] as CharacterLanguageFeature;
                  if (opt.language_id === "") {
                    this.needs_attention = true;
                    break;
                  }
                }
              } else if (feat_feature.feature.feature_type === "Ability Score Improvement") {
                for (let j = 0; j < feat_feature.feature_options.length; j++) {
                  const opt = feat_feature.feature_options[j] as CharacterASIBaseFeature;
                  for (let k = 0; k < opt.asi_features.length; k++) {
                    const asi = opt.asi_features[k];
                    if (asi.selected_option === "") {
                      this.needs_attention = true;
                      break;
                    }
                  }
                  if (this.needs_attention) {
                    break;
                  }
                }
              } else if (feat_feature.feature.feature_type === "Eldritch Invocation") {
                const eldritch_invocation = feat_feature.feature_options[0] as CharacterEldritchInvocation;
                if (eldritch_invocation.eldritch_invocation_id === "") {
                  this.needs_attention = true;
                  break;
                } else {
                  for (let k = 0; k < eldritch_invocation.features.length; k++) {
                    const ei_feature = eldritch_invocation.features[k];
                    for (let j = 0; j < ei_feature.feature_options.length; j++) {
                      const ei_opt: any = ei_feature.feature_options[j];
                      if (ei_opt === "") {
                        this.needs_attention = true;
                        break;
                      }
                    }
                    if (this.needs_attention) {
                      break;
                    }
                  }
                }
                if (this.needs_attention) {
                  break;
                }
              } else if (feat_feature.feature.feature_type === "Special Feature") {
                const special_feature = feat_feature.feature_options[0] as CharacterSpecialFeature;
                if (special_feature.special_feature_id === "") {
                  this.needs_attention = true;
                  break;
                } else {
                  for (let k = 0; k < special_feature.features.length; k++) {
                    const sf_feature = special_feature.features[k];
                    for (let j = 0; j < sf_feature.feature_options.length; j++) {
                      const sf_opt: any = sf_feature.feature_options[j];
                      if (sf_opt === "") {
                        this.needs_attention = true;
                        break;
                      }
                    }
                    if (this.needs_attention) {
                      break;
                    }
                  }
                }
                if (this.needs_attention) {
                  break;
                }
              } else {
                for (let j = 0; j < feature.feature_options.length; j++) {
                  const opt: any = feature.feature_options[j];
                  if (opt === "") {
                    this.needs_attention = true;
                    break;
                  }
                }
              }
              if (this.needs_attention) {
                break;
              }
            }
            if (this.needs_attention) {
              break;
            }
          }
        }
      } else if (feature.feature.feature_type === "Eldritch Invocation") {
        const eldritch_invocation = feature.feature_options[0] as CharacterEldritchInvocation;
        if (eldritch_invocation.eldritch_invocation_id === "") {
          this.needs_attention = true;
          break;
        } else {
          for (let k = 0; k < eldritch_invocation.features.length; k++) {
            const ei_feature = eldritch_invocation.features[k];
            for (let j = 0; j < ei_feature.feature_options.length; j++) {
              const ei_opt: any = ei_feature.feature_options[j];
              if (ei_opt === "") {
                this.needs_attention = true;
                break;
              }
            }
            if (this.needs_attention) {
              break;
            }
          }
        }
        if (this.needs_attention) {
          break;
        }
      } else if (feature.feature.feature_type === "Special Feature") {
        const special_feature = feature.feature_options[0] as CharacterSpecialFeature;
        if (special_feature.special_feature_id === "") {
          this.needs_attention = true;
          break;
        } else {
          for (let k = 0; k < special_feature.features.length; k++) {
            const sf_feature = special_feature.features[k];
            for (let j = 0; j < sf_feature.feature_options.length; j++) {
              const sf_opt: any = sf_feature.feature_options[j];
              if (sf_opt === "") {
                this.needs_attention = true;
                break;
              }
            }
            if (this.needs_attention) {
              break;
            }
          }
        }
        if (this.needs_attention) {
          break;
        }
      } else {
        for (let j = 0; j < feature.feature_options.length; j++) {
          const opt: any = feature.feature_options[j];
          if (opt === "") {
            this.needs_attention = true;
            break;
          }
        }
      }
      if (this.needs_attention) {
        break;
      }
    }
  }
}