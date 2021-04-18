
import { LanguageFeature } from "./LanguageFeature";


export class CharacterLanguageFeature {
  language_id: string;

  constructor(obj?: any) {
    this.language_id = obj ? obj.language_id : "";
  }

  toDBObj = () => {
    return {
      language_id: this.language_id
    };
  }
  
  clone(): CharacterLanguageFeature {
    return new CharacterLanguageFeature(this);
  }

  copy(copyMe: CharacterLanguageFeature): void {
    this.language_id = copyMe.language_id;
  }

  copyLanguageFeature(copyMe: LanguageFeature): void {
    if (copyMe.language_id) {
      this.language_id = copyMe.language_id;
    }
  }
}