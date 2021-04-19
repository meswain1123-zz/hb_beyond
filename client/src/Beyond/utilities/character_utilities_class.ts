

import {
  Ability,
  AbilityScores,
  Advantage,
  ArmorType,
  Bonus,
  BonusSpells,
  Character,
  CharacterAbility,
  CharacterASIBaseFeature,
  CharacterEldritchInvocation,
  CharacterFeat,
  CharacterFeature,
  CharacterItem,
  CharacterLanguageFeature,
  CharacterPactBoon,
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
  HitDice,
  Modifier,
  Proficiency,
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
  IStringNumHash
} from "../models";

import API from "./smart_api";
import { APIClass } from "./smart_api_class";

export class CharacterUtilitiesClass {
  conditions: Condition[] | null;
  spells: Spell[] | null;
  eldritch_invocations: EldritchInvocation[] | null;
  weapon_keywords: WeaponKeyword[] | null;
  armor_types: ArmorType[] | null;
  spell_slot_types: SpellSlotType[] | null;

  constructor() {
    this.api = API.getInstance();
    this.conditions = null;
    this.spells = null;
    this.eldritch_invocations = null;
    this.weapon_keywords = null;
    this.armor_types = null;
    this.spell_slot_types = null;
    this.api.getSetOfObjects(["condition","spell", "eldritch_invocation", "weapon_keyword","armor_type","spell_slot_type"]).then((res: any) => {
      this.conditions = res.condition;
      this.spells = res.spell;
      this.eldritch_invocations = res.eldritch_invocation;
      this.weapon_keywords = res.weapon_keyword;
      this.armor_types = res.armor_type;
      this.spell_slot_types = res.spell_slot_type;
    });
  }

  api: APIClass;


  get_weapon_attack(item: CharacterItem, char: Character, proficient: boolean, ba: boolean, type: string): Attack {
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
      } else if (item.weapon_keywords.filter(o => db.types.includes(o.name))) {
        good = true;
      }

