
import { Feature } from "./Feature";
import { FeatureChoiceTemplate } from "./FeatureChoiceTemplate";
import { v4 as uuidv4 } from "uuid";


/**
 * This represents something that the character can choose.
 * It contains a list of Features, and they can only choose one.
 * If the FeatureBase has preventDuplicateChoices as true then the 
 * choices from other choices in the same FeatureBase will not be in
 * the available options.
 */
export class FeatureChoice {
  parent_type: string;
  parent_id: string;
  base_id: number;
  id: number;
  true_id: string;
  name: string;
  description: string;
  options: Feature[];
  choice_count: number;


  constructor(obj?: any) {
    this.parent_type = obj ? obj.parent_type : "";
    this.parent_id = obj ? obj.parent_id : "";
    this.base_id = obj ? obj.base_id : 0;
    this.id = obj ? obj.id : 0;
    this.true_id = obj && obj.true_id ? obj.true_id : uuidv4().toString();
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
      true_id: this.true_id,
      name: this.name,
      description: this.description,
      options,
      choice_count: this.choice_count
    };
  }

  copy(copyMe: FeatureChoice): void {
    this.id = copyMe.id;
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.options = copyMe.options;
    this.options.forEach(feature => {
      feature.parent_type = this.parent_type;
      feature.parent_id = this.parent_id;
      feature.base_id = this.id;
    });
    this.choice_count = copyMe.choice_count;
  }

  copyTemplate(copyMe: FeatureChoiceTemplate): void {
    this.name = copyMe.name;
    this.description = copyMe.description;
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
}