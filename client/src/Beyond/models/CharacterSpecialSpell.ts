
import { 
  SpecialSpellFeature,
  Spell,
  Character,
  SlotLevel
} from ".";
import { CharacterSpell } from "./CharacterSpell";

export class CharacterSpecialSpell extends CharacterSpell {
  special_spell_feature_id: string;
  special_spell_feature: SpecialSpellFeature | null;
  special_resource_max: number;
  special_resource_used: number;
  game_class_id: string;
  description: string = "";
  
  constructor(obj?: any) {
    super(obj);
    this.special_spell_feature_id = obj ? obj.special_spell_feature_id : "";
    this.special_spell_feature = obj && obj.special_spell_feature ? new SpecialSpellFeature(obj.special_spell_feature) : null;
    this.special_resource_max = obj && obj.special_resource_max ? obj.special_resource_max : 0;
    this.special_resource_used = obj && obj.special_resource_used ? obj.special_resource_used : 0;
    this.game_class_id = obj && obj.game_class_id ? obj.game_class_id : "";
  }

  use_string(character: Character) {
    const the_ability = this.special_spell_feature;
    if (the_ability instanceof SpecialSpellFeature) {
      if (the_ability.slot_override === "Only Special Resource") {
        return `${this.special_resource_used}/${this.special_resource_max}`;
      } else if (the_ability.slot_override === "And Special Resource") {
        return `${this.special_resource_used}/${this.special_resource_max} + Slot`;
      }
    }
    return "Use";
  }

  disabled(character: Character, level: number = -1) {
    const the_ability = this.special_spell_feature;
    if (the_ability instanceof SpecialSpellFeature) {
      if (the_ability.slot_override === "Only Special Resource") {
        return this.special_resource_used + +the_ability.amount_consumed > +this.special_resource_max;
      } else if (the_ability.slot_override === "At Will" && (level === -1 || level === the_ability.level)) {
        return false;
      } else {
        if (level === -1) {
          level = the_ability.level;
        }
        const filtered_slots = character.slots.filter(o => 
          o.level.value === level // &&
          // (the_ability.slot_type === "" || o.type_id === the_ability.slot_type)
        );
        if (filtered_slots.length === 1) {
          const slot = filtered_slots[0];
          return slot.used + +the_ability.amount_consumed > slot.total;
        }
      }
      //  else {
      //   const resource_finder = obj.resources.filter(o => 
      //     o.type_id === the_ability.resource_consumed);
      //   if (resource_finder.length === 1) {
      //     const resource = resource_finder[0];
      //     return resource.used + +the_ability.amount_consumed > resource.total;
      //   }
      // }
    }
    return true;
  }

  get level(): SlotLevel {
    if (this.the_spell) {
      return this.the_spell.level;
    } else {
      return new SlotLevel();
    }
  }

  toDBObj = () => {
    return {
      true_id: this.true_id,
      spell_id: this.spell_id,
      name: this._name,
      customizations: this.customizations,
      source_type: this.source_type,
      source_id: this.source_id,
      source_name: this.source_name,
      always_known: this.always_known,
      prepared: this.prepared,
      extra: this.extra,
      special_spell_feature_id: this.special_spell_feature_id,
      special_resource_max: this.special_resource_max,
      special_resource_used: this.special_resource_used,
      game_class_id: this.game_class_id
    };
  }

  connectFeature = (feature: SpecialSpellFeature, char: Character, class_id: string) => {
    this.game_class_id = class_id;
    this.special_spell_feature = feature;
    this.special_spell_feature_id = feature.true_id;
    this.special_resource_max = feature.special_resource_amount.value(char, class_id, -1, -1);
  }

  connectSpell = (spell: Spell) => {
    this.spell = spell;
    this.spell_id = spell._id;
  }
}