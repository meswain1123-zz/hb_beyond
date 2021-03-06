

import {
  // Ability,
  AbilityScores,
  Advantage,
  ArmorType,
  Bonus,
  BonusSpells,
  Campaign,
  Character,
  CharacterAbility,
  CharacterASIBaseFeature,
  CharacterEldritchInvocation,
  CharacterFeat,
  CharacterFeature,
  CharacterFeatureBase,
  CharacterFightingStyle,
  CharacterItem,
  CharacterLanguageFeature,
  CharacterPactBoon,
  CharacterRace,
  CharacterResource,
  CharacterSense,
  CharacterSlot,
  CharacterSpecialFeature,
  CharacterSpell,
  CharacterSpellcasting,
  Condition,
  DamageMultiplier,
  DamageMultiplierSimple,
  EldritchInvocation,
  FightingStyle,
  HitDice,
  Modifier,
  Proficiency,
  Reroll,
  ResourceFeature,
  SenseFeature,
  Spell,
  SpellAsAbility,
  SpellBook,
  SpellcastingFeature,
  SpellModifier,
  SpellSlotType,
  WeaponKeyword,
  Attack,
  RollPlus,
  IStringNumHash,
  IStringHash,
  SpecialSpellFeature,
  CharacterSpecialSpell,
  CharacterSpellBook,
  CharacterAction,
  SlotLevel,
  Ability,
  CharacterBackground
} from "../models";

import API from "./smart_api";
import { APIClass } from "./smart_api_class";

export class CharacterUtilitiesClass {
  conditions: Condition[] | null;
  spells: Spell[] | null;
  eldritch_invocations: EldritchInvocation[] | null;
  fighting_styles: FightingStyle[] | null;
  weapon_keywords: WeaponKeyword[] | null;
  armor_types: ArmorType[] | null;
  spell_slot_types: SpellSlotType[] | null;

  constructor() {
    this.api = API.getInstance();
    this.conditions = null;
    this.spells = null;
    this.eldritch_invocations = null;
    this.fighting_styles = null;
    this.weapon_keywords = null;
    this.armor_types = null;
    this.spell_slot_types = null;
    this.api.getSetOfObjects(["condition","spell", "eldritch_invocation", "weapon_keyword","armor_type","spell_slot_type","fighting_style"]).then((res: any) => {
      this.conditions = res.condition;
      this.spells = res.spell;
      this.eldritch_invocations = res.eldritch_invocation;
      this.fighting_styles = res.fighting_style;
      this.weapon_keywords = res.weapon_keyword;
      this.armor_types = res.armor_type;
      this.spell_slot_types = res.spell_slot_type;
    });
  }

  api: APIClass;

  get_weapon_attack(item: CharacterItem, char: Character, proficient: boolean, ba: boolean, type: string, two_handed_id: string): Attack {
    let max_asm = char.current_ability_scores.getModifier(item.use_ability_score);
    if (!max_asm) {
      max_asm = 0;
    }

    const attack = new Attack();

    attack.attack_rolls = [];
    if (!["","None","undefined"].includes(item.use_ability_score)) {
      const rolls = new RollPlus();
      rolls.ability_score = item.use_ability_score;
      attack.attack_rolls.push(rolls);
    }
    if (proficient) {
      const bonus = new RollPlus();
      bonus.flat = char.proficiency_modifier;
      attack.attack_rolls.push(bonus);
    } 
    char.attack_bonuses.forEach(ab => {
      let good = false;
      if (ab.types.includes(item.use_ability_score)) {
        good = true;
      } else if (item.weapon_keywords.filter(o => ab.types.includes(o.name))) {
        good = true;
      }

      if (good) {
        attack.attack_rolls.push(ab.rolls);
      }
    });
    if (["SS","GWM"].includes(type)) {
      const rolls = new RollPlus();
      rolls.flat = -5;
      attack.attack_rolls.push(rolls);
    }
    // TODO: Make something using my 
    // feature system which allows 
    // special attacks akin to SS and GWM.
    // It would probably be at least as 
    // complicated as the one for 
    // Dual Wielder and Crossbow Expert

    attack.bonus_action = ba;
    attack.damage_rolls = [];
    if (item.base_item) {
      if (type === "Versatile") {
        item.base_item.versatile_attack_damages.forEach(d => {
          const damage = new RollPlus();
          damage.size = d.size;
          damage.count = d.count;
          damage.type = d.type;
          attack.damage_rolls.push(damage);
        });
      } else {
        item.base_item.attack_damages.forEach(d => {
          const damage = new RollPlus();
          damage.size = d.size;
          damage.count = d.count;
          damage.type = d.type;
          attack.damage_rolls.push(damage);
        });
      }
    }
    if (item.magic_item) {
      item.magic_item.bonus_damages.forEach(d => {
        const damage = new RollPlus();
        damage.size = d.size;
        damage.count = d.count;
        damage.type = d.type;
        attack.damage_rolls.push(damage);
      });
    }
    if (!ba) {
      if (attack.damage_rolls.length > 0) {
        const damage = attack.damage_rolls[0];
        damage.ability_score = item.use_ability_score;
      }
    }
    if (["SS","GWM"].includes(type)) {
      if (attack.damage_rolls.length > 0) {
        const damage = attack.damage_rolls[0];
        damage.flat += 10;
      }
    }
    char.damage_bonuses.forEach(db => {
      let good = false;
      if (db.types.includes(item.use_ability_score)) {
        good = true;
      } else {
        // Check the keywords
        for (let i = 0; i < item.weapon_keywords.length; ++i) {
          if (db.types.includes(item.weapon_keywords[i].name)) {
            good = true;
            break;
          }
        }
        if (!good) {
          // Check the damage types
          for (let i = 0; i < attack.damage_rolls.length; ++i) {
            if (db.types.includes(attack.damage_rolls[i].type)) {
              good = true;
              break;
            }
          }
        }
      }
      if (good) {
        good = false;
        if (db.required.includes("Any") || item.weapon_keywords.filter(o => db.required.includes(o._id)).length > 0) {
          if (db.excluded.includes("Any")) {
            good = true;
          } else if (item.weapon_keywords.filter(o => db.excluded.includes(o._id)).length === 0) {
            if (type === "Versatile" && db.excluded.includes(two_handed_id)) {
              // There's the possibility that Two Handed is excluded, and it's being allowed because it's Versatile.
              // Two Handed exclusions are excluded for Versatile attacks.
            } else {
              good = true;
            }
          }
        }
      }

      if (good) {
        attack.damage_rolls.push(db.rolls);
      }
    });
    attack.damage_rolls.filter(o => o.ability_score === "Attack Ability").forEach(roll_plus => {
      roll_plus.ability_score = item.use_ability_score;
    });
    attack.recalc_attack_string(char.current_ability_scores);
    attack.recalc_damage_string(char.current_ability_scores);
    attack.type = type;
    return attack;
  }

  get_weapon_attacks(item: CharacterItem, char: Character, two_handed_id: string): Attack[] {
    let max_asm = -5;
    let max_ability = "";
    // This is where I'll need to put checks for features like Hex Weapon
    item.weapon_keywords.filter(o => o.use_ability_score).forEach(wk => {
      if (wk.use_ability_score) {
        const newbie = char.current_ability_scores.getModifier(wk.use_ability_score);
        if (newbie && newbie > max_asm) {
          max_asm = newbie;
          max_ability = wk.use_ability_score;
        }
      }
    });
    item.use_ability_score = max_ability;
    const attacks: Attack[] = [];

    // Check for proficiency
    let proficient = false;
    if (item.base_item && char.special_weapon_proficiencies.includes(item.base_item._id)) {
      proficient = true;
    } else {
      const wk_ids = item.weapon_keywords.map(o => o._id);
      for (let i = 0; i < wk_ids.length; i++) {
        if (char.weapon_proficiencies.includes(wk_ids[i])) {
          proficient = true;
          break;
        }
      }
    }
    // May have different attacks based on weapon keywords and feats.
    // If it's Light then they can 
    // also have a bonus_action attack with it.
    let ba = false;
    if (item.weapon_keywords.filter(o => o.can_two_weapon_fight).length > 0 && 
      item.weapon_keywords.filter(o => o.name === "Range").length === 0) {
      ba = true;
    } else if (item.weapon_keywords.filter(o => o.name === "Melee").length > 0 &&
      item.weapon_keywords.filter(o => o.name === "Two-Handed").length === 0) {
      if (char.feats.filter(o => o.feat && o.feat.name === "Dual Wielder").length > 0) {
        // Melee non-two-handed weapons can be used for bonus action attacks with this feat
        ba = true;
      }
    } else if (item.name.toLowerCase().includes("crossbow, hand")) {
      if (char.feats.filter(o => o.feat && o.feat.name === "Crossbow Expert").length > 0) {
        // Crossbow Expert makes it so Hand Crossbow can (sometimes) be used as a bonus action
        ba = true;
      }
    }
    // TODO: Make something using my 
    // feature system which allows 
    // bonus action attacks for weapons 
    // based on weapon names or keywords.
    // It's low priority, and would take some
    // logic because it would need exclusions
    // and inclusions.
    // Once it's done however it would
    // allow the creation of additional features 
    // akin to Dual Wielder and Crossbow Expert
    
    attacks.push(this.get_weapon_attack(item, char, proficient, false, "Normal", two_handed_id));
    if (ba) {
      attacks.push(this.get_weapon_attack(item, char, proficient, true, "Normal", two_handed_id));
    }
    if (item.weapon_keywords.filter(o => o.name === "Versatile").length > 0) {
      // If the weapon is Versatile then there's a SingleHanded and a TwoHanded.
      attacks.push(this.get_weapon_attack(item, char, proficient, false, "Versatile", two_handed_id));
    } else if (item.weapon_keywords.filter(o => o.name === "Great Weapon").length > 0) {
      // If it's a Great Weapon, 
      // and they have Great Weapon Master, 
      // then they have Normal and GWM attacks.
      if (char.feats.filter(o => o.feat && o.feat.name === "Great Weapon Master").length > 0) {
        attacks.push(this.get_weapon_attack(item, char, proficient, false, "GWM", two_handed_id));
      }
    } else if (item.weapon_keywords.filter(o => o.name === "Ranged").length > 0) {
      // If it's a Ranged Weapon 
      // and they have Sharpshooter,
      // then they have Normal and SS attacks.
      if (char.feats.filter(o => o.feat && o.feat.name === "Sharp Shooter").length > 0) {
        attacks.push(this.get_weapon_attack(item, char, proficient, false, "SS", two_handed_id));
        if (ba) {
          attacks.push(this.get_weapon_attack(item, char, proficient, true, "SS", two_handed_id));
        }
      }
    }
    return attacks;
  }
  
