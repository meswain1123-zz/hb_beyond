
import { Modifier } from "./Modifier";
import { SpellModifier } from "./SpellModifier";
import { Proficiency } from "./Proficiency";
import { ResourceFeature } from "./ResourceFeature";
import { Advantage } from "./Advantage";
import { DamageMultiplier } from "./DamageMultiplier";
import { ASIBaseFeature } from "./ASIBaseFeature";
import { TemplateBase } from "./TemplateBase";
import { Feature } from "./Feature";
import { Ability } from "./Ability";
import { SpellAsAbility } from "./SpellAsAbility";
import { ItemAffectingAbility } from "./ItemAffectingAbility";
import { BonusSpells } from "./BonusSpells";
import { SpellBook } from "./SpellBook";
import { SpellcastingFeature } from "./SpellcastingFeature";
import { LanguageFeature } from "./LanguageFeature";
import {
  SenseFeature,
  CreatureAbility,
  MinionAbility
} from ".";

export class FeatureTemplate extends TemplateBase {
  feature_type: string;
  the_feature: Modifier | LanguageFeature | SpellModifier | Proficiency | Advantage | DamageMultiplier | ResourceFeature | ASIBaseFeature | Ability | CreatureAbility | MinionAbility | SpellAsAbility | ItemAffectingAbility | BonusSpells | SpellBook | SpellcastingFeature | SenseFeature | boolean | number | string | null;
  
  constructor(obj?: any) {
    super(obj);
    this.type = "Feature";
    this.feature_type = obj ? `${obj.feature_type}` : "";
    if (obj && obj.the_feature) {
      switch(this.feature_type) {
        case "Language":
          this.the_feature = new LanguageFeature(obj.the_feature);
        break;
        case "Pact Boon":
          this.the_feature = obj.the_feature;
        break;
        case "Eldritch Invocation":
          this.the_feature = obj.the_feature;
        break;
        case "Modifier":
          this.the_feature = new Modifier(obj.the_feature);
        break;
        case "Spell Modifier":
          this.the_feature = new SpellModifier(obj.the_feature);
        break;
        case "Sense":
          this.the_feature = new SenseFeature(obj.the_feature);
        break;
        case "Special Feature":
          this.the_feature = obj.the_feature;
        break;
        case "Special Feature Choices":
        case "Skill Proficiencies":
        case "Skill Proficiency Choices":
        case "Tool Proficiency":
        case "Armor Proficiencies":
        case "Weapon Proficiencies":
        case "Special Weapon Proficiencies":
        case "Saving Throw Proficiencies":
          this.the_feature = new Proficiency(obj.the_feature);
        break;
        case "Expertise":
          this.the_feature = obj.the_feature as number;
        break;
        case "Feat":
          this.the_feature = "Feat";
        break;
        case "Ability":
          this.the_feature = new Ability(obj.the_feature);
          this.the_feature.name = obj.name;
          this.the_feature.description = obj.description;
        break;
        case "Creature Ability":
          this.the_feature = new CreatureAbility(obj.the_feature);
          this.the_feature.name = obj.name;
          this.the_feature.description = obj.description;
        break;
        case "Minion Ability":
          this.the_feature = new MinionAbility(obj.the_feature);
          this.the_feature.name = obj.name;
          this.the_feature.description = obj.description;
        break;
        case "Spell as Ability":
          this.the_feature = new SpellAsAbility(obj.the_feature);
          this.the_feature.name = obj.name;
          this.the_feature.description = obj.description;
        break;
        case "Item Affecting Ability":
          this.the_feature = new ItemAffectingAbility(obj.the_feature);
          this.the_feature.name = obj.name;
          this.the_feature.description = obj.description;
        break;
        case "Advantage":
          this.the_feature = new Advantage(obj.the_feature);
        break;
        case "Damage Multiplier":
          this.the_feature = new DamageMultiplier(obj.the_feature);
        break;
        case "Spellcasting":
          this.the_feature = new SpellcastingFeature(obj.the_feature);
        break;
        case "Bonus Spells":
          this.the_feature = new BonusSpells(obj.the_feature);
        break;
        case "Spell Book":
          this.the_feature = new SpellBook(obj.the_feature);
        break;
        case "Spells":
          this.the_feature = obj.the_feature as number;
        break;
        case "Cantrips":
          this.the_feature = obj.the_feature as number;
        break;
        case "Ritual Casting":
          this.the_feature = "Ritual Casting";
        break;
        case "Resource":
          this.the_feature = new ResourceFeature(obj.the_feature);
        break;
        case "Ability Score Improvement":
          this.the_feature = new ASIBaseFeature(obj.the_feature);
        break;
        case "Mystic Arcanum":
          this.the_feature = obj.the_feature as number;
        break;
        default:
          this.the_feature = null;
        break;
      }
    } else {
      this.the_feature = null;
    }
  }

