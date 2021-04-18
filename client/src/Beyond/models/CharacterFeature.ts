
import { Feature } from "./Feature";
// None of these have options or special resources
// import { CharacterModifier } from "./CharacterModifier";
// import { CharacterSpellModifier } from "./CharacterSpellModifier";
// import { CharacterProficiency } from "./CharacterProficiency";
// import { CharacterBonusSpells } from "./CharacterBonusSpells";
// import { CharacterResourceFeature } from "./CharacterResourceFeature";
// import { CharacterAdvantage } from "./CharacterAdvantage";
// import { CharacterDamageMultiplier } from "./CharacterDamageMultiplier";
// These may have special resources
import { Proficiency } from "./Proficiency";
// import { SpellAsAbility } from "./SpellAsAbility";
// import { ItemAffectingAbility } from "./ItemAffectingAbility";
// These may have options
import { ASIBaseFeature } from "./ASIBaseFeature";
import { CharacterASIBaseFeature } from "./CharacterASIBaseFeature";
import { LanguageFeature } from "./LanguageFeature";
import { CharacterLanguageFeature } from "./CharacterLanguageFeature";
import { CharacterFeat } from "./CharacterFeat";
import { CharacterEldritchInvocation } from "./CharacterEldritchInvocation";
import { CharacterPactBoon } from "./CharacterPactBoon";
import { CharacterSpecialFeature } from "./CharacterSpecialFeature";
import { Feat } from "./Feat";
import { EldritchInvocation } from "./EldritchInvocation";
import { PactBoon } from "./PactBoon";
import { SpecialFeature } from "./SpecialFeature";
import { SpellcastingFeature } from "./SpellcastingFeature";
import { CharacterSpellcasting } from "./CharacterSpellcasting";
// import { SpellBook } from "./SpellBook";
// import {
//   CharacterSense
// } from ".";


/**
 * This represents a feature 
 * (either via race, background, class, or subclass)
 * which the character has.  
 * The FeatureBase is what it is based on, but the 
 * difference is that here we will have values for the choices.
 */
export class CharacterFeature {
  true_id: string;
  feature_type: string;
  feature: Feature;
  name: string;
  special_resource: string;
  special_resource_max: string;
  // options holds things that can vary for the feature. 
  // for ASI it will have objects with the amounts and the selected ability scores
  // for SpellBook it will have objects with spell_id's, the level it was learned at, and whether it was learned at level up or from someting else (training, scroll, or spellbook)
  feature_options: any[]; 
  // the_feature: CharacterASIBaseFeature | CharacterAbility | CharacterSpellAsAbility | CharacterItemAffectingAbility | CharacterSpellBook | boolean | number | string | null;

  constructor(obj?: any) {
    this.true_id = obj ? obj.true_id : "";
    this.name = obj ? `${obj.name}` : "";
    this.feature_type = obj ? obj.feature_type : "";
    this.special_resource = obj ? `${obj.special_resource}` : "";
    this.special_resource_max = obj ? `${obj.special_resource_max}` : "";
    this.feature_options = [];
    if (obj && obj.feature_options && obj.feature_options.length > 0) {
      switch (this.feature_type) {
        case "Language":
          this.feature_options.push(new CharacterLanguageFeature(obj.feature_options[0]));
        break;
        case "Ability Score Improvement":
          this.feature_options.push(new CharacterASIBaseFeature(obj.feature_options[0]));
        break;
        case "Specific Special Feature":
          this.feature_options.push(new CharacterSpecialFeature(obj.feature_options[0]));
        break;
        case "Special Feature": // It's the id of the specific special feature they choose
          this.feature_options.push(new CharacterSpecialFeature(obj.feature_options[0]));
        break;
        case "Special Feature Choices": // It's the ids of the specific skills they choose
          for (let i = 0; i < obj.feature_options.length; i++) {
            this.feature_options.push(new CharacterSpecialFeature(obj.feature_options[i]));
          }
        break;
        case "Sense":
          // this.feature_options.push(new CharacterSense(obj.feature_options[0]));
        break;
        case "Skill Proficiency Choices": // It's the ids of the specific skills they choose
          for (let i = 0; i < obj.feature_options.length; i++) {
            this.feature_options.push({ id: i, skill_id: obj.feature_options[i] });
          }
        break;
        case "Tool Proficiency":
          this.feature_options.push({ type: obj.feature_options[0], tool_id: obj.feature_options[1] });
        break;
        case "Expertise": // It's the ids of the specific skills they choose
          for (let i = 0; i < obj.feature_options.length; i++) {
            this.feature_options.push({ id: i, skill_id: obj.feature_options[i] });
          }
        break;
        case "Feat": // It's the id of the specific feat they choose
          this.feature_options.push(new CharacterFeat(obj.feature_options[0]));
        break;
        case "Eldritch Invocation": // It's the id of the specific feat they choose
          this.feature_options.push(new CharacterEldritchInvocation(obj.feature_options[0]));
        break;
        case "Pact Boon": // It's the id of the specific feat they choose
          this.feature_options.push(new CharacterPactBoon(obj.feature_options[0]));
        break;
      }
    }
    this.feature = obj && obj.feature ? new Feature(obj.feature) : new Feature();
  }

