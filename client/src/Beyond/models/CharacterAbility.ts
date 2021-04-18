
import { Ability } from "./Ability";
import { SpellAsAbility } from "./SpellAsAbility";
import { ItemAffectingAbility } from "./ItemAffectingAbility";
import { 
  Character,
  CreatureAbility,
  CharacterFeature, 
  IStringNumOrStringHash,
  CharacterClass, 
  CharacterFeat, 
  CharacterItem,
  CharacterRace 
} from ".";

export class CharacterAbility {
  true_id: string;
  id: number;
  ability_type: string; 
  the_ability: Ability | SpellAsAbility | ItemAffectingAbility | CreatureAbility | null;
  source_type: string; // Class, Race, Feat, or Item
  source_id: string;
  source_name: string;
  spellcasting_ability: string;
  spell_dc: number;
  spell_attack: number;
  special_resource_used: number;
  customizations: IStringNumOrStringHash;

  constructor(obj?: any) {
    this.true_id = obj && obj.true_id ? obj.true_id : "";
    this.id = obj ? obj.id : 0;
    this.ability_type = obj ? obj.ability_type : "";
    switch (this.ability_type) {
      case "Ability":
        this.the_ability = obj ? new Ability(obj.the_ability) : new Ability();
      break;
      case "Creature Ability":
        this.the_ability = obj ? new CreatureAbility(obj.the_ability) : new CreatureAbility();
      break;
      case "Spell as Ability":
        this.the_ability = obj ? new SpellAsAbility(obj.the_ability) : new SpellAsAbility();
      break;
      case "Item Affecting Ability":
        this.the_ability = obj ? new ItemAffectingAbility(obj.the_ability) : new ItemAffectingAbility();
      break;
      default:
        this.the_ability = null;
      break;
    }
    this.spellcasting_ability = obj && obj.spellcasting_ability ? obj.spellcasting_ability : "";
    this.spell_attack = obj && obj.spell_attack ? obj.spell_attack : "";
    this.spell_dc = obj && obj.spell_dc ? obj.spell_dc : "";
    this.customizations = obj ? obj.customizations : {};
    this.source_type = obj ? obj.source_type : "";
    this.source_id = obj ? obj.source_id : "";
    this.source_name = obj ? obj.source_name : "";
    this.special_resource_used = obj && obj.special_resource_used ? obj.special_resource_used : 0;
  }

  get name(): string {
    if (this.the_ability) {
      return this.the_ability.name;
    }
    return "";
  }

  use_string(obj: Character) {
    const the_ability = this.the_ability;
    if (the_ability instanceof Ability && the_ability.resource_consumed) {
      if (the_ability.resource_consumed === "Special") {
        return `${this.special_resource_used}/${the_ability.special_resource_amount}`;
      } else {
        const resource_finder = obj.resources.filter(o => 
          o.type_id === the_ability.resource_consumed);
        if (resource_finder.length === 1) {
          const resource = resource_finder[0];
          return `${resource.used}/${resource.total}`;
        }
      }
    }
    return "Use";
  }

  disabled(obj: Character) {
    const the_ability = this.the_ability;
    if (the_ability instanceof Ability && the_ability.resource_consumed) {
      if (the_ability.resource_consumed === "Special") {
        return this.special_resource_used >= +the_ability.special_resource_amount;
      } else {
        const resource_finder = obj.resources.filter(o => 
          o.type_id === the_ability.resource_consumed);
        if (resource_finder.length === 1) {
          const resource = resource_finder[0];
          return resource.used >= resource.total;
        }
      }
    }
    return true;
  }

  self_condition() {
    const cond_ids: string[] = [];
    if (this.the_ability instanceof Ability && this.the_ability.effect.type === "Self Condition") {
      this.the_ability.effect.conditions_applied.forEach(cond_id => {
        cond_ids.push(cond_id);
      });
    } else if (this.the_ability instanceof SpellAsAbility && this.the_ability.spell && this.the_ability.spell.effect.type === "Self Condition") {
      this.the_ability.spell.effect.conditions_applied.forEach(cond_id => {
        cond_ids.push(cond_id);
      });
    }
    return cond_ids;
  }

  toDBObj = () => {
    let the_ability: any = null;
    switch (this.ability_type) {
      case "Ability":
        the_ability = (this.the_ability as Ability).toDBObj();
      break;
      case "Creature Ability":
        the_ability = (this.the_ability as CreatureAbility).toDBObj();
      break;
      case "Spell as Ability":
        the_ability = (this.the_ability as SpellAsAbility).toDBObj();
      break;
      case "Item Affecting Ability":
        the_ability = (this.the_ability as ItemAffectingAbility).toDBObj();
      break;
    }
    return {
      true_id: this.true_id,
      id: this.id,
      ability_type: this.ability_type,
      the_ability,
      customizations: this.customizations,
      source_type: this.source_type,
      source_id: this.source_id,
      source_name: this.source_name,
      special_resource_used: this.special_resource_used
    };
  }

  copyFeature = (feature: CharacterFeature) => {
    if (feature.feature.the_feature instanceof Ability ||
      feature.feature.the_feature instanceof SpellAsAbility ||
      feature.feature.the_feature instanceof ItemAffectingAbility) {
      this.ability_type = feature.feature.feature_type;
      this.the_ability = feature.feature.the_feature;
      this.true_id = feature.feature.the_feature.true_id;
    }
  }

  connectFeature = (feature: CharacterFeature) => {
    this.copyFeature(feature);
  }

  connectSource(source: CharacterClass | CharacterRace | CharacterFeat | CharacterItem) {
    if (source instanceof CharacterClass) {
      this.source_type = "Class";
      this.source_id = source.game_class_id;
      this.spellcasting_ability = source.spellcasting_ability;
      this.spell_attack = source.spell_attack;
      this.spell_dc = source.spell_dc;
      if (source.game_class) {
        this.source_name = source.game_class.name;
      }
    } else if (source instanceof CharacterFeat) {
      this.source_type = "Feat";
      this.source_id = source.feat_id;
      if (source.feat) {
        this.source_name = source.feat.name;
      }
    } else if (source instanceof CharacterItem) {
      this.source_type = "Item";
      this.source_id = source.true_id;
      this.source_name = source.name;
    } else if (source instanceof CharacterRace) {
      this.source_type = "Race";
      this.source_id = source.race_id;
      if (source.race) {
        this.source_name = source.race.name;
      }
    }
  }
}