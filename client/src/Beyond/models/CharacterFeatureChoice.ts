
import { CharacterFeature } from "./CharacterFeature";
import { FeatureChoice } from "./FeatureChoice";
import { Feature } from "./Feature";


/**
 * This represents something that the character can choose.
 * It contains a list of Features, and they can only choose one.
 * If the FeatureBase has preventDuplicateChoices as true then the 
 * choices from other choices in the same FeatureBase will not be in
 * the available options.
 */
export class CharacterFeatureChoice {
  true_id: string;
  name: string;
  options: CharacterFeature[];
  choice_count: number;
  feature_choice: FeatureChoice | null;


  constructor(obj?: any) {
    this.true_id = obj ? obj.true_id : "";
    this.name = obj ? obj.name : "";
    this.options = [];
    if (obj && obj.options && obj.options.length > 0) {
      obj.options.forEach((f: any) => {
        const feature = new CharacterFeature(f);
        this.options.push(feature);
      });
    }
    this.choice_count = obj ? obj.choice_count : 1;
    this.feature_choice = obj ? new FeatureChoice(obj.feature_choice) : null;
  }

  toDBObj = () => {
    const options: any[] = [];
    this.options.forEach(option => {
      options.push(option.toDBObj());
    });
    return {
      true_id: this.true_id,
      name: this.name,
      options,
      choice_count: this.choice_count
    };
  }

  copyFeatureChoice = (copyMe: FeatureChoice) => {
    this.feature_choice = copyMe;
    this.name = copyMe.name;
    this.true_id = copyMe.true_id;
    this.options = [];
    copyMe.options.forEach((f: Feature) => {
      const char_feature = new CharacterFeature();
      char_feature.copyFeature(f);
      this.options.push(char_feature);
    });
  }

  connectFeatureChoice = (copyMe: FeatureChoice) => {
    this.feature_choice = copyMe;
    this.options.forEach(o => {
      const objFinder = copyMe.options.filter(o2 => o2.true_id === o.true_id);
      if (objFinder.length === 1) {
        o.connectFeature(objFinder[0]);
      }
    });
  }
}