  toDBObj = () => {
    let feature_options: any[] = [];
    if (this.feature_options.length > 0) {
      switch (this.feature_type) {
        case "Language":
          feature_options.push((this.feature_options[0] as CharacterLanguageFeature).toDBObj());
        break;
        case "Ability Score Improvement":
          feature_options.push((this.feature_options[0] as CharacterASIBaseFeature).toDBObj());
        break;
        case "Special Feature":
          feature_options.push((this.feature_options[0] as CharacterSpecialFeature).toDBObj());
        break;
        case "Special Feature Choices":
          for (let i = 0; i < this.feature_options.length; i++) {
            feature_options.push((this.feature_options[i] as CharacterSpecialFeature).toDBObj());
          }
        break;
        case "Specific Special Feature":
          feature_options.push((this.feature_options[0] as CharacterSpecialFeature).toDBObj());
        break;
        case "Sense":
          // feature_options.push((this.feature_options[0] as CharacterSense).toDBObj());
        break;
        case "Skill Proficiency Choices": // It's the ids of the specific skills they choose
          for (let i = 0; i < this.feature_options.length; i++) {
            const o = this.feature_options[i];
            feature_options.push(o.skill_id as string);
          }
        break;
        case "Tool Proficiency":
          const o = this.feature_options[0];
          feature_options.push(o.type as string);
          feature_options.push(o.tool_id as string);
        break;
        case "Expertise": // It's the ids of the specific skills they choose
          for (let i = 0; i < this.feature_options.length; i++) {
            const o = this.feature_options[i];
            feature_options.push(o.skill_id as string);
          }
        break;
        case "Feat": // It's the id of the specific feat they choose
          feature_options.push((this.feature_options[0] as CharacterFeat).toDBObj());
        break;
        case "Eldritch Invocation": // It's the id of the specific feat they choose
          feature_options.push((this.feature_options[0] as CharacterEldritchInvocation).toDBObj());
        break;
        case "Pact Boon": // It's the id of the specific feat they choose
          feature_options.push((this.feature_options[0] as CharacterPactBoon).toDBObj());
        break;
      }
    }
    return {
      true_id: this.true_id,
      name: this.name,
      feature_type: this.feature_type,
      special_resource: this.special_resource,
      special_resource_max: this.special_resource_max,
      feature_options,
      // the_feature
    };
  }

  copyFeature = (copyMe: Feature) => {
    this.feature = copyMe;
    this.true_id = copyMe.true_id;
    this.name = copyMe.name;
    this.feature_type = copyMe.feature_type;
    this.feature_options = [];
    if (copyMe.feature_type === "Language") {
      const language_feature = copyMe.the_feature as LanguageFeature;
      const char_language_feature = new CharacterLanguageFeature();
      char_language_feature.copyLanguageFeature(language_feature);
      this.feature_options.push(char_language_feature);
    } else if (copyMe.feature_type === "Ability Score Improvement") {
      const asi = copyMe.the_feature as ASIBaseFeature;
      const char_asi = new CharacterASIBaseFeature();
      char_asi.copyASIBaseFeature(asi);
      char_asi.id = 0;
      this.feature_options.push(char_asi);
    } else if (copyMe.feature_type === "Special Feature") {
      this.feature_options.push(new CharacterSpecialFeature());
    } else if (copyMe.feature_type === "Specific Special Feature") {
      this.feature_options.push(new CharacterSpecialFeature());
    } else if (copyMe.feature_type === "Special Feature Choices") {
      const prof = copyMe.the_feature as Proficiency;
      for (let i = 0; i < prof.choice_count; i++) {
        this.feature_options.push(new CharacterSpecialFeature());
      }
    } else if (copyMe.feature_type === "Sense") {
      // this.feature_options.push(new CharacterSense());
    } else if (copyMe.feature_type === "Skill Proficiency Choices") {
      const prof = copyMe.the_feature as Proficiency;
      for (let i = 0; i < prof.choice_count; i++) {
        this.feature_options.push({ id: i, skill_id: "" });
      }
    } else if (copyMe.feature_type === "Tool Proficiency") {
      const prof = copyMe.the_feature as Proficiency;
      this.feature_options.push({ id: 0, type: prof.the_proficiencies[0], tool_id: prof.the_proficiencies[1] });
    } else if (copyMe.feature_type === "Expertise") {
      const expertises = copyMe.the_feature as number;
      for (let i = 0; i < expertises; i++) {
        this.feature_options.push({ id: i, skill_id: "" });
      }
    } else if (copyMe.feature_type === "Feat") {
      this.feature_options.push(new CharacterFeat());
    } else if (copyMe.feature_type === "Eldritch Invocation") {
      this.feature_options.push(new CharacterEldritchInvocation());
    } else if (copyMe.feature_type === "Pact Boon") {
      this.feature_options.push(new CharacterPactBoon());
    } else if (["Spell Book","Bonus Spells","Spellcasting","Spell List","Ritual Casting",
      "Cantrips","Spells","Mystic Arcanum"].includes(copyMe.feature_type)) {
      const spellcasting = new CharacterSpellcasting();
      spellcasting.copyFeature(this);
      this.feature_options.push(spellcasting);
    }
  }

