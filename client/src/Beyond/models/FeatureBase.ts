
import { Feature } from "./Feature";
import { FeatureChoice } from "./FeatureChoice";
import { FeatureBaseTemplate } from "./FeatureBaseTemplate";
import { v4 as uuidv4 } from "uuid";


/**
 * This is equivalent to each box in the race or class pages.
 * It contains lists of Features and FeatureChoices.
 */
export class FeatureBase {
  // These 3 don't go to the db.  They're just for identifying within the UI.
  parent_type: string;
  parent_id: string;
  id: number; 

  true_id: string;
  name: string;
  description: string;
  level: number; // Level of when it is available.  0 for ones that don't have a requirement. 
  features: Feature[];
  feature_choices: FeatureChoice[];
  prevent_duplicate_choices: boolean;
  multiclassing: number; 
  // Default 0 means unaffected by multiclassing
  // 2 means only on classes after first
  // 1 means only on first class
  required_condition_ids: string[];

  constructor(obj?: any) {
    this.parent_type = obj ? obj.parent_type : "";
    this.parent_id = obj ? obj.parent_id : "";
    this.id = obj ? obj.id : 0;
    this.true_id = obj && obj.true_id ? obj.true_id : uuidv4().toString();
    this.name = obj ? `${obj.name}` : "";
    this.description = obj ? `${obj.description}` : "";
    this.level = obj ? obj.level : 1;
    this.features = [];
    if (obj && obj.features) {
      obj.features.forEach((f: any) => {
        const feature = new Feature(f);
        feature.parent_type = this.parent_type;
        feature.parent_id = this.parent_id;
        feature.base_id = this.id;
        feature.id = this.features.length;
        if (feature.description.length === 0) {
          feature.fake_description = this.description;
        }
        this.features.push(feature);
      });
    }
    this.feature_choices = [];
    if (obj && obj.feature_choices) {
      obj.feature_choices.forEach((fc: any) => {
        const feature_choice = new FeatureChoice(fc);
        feature_choice.parent_type = this.parent_type;
        feature_choice.parent_id = this.parent_id;
        feature_choice.base_id = this.id;
        feature_choice.id = this.feature_choices.length;
        this.feature_choices.push(feature_choice);
      });
    }
    this.prevent_duplicate_choices = obj ? obj.prevent_duplicate_choices : false;
    this.multiclassing = obj && obj.multiclassing ? obj.multiclassing : 0;
    this.required_condition_ids = obj && obj.required_condition_ids ? obj.required_condition_ids : ["All"];
  }

  toDBObj = () => {
    const features: any[] = [];
    this.features.forEach(feature => {
      features.push(feature.toDBObj());
    });
    const feature_choices: any[] = [];
    this.feature_choices.forEach(feature_choice => {
      feature_choices.push(feature_choice.toDBObj());
    });
    return {
      true_id: this.true_id,
      name: this.name,
      description: this.description,
      level: this.level,
      features,
      feature_choices,
      prevent_duplicate_choices: this.prevent_duplicate_choices,
      multiclassing: this.multiclassing,
      required_condition_ids: this.required_condition_ids
    };
  }

  copy(copyMe: FeatureBase): void {
    this.id = copyMe.id;
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.level = copyMe.level;
    this.features = copyMe.features;
    this.features.forEach(feature => {
      feature.parent_type = this.parent_type;
      feature.parent_id = this.parent_id;
      feature.base_id = this.id;
    });
    this.feature_choices = copyMe.feature_choices;
    this.feature_choices.forEach(feature_choice => {
      feature_choice.parent_type = this.parent_type;
      feature_choice.parent_id = this.parent_id;
      feature_choice.base_id = this.id;
    });
    this.prevent_duplicate_choices = copyMe.prevent_duplicate_choices;
    this.multiclassing = copyMe.multiclassing;
    this.required_condition_ids = copyMe.required_condition_ids;
  }

  copyTemplate(copyMe: FeatureBaseTemplate): void {
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.level = copyMe.level;
    this.features = [];
    copyMe.features.forEach(f => {
      const feature = new Feature(f);
      feature.parent_type = this.parent_type;
      feature.parent_id = this.parent_id;
      feature.base_id = this.id;
      if (feature.description.length === 0) {
        feature.fake_description = this.description;
      }
      this.features.push(feature);
    });
    this.feature_choices = [];
    copyMe.feature_choices.forEach(fc => {
      const feature_choice = new FeatureChoice(fc);
      feature_choice.parent_type = this.parent_type;
      feature_choice.parent_id = this.parent_id;
      feature_choice.base_id = this.id;
      this.feature_choices.push(feature_choice);
    });
    this.prevent_duplicate_choices = copyMe.prevent_duplicate_choices;
    this.multiclassing = copyMe.multiclassing;
    this.required_condition_ids = copyMe.required_condition_ids;
  }
}