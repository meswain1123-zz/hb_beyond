
import { TemplateBase } from "./TemplateBase";
import { FeatureChoice } from "./FeatureChoice";
import { Feature } from "./Feature";


export class FeatureChoiceTemplate extends TemplateBase {
  parent_type: string;
  parent_id: string;
  base_id: number;
  id: number;
  name: string;
  description: string;
  options: Feature[];
  choice_count: number;
  
  constructor(obj?: any) {
    super(obj);
    this.type = "FeatureChoice";
    this.parent_type = obj ? obj.parent_type : "";
    this.parent_id = obj ? obj.parent_id : "";
    this.base_id = obj ? obj.base_id : 0;
    this.id = obj ? obj.id : 0;
    this.name = obj ? `${obj.name}` : "";
    this.description = obj ? `${obj.description}` : "";
    this.options = [];
    if (obj && obj.options && obj.options.length > 0) {
      obj.options.forEach((f: any) => {
        const feature = new Feature(f);
        feature.parent_type = this.parent_type;
        feature.parent_id = this.parent_id;
        feature.base_id = this.id;
        feature.id = this.options.length;
        this.options.push(feature);
      });
    }
    this.choice_count = obj ? obj.choice_count : 1;
  }

  toDBObj = () => {
    const options: any[] = [];
    this.options.forEach(option => {
      options.push(option.toDBObj());
    });
    return {
      _id: this._id,
      name: this.name,
      description: this.description,
      source_type: this.source_type,
      source_id: this.source_id,
      type: "FeatureChoice",
      options,
      choice_count: this.choice_count
    };
  }

  copy(copyMe: FeatureChoiceTemplate): void {
    this._id = copyMe._id;
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.type = "FeatureChoice";
    this.options = copyMe.options;
    this.options.forEach(feature => {
      feature.parent_type = this.parent_type;
      feature.parent_id = this.parent_id;
      feature.base_id = this.id;
    });
    this.choice_count = copyMe.choice_count;
  }

  copyObj(copyMe: FeatureChoice): void {
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.type = "FeatureChoice";
    this.options = [];
    copyMe.options.forEach(f => {
      const feature = new Feature(f);
      feature.parent_type = this.parent_type;
      feature.parent_id = this.parent_id;
      feature.base_id = this.id;
      this.options.push(feature);
    });
    this.choice_count = copyMe.choice_count;
  }

  clone(): FeatureChoiceTemplate {
    return new FeatureChoiceTemplate(this);
  }
}