      if (good) {
        attack.damage_rolls.push(db.rolls);
      }
    });
    attack.recalc_attack_string(char.current_ability_scores);
    attack.recalc_damage_string(char.current_ability_scores);
    attack.type = type;
    return attack;
  }

  get_weapon_attacks(item: CharacterItem, char: Character): Attack[] {
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
    
    attacks.push(this.get_weapon_attack(item, char, proficient, false, "Normal"));
    if (ba) {
      attacks.push(this.get_weapon_attack(item, char, proficient, true, "Normal"));
    }
    if (item.weapon_keywords.filter(o => o.name === "Versatile").length > 0) {
      // If the weapon is Versatile then there's a SingleHanded and a TwoHanded.
      attacks.push(this.get_weapon_attack(item, char, proficient, false, "Versatile"));
    } else if (item.weapon_keywords.filter(o => o.name === "Great Weapon").length > 0) {
      // If it's a Great Weapon, 
      // and they have Great Weapon Master, 
      // then they have Normal and GWM attacks.
      if (char.feats.filter(o => o.feat && o.feat.name === "Great Weapon Master").length > 0) {
        attacks.push(this.get_weapon_attack(item, char, proficient, false, "GWM"));
      }
    } else if (item.weapon_keywords.filter(o => o.name === "Ranged").length > 0) {
      // If it's a Ranged Weapon 
      // and they have Sharpshooter,
      // then they have Normal and SS attacks.
      if (char.feats.filter(o => o.feat && o.feat.name === "Sharp Shooter").length > 0) {
        attacks.push(this.get_weapon_attack(item, char, proficient, false, "SS"));
        if (ba) {
          attacks.push(this.get_weapon_attack(item, char, proficient, true, "SS"));
        }
      }
    }
    return attacks;
  }

  recalcAll(char: Character): void {
    if (this.armor_types && this.conditions && this.spells && this.spell_slot_types && this.weapon_keywords && this.eldritch_invocations) {
      const all_armor_types = this.armor_types;
      const all_spells = this.spells;
      const all_spell_slot_types = this.spell_slot_types;
      const all_conditions = this.conditions;
      const all_eldritch_invocations = this.eldritch_invocations;
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
      const abilities: CharacterAbility[] = [];
      const spell_as_abilities: CharacterSpell[] = [];

      // Spell List, Ritual Casting, 
      // Spellcasting,
      // Spell Book, Spells/Cantrips Known/Prepared,
      // Bonus Spells, Mystic Arcanum
      const spellcasting: CharacterSpellcasting[] = [];

      const senses: CharacterSense[] = [];
      const sense_features: SenseFeature[] = [];
      const attack_bonuses: Bonus[] = [];
      const damage_bonuses: Bonus[] = [];
      const saving_throw_bonuses: Bonus[] = [];
      const check_bonuses: Bonus[] = [];

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
        } else if (f.feature_type === "Spell Modifier") {
          spell_modifiers.push({ source_type, source_id, source_name, modifier: f.feature.the_feature as SpellModifier });
        } else if (f.feature_type === "Damage Multiplier") {
          const dm = f.feature.the_feature as DamageMultiplier;
          dm.id = damage_multipliers.length;
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
        } else if (f.feature_type === "Expertise") {
          f.feature_options.forEach((fo: any) => {
            skill_proficiencies[fo.skill_id] = 2;
          });
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
            const char_resource = new CharacterResource();
            char_resource.copyResource(f.feature.the_feature);
            resources.push(char_resource);
          }
        } else if (f.feature_type === "Ability" ||
          f.feature_type === "Item Affecting Ability") {
          const char_ability = new CharacterAbility();
          char_ability.copyFeature(f);
          char_ability.source_type = source_type;
          char_ability.source_id = source_id;
          char_ability.source_name = source_name;
          abilities.push(char_ability);
        } else if (f.feature_type === "Spell as Ability") {
          if (f.feature.the_feature instanceof SpellAsAbility) {
            const the_feature = f.feature.the_feature;
            const spell_finder = all_spells.filter(o => o._id === the_feature.spell_id);
            if (spell_finder.length === 1) {
              the_feature.connectSpell(spell_finder[0]);
            }
            const char_ability = new CharacterSpell();
            char_ability.copySpell(the_feature);
            char_ability.source_type = source_type;
            char_ability.source_id = source_id;
            char_ability.source_name = source_name;
            char_ability.spellcasting_ability = the_feature.spellcasting_ability;
            spell_as_abilities.push(char_ability);
          }
        } else if (f.feature_type === "Spell Book" ||
          f.feature_type === "Bonus Spells" ||
          f.feature_type === "Spell List" ||
          f.feature_type === "Ritual Casting" ||
          f.feature_type === "Spellcasting" ||
          f.feature_type === "Cantrips" ||
          f.feature_type === "Spells" ||
          f.feature_type === "Mystic Arcanum") {
          const char_spellcasting = new CharacterSpellcasting();
          if (source_type === "Class") {
            char_spellcasting.class_id = source_id;
            char_spellcasting.copyFeature(f);
            spellcasting.push(char_spellcasting);
          }
        } else if (f.feature_type === "Eldritch Invocation") {
          const cei = f.feature_options[0] as CharacterEldritchInvocation;
          if (!cei.eldritch_invocation) {
            const ei_finder = all_eldritch_invocations.filter(o => o._id === cei.eldritch_invocation_id);
            if (ei_finder.length === 1) {
              cei.connectEldritchInvocation(ei_finder[0]);
            }
          }
          eldritch_invocations.push(cei);
        } else if (f.feature_type === "Pact Boon") {
          pact_boon = f.feature_options[0] as CharacterPactBoon;
        }
      }

      const processAll = (me: Character) => {
        me.race.features.forEach(fb => {
          let good = true;
          if (fb.feature_base) {
            if (fb.feature_base.required_condition_ids.length > 0 && fb.feature_base.required_condition_ids.filter(o => o !== "All").length > 0) {
              good = false;
              for (let i = 0; i < fb.feature_base.required_condition_ids.length; ++i) {
                if (me.conditions.includes(fb.feature_base.required_condition_ids[i])) {
                  good = true;
                  break;
                }
              }
            }
          }
          if (good) {
            fb.features.forEach(f => { processCharacterFeature(f, "Race", me.race.race_id, me.race.race ? me.race.race.name : ""); });
          }
        });
        if (me.race.subrace) {
          me.race.subrace.features.forEach(fb => {
            let good = true;
            if (fb.feature_base) {
              if (fb.feature_base.required_condition_ids.length > 0 && fb.feature_base.required_condition_ids.filter(o => o !== "All").length > 0) {
                good = false;
                for (let i = 0; i < fb.feature_base.required_condition_ids.length; ++i) {
                  if (me.conditions.includes(fb.feature_base.required_condition_ids[i])) {
                    good = true;
                    break;
                  }
                }
              }
            }
            if (good) {
              fb.features.forEach(f => { processCharacterFeature(f, "Subrace", me.race.subrace ? me.race.subrace.subrace_id : "", me.race.subrace && me.race.subrace.subrace ? me.race.subrace.subrace.name : ""); });
            }
          });
        }
        me.background.features.forEach(fb => {
          let good = true;
          if (fb.feature_base) {
            if (fb.feature_base.required_condition_ids.length > 0 && fb.feature_base.required_condition_ids.filter(o => o !== "All").length > 0) {
              good = false;
              for (let i = 0; i < fb.feature_base.required_condition_ids.length; ++i) {
                if (me.conditions.includes(fb.feature_base.required_condition_ids[i])) {
                  good = true;
                  break;
                }
              }
            }
          }
          if (good) {
            fb.features.forEach(f => { processCharacterFeature(f, "Background", me.background.background_id, me.background.background ? me.background.background.name : ""); });
          }
        });
        me.classes.forEach(char_class => {
          char_class.class_features.forEach(fb => {
            let good = true;
            if (fb.feature_base) {
              if (fb.feature_base.required_condition_ids.length > 0 && fb.feature_base.required_condition_ids.filter(o => o !== "All").length > 0) {
                good = false;
                for (let i = 0; i < fb.feature_base.required_condition_ids.length; ++i) {
                  if (me.conditions.includes(fb.feature_base.required_condition_ids[i])) {
                    good = true;
                    break;
                  }
                }
              }
            }
            if (good) {
              fb.features.forEach(f => { processCharacterFeature(f, "Class", char_class.game_class_id, char_class.game_class ? char_class.game_class.name : ""); });
            }
          });
          char_class.subclass_features.forEach(fb => {
            let good = true;
            if (fb.feature_base) {
              if (fb.feature_base.required_condition_ids.length > 0 && fb.feature_base.required_condition_ids.filter(o => o !== "All").length > 0) {
                good = false;
                for (let i = 0; i < fb.feature_base.required_condition_ids.length; ++i) {
                  if (me.conditions.includes(fb.feature_base.required_condition_ids[i])) {
                    good = true;
                    break;
                  }
                }
              }
            }
            if (good) {
              fb.features.forEach(f => { processCharacterFeature(f, "Class", char_class.game_class_id, char_class.game_class ? char_class.game_class.name : ""); });
            }
          });
        });
        me.items.filter(item => item.equipped && item.magic_item && (!item.magic_item.attunement || item.attuned)).forEach(item => {
          item.features.forEach(fb => {
            let good = true;
            if (fb.feature_base) {
              if (fb.feature_base.required_condition_ids.length > 0 && fb.feature_base.required_condition_ids.filter(o => o !== "All").length > 0) {
                good = false;
                for (let i = 0; i < fb.feature_base.required_condition_ids.length; ++i) {
                  if (me.conditions.includes(fb.feature_base.required_condition_ids[i])) {
                    good = true;
                    break;
                  }
                }
              }
            }
            if (good) {
              fb.features.forEach(f => { processCharacterFeature(f, "Item", item.true_id, item.name); });
            }
          });
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
          feat.features.forEach(fb => {
            let good = true;
            if (fb.feature_base) {
              if (fb.feature_base.required_condition_ids.length > 0 && fb.feature_base.required_condition_ids.filter(o => o !== "All").length > 0) {
                good = false;
                for (let i = 0; i < fb.feature_base.required_condition_ids.length; ++i) {
                  if (me.conditions.includes(fb.feature_base.required_condition_ids[i])) {
                    good = true;
                    break;
                  }
                }
              }
            }
            if (good) {
              fb.features.forEach(f => { processCharacterFeature(f, "Feat", feat.feat_id, feat.feat ? feat.feat.name : ""); });
            }
          });
        });
        pact_boon.features.forEach(f => { processCharacterFeature(f, "Pact Boon", pact_boon.pact_boon_id, pact_boon.pact_boon ? pact_boon.pact_boon.name : ""); });
        eldritch_invocations.forEach(ei => {
          ei.features.forEach(f => { processCharacterFeature(f, "Eldritch Invocation", ei.eldritch_invocation_id, ei.eldritch_invocation ? ei.eldritch_invocation.name : ""); });
        });
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
      let level = 0;
      let max_hit_points = 0;
      const hit_dice: HitDice[] = [];
      let start_hit_dice: HitDice = new HitDice({ size: 6, count: 1 });
      char.classes.forEach(char_class => {
        level += char_class.level;
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
      char.character_level = level;
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
      const checkArmorRequirement = (me: Character, mod: Modifier) => {
        // Check if it matches the armor_requirement field
        if (mod.allowed_armor_types.filter(o => o === "All").length === 1) {
          // Check for required
          if (mod.required_armor_types.filter(o => o === "None").length === 1) {
            return true;
          } else {
            const missing_armor_types = mod.required_armor_types.filter(a =>
              me.equipped_items.filter(o =>
                o.base_item &&
                o.base_item.item_type === "Armor" &&
                o.base_item.armor_type_id === a).length === 0);
            return missing_armor_types.length === 0;
          }
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
          if (checkArmorRequirement(char, mod)) {
            const amount = getModifierAmount(char, mod_obj);
            if (amount) {
              base_armor_class += +amount;
            }
          }
        } else if (mod.modifies === "Speed") {
          if (checkArmorRequirement(char, mod)) {
            const amount = getModifierAmount(char, mod_obj);
            if (amount) {
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
          if (checkArmorRequirement(char, mod)) {
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
          if (checkArmorRequirement(char, mod)) {
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
          if (checkArmorRequirement(char, mod)) {
            const amount = getModifierAmount(char, mod_obj);
            if (amount) {
              char.initiative_modifier += +amount;
            }
          }
        } else if (mod.modifies === "Attack") {
          if (checkArmorRequirement(char, mod)) {
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
          if (checkArmorRequirement(char, mod)) {
            const amount = getModifierAmount(char, mod_obj);
            if (amount) {
              const bonus = new Bonus();
              bonus.source = mod_obj.source_name;
              bonus.types = mod.modifies_details;
              if (mod.modifies_detail_2 === "All") {
                bonus.subtypes.push(mod.modifies_detail_2);
              }
              if (amount.includes("d")) {
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

        spellcasting.filter(sc => sc.class_id === char_class.game_class_id).forEach(sc => {
          if (sc.feature_type === "Spellcasting") {
            const feature = sc.the_feature as SpellcastingFeature;
            char_class.spellcasting_ability = feature.ability;
            const spellcasting_ability_modifier = current.getModifier(feature.ability);
            if (spellcasting_ability_modifier) {
              // They can only have one Spellcasting feature per class
              char_class.spell_dc += 8 + char.proficiency_modifier + spellcasting_ability_modifier;
              char_class.spell_attack += char.proficiency_modifier + spellcasting_ability_modifier;
            }
            if (feature.cantrips_max) {
              char_class.cantrips_max += +feature.cantrips_max;
            }
            char_class.extra_prepared_from_ability = feature.extra_prepared_from_ability;
            char_class.knowledge_type = feature.knowledge_type;
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
          } else if (sc.feature_type === "Spell Book") {
            const feature = sc.the_feature as SpellBook;
            char_class.spell_book = feature;
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
            const feature = sc.the_feature as number;
            char_class.mystic_arcanum_levels.push(feature);
          }
        });
        char_class.spells_prepared_max = char_class.spell_count_per_level * char_class.level;
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
          if (char_spell.level === 0) {
            char_class.cantrip_ids.push(char_spell.spell_id);
          } else {
            char_class.spell_ids.push(char_spell.spell_id);
          }
          char_spell.connectSource(char_class);
        });
      });
      abilities.forEach(ability => {
        const a_finder = char.abilities.filter(o =>
          o.source_type === ability.source_type &&
          o.source_id === ability.source_id &&
          o.ability_type === ability.ability_type &&
          o.true_id === ability.true_id);
        if (a_finder.length === 1) {
          ability.customizations = a_finder[0].customizations;
        }
      });
      char.abilities = abilities;
      spell_as_abilities.forEach(ability => {
        const a_finder = char.spell_as_abilities.filter(o =>
          o.source_type === ability.source_type &&
          o.source_id === ability.source_id &&
          o.true_id === ability.true_id);
        if (a_finder.length === 1) {
          ability.customizations = a_finder[0].customizations;
        }
        const spellcasting_ability_modifier = current.getModifier(ability.spellcasting_ability);
        if (spellcasting_ability_modifier) {
          ability.spell_dc += 8 + char.proficiency_modifier + spellcasting_ability_modifier;
          ability.spell_attack += char.proficiency_modifier + spellcasting_ability_modifier;
        }
      });
      char.spell_as_abilities = spell_as_abilities;
      if (char.concentrating_on) {
        if (char.concentrating_on instanceof CharacterSpell) {
          const spell_id = char.concentrating_on.spell_id;
          const obj_finder = all_spells.filter(o => o._id === spell_id);
          if (obj_finder.length === 1) {
            char.concentrating_on.connectSpell(obj_finder[0]);
          }
        } 
      }

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
            slot.level = slot_level;
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

      let weight_carried = 0;
      char.items.forEach(i => {
        if (i.base_item) {
          weight_carried += (i.base_item.weight * i.count);
        }
      });
      char.weight_carried = weight_carried;
      char.current_ability_scores = current;
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
        const r_finder = char.resources.filter(o => o.type_id === r.type_id);
        if (r_finder.length === 1) {
          r.used = r_finder[0].used;
        }
      });
      char.resources = resources;
      slots.forEach(slot => {
        const slot_finder = char.slots.filter(o => o.type_id === slot.type_id && o.level === slot.level);
        if (slot_finder.length === 1) {
          slot.used = slot_finder[0].used;
        }
      });
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
      char.pact_boon_id = pact_boon.pact_boon_id;
      char.senses = senses;
      char.advantages = advantages;
      damage_multipliers.forEach(dm => {
        dm.damage_types.forEach(dt => {
          const dms = new DamageMultiplierSimple();
          dms.damage_type = dt;
          dms.multiplier = dm.multiplier;
          dms.id = damage_multiplier_simples.length;
          dms.from_feature = true;
          damage_multiplier_simples.push(dms);
        });
      });
      char.extra_damage_multipliers.forEach(dm => {
        dm.id = damage_multiplier_simples.length;
        damage_multiplier_simples.push(dm);
      });
      char.damage_multipliers = damage_multiplier_simples;
      char.attack_bonuses = attack_bonuses;
      char.damage_bonuses = damage_bonuses;
      char.saving_throw_bonuses = saving_throw_bonuses;
      char.check_bonuses = check_bonuses;

      // Apply modifiers to spells
      char.spells.forEach(spell => {
        const attack = new Attack();
        if (spell.the_spell) {
          if (spell.level === 0) {
            if (spell.the_spell.effect.attack_type === "Save") {
              // It's a save attack
              char.attack_bonuses.filter(o => o.types.includes("Cantrip Saves")).forEach(ab => {
                const rolls = new RollPlus(ab.rolls);
                attack.attack_rolls.push(rolls);
              });
              if (spell.spell_dc !== 0) {
                const rolls = new RollPlus();
                rolls.flat = spell.spell_dc;
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
                rolls.flat = spell.spell_attack;
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
                rolls.flat = spell.spell_dc;
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
                rolls.flat = spell.spell_attack;
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
        // spell damages are based on levels, so calculated elsewhere
        // spell.recalc_damage_string(char.current_ability_scores);
      });

      // Go through weapons
      const item_actions = char.items.filter(o =>
        o.base_item &&
        o.base_item.item_type === "Weapon" &&
        o.equipped);
      item_actions.forEach(weapon => {
        weapon.weapon_keywords = all_weapon_keywords.filter(o => weapon.base_item && weapon.base_item.weapon_keyword_ids.includes(o._id));
        weapon.attacks = this.get_weapon_attacks(weapon, char);
      });
      char.actions.item_actions = item_actions;
      // Go through spells
      const spell_actions = char.spells.filter(o =>
        o.spell && o.spell instanceof Spell && o.spell.effect.type !== "None");
      const spell_ability_actions = char.spells.filter(o =>
        o.spell && o.spell instanceof SpellAsAbility && o.spell.spell && o.spell.spell.effect.type !== "None");
      char.actions.spells_actions = [
        ...spell_actions.filter(o => o.spell && o.spell instanceof Spell && o.spell.casting_time === "A"),
        ...spell_ability_actions.filter(o => o.spell && o.spell instanceof SpellAsAbility && o.spell.spell && o.spell.spell.casting_time === "A")
      ];
      char.actions.spells_bonus_actions = [
        ...spell_actions.filter(o => o.spell && o.spell instanceof Spell && o.spell.casting_time === "BA"),
        ...spell_ability_actions.filter(o => o.spell && o.spell instanceof SpellAsAbility && o.spell.spell && o.spell.spell.casting_time === "BA")
      ];
      char.actions.spells_reactions = [
        ...spell_actions.filter(o => o.spell && o.spell instanceof Spell && o.spell.casting_time === "RA"),
        ...spell_ability_actions.filter(o => o.spell && o.spell instanceof SpellAsAbility && o.spell.spell && o.spell.spell.casting_time === "RA")
      ];
      char.actions.spells_other_actions = [
        ...spell_actions.filter(o => o.spell && o.spell instanceof Spell && !["A", "BA", "RA"].includes(o.spell.casting_time)),
        ...spell_ability_actions.filter(o => o.spell && o.spell instanceof SpellAsAbility && o.spell.spell && !["A", "BA", "RA"].includes(o.spell.spell.casting_time))
      ];
      // Go through abilities
      const ability_actions = char.abilities.filter(o =>
        o.the_ability && 
        o.the_ability instanceof Ability);
      char.actions.abilities_actions = ability_actions.filter(o => o.the_ability && o.the_ability instanceof Ability && o.the_ability.casting_time === "A");
      char.actions.abilities_bonus_actions = ability_actions.filter(o => o.the_ability && o.the_ability instanceof Ability && o.the_ability.casting_time === "BA");
      char.actions.abilities_reactions = ability_actions.filter(o => o.the_ability && o.the_ability instanceof Ability && o.the_ability.casting_time === "RA");
      char.actions.abilities_other_actions = ability_actions.filter(o => o.the_ability && o.the_ability instanceof Ability && !["A", "BA", "RA"].includes(o.the_ability.casting_time));
    }
  }
}