  get_unarmed_strike(char: Character, score: string, ba: boolean, damage_type: string): Attack {
    const attack = new Attack();

    attack.attack_rolls = [];
    const rolls = new RollPlus();
    rolls.ability_score = score;
    rolls.flat = char.proficiency_modifier;
    attack.attack_rolls.push(rolls);
    char.attack_bonuses.forEach(ab => {
      let good = false;
      if (ab.types.includes(score)) {
        good = true;
      }

      if (good) {
        attack.attack_rolls.push(ab.rolls);
      }
    });
    attack.bonus_action = ba;
    attack.damage_rolls = [];
    const damage = new RollPlus();
    damage.size = char.unarmed_strike_size;
    damage.count = char.unarmed_strike_count;
    damage.type = damage_type;
    attack.damage_rolls.push(damage);
    damage.ability_score = score;
    char.damage_bonuses.forEach(db => {
      let good = false;
      if (db.types.includes(score)) {
        good = true;
      } else {
        // Check the damage types
        for (let i = 0; i < attack.damage_rolls.length; ++i) {
          if (db.types.includes(attack.damage_rolls[i].type)) {
            good = true;
            break;
          }
        }
      }

      if (good) {
        attack.damage_rolls.push(db.rolls);
      }
    });
    attack.damage_rolls.filter(o => o.ability_score === "Attack Ability").forEach(roll_plus => {
      roll_plus.ability_score = score;
    });
    attack.recalc_attack_string(char.current_ability_scores);
    attack.recalc_damage_string(char.current_ability_scores);
    attack.type = "Normal";
    return attack;
  }

  get_unarmed_strikes(char: Character): Attack[] {
    let max_asm = -5;
    let max_score = "";
    char.unarmed_strike_scores.forEach(score => {
      const new_score = char.current_ability_scores.getModifier(score);
      if (new_score && new_score > max_asm) {
        max_asm = new_score;
        max_score = score;
      }
    });
    const attacks: Attack[] = [];
    char.unarmed_strike_damage_types.forEach(damage_type => {
      attacks.push(this.get_unarmed_strike(char, max_score, false, damage_type));
    });
    if (char.unarmed_strike_bonus_action) {
      char.unarmed_strike_damage_types.forEach(damage_type => {
        attacks.push(this.get_unarmed_strike(char, max_score, true, damage_type));
      });
    }
    return attacks;
  }