  connectFeature = (copyMe: Feature, obj: Feat | PactBoon | EldritchInvocation | SpecialFeature | ASIBaseFeature | SpellcastingFeature | null = null) => {
    this.feature = new Feature(copyMe);
    if (obj) {
      if (copyMe.feature_type === "Feat" && obj instanceof Feat) {
        const opt = this.feature_options[0] as CharacterFeat;
        opt.connectFeat(obj);
      } else if (copyMe.feature_type === "Pact Boon" && obj instanceof PactBoon) {
        const opt = this.feature_options[0] as CharacterPactBoon;
        opt.connectPactBoon(obj);
      } else if (copyMe.feature_type === "Eldritch Invocation" && obj instanceof EldritchInvocation) {
        const opt = this.feature_options[0] as CharacterEldritchInvocation;
        opt.connectEldritchInvocation(obj);
      } else if (copyMe.feature_type === "Special Feature" && obj instanceof SpecialFeature) {
        const opt = this.feature_options[0] as CharacterSpecialFeature;
        opt.connectSpecialFeature(obj);
      } else if (copyMe.feature_type === "Ability Score Improvement" && obj instanceof ASIBaseFeature) {
        const opt = this.feature_options[0] as CharacterASIBaseFeature;
        opt.connectASIBaseFeature(obj);
      } else if (["Spell Book","Bonus Spells","Spellcasting","Spell List","Ritual Casting",
        "Cantrips","Spells","Mystic Arcanum"].includes(copyMe.feature_type)) {
        const opt = this.feature_options[0] as CharacterSpellcasting;
        opt.connectFeature(this);
      }
    }
    // switch(copyMe.feature_type) {
    //   case "Language":
    //     // No need to connect
    //     // const language_feature = copyMe.the_feature as LanguageFeature;
    //     // const char_language_feature = this.feature_options[0] as CharacterLanguageFeature;
    //     // char_language_feature.connectLanguageFeature(language_feature);
    //   break;
    //   case "Ability Score Improvement":
    //     // No need to connect
    //     // const asi = copyMe.the_feature as ASIBaseFeature;
    //     // const char_asi = this.feature_options[0] as CharacterASIBaseFeature;
    //     // char_asi.connectASIBaseFeature(asi);
    //   break;
    //   case "Special Feature":
    //     // It's a string of the id, so no need to connect
    //   break;
    //   case "Skill Proficiency Choices": // It's the ids of the specific skills they choose
    //     // It's a generic object, so no need to connect
    //     // const prof = copyMe.the_feature as Proficiency;
    //     // for (let i = 0; i < prof.choice_count; i++) {
    //     //   this.feature_options.push({ id: i, skill_id: "" });
    //     // }
    //   break;
    //   case "Expertise": // It's the ids of the specific skills they choose
    //     // It's a generic object, so no need to connect
    //     // const expertises = copyMe.the_feature as number;
    //     // for (let i = 0; i < expertises; i++) {
    //     //   this.feature_options.push({ id: i, skill_id: "" });
    //     // }
    //   break;
    //   case "Feat": // It's the id of the specific feat they choose
    //     // No need to connect?
    //     // this.feature_options.push(new CharacterFeat());
    //   break;
    // }
  }
}