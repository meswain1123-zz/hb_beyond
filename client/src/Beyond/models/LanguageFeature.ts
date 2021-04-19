
export class LanguageFeature {
  type: string; // Standard, Exotic, or Specific
  language_id: string | null; // if it's specific, then this is the id of it

  constructor(obj?: any) {
    this.type = obj ? `${obj.type}` : "Standard";
    this.language_id = obj?.language_id;
  }

  toDBObj = () => {
    return {
      type: this.type,
      language_id: this.language_id
    };
  }
  
  clone(): LanguageFeature {
    return new LanguageFeature(this);
  }

  copy(copyMe: LanguageFeature): void {
    this.type = copyMe.type;
    this.language_id = copyMe.language_id;
  }
}