
import { FeatureBase } from "./FeatureBase";
import { Feature } from "./Feature";
import { FeatureChoice } from "./FeatureChoice";
import { TemplateBase } from "./TemplateBase";


export class FeatureBaseTemplate extends TemplateBase {
  level: number; // Level of when it is available.  0 for ones that don't have a requirement. 
  features: Feature[];
  feature_choices: FeatureChoice[];
  prevent_duplicate_choices: boolean;
  multiclassing: number;
  required_condition_ids: string[];

  constructor(obj?: any) {
    super(obj);
    this.type = "FeatureBase";
    this.level = obj ? obj.level : 1;
    this.features = [];
    if (obj && obj.features) {
      obj.features.forEach((f: any) => {
        const feature = new Feature(f);
        feature.id = this.features.length;
        this.features.push(feature);
      });
    }
    this.feature_choices = [];
    if (obj && obj.feature_choices) {
      obj.feature_choices.forEach((fc: any) => {
        const feature_choice = new FeatureChoice(fc);
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
      _id: this._id,
      name: this.name,
      description: this.description,
      type: "FeatureBase",
      category: this.category,
      level: this.level,
      features,
      feature_choices,
      prevent_duplicate_choices: this.prevent_duplicate_choices,
      multiclassing: this.multiclassing,
      required_condition_ids: this.required_condition_ids
    };
  }

  copy(copyMe: FeatureBaseTemplate): void {
    this._id = copyMe._id;
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.type = "FeatureBase";
    this.category = copyMe.category;
    this.level = copyMe.level;
    this.features = copyMe.features;
    this.feature_choices = copyMe.feature_choices;
    this.prevent_duplicate_choices = copyMe.prevent_duplicate_choices;
    this.multiclassing = copyMe.multiclassing;
    this.required_condition_ids = copyMe.required_condition_ids;
  }

  copyObj(copyMe: FeatureBase): void {
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.type = "FeatureBase";
    this.level = copyMe.level;
    this.features = [];
    copyMe.features.forEach(f => {
      const feature = new Feature(f);
      this.features.push(feature);
    });
    this.feature_choices = [];
    copyMe.feature_choices.forEach(fc => {
      const feature_choice = new FeatureChoice(fc);
      this.feature_choices.push(feature_choice);
    });
    this.prevent_duplicate_choices = copyMe.prevent_duplicate_choices;
    this.multiclassing = copyMe.multiclassing;
    this.required_condition_ids = copyMe.required_condition_ids;
  }

  clone(): FeatureBaseTemplate {
    return new FeatureBaseTemplate(this);
  }
}