  recalcAll(char: Character, campaign: Campaign | null = null): void {
    if (this.armor_types && this.conditions && this.spells && this.spell_slot_types && this.weapon_keywords && this.eldritch_invocations && this.fighting_styles) {
      const all_armor_types = this.armor_types;
      const all_spells = this.spells;
      const all_spell_slot_types = this.spell_slot_types;
      const all_conditions = this.conditions;
      const all_eldritch_invocations = this.eldritch_invocations;
      const all_fighting_styles = this.fighting_styles;
      const all_weapon_keywords = this.weapon_keywords;
      // Proficiencies
      let skill_proficiencies: IStringNumHash = {};
      let armor_type_proficiencies: string[] = [];
      let weapon_keyword_proficiencies: string[] = [];
      let special_weapon_proficiencies: string[] = [];
      let tool_proficiencies: IStringNumHash = {};
      let saving_throw_proficiencies: string[] = [];

      // Feature Holders
      const special_features: CharacterSpecialFeature[] = [];
      const feats: CharacterFeat[] = [];
      const ability_score_features: CharacterASIBaseFeature[] = [];
      // Warlock (usually) Specific Feature Holders
      const eldritch_invocations: CharacterEldritchInvocation[] = [];
      const fighting_styles: CharacterFightingStyle[] = [];
      let pact_boon = new CharacterPactBoon();

      // Don't care about class
      const damage_multipliers: DamageMultiplier[] = [];
      const damage_multiplier_simples: DamageMultiplierSimple[] = [];
      const languages: CharacterLanguageFeature[] = [];
      const advantages: Advantage[] = [];

      // Might care about class
      const modifiers: any[] = [];
      const spell_modifiers: any[] = [];
      const resources: CharacterResource[] = [];

      // Ability, Spell As Ability, Item Affecting Ability
      const abilities: CharacterAbility[] = char.abilities;
      const spell_as_abilities: CharacterAbility[] = char.spell_as_abilities;
      
      // Spell List, Ritual Casting, 
      // Spellcasting,
      // Spell Book, Spells/Cantrips Known/Prepared,
      // Bonus Spells
      const spellcasting: CharacterSpellcasting[] = [];
      const special_spells: CharacterSpecialSpell[] = [];
      const ritual_only: CharacterSpell[] = [];
      
      const senses: CharacterSense[] = [];
      const sense_features: SenseFeature[] = [];
      const attack_bonuses: Bonus[] = [];
      const damage_bonuses: Bonus[] = [];
      const saving_throw_bonuses: Bonus[] = [];
      const check_bonuses: Bonus[] = [];
      const rerolls: Reroll[] = [];

      if (campaign) {
        // First make sure that the options match.
        // Then enforce the options on:
        // race, subrace, lineages, classes, subclasses, 
        // items, and spells
      }

      let new_character_level = 0;
      char.classes.forEach(char_class => {
        new_character_level += char_class.level;
      });
      char.character_level = new_character_level;

      const processCharacterFeature = (f: CharacterFeature, source_type: string, source_id: string, source_name: string) => {
        if (f.feature_type === "Special Feature Choices") {
          console.log('Not sure if this is right');
          f.feature_options.forEach((fo: any) => {
            special_features.push(fo as CharacterSpecialFeature);
          });
        } else if (f.feature_type === "Special Feature") {
          special_features.push(f.feature_options[0] as CharacterSpecialFeature);
        } else if (f.feature_type === "Specific Special Feature") {
          special_features.push(f.feature_options[0] as CharacterSpecialFeature);
        } else if (f.feature_type === "Modifier") {
          modifiers.push({ source_type, source_id, source_name, modifier: f.feature.the_feature as Modifier });
        } else if (f.feature_type === "Reroll") {
          rerolls.push(f.feature.the_feature as Reroll);
        } else if (f.feature_type === "Spell Modifier") {
          spell_modifiers.push({ source_type, source_id, source_name, modifier: f.feature.the_feature as SpellModifier });
        } else if (f.feature_type === "Damage Multiplier") {
          const dm = f.feature.the_feature as DamageMultiplier;
          damage_multipliers.push(dm);
        } else if (f.feature_type === "Ability Score Improvement") {
          const asi_base_feature = f.feature_options[0] as CharacterASIBaseFeature;
          asi_base_feature.source_type = source_type;
          ability_score_features.push(asi_base_feature);
        } else if (f.feature_type === "Feat") {
          feats.push(f.feature_options[0] as CharacterFeat);
        } else if (f.feature_type === "Language") {
          f.feature_options.forEach(opt => {
            languages.push(opt as CharacterLanguageFeature);
          });
        } else if (f.feature_type === "Sense") {
          sense_features.push(f.feature.the_feature as SenseFeature);
        } else if (f.feature_type === "Skill Proficiencies") {
          const prof = f.feature.the_feature as Proficiency;
          prof.the_proficiencies.forEach(id => {
            if (prof.double) {
              skill_proficiencies[id] = 2;
            } else {
              skill_proficiencies[id] = 1;
            }
          });
        } else if (f.feature_type === "Skill Proficiency Choices") {
          f.feature_options.forEach((fo: any) => {
            skill_proficiencies[fo.skill_id] = 1;
          });
        } else if (f.feature_type === "Tool Proficiency") {
          f.feature_options.forEach((fo: any) => {
            tool_proficiencies[fo.tool_id] = 1;
          });
        } else if (f.feature_type === "Tool Proficiencies") {
          const prof = f.feature.the_feature as Proficiency;
          prof.the_proficiencies.forEach(id => {
            tool_proficiencies[id] = 1;
          });
        } else if (f.feature_type === "Tool Proficiency Choices") {
          f.feature_options.forEach((fo: any) => {
            tool_proficiencies[fo.tool_id] = 1;
          });
        } else if (f.feature_type === "Expertise") {
          f.feature_options.forEach((fo: any) => {
            skill_proficiencies[fo.skill_id] = 2;
          });
        } else if (f.feature_type === "Jack of All Trades") {
          char.jack_of_all_trades = true;
        } else if (f.feature_type === "Armor Proficiencies") {
          const prof = f.feature.the_feature as Proficiency;
          armor_type_proficiencies = [...armor_type_proficiencies, ...prof.the_proficiencies];
        } else if (f.feature_type === "Weapon Proficiencies") {
          const prof = f.feature.the_feature as Proficiency;
          weapon_keyword_proficiencies = [...weapon_keyword_proficiencies, ...prof.the_proficiencies];
        } else if (f.feature_type === "Special Weapon Proficiencies") {
          const prof = f.feature.the_feature as Proficiency;
          special_weapon_proficiencies = [...special_weapon_proficiencies, ...prof.the_proficiencies];
        } else if (f.feature_type === "Saving Throw Proficiencies") {
          const prof = f.feature.the_feature as Proficiency;
          saving_throw_proficiencies = [...saving_throw_proficiencies, ...prof.the_proficiencies];
        } else if (f.feature_type === "Advantage") {
          advantages.push(f.feature.the_feature as Advantage);
        } else if (f.feature_type === "Resource") {
          if (f.feature.the_feature instanceof ResourceFeature) {
            const resource_finder = resources.filter(o => o.type_id && o.class_id === source_id);
            if (resource_finder.length === 1) {
              const char_resource = resource_finder[0];
              char_resource.copyResource(f.feature.the_feature, char, source_id);
            } else {
              const char_resource = new CharacterResource();
              char_resource.copyResource(f.feature.the_feature, char, source_id);
              resources.push(char_resource);
            }
          }
        } else if (f.feature_type === "Ability" ||
          f.feature_type === "Item Affecting Ability") {
          let char_ability = new CharacterAbility();
          char_ability.copyFeature(f, char, (source_type === "Class" ? source_id : ""));
          const ability_finder = abilities.filter(o => o.name === char_ability.name && o.source_type === source_type && o.source_id === source_id);
          if (ability_finder.length === 0) {
            char_ability.source_type = source_type;
            char_ability.source_id = source_id;
            char_ability.source_name = source_name;
            abilities.push(char_ability);
          } else {
            char_ability = ability_finder[0];
            char_ability.connectFeature(f, char, (source_type === "Class" ? source_id : ""));
          }
        } else if (f.feature_type === "Spell as Ability") {
          if (f.feature.the_feature instanceof SpellAsAbility) {
            const the_feature = f.feature.the_feature;
            if (!the_feature.spell) {
              const spell_finder = all_spells.filter(o => o._id === the_feature.spell_id);
              if (spell_finder.length === 1) {
                the_feature.connectSpell(spell_finder[0]);
              }
            }
            let char_ability = new CharacterAbility();
            char_ability.the_ability = f.feature.the_feature;
            const true_id = f.true_id;
            const ability_finder = spell_as_abilities.filter(o => o.true_id === true_id);
            if (ability_finder.length === 0) {
              char_ability.source_type = source_type;
              char_ability.source_id = source_id;
              char_ability.source_name = source_name;
              char_ability.spellcasting_ability = the_feature.spellcasting_ability;
              char_ability.connectFeature(f, char, (source_type === "Class" ? source_id : ""));
              spell_as_abilities.push(char_ability);
            } else {
              char_ability = ability_finder[0];
              char_ability.the_ability = f.feature.the_feature;
              char_ability.connectFeature(f, char, (source_type === "Class" ? source_id : ""));
            }
          }
        } else if (f.feature_type === "Spell Book" ||
          f.feature_type === "Bonus Spells" ||
          f.feature_type === "Spell List" ||
          f.feature_type === "Ritual Casting" ||
          f.feature_type === "Spellcasting" ||
          f.feature_type === "Cantrips" ||
          f.feature_type === "Spells" ||
          f.feature_type === "Mystic Arcanum" ||
          f.feature_type === "Spell Mastery") {
          const char_spellcasting = new CharacterSpellcasting();
          char_spellcasting.source_id = source_id;
          char_spellcasting.source_type = source_type;
          char_spellcasting.copyFeature(f);
          spellcasting.push(char_spellcasting);
        } else if (f.feature_type === "Special Spell") {
          f.feature_options.forEach((id: string) => {
            const obj_finder = all_spells.filter(o => o._id === id);
            if (obj_finder.length === 1) {
              const ssf = f.feature.the_feature as SpecialSpellFeature;
              const ss_finder = char.special_spells.filter(o => o.special_spell_feature_id === ssf.true_id);
              let char_spell = new CharacterSpecialSpell();
              if (ss_finder.length === 1) {
                char_spell = ss_finder[0];
              } else {
                char_spell = new CharacterSpecialSpell();
                char.special_spells.push(char_spell);
              }
              char_spell.connectFeature(ssf, char, source_id);
              char_spell.connectSpell(obj_finder[0]);
              char_spell.description = f.feature.description;
              special_spells.push(char_spell);
            }
          });
        } else if (f.feature_type === "Cantrips from List") {
          f.feature_options.forEach((id: string) => {
            const obj_finder = all_spells.filter(o => o._id === id);
            if (obj_finder.length === 1) {
              const cfl = f.feature.the_feature as IStringHash;
              let char_spell = new CharacterAbility();
              char_spell.the_ability = new SpellAsAbility();
              char_spell.the_ability.spell = obj_finder[0];
              const true_id = f.feature.true_id;
              const ability_finder = spell_as_abilities.filter(o => o.true_id === true_id);
              if (ability_finder.length === 0) {
                char_spell.spellcasting_ability = cfl.spellcasting_ability;
                char_spell.source_type = source_type;
                char_spell.source_id = source_id;
                char_spell.source_name = source_name;
                spell_as_abilities.push(char_spell);
              } else {
                char_spell = ability_finder[0];
                char_spell.the_ability = new SpellAsAbility();
                char_spell.the_ability.spell = obj_finder[0];
                char_spell.connectFeature(f, char, (source_type === "Class" ? source_id : ""));
              }
            }
          });
        } else if (f.feature_type === "Spells from List") {
          f.feature_options.forEach((id: string) => {
            const obj_finder = all_spells.filter(o => o._id === id);
            const sfl = f.feature.the_feature as IStringHash;
            const char_class_finder = char.classes.filter(o => o.game_class_id === sfl.count_as_class_id);
            if (obj_finder.length === 1 && char_class_finder.length === 1) {
              char.spells = char.spells.filter(o => o.spell_id !== id || o.source_id !== sfl.count_as_class_id);
              
              const char_spell = new CharacterSpell();
              char_spell.copySpell(obj_finder[0]);
              char_spell.always_known = true;
              char_spell.connectSource(char_class_finder[0]);
              char.spells.push(char_spell);
            }
          });
        } else if (f.feature_type === "Eldritch Invocation") {
          const cei = f.feature_options[0] as CharacterEldritchInvocation;
          if (!cei.eldritch_invocation) {
            const ei_finder = all_eldritch_invocations.filter(o => o._id === cei.eldritch_invocation_id);
            if (ei_finder.length === 1) {
              cei.connectEldritchInvocation(ei_finder[0]);
            }
          }
          eldritch_invocations.push(cei);
        } else if (f.feature_type === "Fighting Style") {
          const cei = f.feature_options[0] as CharacterFightingStyle;
          cei.source_id = source_id;
          cei.source_type = source_type;
          cei.source_name = source_name;
          if (!cei.fighting_style) {
            const ei_finder = all_fighting_styles.filter(o => o._id === cei.fighting_style_id);
            if (ei_finder.length === 1) {
              cei.connectFightingStyle(ei_finder[0]);
            }
          }
          fighting_styles.push(cei);
        } else if (f.feature_type === "Pact Boon") {
          pact_boon = f.feature_options[0] as CharacterPactBoon;
        } else if (f.feature_type === "Extra Attacks") {
          char.extra_attacks = Math.max(char.extra_attacks, f.feature.the_feature as number);
        } else if (f.feature_type === "Unarmed Strike Size") {
          char.unarmed_strike_size = Math.max(char.unarmed_strike_size, f.feature.the_feature as number);
        } else if (f.feature_type === "Unarmed Strike Count") {
          char.unarmed_strike_count = Math.max(char.unarmed_strike_count, f.feature.the_feature as number);
        } else if (f.feature_type === "Unarmed Strike Bonus Action") {
          char.unarmed_strike_bonus_action = true;
        } else if (f.feature_type === "Unarmed Strike Damage Type") {
          char.unarmed_strike_damage_types.push(f.feature.the_feature as string);
        } else if (f.feature_type === "Unarmed Strike Score") {
          char.unarmed_strike_scores.push(f.feature.the_feature as string);
        }
      }

      const processCharacterFeatureBase = (me: Character, fb: CharacterFeatureBase, source_type: string, source_id: string, source_name: string) => {
        let good = true;
        if (fb.feature_base) {
          if (fb.feature_base.required_condition_ids.length > 0 && fb.feature_base.required_condition_ids.filter(o => o.toUpperCase() !== "ALL").length > 0) {
            good = false;
            for (let i = 0; i < fb.feature_base.required_condition_ids.length; ++i) {
              if (me.conditions.includes(fb.feature_base.required_condition_ids[i])) {
                good = true;
                break;
              }
            }
          }
          if (good && fb.feature_base.level > 1) {
            if (source_type === "Class") {
              // Check the class level
              good = false;
              const class_finder = me.classes.filter(o => o.game_class_id === source_id);
              if (class_finder.length === 1) {
                good = class_finder[0].level >= fb.feature_base.level;
              }
            } else {
              // Check the char level
              good = me.character_level >= fb.feature_base.level;
            }
          }
        }
        if (good) {
          fb.features.forEach(f => {
            processCharacterFeature(f, source_type, source_id, source_name); 
          });
        }
      }

      const processAll = (me: Character) => {
        me.race.features.forEach(fb => { processCharacterFeatureBase(me, fb, "Race", me.race.race_id, me.race.race ? me.race.race.name : ""); });
        if (me.race.subrace) {
          me.race.subrace.features.forEach(fb => { processCharacterFeatureBase(me, fb, "Subrace", me.race.subrace ? me.race.subrace.subrace_id : "", me.race.subrace ? me.race.subrace.name : ""); });
        }
        me.lineages.forEach(l => {
          l.features.forEach(fb => { processCharacterFeatureBase(me, fb, "Lineage", l.lineage_id, l.name); });
        });
        me.background.features.forEach(fb => { processCharacterFeatureBase(me, fb, "Background", me.background.background_id, me.background.background ? me.background.background.name : ""); });
        me.classes.forEach(char_class => {
          char_class.class_features.forEach(fb => { processCharacterFeatureBase(me, fb, "Class", char_class.game_class_id, char_class.name); });
          char_class.subclass_features.forEach(fb => { processCharacterFeatureBase(me, fb, "Class", char_class.subclass_id, char_class.subclass ? char_class.subclass.name : ""); });
        });
        me.items.filter(item => item.equipped && item.magic_item && (!item.magic_item.attunement || item.attuned)).forEach(item => {
          item.features.forEach(fb => { processCharacterFeatureBase(me, fb, "Item", item.magic_item_id, item.magic_item ? item.magic_item.name : ""); });
        });
        ability_score_features.forEach(char_asi_base_feature => {
          if (char_asi_base_feature.feat_option && char_asi_base_feature.use_feat === true) {
            const feat = char_asi_base_feature.feat;
            if (feat.feat_id !== "") {
              feats.push(feat);
            }
          }
        });
        me.extra_feats.forEach(feat => {
          feats.push(feat);
        });
        feats.forEach(feat => {
          feat.features.forEach(fb => { processCharacterFeatureBase(me, fb, "Feat", feat.feat_id, feat.feat ? feat.feat.name : ""); });
        });
        pact_boon.features.forEach(f => { processCharacterFeature(f, "Pact Boon", pact_boon.pact_boon_id, pact_boon.pact_boon ? pact_boon.pact_boon.name : ""); });
        eldritch_invocations.forEach(ei => {
          // I should do the same here that I did with fighting_styles for source
          ei.features.forEach(f => { processCharacterFeature(f, "Eldritch Invocation", ei.eldritch_invocation_id, ei.eldritch_invocation ? ei.eldritch_invocation.name : ""); });
        });
        fighting_styles.forEach(ei => {
          ei.features.forEach(f => { processCharacterFeature(f, ei.source_type, ei.source_id, ei.source_name); });
        });
        // Something isn't right here?  The special features aren't being processed the first time.
        let processed_special_features = 0;
        while (processed_special_features < special_features.length) {
          // Special Features have to be processed differently because they have the ability to add other Special Features which also need to be processed
          const sf = special_features[processed_special_features];
          if (sf.special_feature) {
            const the_sf = sf.special_feature;
            sf.features.forEach(fb => { 
              processCharacterFeatureBase(me, fb, "Special Feature", sf.special_feature_id, the_sf.name); 
            });
          }
          processed_special_features++;
        }
        // We don't need to make a CharacterCondition class
        // because the features on them are always simple, no choices
        me.conditions.forEach(cond_id => {
          const cond_finder = all_conditions.filter(o => o._id === cond_id);
          if (cond_finder.length === 1) {
            const cond = cond_finder[0];
            cond.features.forEach(f => { 
              const cf = new CharacterFeature();
              cf.copyFeature(f);
              processCharacterFeature(cf, "Condition", cond._id, cond.name); 
            });
          }
        });
      }
      processAll(char);

      const current = new AbilityScores(char.base_ability_scores);

      const increaseAbilityScores = (char_asi_base_feature: CharacterASIBaseFeature) => {
        for (let i = 0; i < char_asi_base_feature.asi_features.length; i++) {
          const asi = char_asi_base_feature.asi_features[i];
          const amount = asi.amount;
          let ability = asi.selected_option;
          switch (ability) {
            case "STR":
              current.strength += amount;
              break;
            case "DEX":
              current.dexterity += amount;
              break;
            case "CON":
              current.constitution += amount;
              break;
            case "INT":
              current.intelligence += amount;
              break;
            case "WIS":
              current.wisdom += amount;
              break;
            case "CHA":
              current.charisma += amount;
              break;
          }
        }
      }
      ability_score_features.forEach(char_asi_base_feature => {
        if (!char_asi_base_feature.feat_option || char_asi_base_feature.use_feat === false) {
          increaseAbilityScores(char_asi_base_feature);
        }
      });
      char.ability_score_features = ability_score_features;
      char.saving_throws = {
        STR: current.STR,
        DEX: current.DEX,
        CON: current.CON,
        INT: current.INT,
        WIS: current.WIS,
        CHA: current.CHA
      };
      if (char.override_ability_scores.strength >= 0) {
        current.strength = char.override_ability_scores.strength;
      } else {
        current.strength += char.bonus_ability_score_modifiers.strength;
      }
      if (char.override_ability_scores.dexterity >= 0) {
        current.dexterity = char.override_ability_scores.dexterity;
      } else {
        current.dexterity += char.bonus_ability_score_modifiers.dexterity;
      }
      if (char.override_ability_scores.constitution >= 0) {
        current.constitution = char.override_ability_scores.constitution;
      } else {
        current.constitution += char.bonus_ability_score_modifiers.constitution;
      }
      if (char.override_ability_scores.intelligence >= 0) {
        current.intelligence = char.override_ability_scores.intelligence;
      } else {
        current.intelligence += char.bonus_ability_score_modifiers.intelligence;
      }
      if (char.override_ability_scores.wisdom >= 0) {
        current.wisdom = char.override_ability_scores.wisdom;
      } else {
        current.wisdom += char.bonus_ability_score_modifiers.wisdom;
      }
      if (char.override_ability_scores.charisma >= 0) {
        current.charisma = char.override_ability_scores.charisma;
      } else {
        current.charisma += char.bonus_ability_score_modifiers.charisma;
      }
      char.max_ability_scores = new AbilityScores(20);
      let max_hit_points = 0;
      const hit_dice: HitDice[] = [];
      let start_hit_dice: HitDice = new HitDice({ size: 6, count: 1 });
      char.classes.forEach(char_class => {
        if (char_class.game_class && char_class.game_class.hit_die) {
          if (char_class.position === 0) {
            start_hit_dice = new HitDice({ size: char_class.game_class.hit_die, count: char_class.level });
          }
          const hit_dice_finder = hit_dice.filter(o => char_class.game_class && char_class.game_class.hit_die && o.size === char_class.game_class.hit_die);
          if (hit_dice_finder.length === 0) {
            hit_dice.push(new HitDice({ size: char_class.game_class.hit_die, count: char_class.level }));
          } else {
            hit_dice_finder[0].count += char_class.level;
          }
        }
      });
      hit_dice.forEach(hd => {
        max_hit_points += (((hd.size / 2) + 1) + current.CON) * hd.count;
      });
      if (start_hit_dice) {
        max_hit_points += (start_hit_dice.size / 2) - 1;
      }
      char.max_hit_points = max_hit_points;
      char.current_hit_points = Math.min(char.current_hit_points, max_hit_points);

      char.speed.walk = char.race.race ? char.race.race.speed : 0;
      char.speed.swim = 0;
      char.speed.climb = 0;
      char.speed.fly = 0;
      char.speed.burrow = 0;
      char.initiative_modifier = current.DEX;
      let base_armor_class = 10 + current.DEX;
      let shield = 0;
      const shield_finder = all_armor_types.filter(o => o.name === "Shield");
      let shield_type: ArmorType | null = null;
      if (shield_finder.length === 1) {
        shield_type = shield_finder[0];
      }
      char.items.filter(item =>
        item.equipped &&
        item.base_item &&
        item.base_item.item_type === "Armor" &&
        (!shield_type || item.base_item.armor_type_id !== shield_type._id)).forEach(item => {
          char.armor_worn = true;
          const armor_type_finder = all_armor_types.filter(o => item.base_item && o._id === item.base_item.armor_type_id);
          if (item.base_item && armor_type_finder.length === 1) {
            const armor_type = armor_type_finder[0];
            let dex_bonus = current.DEX;
            if (armor_type.dex_bonus_max) {
              dex_bonus = Math.min(current.DEX, +armor_type.dex_bonus_max)
            }
            base_armor_class = Math.max(base_armor_class, item.base_item.base_armor_class + dex_bonus);
          }
        });
      if (shield_type) {
        char.items.filter(item =>
          item.equipped &&
          item.base_item &&
          item.base_item.item_type === "Armor" &&
          shield_type && item.base_item.armor_type_id === shield_type._id).forEach(item => {
            if (item.base_item) {
              shield = Math.max(shield, item.base_item.base_armor_class);
              char.shield_carried = true;
            }
          });
      }
      const checkArmorRequirements = (me: Character, mod: Modifier) => {
        // Check if it matches the armor_requirement field
        if (mod.allowed_armor_types.includes("ALL")) {
          // Check for required
          if (mod.required_armor_types.includes("None")) {
            return true;
          } else if (mod.required_armor_types.includes("Any")) {
            return me.equipped_items.filter(o => 
              o.base_item &&
              o.base_item.item_type === "Armor" &&
              o.base_item.name !== "Shield"
            ).length > 0;
          } else {
            const missing_armor_types = mod.required_armor_types.filter(a =>
              me.equipped_items.filter(o =>
                o.base_item &&
                o.base_item.item_type === "Armor" &&
                o.base_item.armor_type_id === a).length === 0);
            return missing_armor_types.length === 0;
          }
        } else if (mod.allowed_armor_types.includes("None")) {
          return me.equipped_items.filter(o => 
            o.base_item &&
            o.base_item.item_type === "Armor" &&
            o.base_item.name !== "Shield"
          ).length === 0;
        } else {
          const bad_armor_items = me.equipped_items.filter(o =>
            o.base_item &&
            o.base_item.item_type === "Armor" &&
            !mod.allowed_armor_types.includes(o.base_item.armor_type_id));

          return bad_armor_items.length === 0;
        }
      }
      const getModifierAmount = (me: Character, mod_obj: any) => {
        const mod = mod_obj.modifier as Modifier;
        if (mod.type === "Flat") {
          return mod.amount;
        } else if (mod.type === "Character Level") {
          const amount = +mod.amount;
          return `${amount * me.character_level}`;
        } else if (mod.type === "Class Level") {
          const class_finder = me.classes.filter(o => o.game_class_id === mod_obj.class_id);
          if (class_finder.length === 1) {
            const amount = +mod.amount;
            return `${amount * class_finder[0].level}`;
          } else {
            return "0";
          }
        } else if (mod.type === "Attack Ability Modifier") {
          return "Attack Ability Modifier";
        } else if (mod.type !== "None") {
          // It's based on an ability score modifier
          const amount = current.getModifier(mod.type);
          if (amount) {
            return `${amount}`;
          } else {
            return "0";
          }
        }
      }
      modifiers.forEach(mod_obj => {
        const mod = mod_obj.modifier as Modifier;
        if (mod.modifies === "Max HP") {
          const amount = getModifierAmount(char, mod_obj);
          if (amount) {
            max_hit_points += +amount;
          }
        } else if (mod.modifies === "AC") {
          if (checkArmorRequirements(char, mod)) {
            const amount = getModifierAmount(char, mod_obj);
            if (amount) {
              base_armor_class += +amount;
            }
          }
        } else if (mod.modifies === "Speed") {
          if (checkArmorRequirements(char, mod)) {
            let amount = getModifierAmount(char, mod_obj);
            if (amount) {
              if (amount === "-1") {
                amount = `${char.speed.walk}`;
              }
              for (let i = 0; i < mod.modifies_details.length; i++) {
                switch (mod.modifies_details[i]) {
                  case "Walking":
                    char.speed.walk += +amount;
                    break;
                  case "Swimming":
                    char.speed.swim += +amount;
                    break;
                  case "Flying":
                    char.speed.fly += +amount;
                    break;
                  case "Climbing":
                    char.speed.climb += +amount;
                    break;
                  case "Burrowing":
                    char.speed.burrow += +amount;
                    break;
                }
              }
            }
          }
        } else if (mod.modifies === "Saving Throw") {
          if (checkArmorRequirements(char, mod)) {
            const amount = getModifierAmount(char, mod_obj);
            if (amount) {
              if (amount.includes("d")) {
                const bonus = new Bonus();
                bonus.source = mod_obj.source_name;
                bonus.types = mod.modifies_details;
                const pieces = amount.split("d");
                bonus.rolls.count = +pieces[0];
                bonus.rolls.size = +pieces[1];
                saving_throw_bonuses.push(bonus);
              } else {
                for (let i = 0; i < mod.modifies_details.length; i++) {
                  char.saving_throws[mod.modifies_details[i]] += +amount;
                }
              }
            }
          }
        } else if (mod.modifies === "Ability Check") {
          if (checkArmorRequirements(char, mod)) {
            const amount = getModifierAmount(char, mod_obj);
            if (amount) {
              const bonus = new Bonus();
              bonus.source = mod_obj.source_name;
              bonus.types = mod.modifies_details;
              if (amount.includes("d")) {
                const pieces = amount.split("d");
                bonus.rolls.count = +pieces[0];
                bonus.rolls.size = +pieces[1];
              } else {
                bonus.rolls.flat = +amount;
              }
              check_bonuses.push(bonus);
            }
          }
        } else if (mod.modifies === "Ability Score Max") {
          const amount = getModifierAmount(char, mod_obj);
          if (amount) {
            for (let i = 0; i < mod.modifies_details.length; i++) {
              switch (mod.modifies_details[i]) {
                case "STR":
                  char.max_ability_scores.strength += +amount;
                  break;
                case "DEX":
                  char.max_ability_scores.dexterity += +amount;
                  break;
                case "CON":
                  char.max_ability_scores.constitution += +amount;
                  break;
                case "INT":
                  char.max_ability_scores.intelligence += +amount;
                  break;
                case "WIS":
                  char.max_ability_scores.wisdom += +amount;
                  break;
                case "CHA":
                  char.max_ability_scores.charisma += +amount;
                  break;
              }
            }
          }
        } else if (mod.modifies === "Resource Dice Size") {
          const size = getModifierAmount(char, mod_obj);
          if (size) {
            const resource_type = mod.modifies_details[0];
            const char_resource_finder = resources.filter(o => o.type_id === resource_type);
            if (char_resource_finder.length === 1) {
              const char_resource = char_resource_finder[0];
              char_resource.size = Math.max(char_resource.size, +size);
            }
          }
        } else if (mod.modifies === "Initiative") {
          if (checkArmorRequirements(char, mod)) {
            const amount = getModifierAmount(char, mod_obj);
            if (amount) {
              char.initiative_modifier += +amount;
            }
          }
        } else if (mod.modifies === "Attack") {
          if (checkArmorRequirements(char, mod)) {
            const amount = getModifierAmount(char, mod_obj);
            if (amount) {
              const bonus = new Bonus();
              bonus.source = mod_obj.source_name;
              bonus.types = mod.modifies_details;
              if (amount.includes("d")) {
                const pieces = amount.split("d");
                bonus.rolls.count = +pieces[0];
                bonus.rolls.size = +pieces[1];
              } else {
                bonus.rolls.flat = +amount;
              }
              attack_bonuses.push(bonus);
            }
          }
        } else if (mod.modifies === "Damage") {
          if (checkArmorRequirements(char, mod)) {
            const amount = getModifierAmount(char, mod_obj);
            if (amount) {
              const bonus = new Bonus();
              bonus.source = mod_obj.source_name;
              bonus.types = mod.modifies_details;
              if (mod.modifies_detail_2 === "ALL") {
                bonus.subtypes.push(mod.modifies_detail_2);
              }
              bonus.excluded = mod.excluded_weapon_keywords;
              bonus.required = mod.required_weapon_keywords;
              if (amount === "Attack Ability Modifier") {
                bonus.rolls.ability_score = "Attack Ability";
              } else if (amount.includes("d")) {
                const pieces = amount.split("d");
                bonus.rolls.count = +pieces[0];
                bonus.rolls.size = +pieces[1];
              } else {
                bonus.rolls.flat = +amount;
              }
              damage_bonuses.push(bonus);
            }
          }
        }
      });
      char.classes.forEach(char_class => {
        // Go through class specific features 
        // that need to be attached as needed
        let extra_spells = 0;
        char_class.cantrips_max = 0;
        char_class.spell_dc = 0;
        char_class.spell_attack = 0;
        spellcasting.filter(sc => sc.source_type !== "Class" || sc.source_id === char_class.game_class_id).forEach(sc => {
          if (sc.feature_type === "Spellcasting") {
            const feature = sc.the_feature as SpellcastingFeature;
            char_class.spellcasting_ability = feature.ability;
            const spellcasting_ability_modifier = current.getModifier(feature.ability);
            if (spellcasting_ability_modifier !== null) {
              // They can only have one Spellcasting feature per class
              char_class.spell_dc = 8 + char.proficiency_modifier + spellcasting_ability_modifier;
              char_class.spell_attack = char.proficiency_modifier + spellcasting_ability_modifier;
            }
            if (feature.cantrips_max) {
              char_class.cantrips_max += +feature.cantrips_max;
            }
            char_class.extra_prepared_from_ability = feature.extra_prepared_from_ability;
            char_class.knowledge_type = feature.knowledge_type;
            char_class.base_spell_count = feature.base_spell_count;
            char_class.spell_count_per_level = feature.spell_count_per_level;
            char_class.spell_list_id = feature.spell_list_id;
            char_class.spell_table = feature.table;
            char_class.spellcasting_level = feature.level; // Spellcasting Level goes together with table.  If you have different tables then the levels from those classes don't add to each other
            if (feature.focus !== "") {
              char_class.spellcasting_focus = feature.focus;
            }
            if (feature.ritual_casting) {
              char_class.ritual_casting = feature.ritual_casting;
            }
            if (feature.spell_book) {
              if (!char_class.spell_book) {
                char_class.spell_book = new CharacterSpellBook();
              }
              char_class.spell_book.spell_book = feature.spell_book;
            }
          } else if (sc.feature_type === "Spell Book") {
            const feature = sc.the_feature as SpellBook;
            if (char_class.spell_book) {
              char_class.spell_book.spell_book = feature;
            } else {
              char_class.spell_book = new CharacterSpellBook();
              char_class.spell_book.spell_book = feature;
            }
          } else if (sc.feature_type === "Bonus Spells") {
            const feature = sc.the_feature as BonusSpells;
            if (feature.always_known) {
              Object.keys(feature.spell_ids).forEach((id: string) => {
                // If they don't already have the spell (on char class), and they're able to cast it, add it.
                const level = feature.spell_ids[id];
                if (level <= char_class.level) {
                  const char_spell_finder = char.spells.filter(o => o.spell_id === id && o.source_type === "Class" && o.source_id === char_class.game_class_id);
                  if (char_spell_finder.length === 0) {
                    const obj_finder = all_spells.filter(o => o._id === id);
                    if (obj_finder.length === 1) {
                      const char_spell = new CharacterSpell();
                      char_spell.copySpell(obj_finder[0]);
                      char_spell.always_known = true;
                      char_spell.connectSource(char_class);
                      char.spells.push(char_spell);
                    }
                  } else {
                    // If they do have it, make sure it's marked as always known.
                    const obj_finder = all_spells.filter(o => o._id === id);
                    if (obj_finder.length === 1) {
                      const char_spell = char_spell_finder[0];
                      char_spell.connectSpell(obj_finder[0]);
                      char_spell.always_known = true;
                      char_spell.connectSource(char_class);
                    }
                  }
                }
              });
            }
            char_class.bonus_spells.push(feature);
          } else if (sc.feature_type === "Ritual Casting") {
            char_class.ritual_casting = true;
          } else if (sc.feature_type === "Cantrips") {
            const feature = sc.the_feature as number;
            char_class.cantrips_max += +feature;
          } else if (sc.feature_type === "Spells") {
            // These are additional spells known/prepared
            // on top of the calculated number.
            // In standard 5e, this is the only way 
            // Warlocks, Bards, Rangers, and 
            // Sorcerers have any spells, as well as the
            // Spellcasting subclasses for Rogue and Fighter.
            const feature = sc.the_feature as number;
            extra_spells += +feature;
          } else if (sc.feature_type === "Mystic Arcanum") {
            // const feature = sc.the_feature as number;
            // char_class.mystic_arcanum_levels.push(feature);
          } else if (sc.feature_type === "Spell Mastery") {
            // const feature = sc.the_feature as number;
            // char_class.spell_mastery_levels.push(feature);
          }
        });
        if (char_class.base_spell_count === 0) {
          char_class.spells_prepared_max = char_class.spell_count_per_level * char_class.level;
        } else {
          char_class.spells_prepared_max = char_class.base_spell_count + char_class.spell_count_per_level * (char_class.level - 1);
        }
        const extra_from_ability = current.getModifier(char_class.extra_prepared_from_ability);
        if (extra_from_ability) {
          char_class.spells_prepared_max += extra_from_ability;
        }
        // This is where the extra spells get added.
        char_class.spells_prepared_max += extra_spells;
        char_class.spell_level_max = 0;
        const caster_level = (char_class.level * char_class.spellcasting_level);
        if (caster_level > 0) {
          const type_finder = all_spell_slot_types.filter(o =>
            o._id === char_class.spell_table);
          if (type_finder.length === 1) {
            const type = type_finder[0];
            type.entries.filter(o => o.level <= caster_level).forEach(entry => {
              Object.keys(entry.slots_per_level).forEach(key => {
                char_class.spell_level_max = Math.max(+key, char_class.spell_level_max);
              });
            });
          }
        }
        char_class.spell_ids = [];
        char_class.cantrip_ids = [];
        char.spells.filter(o => !o.always_known && o.source_type === "Class" && o.source_id === char_class.game_class_id).forEach(char_spell => {
          char_spell.connectSource(char_class);
          if (!char_spell.the_spell) {
            const obj_finder = all_spells.filter(o => o._id === char_spell.spell_id);
            if (obj_finder.length === 1) {
              char_spell.connectSpell(obj_finder[0]);
            }
          }
          if (char_spell.level.value === 0) {
            char_class.cantrip_ids.push(char_spell.spell_id);
          } else {
            char_class.spell_ids.push(char_spell.spell_id);
          }
        });
        if (char_class.spell_book && char_class.spell_book.spell_book) {
          const spell_book = char_class.spell_book;
          const the_spell_book = char_class.spell_book.spell_book;

          let free_spells = +the_spell_book.spells_at_level_1 + (+the_spell_book.spells_add_per_level * (char_class.level - 1));
          char_class.spell_book.spells.forEach(char_spell => {
            if (!char_spell.extra) {
              free_spells--;
            }
            char_spell.connectSource(char_class);
            if ((char_class.ritual_casting || the_spell_book.limitations.includes("Rituals Only")) &&
              char.spells.filter(o => o.spell_id === char_spell.spell_id && o.source_id === char_class.game_class_id).length === 0) {
              if (char_spell.spell === null) {
                const obj_finder = all_spells.filter(o => o._id === char_spell.spell_id);
                if (obj_finder.length === 1) {
                  char_spell.connectSpell(obj_finder[0]);
                }
              }
              if (char_spell.spell && char_spell.spell.ritual) {
                char_spell.ritual_only = true;
                char_spell.ritual = true;
                ritual_only.push(char_spell);
              }
            }
          });
          spell_book.unused_free_spells = free_spells;
        }
      });

      char.ritual_only = ritual_only;
      const type_levels: any = {
      };
      char.classes.filter(o => o.spell_table !== "").forEach(game_class => {
        if (!type_levels[game_class.spell_table]) {
          type_levels[game_class.spell_table] = {
            level: 0
          };
          const type_finder = all_spell_slot_types.filter(o => o._id === game_class.spell_table);
          if (type_finder.length === 1) {
            type_levels[game_class.spell_table].table = type_finder[0];
          }
        }
        type_levels[game_class.spell_table].level += game_class.spellcasting_level * game_class.level;
      });
      const slots: CharacterSlot[] = [];
      Object.keys(type_levels).forEach((type_id: string) => {
        const type_obj = type_levels[type_id];
        const table: SpellSlotType = type_obj.table;
        let entry_finder = table.entries.filter(o => o.level <= type_obj.level);
        if (entry_finder.length > 0) {
          entry_finder = entry_finder.filter(o => o.level === Math.max(...entry_finder.map(o2 => o2.level)));
          const entry = entry_finder[0];
          Object.keys(entry.slots_per_level).forEach((sl: any) => {
            const slot_level = +sl;
            const slot = new CharacterSlot();
            slot.level = new SlotLevel(slot_level);
            slot.total = entry.slots_per_level[slot_level];
            slot.type_id = table._id;
            slot.slot_name = table.slot_name;
            slots.push(slot);
          });
        }
      });

      sense_features.forEach(sf => {
        const sense_finder = senses.filter(o => o.sense_id === sf.sense_id);
        if (sense_finder.length === 0) {
          const sense = new CharacterSense();
          sense.sense_id = sf.sense_id;
          sense.range = sf.range;
          sense.features.push(sf);
          senses.push(sense);
        } else {
          const sense = sense_finder[0];
          sense.range = Math.max(sf.range, sense.range);
          sense.features.push(sf);
        }
      });
      senses.filter(o => o.features.length > 1).forEach(s => {
        const or_adds = s.features.map(o => o.or_add);
        const or_add_min = Math.min(...or_adds);
        const or_add_total = or_adds.reduce((a, b) => a + b, 0);
        s.range += or_add_total - or_add_min;
      });

      char.rerolls = rerolls;
      let weight_carried = 0;
      char.items.forEach(i => {
        if (i.base_item) {
          weight_carried += (i.base_item.weight * i.count);
        }
      });
      char.weight_carried = weight_carried;
      char.current_ability_scores = current;
      char.spells.filter(o => o.spellcasting_ability === "").forEach(char_spell => {
        const class_finder = char.classes.filter(o => o.game_class_id === char_spell.source_id);
        if (class_finder.length === 1) {
          char_spell.connectSource(class_finder[0]);
        }
      });
      char.special_features = special_features;
      char.special_feature_ids = special_features.filter(o => o).map(o => o.special_feature_id);
      char.max_hit_points = max_hit_points;
      // Merge existing with calculated
      hit_dice.forEach(hd => {
        const hd_finder = char.hit_dice.filter(o => o.size === hd.size);
        if (hd_finder.length === 1) {
          hd.used = hd_finder[0].used;
        }
      });
      char.hit_dice = hit_dice;
      resources.forEach(r => {
        if (r.resource_feature) {
          r.copyResource(r.resource_feature, char, r.class_id);
        }
        const r_finder = char.resources.filter(o => o.type_id === r.type_id);
        if (r_finder.length === 1) {
          r.created = r_finder[0].created;
          r.used = r_finder[0].used;
        }
      });
      char.resources = resources;
      slots.forEach(slot => {
        const slot_finder = char.slots.filter(o => o.type_id === slot.type_id && o.level === slot.level);
        if (slot_finder.length === 1) {
          slot.created = slot_finder[0].created;
          slot.used = slot_finder[0].used;
        }
      });
      abilities.forEach(ability => {
        ability.calc_special_resource_amount(char);
        const a_finder = char.abilities.filter(o =>
          o.source_type === ability.source_type &&
          o.source_id === ability.source_id &&
          o.ability_type === ability.ability_type &&
          o.true_id === ability.true_id);
        if (a_finder.length === 1) {
          ability.customizations = a_finder[0].customizations;
        }
      });
      char.abilities = abilities.filter(o => o.the_ability);
      spell_as_abilities.forEach(ability => {
        const a_finder = char.spell_as_abilities.filter(o =>
          o.source_type === ability.source_type &&
          o.source_id === ability.source_id &&
          o.true_id === ability.true_id);
        if (a_finder.length === 1) {
          ability.customizations = a_finder[0].customizations;
        }
        const spellcasting_ability_modifier = current.getModifier(ability.spellcasting_ability);
        if (spellcasting_ability_modifier !== null) {
          ability.spell_dc = 8 + char.proficiency_modifier + spellcasting_ability_modifier;
          ability.spell_attack = char.proficiency_modifier + spellcasting_ability_modifier;
        }
        ability.calc_special_resource_amount(char);
      });
      char.spell_as_abilities = spell_as_abilities.filter(o => o.the_ability && o.spell);
      if (char.concentrating_on) {
        if (char.concentrating_on instanceof CharacterSpell) {
          const spell_id = char.concentrating_on.spell_id;
          const obj_finder = all_spells.filter(o => o._id === spell_id);
          if (obj_finder.length === 1) {
            char.concentrating_on.connectSpell(obj_finder[0]);
          }
        } 
      }
      char.slots = slots;

      char.feats = feats;
      char.feat_ids = feats.map(o => o.feat_id);
      char.armor_class = base_armor_class + shield;
      char.languages_known = languages.map(o => o.language_id);
      char.armor_proficiencies = armor_type_proficiencies;
      char.weapon_proficiencies = weapon_keyword_proficiencies;
      char.special_weapon_proficiencies = special_weapon_proficiencies;
      char.skill_proficiencies = skill_proficiencies;
      char.tool_proficiencies = tool_proficiencies;
      char.saving_throw_proficiencies = saving_throw_proficiencies;
      char.eldritch_invocation_ids = eldritch_invocations.map(o => o.eldritch_invocation_id);
      char.fighting_style_ids = fighting_styles.map(o => o.fighting_style_id);
      char.pact_boon_id = pact_boon.pact_boon_id;
      char.senses = senses;
      char.advantages = advantages;
      damage_multipliers.forEach(dm => {
        dm.damage_types.forEach(dt => {
          const dms = new DamageMultiplierSimple();
          dms.damage_type = dt;
          dms.multiplier = dm.multiplier;
          dms.from_feature = true;
          damage_multiplier_simples.push(dms);
        });
      });
      char.extra_damage_multipliers.forEach(dm => {
        damage_multiplier_simples.push(dm);
      });
      char.damage_multipliers = damage_multiplier_simples;
      char.attack_bonuses = attack_bonuses;
      char.damage_bonuses = damage_bonuses;
      char.saving_throw_bonuses = saving_throw_bonuses;
      char.check_bonuses = check_bonuses;

      const actions: CharacterAction[] = [];
      // Apply modifiers to spells
      char.spells.forEach(spell => {
        const attack = new Attack();
        if (spell.the_spell) {
          if (spell.level.value === 0) {
            if (spell.the_spell.effect.attack_type === "Save") {
              // It's a save attack
              char.attack_bonuses.filter(o => o.types.includes("Cantrip Saves")).forEach(ab => {
                const rolls = new RollPlus(ab.rolls);
                attack.attack_rolls.push(rolls);
              });
              if (spell.spell_dc !== 0) {
                const rolls = new RollPlus();
                rolls.flat = +spell.spell_dc;
                attack.attack_rolls.push(rolls);
              }
              char.damage_bonuses.filter(o => 
                o.types.includes("Cantrip Saves") &&
                o.subtypes.includes(spell.effect_string)
              ).forEach(db => {
                const dmg = new RollPlus(db.rolls);
                dmg.type = spell.effect_string;
                attack.damage_rolls.push(dmg);
              });
            } else if (["Ranged Spell","Melee Spell"].includes(spell.the_spell.effect.attack_type)) {
              // It's a spell attack
              char.attack_bonuses.filter(o => o.types.includes("Cantrip Attacks")).forEach(ab => {
                attack.attack_rolls.push(ab.rolls);
              });
              if (spell.spell_attack !== 0) {
                const rolls = new RollPlus();
                rolls.flat = +spell.spell_attack;
                attack.attack_rolls.push(rolls);
              }
              char.damage_bonuses.filter(o => 
                o.types.includes("Cantrip Attacks") &&
                o.subtypes.includes(spell.effect_string)
              ).forEach(db => {
                const dmg = new RollPlus(db.rolls);
                dmg.type = spell.effect_string;
                attack.damage_rolls.push(dmg);
              });
            }
          } else {
            if (spell.the_spell.effect.attack_type === "Save") {
              // It's a save attack
              char.attack_bonuses.filter(o => o.types.includes("Spell Saves")).forEach(ab => {
                attack.attack_rolls.push(ab.rolls);
              });
              if (spell.spell_dc !== 0) {
                const rolls = new RollPlus();
                rolls.flat = +spell.spell_dc;
                attack.attack_rolls.push(rolls);
              }
              char.damage_bonuses.filter(o => 
                o.types.includes("Spell Saves") &&
                o.subtypes.includes(spell.effect_string)
              ).forEach(db => {
                const dmg = new RollPlus(db.rolls);
                dmg.type = spell.effect_string;
                attack.damage_rolls.push(dmg);
              });
            } else if (["Ranged Spell","Melee Spell"].includes(spell.the_spell.effect.attack_type)) {
              // It's a spell attack
              char.attack_bonuses.filter(o => 
                o.types.includes("Spell Attacks")).forEach(ab => {
                const rolls = new RollPlus(ab.rolls);
                attack.attack_rolls.push(rolls);
              });
              if (spell.spell_attack !== 0) {
                const rolls = new RollPlus();
                rolls.flat = +spell.spell_attack;
                attack.attack_rolls.push(rolls);
              }
              char.damage_bonuses.filter(o => 
                o.types.includes("Spell Attacks") &&
                o.subtypes.includes(spell.effect_string)
              ).forEach(db => {
                const dmg = new RollPlus(db.rolls);
                dmg.type = spell.effect_string;
                attack.damage_rolls.push(dmg);
              });
            }
          }
          spell_modifiers.filter(o => o.modifier.spell_id === spell.spell_id).forEach((mod_obj: any) => {
            const mod = mod_obj.modifier as SpellModifier;
            if (mod.modifies === "Include Modifier") {
              spell.use_spellcasting_modifier = true;
            } else {
              console.log(mod_obj);
            }
          });
        }
        attack.type = "Spell";
        spell.attack = attack;
        spell.recalc_attack_string(char.current_ability_scores);
        // Loop through the slot levels >= spell.level and add to actions
        if (spell.level.value === 0) {
          const action = new CharacterAction();
          action.type = "Spell";
          action.action = spell;
          action.level = spell.level;
          action.casting_time = spell.the_spell ? spell.the_spell.casting_time : "A";
          actions.push(action);
        } else {
          const slot_levels = Array.from(new Set(char.slots.filter(o => o.level.value >= spell.level.value).map(o => o.level.value)));
          slot_levels.forEach(level => {
            const action = new CharacterAction();
            action.type = "Spell";
            action.action = spell;
            action.level = new SlotLevel(level);
            action.casting_time = spell.the_spell ? spell.the_spell.casting_time : "A";
            actions.push(action);
          });
        }
      });
      let count = 0;
      while (count < char.special_spells.length) {
        const spell = char.special_spells[count];
        
        if (special_spells.filter(o => o.special_spell_feature_id === spell.special_spell_feature_id).length === 0) {
          char.special_spells = char.special_spells.filter(o => o.special_spell_feature_id !== spell.special_spell_feature_id);
        } else {
          const attack = new Attack();
          if (spell.the_spell) {
            if (spell.level.value === 0) {
              if (spell.the_spell.effect.attack_type === "Save") {
                // It's a save attack
                char.attack_bonuses.filter(o => o.types.includes("Cantrip Saves")).forEach(ab => {
                  const rolls = new RollPlus(ab.rolls);
                  attack.attack_rolls.push(rolls);
                });
                if (spell.spell_dc !== 0) {
                  const rolls = new RollPlus();
                  rolls.flat = +spell.spell_dc;
                  attack.attack_rolls.push(rolls);
                }
                char.damage_bonuses.filter(o => 
                  o.types.includes("Cantrip Saves") &&
                  o.subtypes.includes(spell.effect_string)
                ).forEach(db => {
                  const dmg = new RollPlus(db.rolls);
                  dmg.type = spell.effect_string;
                  attack.damage_rolls.push(dmg);
                });
              } else if (["Ranged Spell","Melee Spell"].includes(spell.the_spell.effect.attack_type)) {
                // It's a spell attack
                char.attack_bonuses.filter(o => o.types.includes("Cantrip Attacks")).forEach(ab => {
                  attack.attack_rolls.push(ab.rolls);
                });
                if (spell.spell_attack !== 0) {
                  const rolls = new RollPlus();
                  rolls.flat = +spell.spell_attack;
                  attack.attack_rolls.push(rolls);
                }
                char.damage_bonuses.filter(o => 
                  o.types.includes("Cantrip Attacks") &&
                  o.subtypes.includes(spell.effect_string)
                ).forEach(db => {
                  const dmg = new RollPlus(db.rolls);
                  dmg.type = spell.effect_string;
                  attack.damage_rolls.push(dmg);
                });
              }
            } else {
              if (spell.the_spell.effect.attack_type === "Save") {
                // It's a save attack
                char.attack_bonuses.filter(o => o.types.includes("Spell Saves")).forEach(ab => {
                  attack.attack_rolls.push(ab.rolls);
                });
                if (spell.spell_dc !== 0) {
                  const rolls = new RollPlus();
                  rolls.flat = +spell.spell_dc;
                  attack.attack_rolls.push(rolls);
                }
                char.damage_bonuses.filter(o => 
                  o.types.includes("Spell Saves") &&
                  o.subtypes.includes(spell.effect_string)
                ).forEach(db => {
                  const dmg = new RollPlus(db.rolls);
                  dmg.type = spell.effect_string;
                  attack.damage_rolls.push(dmg);
                });
              } else if (["Ranged Spell","Melee Spell"].includes(spell.the_spell.effect.attack_type)) {
                // It's a spell attack
                char.attack_bonuses.filter(o => 
                  o.types.includes("Spell Attacks")).forEach(ab => {
                  const rolls = new RollPlus(ab.rolls);
                  attack.attack_rolls.push(rolls);
                });
                if (spell.spell_attack !== 0) {
                  const rolls = new RollPlus();
                  rolls.flat = +spell.spell_attack;
                  attack.attack_rolls.push(rolls);
                }
                char.damage_bonuses.filter(o => 
                  o.types.includes("Spell Attacks") &&
                  o.subtypes.includes(spell.effect_string)
                ).forEach(db => {
                  const dmg = new RollPlus(db.rolls);
                  dmg.type = spell.effect_string;
                  attack.damage_rolls.push(dmg);
                });
              }
            }
            spell_modifiers.filter(o => o.modifier.spell_id === spell.spell_id).forEach((mod_obj: any) => {
              const mod = mod_obj.modifier as SpellModifier;
              if (mod.modifies === "Include Modifier") {
                spell.use_spellcasting_modifier = true;
              } else {
                console.log(mod_obj);
              }
            });
          }
          attack.type = "Spell";
          spell.attack = attack;
          spell.recalc_attack_string(char.current_ability_scores);
          count++;
        }
        if (spell.level.value === 0) {
          const action = new CharacterAction();
          action.type = "Special Spell";
          action.action = spell;
          action.level = spell.level;
          action.casting_time = spell.the_spell ? spell.the_spell.casting_time : "A";
          actions.push(action);
        } else {
          const slot_levels = Array.from(new Set(char.slots.filter(o => o.level.value >= spell.level.value).map(o => o.level.value)));
          slot_levels.forEach(level => {
            const action = new CharacterAction();
            action.type = "Special Spell";
            action.action = spell;
            action.level = new SlotLevel(level);
            action.casting_time = spell.the_spell ? spell.the_spell.casting_time : "A";
            actions.push(action);
          });
        }
      }
      char.spell_as_abilities.forEach(spell => {
        const attack = new Attack();
        if (spell.spell) {
          if (spell.level.value === 0) {
            if (spell.spell.effect.attack_type === "Save") {
              // It's a save attack
              char.attack_bonuses.filter(o => o.types.includes("Cantrip Saves")).forEach(ab => {
                const rolls = new RollPlus(ab.rolls);
                attack.attack_rolls.push(rolls);
              });
              if (spell.spell_dc !== 0) {
                const rolls = new RollPlus();
                rolls.flat = +spell.spell_dc;
                attack.attack_rolls.push(rolls);
              }
              char.damage_bonuses.filter(o => 
                o.types.includes("Cantrip Saves") &&
                o.subtypes.includes(spell.effect_string)
              ).forEach(db => {
                const dmg = new RollPlus(db.rolls);
                dmg.type = spell.effect_string;
                attack.damage_rolls.push(dmg);
              });
            } else if (["Ranged Spell","Melee Spell"].includes(spell.spell.effect.attack_type)) {
              // It's a spell attack
              char.attack_bonuses.filter(o => o.types.includes("Cantrip Attacks")).forEach(ab => {
                attack.attack_rolls.push(ab.rolls);
              });
              if (spell.spell_attack !== 0) {
                const rolls = new RollPlus();
                rolls.flat = +spell.spell_attack;
                attack.attack_rolls.push(rolls);
              }
              char.damage_bonuses.filter(o => 
                o.types.includes("Cantrip Attacks") &&
                o.subtypes.includes(spell.effect_string)
              ).forEach(db => {
                const dmg = new RollPlus(db.rolls);
                dmg.type = spell.effect_string;
                attack.damage_rolls.push(dmg);
              });
            }
          } else {
            if (spell.spell.effect.attack_type === "Save") {
              // It's a save attack
              char.attack_bonuses.filter(o => o.types.includes("Spell Saves")).forEach(ab => {
                attack.attack_rolls.push(ab.rolls);
              });
              if (spell.spell_dc !== 0) {
                const rolls = new RollPlus();
                rolls.flat = +spell.spell_dc;
                attack.attack_rolls.push(rolls);
              }
              char.damage_bonuses.filter(o => 
                o.types.includes("Spell Saves") &&
                o.subtypes.includes(spell.effect_string)
              ).forEach(db => {
                const dmg = new RollPlus(db.rolls);
                dmg.type = spell.effect_string;
                attack.damage_rolls.push(dmg);
              });
            } else if (["Ranged Spell","Melee Spell"].includes(spell.spell.effect.attack_type)) {
              // It's a spell attack
              char.attack_bonuses.filter(o => 
                o.types.includes("Spell Attacks")).forEach(ab => {
                const rolls = new RollPlus(ab.rolls);
                attack.attack_rolls.push(rolls);
              });
              if (spell.spell_attack !== 0) {
                const rolls = new RollPlus();
                rolls.flat = +spell.spell_attack;
                attack.attack_rolls.push(rolls);
              }
              char.damage_bonuses.filter(o => 
                o.types.includes("Spell Attacks") &&
                o.subtypes.includes(spell.effect_string)
              ).forEach(db => {
                const dmg = new RollPlus(db.rolls);
                dmg.type = spell.effect_string;
                attack.damage_rolls.push(dmg);
              });
            }
          }
          spell_modifiers.filter(o => spell.spell && o.modifier.spell_id === spell.spell._id).forEach((mod_obj: any) => {
            const mod = mod_obj.modifier as SpellModifier;
            if (mod.modifies === "Include Modifier") {
              spell.use_spellcasting_modifier = true;
            } else {
              console.log(mod_obj);
            }
          });
        }
        attack.type = "Spell";
        spell.attack = attack;
        spell.recalc_attack_string(char.current_ability_scores);
        // spell damages are based on levels, so calculated elsewhere
        // spell.recalc_damage_string(char.current_ability_scores);
        
        if (spell.the_ability instanceof SpellAsAbility) {
          if (spell.level.value === 0 || ["Only Special Resource","At Will"].includes(spell.the_ability.slot_override)) {
            const action = new CharacterAction();
            action.type = "Spell As Ability";
            action.action = spell;
            action.level = spell.level;
            action.casting_time = spell.spell ? spell.spell.casting_time : "A";
            action.special_resource = spell.the_ability.slot_override === "Only Special Resource";
            actions.push(action);
          } else if (["Normal","And Special Resource"].includes(spell.the_ability.slot_override)) {
            const slot_levels = Array.from(new Set(char.slots.filter(o => o.level.value >= spell.level.value).map(o => o.level.value)));
            slot_levels.forEach(level => {
              const action = new CharacterAction();
              action.type = "Spell As Ability";
              action.action = spell;
              action.level = new SlotLevel(level);
              action.casting_time = spell.spell ? spell.spell.casting_time : "A";
              action.special_resource = spell.the_ability instanceof SpellAsAbility && spell.the_ability.slot_override === "And Special Resource";
              actions.push(action);
            });
          } else {
            const action = new CharacterAction();
            action.type = "Spell As Ability";
            action.action = spell;
            action.level = spell.level;
            action.casting_time = spell.spell ? spell.spell.casting_time : "A";
            action.special_resource = true;
            actions.push(action);
            
            const slot_levels = Array.from(new Set(char.slots.filter(o => o.level.value >= spell.level.value).map(o => o.level.value)));
            slot_levels.forEach(level => {
              const action = new CharacterAction();
              action.type = "Spell";
              action.action = spell;
              action.casting_time = spell.spell ? spell.spell.casting_time : "A";
              action.level = new SlotLevel(level);
              actions.push(action);
            });
          }
        }
      });
      if (false) {
        // TODO:
        // Warcaster:
        // When a hostile creature's movement 
        // provokes an opportunity attack from you, 
        // you can use your reaction to cast a spell 
        // at the creature, rather than making an 
        // opportunity attack. 
        // The spell must have a casting time of 
        // 1 action and must target only that creature.
      }

      // Go through weapons
      const item_actions = char.items.filter(o =>
        o.base_item &&
        o.base_item.item_type === "Weapon" &&
        o.equipped);
      let two_handed_id = "";
      const two_handed_finder = all_weapon_keywords.filter(o => o.name === "Two-Handed");
      if (two_handed_finder.length === 1) {
        two_handed_id = two_handed_finder[0]._id;
      }
      item_actions.forEach(weapon => {
        weapon.weapon_keywords = all_weapon_keywords.filter(o => weapon.base_item && weapon.base_item.weapon_keyword_ids.includes(o._id));
        weapon.attacks = this.get_weapon_attacks(weapon, char, two_handed_id);
        const action = new CharacterAction();
        action.type = "Weapon";
        action.action = weapon;
        actions.push(action);
        if (this.can_bonus_action_attack(weapon, char)) {
          const action = new CharacterAction();
          action.type = "Weapon";
          action.action = weapon;
          action.casting_time = "BA";
          actions.push(action);
        }
        if (this.can_reaction_attack(weapon, char)) {
          const action = new CharacterAction();
          action.type = "Weapon";
          action.action = weapon;
          action.casting_time = "RA";
          actions.push(action);  
        }
        // If they can do it as a bonus action or reaction then add
      });
      char.abilities.forEach(ability => {
        const attack = new Attack();
        attack.type = "Ability";
        ability.attack = attack;
        ability.recalc_attack_string(char.current_ability_scores);
        
        if (ability.the_ability instanceof Ability) {
          if (ability.the_ability.resource_consumed === "Slot") {
            const min_level = ability.the_ability.slot_level.value;
            char.slots.filter(o => o.level.value >= min_level).forEach(slot => {
              const action = new CharacterAction();
              action.type = "Ability";
              action.action = ability;
              action.level = slot.level;
              if (ability.the_ability instanceof Ability) {
                action.casting_time = ability.the_ability.casting_time;
              }
              actions.push(action);
            });
          } else {
            const action = new CharacterAction();
            action.type = "Ability";
            action.action = ability;
            action.casting_time = ability.the_ability.casting_time;
            actions.push(action);
          }
        }
      });
      // Need to get char.abilities into actions as well
      // console.log(item_actions);
      // console.log(char.spells);
      // console.log(char.abilities);
      // console.log(char.spell_as_abilities);
      // console.log(char.special_spells);
      // console.log(actions);
      char.actions = actions;
    }
  }