  toDBObj = () => {
    let the_feature: any = null;
    switch(this.feature_type) {
      case "Language":
        the_feature = (this.the_feature as LanguageFeature).toDBObj();
      break;
      case "Pact Boon":
        the_feature = this.the_feature as string;
      break;
      case "Eldritch Invocation":
        the_feature = this.the_feature as string;
      break;
      case "Modifier":
        the_feature = (this.the_feature as Modifier).toDBObj();
      break;
      case "Spell Modifier":
        the_feature = (this.the_feature as SpellModifier).toDBObj();
      break;
      case "Sense":
        the_feature = (this.the_feature as SenseFeature).toDBObj();
      break;
      case "Special Feature":
        the_feature = this.the_feature as string;
      break;
      case "Special Feature Choices":
      case "Skill Proficiencies":
      case "Skill Proficiency Choices":
      case "Tool Proficiency":
      case "Armor Proficiencies":
      case "Weapon Proficiencies":
      case "Special Weapon Proficiencies":
      case "Saving Throw Proficiencies":
        the_feature = (this.the_feature as Proficiency).toDBObj();
      break;
      case "Expertise":
        the_feature = this.the_feature as number;
      break;
      case "Feat":
        the_feature = "Feat";
      break;
      case "Ability":
        the_feature = (this.the_feature as Ability).toDBObj();
      break;
      case "Creature Ability":
        the_feature = (this.the_feature as CreatureAbility).toDBObj();
      break;
      case "Minion Ability":
        the_feature = (this.the_feature as MinionAbility).toDBObj();
      break;
      case "Spell as Ability":
        the_feature = (this.the_feature as SpellAsAbility).toDBObj();
      break;
      case "Item Affecting Ability":
        the_feature = (this.the_feature as ItemAffectingAbility).toDBObj();
      break;
      case "Advantage":
        the_feature = (this.the_feature as Advantage).toDBObj();
      break;
      case "Damage Multiplier":
        the_feature = (this.the_feature as DamageMultiplier).toDBObj();
      break;
      case "Spellcasting":
        the_feature = (this.the_feature as SpellcastingFeature).toDBObj();
      break;
      case "Bonus Spells":
        the_feature = (this.the_feature as BonusSpells).toDBObj();
      break;
      case "Spell Book":
        the_feature = (this.the_feature as SpellBook).toDBObj();
      break;
      case "Spells":
        the_feature = this.the_feature as number;
      break;
      case "Cantrips":
        the_feature = this.the_feature as number;
      break;
      case "Ritual Casting":
        the_feature = "Ritual Casting";
      break;
      case "Resource":
        the_feature = (this.the_feature as ResourceFeature).toDBObj();
      break;
      case "Ability Score Improvement":
        the_feature = (this.the_feature as ASIBaseFeature).toDBObj();
      break;
      case "Mystic Arcanum":
        the_feature = this.the_feature as number;
      break;
    }
    return {
      _id: this._id,
      name: this.name,
      description: this.description,
      type: "Feature",
      category: this.category,
      feature_type: this.feature_type,
      the_feature
    };
  }

  copy(copyMe: FeatureTemplate): void {
    this._id = copyMe._id;
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.type = "Feature";
    this.category = copyMe.category;
    this.feature_type = copyMe.feature_type;
    this.the_feature = copyMe.the_feature;
  }

  copyObj(copyMe: Feature): void {
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.type = "Feature";
    this.feature_type = copyMe.feature_type;
    switch(this.feature_type) {
      case "Language":
        this.the_feature = new LanguageFeature(copyMe.the_feature);
      break;
      case "Modifier":
        this.the_feature = new Modifier(copyMe.the_feature);
      break;
      case "Spell Modifier":
        this.the_feature = new SpellModifier(copyMe.the_feature);
      break;
      case "Skill Proficiencies":
      case "Skill Proficiency Choices":
      case "Tool Proficiency":
      case "Armor Proficiencies":
      case "Weapon Proficiencies":
      case "Special Weapon Proficiencies":
      case "Saving Throw Proficiencies":
        this.the_feature = new Proficiency(copyMe.the_feature);
      break;
      case "Ability":
        this.the_feature = new Ability(copyMe.the_feature);
      break;
      case "Creature Ability":
        this.the_feature = new CreatureAbility(copyMe.the_feature);
      break;
      case "Minion Ability":
        this.the_feature = new MinionAbility(copyMe.the_feature);
      break;
      case "Spell as Ability":
        this.the_feature = new SpellAsAbility(copyMe.the_feature);
      break;
      case "Item Affecting Ability":
        this.the_feature = new ItemAffectingAbility(copyMe.the_feature);
      break;
      case "Advantage":
        this.the_feature = new Advantage(copyMe.the_feature);
      break;
      case "Damage Multiplier":
        this.the_feature = new DamageMultiplier(copyMe.the_feature);
      break;
      case "Bonus Spells":
        this.the_feature = new BonusSpells(copyMe.the_feature);
      break;
      case "Spell Book":
        this.the_feature = new SpellBook(copyMe.the_feature);
      break;
      case "Resource":
        this.the_feature = new ResourceFeature(copyMe.the_feature);
      break;
      case "Ability Score Improvement":
        this.the_feature = new ASIBaseFeature(copyMe.the_feature);
      break;
      default:
        this.the_feature = copyMe.the_feature;
      break;
    }
  }

  clone(): FeatureTemplate {
    return new FeatureTemplate(this);
  }
}