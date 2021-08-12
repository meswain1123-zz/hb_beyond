
import { TemplateBase } from "./TemplateBase";
import { AbilityEffect, SlotLevel } from ".";
import { Spell } from "./Spell";


export class SpellTemplate extends TemplateBase {
  saving_throw_ability_score: string | null; // Ability Score saving throw the target(s) have to make
  effects: AbilityEffect[]; // Formula for how much damage/healing to do
  // effect_2: AbilityEffect; // Some abilities have a second (like Ice Knife or Booming Blade or things that do different types of damage)
  range: string | null; // Self, Touch, or a number
  range_2: string | null; // For some there are multiple ranges.  It can be an AoE size, or sometimes something else.
  concentration: boolean;
  ritual: boolean;
  notes: string | null;
  duration: string;
  components: string[]; // VSM
  material_component: string;
  casting_time: 'A' | 'BA' | 'RA' | 'Special' | 'Attack'; // A, BA, RA, X minute(s), etc
  school: string | null;
  level: SlotLevel;

  constructor(obj?: any) {
    super(obj);
    this.type = "Spell";
    this.saving_throw_ability_score = obj ? obj.saving_throw_ability_score : "";
    this.effects = []; 
    if (obj && obj.effects && obj.effects.length) {
      obj.effects.forEach((effect: any) => {
        this.effects.push(new AbilityEffect(effect));
      });
    } else if (obj && obj.effect) {
      this.effects.push(new AbilityEffect(obj.effect));
    }
    // this.effect = obj ? new AbilityEffect(obj.effect) : new AbilityEffect();
    // this.effect_2 = obj ? new AbilityEffect(obj.effect_2) : new AbilityEffect();
    this.range = obj ? obj.range : "";
    this.range_2 = obj ? obj.range_2 : "";
    this.concentration = obj ? obj.concentration : false;
    this.ritual = obj ? obj.ritual : false;
    this.notes = obj?.notes;
    this.duration = obj ? obj.duration : "Instantaneous";
    this.components = obj ? [...obj.components] : [];
    this.material_component = obj ? obj.material_component : "";
    this.casting_time = obj ? obj.casting_time : "A";
    this.school = obj ? obj.school : "";
    this.level = obj ? new SlotLevel(obj.level) : new SlotLevel(0);
  }

  toDBObj = () => {
    const effects: any[] = [];
    for (let i = 0; i < this.effects.length; i++) {
      effects.push(this.effects[i].toDBObj());
    }
    return {
      _id: this._id,
      name: this.name,
      description: this.description,
      source_type: this.source_type,
      source_id: this.source_id,
      type: "Spell",
      category: this.category,
      saving_throw_ability_score: this.saving_throw_ability_score,
      effects,
      range: this.range,
      range_2: this.range_2,
      concentration: this.concentration,
      ritual: this.ritual,
      notes: this.notes,
      duration: this.duration,
      components: this.components,
      material_component: this.material_component,
      casting_time: this.casting_time,
      school: this.school,
      level: this.level.value
    };
  }

  clone(): SpellTemplate {
    return new SpellTemplate(this);
  }

  copy(copyMe: SpellTemplate): void {
    this._id = copyMe._id;
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.source_type = copyMe.source_type;
    this.source_id = copyMe.source_id;
    this.type = "Spell";
    this.category = copyMe.category;
    this.saving_throw_ability_score = copyMe.saving_throw_ability_score;
    this.effects = [...copyMe.effects];
    this.range = copyMe.range;
    this.range_2 = copyMe.range_2;
    this.concentration = copyMe.concentration;
    this.ritual = copyMe.ritual;
    this.notes = copyMe.notes;
    this.duration = copyMe.duration;
    this.components = [...copyMe.components];
    this.material_component = copyMe.material_component;
    this.casting_time = copyMe.casting_time;
    this.school = copyMe.school;
    this.level = copyMe.level;
  }

  copyObj(copyMe: Spell): void {
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.source_type = copyMe.source_type;
    this.source_id = copyMe.source_id;
    this.type = "Spell";
    this.saving_throw_ability_score = copyMe.saving_throw_ability_score;
    this.effects = [...copyMe.effects];
    this.range = copyMe.range;
    this.range_2 = copyMe.range_2;
    this.concentration = copyMe.concentration;
    this.ritual = copyMe.ritual;
    this.notes = copyMe.notes;
    this.duration = copyMe.duration;
    this.components = [...copyMe.components];
    this.material_component = copyMe.material_component;
    this.casting_time = copyMe.casting_time;
    this.school = copyMe.school;
    this.level = copyMe.level;
  }
}