  enforce_options(char: Character, campaign: Campaign | null = null): void {
    this.recalcAll(char, null);
    let i = 0;
    if (campaign) {
      char.allow_homebrew = campaign.allow_homebrew;
      char.custom_origins = campaign.custom_origins;
      char.optional_features = campaign.optional_features;
      char.source_books = campaign.source_books;

      if (campaign.blocked_races.includes(char.race.race_id)) {
        char.spells = char.spells.filter(o => o.source_type !== "Race" || o.source_id !== char.race.race_id);
        char.race = new CharacterRace();
      }
      while (i < char.classes.length) {
        const char_class = char.classes[i];
        if (campaign.blocked_classes.includes(char_class.game_class_id)) {
          // Remove the class
          char.classes = char.classes.filter(o => o.game_class_id !== char_class.game_class_id);
          char.classes.filter(o => o.position > char_class.position).forEach(cc => {
            cc.position--;
            if (cc.position === 0) {
              cc.fixWithGameClass();
            }
          });
          char.spells = char.spells.filter(o => o.source_type !== "Class" || o.source_id !== char_class.game_class_id);
        } else {
          i++;
        }
      }
      if (!campaign.source_books.includes("60d9e2ff909a1d2014235f15")) {
        char.lineages = [];
        char.spells = char.spells.filter(o => o.source_type !== "Lineage");
      } else {
        i = 0;
        while (i < char.lineages.length) {
          const char_lineage = char.lineages[i];
          if (campaign.blocked_lineages.includes(char_lineage.lineage_id)) {
            // Remove the class
            char.lineages = char.lineages.filter(o => o.lineage_id !== char_lineage.lineage_id);
            char.spells = char.spells.filter(o => o.source_type !== "Lineage" || o.source_id !== char_lineage.lineage_id);
          } else {
            i++;
          }
        }
      }
      i = 0;
    }
    while (i < char.classes.length) {
      const char_class = char.classes[i];
      if (char_class.game_class && char_class.game_class.source_id !== "Basic Rules" && !char.source_books.includes(char_class.game_class.source_id)) {
        // Remove the class
        char.classes = char.classes.filter(o => o.game_class_id !== char_class.game_class_id);
        char.classes.filter(o => o.position > char_class.position).forEach(cc => {
          cc.position--;
          if (cc.position === 0) {
            cc.fixWithGameClass();
          }
        });
        char.spells = char.spells.filter(o => o.source_type !== "Class" || o.source_id !== char_class.game_class_id);
      } else {
        if (char_class.subclass && !char.source_books.includes(char_class.subclass.source_id)) {
          // Remove the class
          if (char_class.spellcasting_ability !== "") {
            // Check to see if spellcasting came through the subclass
            for (let j = 0; j < char_class.subclass_features.length; ++j) {
              const feature = char_class.subclass_features[j];
              if (feature.name === "Spellcasting") {
                char.spells = char.spells.filter(o => o.source_type !== "Class" || (o.source_id !== char_class.game_class_id && o.source_id !== char_class.subclass_id));
                char_class.spellcasting_ability = "";
                char_class.spell_attack = 0;
                char_class.spell_book = null;
                char_class.spell_count_per_level = 0;
                char_class.spell_dc = 0;
                char_class.spell_ids = [];
                char_class.spell_level_max = -1;
                char_class.spell_list_id = "";
                char_class.spell_table = "";
                char_class.spellcasting_focus = "";
                char_class.spellcasting_level = 0;
                char_class.spells_prepared_max = 0;
                char_class.base_spell_count = 0;
                char_class.bonus_spells = [];
                char_class.cantrip_ids = [];
                char_class.cantrips_max = 0;
                break;
              }
            }
          }
          char_class.subclass_id = "";
          char_class.subclass = null;
          char_class.subclass_features = [];
        }
        i++;
      }
    }
    if (char.background && char.background.background) {
      if (!char.source_books.includes(char.background.background.source_id)) {
        char.background = new CharacterBackground();
      }
    }
    if (char.race && char.race.race && 
      (!char.source_books.includes(char.race.race.source_id) || 
        (char.race.subrace && char.race.subrace.subrace && 
          !char.source_books.includes(char.race.subrace.subrace.source_id)))) {
      char.spells = char.spells.filter(o => o.source_type !== "Race" || o.source_id !== char.race.race_id);
      char.race = new CharacterRace();
    }
    i = 0;
    while (i < char.items.length) {
      const char_item = char.items[i];
      if (char_item.magic_item && char_item.magic_item.source_id !== "Basic Rules" && !char.source_books.includes(char_item.magic_item.source_id)) {
        char.remove_item(char_item);
      } else {
        i++;
      }
    }
    i = 0;
    while (i < char.spells.length) {
      const char_spell = char.spells[i];
      if (char_spell.spell && char_spell.spell.source_id !== "Basic Rules" && !char.source_books.includes(char_spell.spell.source_id)) {
        char.remove_spell(char_spell.spell_id, char_spell.source_type, char_spell.source_id);
      } else {
        i++;
      }
    }
  }

  /**
   * Two-Weapon Fighting:
   * When you take the Attack action and 
   * attack with a light melee weapon that 
   * you're holding in one hand, 
   * you can use a bonus action to attack 
   * with a different light melee weapon 
   * that you're holding in the other hand. 
   * You don't add your ability modifier to 
   * the damage of the bonus attack, 
   * unless that modifier is negative.
   * 
   * If either weapon has the thrown property, 
   * you can throw the weapon, 
   * instead of making a melee attack with it.
   */
  can_bonus_action_attack(weapon: CharacterItem, char: Character): boolean {
    if (weapon.weapon_keywords.filter(o => o.name === "Light").length > 0 &&
      weapon.weapon_keywords.filter(o => o.name === "Melee").length > 0) {
      return true;
    } else {
      // TODO:
      // Crossbow Expert Attack
      // When you use the Attack action 
      // and attack with a one-handed weapon, 
      // you can use a bonus action to attack 
      // with a hand crossbow you are holding.

      // Dual Wielder
      // You master fighting with two weapons, 
      // gaining the following benefits:

      // You gain a +1 bonus to AC while 
      // you are wielding a separate melee 
      // weapon in each hand.
      // You can use two-weapon fighting even 
      // when the one-handed melee weapons 
      // you are wielding aren't light.
      // You can draw or stow two one-handed 
      // weapons when you would normally be 
      // able to draw or stow only one.
    }

    return false;
  }

  /**
   * Opportunity Attack:
   * You can make an opportunity attack when a 
   * hostile creature that you can see moves 
   * out of your reach. To make the opportunity attack, 
   * you use your reaction to make one melee attack 
   * against the provoking creature. 
   * The attack occurs right before the creature leaves 
   * your reach.
   */
  can_reaction_attack(weapon: CharacterItem, char: Character): boolean {
    if (weapon.weapon_keywords.filter(o => o.name === "Melee").length > 0) {
      return true;
    }

    return false;
  }
}
