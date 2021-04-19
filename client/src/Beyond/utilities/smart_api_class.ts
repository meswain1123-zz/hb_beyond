
import { 
  AbilityTemplate,
  SpellAsAbilityTemplate,
  ItemAffectingAbilityTemplate,
  SummonStatBlockTemplate,
  Skill,
  Condition,
  SpellList,
  ArmorType,
  Background,
  BaseItem,
  Campaign,
  Character,
  Creature,
  EldritchInvocation,
  EquipmentPack,
  PactBoon,
  Feat,
  FeatureBaseTemplate,
  FeatureChoiceTemplate,
  FeatureTemplate,
  GameClass,
  MagicItem,
  MagicItemKeyword,
  // MagicItemTemplate,
  Race,
  Subrace,
  Resource,
  Spell,
  SpellSlotType,
  SpecialFeature,
  SpellTemplate,
  Subclass,
  Tool,
  Sense,
  User,
  WeaponKeyword,
  TemplateBase,
  Language,
  ModelBase
} from "../models";

// This is our special type of Error that represents
// when a request got a 401 Unauthorized response
class UnauthorizedError {
  name: string;
  message: string;

  constructor(message: string) {
    this.name = "UnauthorizedError";
    this.message = message;
  }
}


export class APIClass {
  real: boolean;
  spells: Spell[] | null;
  skills: Skill[] | null;
  conditions: Condition[] | null;
  spell_lists: SpellList[] | null;
  armor_types: ArmorType[] | null;
  backgrounds: Background[] | null;
  base_items: BaseItem[] | null;
  campaigns: Campaign[] | null;
  characters: Character[] | null;
  creatures: Creature[] | null;
  eldritch_invocations: EldritchInvocation[] | null;
  equipment_packs: EquipmentPack[] | null;
  pact_boons: PactBoon[] | null;
  feats: Feat[] | null;
  game_classes: GameClass[] | null;
  magic_items: MagicItem[] | null;
  magic_item_keywords: MagicItemKeyword[] | null;
  // magic_item_templates: MagicItemTemplate[] | null;
  races: Race[] | null;
  subraces: Subrace[] | null;
  resources: Resource[] | null;
  spell_slot_types: SpellSlotType[] | null;
  subclasses: Subclass[] | null;
  users: User[] | null;
  weapon_keywords: WeaponKeyword[] | null;
  template_bases: TemplateBase[] | null;
  languages: Language[] | null;
  special_features: SpecialFeature[] | null;
  tools: Tool[] | null;
  senses: Sense[] | null;
  
  constructor() {
    this.real = true;
    this.spells = null;
    this.skills = null;
    this.conditions = null;
    this.spell_lists = null;
    this.armor_types = null;
    this.backgrounds = null;
    this.base_items = null;
    this.campaigns = null;
    this.characters = null;
    this.creatures = null;
    this.eldritch_invocations = null;
    this.equipment_packs = null;
    this.pact_boons = null;
    this.feats = null;
    this.game_classes = null;
    this.magic_items = null;
    this.magic_item_keywords = null;
    // this.magic_item_templates = null;
    this.races = null;
    this.subraces = null;
    this.resources = null;
    this.spell_slot_types = null;
    this.subclasses = null;
    this.users = null;
    this.weapon_keywords = null;
    this.template_bases = null;
    this.languages = null;
    this.special_features = null;
    this.tools = null;
    this.senses = null;
  }

  logErrorReason = (reason: string) => {
    // log the error reason but keep the rejection
    console.log("Response error reason:", reason);
    return Promise.reject(reason);
  };

  checkStatus = (response: any) => {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else if (response.status === 401) {
      let unauthorizedError = new UnauthorizedError(response.statusText);
      return Promise.reject(unauthorizedError);
    } else {
      var error = new Error(response.statusText);
      return Promise.reject(error);
    }
  };

  // User
  login = async (user: any, stayLoggedIn: boolean) => {
    if (this.real) {
      if (stayLoggedIn) {
        const sessionObj = {
          body: user,
          expiresAt: "never"
        };
        localStorage.setItem("loginUser", JSON.stringify(sessionObj));
      }
      const response = await this.postData("/api/beyond/login", user);
      return this.processResponse(response, "user", null, "user", stayLoggedIn);
    } else {
      return {
        _id: "-1",
        email: "fake@fakemail.com",
        username: "Liar Liar"
      };
    }
  }

  register = async (user: any) => {
    if (this.real) {
      const response = await this.postData("/api/beyond/register", user);
      return this.processResponse(response, "user");
    } else {
      return -1;
    }
  };
  
  getSetOfObjects = async (data_types: string[], refresh = false) => {
    const return_me: any = {};
    for (let i = 0; i < data_types.length; i++) {
      const data_type = data_types[i];
      return_me[data_type] = await this.getObjects(data_type, refresh);
    }
    return return_me;
  };
  getObjects = async (data_type: string, refresh = false) => {
    if (refresh) {
      return this.getObjectsFromAPI(data_type);
    } else {
      let data: any = null;
      switch(data_type) {
        case "spell": 
          data = this.spells;
        break;
        case "skill": 
          data = this.skills;
        break;
        case "condition": 
          data = this.conditions;
        break;
        case "spell_list": 
          data = this.spell_lists;
        break;
        case "armor_type": 
          data = this.armor_types;
        break;
        case "background": 
          data = this.backgrounds;
        break;
        case "base_item": 
          data = this.base_items;
        break;
        case "campaign": 
          data = this.campaigns;
        break;
        case "character": 
          data = this.characters;
        break;
        case "creature": 
          data = this.creatures;
        break;
        case "eldritch_invocation": 
          data = this.eldritch_invocations;
        break;
        case "equipment_pack": 
          data = this.equipment_packs;
        break;
        case "pact_boon": 
          data = this.pact_boons;
        break;
        case "feat": 
          data = this.feats;
        break;
        case "game_class": 
          data = this.game_classes;
        break;
        case "magic_item": 
          data = this.magic_items;
        break;
        case "magic_item_keyword":
          data = this.magic_item_keywords;
        break;
        case "magic_item_template": 
        break;
        case "race": 
          data = this.races;
        break;
        case "subrace": 
          data = this.subraces;
        break;
        case "resource": 
          data = this.resources;
        break;
        case "spell_slot_type": 
          data = this.spell_slot_types;
        break;
        case "subclass": 
          data = this.subclasses;
        break;
        case "user": 
          data = this.users;
        break;
        case "weapon_keyword": 
          data = this.weapon_keywords;
        break;
        case "template": 
          data = this.template_bases;
        break;
        case "language": 
          data = this.languages;
        break;
        case "special_feature": 
          data = this.special_features;
        break;
        case "tool": 
          data = this.tools;
        break;
        case "sense": 
          data = this.senses;
        break;
        default:
          data = this.getSessionData(data_type);
        break;
      }
      if (data !== null) {
        return data;
      } else {
        return this.getObjectsFromAPI(data_type);
      }
    }
  };
  getObjectsFromAPI = async (data_type: string) => {
    if (this.real) {
      const response = await this.fetchData(
        `/api/beyond/getObjects/${data_type}`
      );
      const data = await this.processResponse(response, data_type, null, data_type);
      return data;
    } else {
      return [{ _id: -1, vttID: -1, Name: "Alice" }];
    }
  };
  getFullObject = async (data_type: string, id: string, refresh = false) => {
    if (refresh) {
      return this.getObjectsFromAPI(data_type);
    } else {
      let data: any = null;
      switch(data_type) {
        case "spell": 
          if (!this.spells) {
            await this.getObjects("spell");
          }
          if (this.spells) {
            data = this.spells.filter(o => o._id === id);
          }
        break;
        case "skill": 
          if (!this.skills) {
            await this.getObjects("skill");
          }
          if (this.skills) {
            data = this.skills.filter(o => o._id === id);
          }
        break;
        case "condition": 
          if (!this.conditions) {
            await this.getObjects("condition");
          }
          if (this.conditions) {
            data = this.conditions.filter(o => o._id === id);
          }
        break;
        case "spell_list": 
          if (!this.spell_lists) {
            await this.getObjects("spell_list");
          }
          if (this.spell_lists) {
            data = this.spell_lists.filter(o => o._id === id);
          }
        break;
        case "armor_type": 
          if (!this.armor_types) {
            await this.getObjects("armor_type");
          }
          if (this.armor_types) {
            data = this.armor_types.filter(o => o._id === id);
          }
        break;
        case "background": 
          if (!this.backgrounds) {
            await this.getObjects("background");
          }
          if (this.backgrounds) {
            data = this.backgrounds.filter(o => o._id === id);
          }
        break;
        case "base_item": 
          if (!this.base_items) {
            await this.getObjects("base_item");
          }
          if (this.base_items) {
            data = this.base_items.filter(o => o._id === id);
          }
        break;
        case "campaign": 
          if (!this.campaigns) {
            await this.getObjects("campaign");
          }
          if (this.campaigns) {
            data = this.campaigns.filter(o => o._id === id);
          }
        break;
        case "character": 
          if (!this.backgrounds) {
            await this.getObjects("background");
          }
          if (!this.spells) {
            await this.getObjects("spell");
          }
          if (!this.characters) {
            await this.getObjects("character");
          }
          if (!this.base_items) {
            await this.getObjects("base_item");
          }
          if (!this.magic_items) {
            await this.getObjects("magic_item");
          }
          if (!this.game_classes) {
            await this.getObjects("game_class");
          }
          if (!this.subclasses) {
            await this.getObjects("subclass");
          }
          if (!this.subraces) {
            await this.getObjects("subrace");
          }
          if (!this.races) {
            await this.getObjects("race");
          }
          if (!this.spell_slot_types) {
            await this.getObjects("spell_slot_type");
          }
          if (this.characters) {
            data = this.characters.filter(o => o._id === id);
            data.forEach((char: Character) => {
              if (char.background.background_id !== "" && !char.background.background) {
                if (this.backgrounds) {
                  const obj_finder = this.backgrounds.filter(o => o._id === char.background.background_id);
                  if (obj_finder.length === 1) {
                    char.background.connectBackground(obj_finder[0]);
                  }
                }
              }
              if (char.race.race_id && !char.race.race) {
                if (this.races) {
                  const obj_finder = this.races.filter(o => o._id === char.race.race_id);
                  if (obj_finder.length === 1) {
                    char.race.connectRace(obj_finder[0]);
                  }
                }
              }
              if (char.race.subrace && char.race.subrace.subrace_id && !char.race.subrace.subrace) {
                if (this.subraces) {
                  const obj_finder = this.subraces.filter(o => char.race.subrace && o._id === char.race.subrace.subrace_id);
                  if (obj_finder.length === 1) {
                    char.race.subrace.connectSubrace(obj_finder[0]);
                  }
                }
              }
              char.items.forEach(item => {
                if (item.magic_item_id && !item.magic_item) {
                  if (this.magic_items) {
                    const obj_finder = this.magic_items.filter(o => o._id === item.magic_item_id);
                    if (obj_finder.length === 1) {
                      item.connectMagicItem(obj_finder[0]);
                    }
                  }
                } else if (item.base_item_id && !item.base_item) {
                  if (this.base_items) {
                    const obj_finder = this.base_items.filter(o => o._id === item.base_item_id);
                    if (obj_finder.length === 1) {
                      item.connectBaseItem(obj_finder[0]);
                    }
                  }
                }
              });
              char.classes.forEach(char_class => {
                if (char_class.game_class_id && !char_class.game_class) {
                  if (this.game_classes) {
                    const obj_finder = this.game_classes.filter(o => o._id === char_class.game_class_id);
                    if (obj_finder.length === 1) {
                      char_class.connectGameClass(obj_finder[0]);
                    }
                  }
                }
                if (char_class.subclass_id && !char_class.subclass) {
                  if (this.subclasses) {
                    const obj_finder = this.subclasses.filter(o => o._id === char_class.subclass_id);
                    if (obj_finder.length === 1) {
                      char_class.connectSubclass(obj_finder[0]);
                    }
                  }
                }
              });
              char.spells.forEach(char_spell => {
                if (char_spell.spell_id && !char_spell.spell) {
                  if (this.spells) {
                    const obj_finder = this.spells.filter(o => o._id === char_spell.spell_id);
                    if (obj_finder.length === 1) {
                      char_spell.connectSpell(obj_finder[0]);
                    }
                  }
                }
              });
            });
          }
        break;
        case "creature": 
          if (!this.creatures) {
            await this.getObjects("creature");
          }
          if (this.creatures) {
            data = this.creatures.filter(o => o._id === id);
          }
        break;
        case "eldritch_invocation": 
          if (!this.eldritch_invocations) {
            await this.getObjects("eldritch_invocation");
          }
          if (this.eldritch_invocations) {
            data = this.eldritch_invocations.filter(o => o._id === id);
          }
        break;
        case "equipment_pack": 
          if (!this.equipment_packs) {
            await this.getObjects("equipment_pack");
          }
          if (this.equipment_packs) {
            data = this.equipment_packs.filter(o => o._id === id);
          }
        break;
        case "pact_boon": 
          if (!this.pact_boons) {
            await this.getObjects("pact_boon");
          }
          if (this.pact_boons) {
            data = this.pact_boons.filter(o => o._id === id);
          }
        break;
        case "feat": 
          if (!this.feats) {
            await this.getObjects("feat");
          }
          if (this.feats) {
            data = this.feats.filter(o => o._id === id);
          }
        break;
        case "game_class": 
          if (!this.game_classes) {
            await this.getObjects("game_class");
          }
          if (this.game_classes) {
            data = this.game_classes.filter(o => o._id === id);
          }
        break;
        case "magic_item": 
          if (!this.magic_items) {
            await this.getObjects("magic_item");
          }
          if (this.magic_items) {
            data = this.magic_items.filter(o => o._id === id);
          }
        break;
        case "magic_item_keyword":
          if (!this.magic_item_keywords) {
            await this.getObjects("magic_item_keyword");
          }
          if (this.magic_item_keywords) {
            data = this.magic_item_keywords.filter(o => o._id === id);
          }
        break;
        case "magic_item_template": 
        break;
        case "race": 
          if (!this.races) {
            await this.getObjects("race");
          }
          if (this.races) {
            data = this.races.filter(o => o._id === id);
          }
        break;
        case "subrace": 
          if (!this.subraces) {
            await this.getObjects("subrace");
          }
          if (this.subraces) {
            data = this.subraces.filter(o => o._id === id);
          }
        break;
        case "resource": 
          if (!this.resources) {
            await this.getObjects("resource");
          }
          if (this.resources) {
            data = this.resources.filter(o => o._id === id);
          }
        break;
        case "spell_slot_type": 
          if (!this.spell_slot_types) {
            await this.getObjects("spell_slot_type");
          }
          if (this.spell_slot_types) {
            data = this.spell_slot_types.filter(o => o._id === id);
          }
        break;
        case "subclass": 
          if (!this.subclasses) {
            await this.getObjects("subclass");
          }
          if (this.subclasses) {
            data = this.subclasses.filter(o => o._id === id);
          }
        break;
        case "user": 
          if (!this.users) {
            await this.getObjects("user");
          }
          if (this.users) {
            data = this.users.filter(o => o._id === id);
          }
        break;
        case "weapon_keyword": 
          if (!this.weapon_keywords) {
            await this.getObjects("weapon_keyword");
          }
          if (this.weapon_keywords) {
            data = this.weapon_keywords.filter(o => o._id === id);
          }
        break;
        case "template": 
          if (!this.template_bases) {
            await this.getObjects("template_base");
          }
          if (this.template_bases) {
            data = this.template_bases.filter(o => o._id === id);
          }
        break;
        case "language": 
          if (!this.languages) {
            await this.getObjects("language");
          }
          if (this.languages) {
            data = this.languages.filter(o => o._id === id);
          }
        break;
        case "special_feature": 
          if (!this.special_features) {
            await this.getObjects("special_feature");
          }
          if (this.special_features) {
            data = this.special_features.filter(o => o._id === id);
          }
        break;
        case "tool": 
          if (!this.tools) {
            await this.getObjects("tool");
          }
          if (this.tools) {
            data = this.tools.filter(o => o._id === id);
          }
        break;
        case "sense": 
          if (!this.senses) {
            await this.getObjects("sense");
          }
          if (this.senses) {
            data = this.senses.filter(o => o._id === id);
          }
        break;
        default:
          data = this.getSessionData(data_type);
        break;
      }
      if (data !== null) {
        return data;
      } else {
        return this.getObjectsFromAPI(data_type);
      }
    }
  };

  connectObject = async (obj: ModelBase) => {
    if (obj instanceof Character) {    
      const char = obj as Character;
      if (!char.race.race) {
        if (!this.races) {
          await this.getObjects("race");
        }
        if (this.races) {
          const obj_finder = this.races.filter(o => o._id === char.race.race_id);
          if (obj_finder.length === 1) {
            const race = obj_finder[0];
            if (!char.race.subrace) {
              char.race.connectRace(race);
            } else {
              if (!this.subraces) {
                await this.getObjects("subrace");
              }
              if (this.subraces) {
                const obj_finder2 = this.subraces.filter(o => char.race.subrace && o._id === char.race.subrace.subrace_id);
                if (obj_finder2.length === 1) {
                  char.race.connectRace(race, obj_finder2[0]);
                }
              }
            }
          }
        }
      }
      if (!char.background.background) {
        if (!this.backgrounds) {
          await this.getObjects("background");
        }
        if (this.backgrounds) {
          const obj_finder = this.backgrounds.filter(o => o._id === char.background.background_id);
          if (obj_finder.length === 1) {
            char.background.connectBackground(obj_finder[0]);
          }
        }
      }
    }
    return obj;
  }

  createObject = async (obj: ModelBase) => {
    if (this.real) {
      let data_type = obj.data_type;
      const response = await this.postData("/api/beyond/createObject", { data_type, obj: obj.toDBObj() });
      const res = await this.processResponse(response, data_type, null);
      if (res.id) {
        obj._id = res.id;
        switch(data_type) {
          case "spell":
            if (this.spells) {
              this.spells.push(obj as Spell);
            }
          break;
          case "skill":
            if (this.skills) {
              this.skills.push(obj as Skill);
            }
          break;
          case "condition":
            if (this.conditions) {
              this.conditions.push(obj as Condition);
            }
          break;
          case "spell_list": 
            if (this.spell_lists) {
              this.spell_lists.push(obj as SpellList);
            }
          break;
          case "armor_type": 
            if (this.armor_types) {
              this.armor_types.push(obj as ArmorType);
            } 
          break;
          case "background": 
            if (this.backgrounds) {
              this.backgrounds.push(obj as Background);
            }
          break;
          case "base_item": 
            if (this.base_items) {
              this.base_items.push(obj as BaseItem);
            }
          break;
          case "campaign":
            if (this.campaigns) {
              this.campaigns.push(obj as Campaign);
            }
          break;
          case "character": 
            if (this.characters) {
              this.characters.push(obj as Character);
            }
          break;
          case "creature": 
            if (this.creatures) {
              this.creatures.push(obj as Creature);
            }
          break;
          case "eldritch_invocation": 
            if (this.eldritch_invocations) {
              this.eldritch_invocations.push(obj as EldritchInvocation);
            }
          break;
          case "equipment_pack": 
            if (this.equipment_packs) {
              this.equipment_packs.push(obj as EquipmentPack);
            }
          break;
          case "pact_boon": 
            if (this.pact_boons) {
              this.pact_boons.push(obj as PactBoon);
            }
          break;
          case "feat": 
            if (this.feats) {
              this.feats.push(obj as Feat);
            }
          break;
          case "game_class": 
            if (this.game_classes) {
              this.game_classes.push(obj as GameClass);
            }
          break;
          case "magic_item": 
            if (this.magic_items) {
              this.magic_items.push(obj as MagicItem);
            }
          break;
          case "magic_item_keyword": 
            if (this.magic_item_keywords) {
              this.magic_item_keywords.push(obj as MagicItemKeyword);
            }
          break;
          case "magic_item_template": 
          break;
          case "race": 
            if (this.races) {
              this.races.push(obj as Race);
            }
          break;
          case "subrace": 
            if (this.subraces) {
              this.subraces.push(obj as Subrace);
            }
          break;
          case "resource":
            if (this.resources) {
              this.resources.push(obj as Resource);
            }
          break;
          case "spell_slot_type":
            if (this.spell_slot_types) {
              this.spell_slot_types.push(obj as SpellSlotType);
            }
          break;
          case "subclass":
            if (this.subclasses) {
              this.subclasses.push(obj as Subclass);
            }
          break;
          case "user":
            if (this.users) {
              this.users.push(obj as User);
            }
          break;
          case "weapon_keyword":
            if (this.weapon_keywords) {
              this.weapon_keywords.push(obj as WeaponKeyword);
            }
          break;
          case "template":
            if (this.template_bases) {
              const template: TemplateBase = obj as TemplateBase;
              if (template.type === "Ability") {
                this.template_bases.push(obj as AbilityTemplate);
              } else if (template.type === "SpellAsAbility") {
                this.template_bases.push(obj as SpellAsAbilityTemplate);
              } else if (template.type === "ItemAffectingAbility") {
                this.template_bases.push(obj as ItemAffectingAbilityTemplate);
              } else if (template.type === "Spell") {
                this.template_bases.push(obj as SpellTemplate);
              } else if (template.type === "FeatureBase") {
                this.template_bases.push(obj as FeatureBaseTemplate);
              } else if (template.type === "FeatureChoice") {
                this.template_bases.push(obj as FeatureChoiceTemplate);
              } else if (template.type === "Feature") {
                this.template_bases.push(obj as FeatureTemplate);
              } else if (template.type === "SummonStatBlock") {
                this.template_bases.push(obj as SummonStatBlockTemplate);
              }
            }
          break;
          case "language":
            if (this.languages) {
              this.languages.push(obj as Language);
            }
          break;
          case "special_feature":
            if (this.special_features) {
              this.special_features.push(obj as SpecialFeature);
            }
          break;
          case "tool":
            if (this.tools) {
              this.tools.push(obj as Tool);
            }
          break;
          case "sense":
            if (this.senses) {
              this.senses.push(obj as Sense);
            }
          break;
        }
      }
      return res;
    } else {
      return -1;
    }
  };

  deleteObject = async (obj: ModelBase) => {
    if (this.real) {
      const data_type = obj.data_type;
      const object_id = obj._id;
      const response = await this.deleteData("/api/beyond/deleteObject", { data_type, object_id });
      const res = await this.processResponse(response, data_type, null);
      if (res.message.includes("deleted!")) {
        switch(data_type) {
          case "spell":
            if (this.spells) {
              this.spells = this.spells.filter(o => o._id !== object_id);
            }
          break;
          case "skill":
            if (this.skills) {
              this.skills = this.skills.filter(o => o._id !== object_id);
            }
          break;
          case "condition":
            if (this.conditions) {
              this.conditions = this.conditions.filter(o => o._id !== object_id);
            }
          break;
          case "spell_list": 
            if (this.spell_lists) {
              this.spell_lists = this.spell_lists.filter(o => o._id !== object_id);
            }
          break;
          case "armor_type": 
            if (this.armor_types) {
              this.armor_types = this.armor_types.filter(o => o._id !== object_id);
            } 
          break;
          case "background": 
            if (this.backgrounds) {
              this.backgrounds = this.backgrounds.filter(o => o._id !== object_id);
            }
          break;
          case "base_item": 
            if (this.base_items) {
              this.base_items = this.base_items.filter(o => o._id !== object_id);
            }
          break;
          case "campaign":
            if (this.campaigns) {
              this.campaigns = this.campaigns.filter(o => o._id !== object_id);
            }
          break;
          case "character": 
            if (this.characters) {
              this.characters = this.characters.filter(o => o._id !== object_id);
            }
          break;
          case "creature": 
            if (this.creatures) {
              this.creatures = this.creatures.filter(o => o._id !== object_id);
            }
          break;
          case "eldritch_invocation": 
            if (this.eldritch_invocations) {
              this.eldritch_invocations = this.eldritch_invocations.filter(o => o._id !== object_id);
            }
          break;
          case "equipment_pack": 
            if (this.equipment_packs) {
              this.equipment_packs = this.equipment_packs.filter(o => o._id !== object_id);
            }
          break;
          case "pact_boon": 
            if (this.pact_boons) {
              this.pact_boons = this.pact_boons.filter(o => o._id !== object_id);
            }
          break;
          case "feat": 
            if (this.feats) {
              this.feats = this.feats.filter(o => o._id !== object_id);
            }
          break;
          case "game_class": 
            if (this.game_classes) {
              this.game_classes = this.game_classes.filter(o => o._id !== object_id);
            }
          break;
          case "magic_item": 
            if (this.magic_items) {
              this.magic_items = this.magic_items.filter(o => o._id !== object_id);
            }
          break;
          case "magic_item_keyword": 
            if (this.magic_item_keywords) {
              this.magic_item_keywords = this.magic_item_keywords.filter(o => o._id !== object_id);
            }
          break;
          case "magic_item_template":
          break;
          case "race": 
            if (this.races) {
              this.races = this.races.filter(o => o._id !== object_id);
            }
          break;
          case "subrace": 
            if (this.subraces) {
              this.subraces = this.subraces.filter(o => o._id !== object_id);
            }
          break;
          case "resource":
            if (this.resources) {
              this.resources = this.resources.filter(o => o._id !== object_id);
            }
          break;
          case "spell_slot_type":
            if (this.spell_slot_types) {
              this.spell_slot_types = this.spell_slot_types.filter(o => o._id !== object_id);
            }
          break;
          case "subclass":
            if (this.subclasses) {
              this.subclasses = this.subclasses.filter(o => o._id !== object_id);
            }
          break;
          case "user":
            if (this.users) {
              this.users = this.users.filter(o => o._id !== object_id);
            }
          break;
          case "weapon_keyword":
            if (this.weapon_keywords) {
              this.weapon_keywords = this.weapon_keywords.filter(o => o._id !== object_id);
            }
          break;
          case "template":
            if (this.template_bases) {
              this.template_bases = this.template_bases.filter(o => o._id !== object_id);
            }
          break;
          case "language":
            if (this.languages) {
              this.languages = this.languages.filter(o => o._id !== object_id);
            }
          break;
          case "special_feature":
            if (this.special_features) {
              this.special_features = this.special_features.filter(o => o._id !== object_id);
            }
          break;
          case "tool":
            if (this.tools) {
              this.tools = this.tools.filter(o => o._id !== object_id);
            }
          break;
          case "sense":
            if (this.senses) {
              this.senses = this.senses.filter(o => o._id !== object_id);
            }
          break;
        }
      }
      return res;
    } else {
      return "success";
    }
  };

  deleteObjects = async (objects: ModelBase[]) => {
    if (this.real) {
      const return_me: any[] = [];
      for (let i = 0; i < objects.length; i++) {
        const obj = objects[i];
        return_me.push(await this.deleteObject(obj));
      }
      return return_me;
    } else {
      return -1;
    }
  };

  updateObject = async (obj: ModelBase) => {
    if (this.real) {
      const data_type = obj.data_type;
      const response = await this.patchData("/api/beyond/updateObject", { data_type, obj: obj.toDBObj() });
      const res = await this.processResponse(response, data_type, null);
      if (res.message.includes("updated!")) {
        switch(data_type) {
          case "spell":
            if (this.spells) {
              const objects: Spell[] = this.spells;
              const objFinder = objects.filter(o => o._id === obj._id);
              if (objFinder.length === 1) {
                const updated = objFinder[0];
                updated.copy(obj as Spell);
                this.spells = objects;
              }
            }
          break;
          case "skill":
            if (this.skills) {
              const objects: Skill[] = this.skills;
              const objFinder = objects.filter(o => o._id === obj._id);
              if (objFinder.length === 1) {
                const updated = objFinder[0];
                updated.copy(obj as Skill);
                this.skills = objects;
              }
            }
          break;
          case "condition":
            if (this.conditions) {
              const objects: Condition[] = this.conditions;
              const objFinder = objects.filter(o => o._id === obj._id);
              if (objFinder.length === 1) {
                const updated = objFinder[0];
                updated.copy(obj as Condition);
                this.conditions = objects;
              }
            }
          break;
          case "spell_list": 
            if (this.spell_lists) {
              const objects: SpellList[] = this.spell_lists;
              const objFinder = objects.filter(o => o._id === obj._id);
              if (objFinder.length === 1) {
                const updated = objFinder[0];
                updated.copy(obj as SpellList);
                this.spell_lists = objects;
              }
            }
          break;
          case "armor_type": 
            if (this.armor_types) {
              const objects: ArmorType[] = this.armor_types;
              const objFinder = objects.filter(o => o._id === obj._id);
              if (objFinder.length === 1) {
                const updated = objFinder[0];
                updated.copy(obj as ArmorType);
                this.armor_types = objects;
              }
            } 
          break;
          case "background": 
            if (this.backgrounds) {
              const objects: Background[] = this.backgrounds;
              const objFinder = objects.filter(o => o._id === obj._id);
              if (objFinder.length === 1) {
                const updated = objFinder[0];
                updated.copy(obj as Background);
                this.backgrounds = objects;
              }
            }
          break;
          case "base_item": 
            if (this.base_items) {
              const objects: BaseItem[] = this.base_items;
              const objFinder = objects.filter(o => o._id === obj._id);
              if (objFinder.length === 1) {
                const updated = objFinder[0];
                updated.copy(obj as BaseItem);
                this.base_items = objects;
              }
            }
          break;
          case "campaign":
            if (this.campaigns) {
              const objects: Campaign[] = this.campaigns;
              const objFinder = objects.filter(o => o._id === obj._id);
              if (objFinder.length === 1) {
                const updated = objFinder[0];
                updated.copy(obj as Campaign);
                this.campaigns = objects;
              }
            }
          break;
          case "character": 
            if (this.characters) {
              const objects: Character[] = this.characters;
              const objFinder = objects.filter(o => o._id === obj._id);
              if (objFinder.length === 1) {
                const updated = objFinder[0];
                updated.copy(obj as Character);
                this.characters = objects;
              }
            }
          break;
          case "creature": 
            if (this.creatures) {
              const objects: Creature[] = this.creatures;
              const objFinder = objects.filter(o => o._id === obj._id);
              if (objFinder.length === 1) {
                const updated = objFinder[0];
                updated.copy(obj as Creature);
                this.creatures = objects;
              }
            }
          break;
          case "eldritch_invocation": 
            if (this.eldritch_invocations) {
              const objects: EldritchInvocation[] = this.eldritch_invocations;
              const objFinder = objects.filter(o => o._id === obj._id);
              if (objFinder.length === 1) {
                const updated = objFinder[0];
                updated.copy(obj as EldritchInvocation);
                this.eldritch_invocations = objects;
              }
            }
          break;
          case "equipment_pack": 
            if (this.equipment_packs) {
              const objects: EquipmentPack[] = this.equipment_packs;
              const objFinder = objects.filter(o => o._id === obj._id);
              if (objFinder.length === 1) {
                const updated = objFinder[0];
                updated.copy(obj as EquipmentPack);
                this.equipment_packs = objects;
              }
            }
          break;
          case "pact_boon": 
            if (this.pact_boons) {
              const objects: PactBoon[] = this.pact_boons;
              const objFinder = objects.filter(o => o._id === obj._id);
              if (objFinder.length === 1) {
                const updated = objFinder[0];
                updated.copy(obj as PactBoon);
                this.pact_boons = objects;
              }
            }
          break;
          case "feat": 
            if (this.feats) {
              const objects: Feat[] = this.feats;
              const objFinder = objects.filter(o => o._id === obj._id);
              if (objFinder.length === 1) {
                const updated = objFinder[0];
                updated.copy(obj as Feat);
                this.feats = objects;
              }
            }
          break;
          case "game_class": 
            if (this.game_classes) {
              const objects: GameClass[] = this.game_classes;
              const objFinder = objects.filter(o => o._id === obj._id);
              if (objFinder.length === 1) {
                const updated = objFinder[0];
                updated.copy(obj as GameClass);
                this.game_classes = objects;
              }
            }
          break;
          case "magic_item": 
            if (this.magic_items) {
              const objects: MagicItem[] = this.magic_items;
              const objFinder = objects.filter(o => o._id === obj._id);
              if (objFinder.length === 1) {
                const updated = objFinder[0];
                updated.copy(obj as MagicItem);
                this.magic_items = objects;
              }
            }
          break;
          case "magic_item_keyword": 
            if (this.magic_item_keywords) {
              const objects: MagicItemKeyword[] = this.magic_item_keywords;
              const objFinder = objects.filter(o => o._id === obj._id);
              if (objFinder.length === 1) {
                const updated = objFinder[0];
                updated.copy(obj as MagicItemKeyword);
                this.magic_item_keywords = objects;
              }
            }
          break;
          case "magic_item_template": 
          break;
          case "race": 
            if (this.races) {
              const objects: Race[] = this.races;
              const objFinder = objects.filter(o => o._id === obj._id);
              if (objFinder.length === 1) {
                const updated = objFinder[0];
                updated.copy(obj as Race);
                this.races = objects;
              }
            }
          break;
          case "subrace": 
            if (this.subraces) {
              const objects: Subrace[] = this.subraces;
              const objFinder = objects.filter(o => o._id === obj._id);
              if (objFinder.length === 1) {
                const updated = objFinder[0];
                updated.copy(obj as Subrace);
                this.subraces = objects;
              }
            }
          break;
          case "resource":
            if (this.resources) {
              const objects: Resource[] = this.resources;
              const objFinder = objects.filter(o => o._id === obj._id);
              if (objFinder.length === 1) {
                const updated = objFinder[0];
                updated.copy(obj as Resource);
                this.resources = objects;
              }
            }
          break;
          case "spell_slot_type":
            if (this.spell_slot_types) {
              const objects: SpellSlotType[] = this.spell_slot_types;
              const objFinder = objects.filter(o => o._id === obj._id);
              if (objFinder.length === 1) {
                const updated = objFinder[0];
                updated.copy(obj as SpellSlotType);
                this.spell_slot_types = objects;
              }
            }
          break;
          case "subclass":
            if (this.subclasses) {
              const objects: Subclass[] = this.subclasses;
              const objFinder = objects.filter(o => o._id === obj._id);
              if (objFinder.length === 1) {
                const updated = objFinder[0];
                updated.copy(obj as Subclass);
                this.subclasses = objects;
              }
            }
          break;
          case "user":
            if (this.users) {
              const objects: User[] = this.users;
              const objFinder = objects.filter(o => o._id === obj._id);
              if (objFinder.length === 1) {
                const updated = objFinder[0];
                updated.copy(obj as User);
                this.users = objects;
              }
            }
          break;
          case "weapon_keyword":
            if (this.weapon_keywords) {
              const objects: WeaponKeyword[] = this.weapon_keywords;
              const objFinder = objects.filter(o => o._id === obj._id);
              if (objFinder.length === 1) {
                const updated = objFinder[0];
                updated.copy(obj as WeaponKeyword);
                this.weapon_keywords = objects;
              }
            }
          break;
          case "template":
            if (this.template_bases) {
              const objects: TemplateBase[] = this.template_bases;
              const objFinder = objects.filter(o => o._id === obj._id);
              if (objFinder.length === 1) {
                const updated = objFinder[0];
                if (updated.type === "Ability") {
                  updated.copy(obj as AbilityTemplate);
                } else if (updated.type === "SpellAsAbility") {
                  updated.copy(obj as SpellAsAbilityTemplate);
                } else if (updated.type === "ItemAffectingAbility") {
                  updated.copy(obj as ItemAffectingAbilityTemplate);
                } else if (updated.type === "Spell") {
                  updated.copy(obj as SpellTemplate);
                } else if (updated.type === "FeatureBase") {
                  updated.copy(obj as FeatureBaseTemplate);
                } else if (updated.type === "FeatureChoice") {
                  updated.copy(obj as FeatureChoiceTemplate);
                } else if (updated.type === "Feature") {
                  updated.copy(obj as FeatureTemplate);
                } else if (updated.type === "SummonStatBlock") {
                  updated.copy(obj as SummonStatBlockTemplate);
                }
                this.template_bases = objects;
              }
            }
          break;
          case "language":
            if (this.languages) {
              const objects: Language[] = this.languages;
              const objFinder = objects.filter(o => o._id === obj._id);
              if (objFinder.length === 1) {
                const updated = objFinder[0];
                updated.copy(obj as Language);
                this.languages = objects;
              }
            }
          break;
          case "special_feature":
            if (this.special_features) {
              const objects: SpecialFeature[] = this.special_features;
              const objFinder = objects.filter(o => o._id === obj._id);
              if (objFinder.length === 1) {
                const updated = objFinder[0];
                updated.copy(obj as SpecialFeature);
                this.special_features = objects;
              }
            }
          break;
          case "tool":
            if (this.tools) {
              const objects: Tool[] = this.tools;
              const objFinder = objects.filter(o => o._id === obj._id);
              if (objFinder.length === 1) {
                const updated = objFinder[0];
                updated.copy(obj as Tool);
                this.tools = objects;
              }
            }
          break;
          case "sense":
            if (this.senses) {
              const objects: Sense[] = this.senses;
              const objFinder = objects.filter(o => o._id === obj._id);
              if (objFinder.length === 1) {
                const updated = objFinder[0];
                updated.copy(obj as Sense);
                this.senses = objects;
              }
            }
          break;
        }
      }
      return res;
    } else {
      return "success";
    }
  };

  upsertObject = async (obj: ModelBase) => {
    if (this.real) {
      if (obj._id && obj._id !== "") {
        this.updateObject(obj).then((res: any) => {
          return res;
        });
      } else {
        this.createObject(obj).then((res: any) => {
          return res;
        });
      }
    } else {
      return -1;
    }
  };

  upsertObjects = async (objects: ModelBase[]) => {
    if (this.real) {
      const return_me: any[] = [];
      for (let i = 0; i < objects.length; i++) {
        const obj = objects[i];
        return_me.push(await this.upsertObject(obj));
      }
      return return_me;
    } else {
      return -1;
    }
  };

  // Core API Calls
  fetchData = async (path: string, options: any = {}) => {
    return await fetch(`${path}`, {
      mode: "cors",
      credentials: "include",
      ...options,
      headers: {
        Accept: "application/json",
        ...options.headers
      }
    })
      .then(this.checkStatus)
      .catch(this.logErrorReason);
  };

  postData = async (path: string, data: any, options: any = {}) => {
    return await fetch(`${path}`, {
      mode: "cors",
      credentials: "include",
      ...options,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...options.headers
      },
      method: "POST",
      body: JSON.stringify(data)
    })
      .then(this.checkStatus)
      .catch(this.logErrorReason);
  };

  putData = async (path: string, data: any, options: any = {}) => {
    return await fetch(`${path}`, {
      mode: "cors",
      credentials: "include",
      ...options,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...options.headers
      },
      method: "PUT",
      body: JSON.stringify(data)
    })
      .then(this.checkStatus)
      .catch(this.logErrorReason);
  };

  patchData = async (path: string, data: any, options: any = {}) => {
    return await fetch(`${path}`, {
      mode: "cors",
      credentials: "include",
      ...options,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...options.headers
      },
      method: "PATCH",
      body: JSON.stringify(data)
    })
      .then(this.checkStatus)
      .catch(this.logErrorReason);
  };

  deleteData = async (path: string, data: any, options: any = {}) => {
    return await fetch(`${path}`, {
      mode: "cors",
      credentials: "include",
      ...options,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...options.headers
      },
      method: "DELETE",
      body: JSON.stringify(data)
    })
      .then(this.checkStatus)
      .catch(this.logErrorReason);
  };

  processResponse = async (response: any, data_type: string, retry: Function | null = null, sessionName: string | null = null, noExpiry: boolean = false) => {
    const body = await response.json();
    if (response.status !== 200) { 
      throw Error(body.message);
    } else if (body.error !== undefined && retry) {
      return retry();
    } else {
      let response: any = body;
      if (body.objects) {
        switch(data_type) {
          case "spell":
            const spells: Spell[] = [];
            body.objects.forEach((o: any) => {
              spells.push(new Spell(o));
            });
            this.spells = spells;
            response = spells;
          break;
          case "skill":
            const skills: Skill[] = [];
            body.objects.forEach((o: any) => {
              skills.push(new Skill(o));
            });
            this.skills = skills;
            response = skills;
          break;
          case "condition":
            const conditions: Condition[] = [];
            body.objects.forEach((o: any) => {
              conditions.push(new Condition(o));
            });
            this.conditions = conditions;
            response = conditions;
          break;
          case "spell_list": 
            const spell_lists: SpellList[] = [];
            body.objects.forEach((o: any) => {
              spell_lists.push(new SpellList(o));
            });
            this.spell_lists = spell_lists;
            response = spell_lists;
          break;
          case "armor_type": 
            const armor_types: ArmorType[] = [];
            body.objects.forEach((o: any) => {
              armor_types.push(new ArmorType(o));
            });
            this.armor_types = armor_types;
            response = armor_types;
          break;
          case "background": 
            const backgrounds: Background[] = [];
            body.objects.forEach((o: any) => {
              backgrounds.push(new Background(o));
            });
            this.backgrounds = backgrounds;
            response = backgrounds;
          break;
          case "base_item": 
            const base_items: BaseItem[] = [];
            body.objects.forEach((o: any) => {
              base_items.push(new BaseItem(o));
            });
            this.base_items = base_items;
            if (!this.armor_types) {
              await this.getObjects("armor_type");
            }
            if (!this.weapon_keywords) {
              await this.getObjects("weapon_keyword");
            }
            this.base_items.filter(item => item.item_type === "Armor" && item.armor_type_name === "").forEach(item => {
              if (this.armor_types) {
                const obj_finder = this.armor_types.filter(o => o._id === item.armor_type_id);
                if (obj_finder.length === 1) {
                  item.armor_type_name = obj_finder[0].name;
                }
              }
            });
            this.base_items.filter(item => item.item_type === "Weapon" && item.weapon_keyword_names.length === 0).forEach(item => {
              if (this.weapon_keywords) {
                const obj_finder = this.weapon_keywords.filter(o => item.weapon_keyword_ids.includes(o._id) && o.display_in_equipment);
                obj_finder.forEach(kw => {
                  item.weapon_keyword_names.push(kw.name);
                });
              }
            });
            response = base_items;
          break;
          case "campaign": 
            const campaigns: Campaign[] = [];
            body.objects.forEach((o: any) => {
              campaigns.push(new Campaign(o));
            });
            this.campaigns = campaigns;
            response = campaigns;
          break;
          case "character": 
            const characters: Character[] = [];
            body.objects.forEach((o: any) => {
              characters.push(new Character(o));
            });
            this.characters = characters;
            response = characters;
          break;
          case "creature": 
            const creatures: Creature[] = [];
            body.objects.forEach((o: any) => {
              creatures.push(new Creature(o));
            });
            this.creatures = creatures;
            response = creatures;
          break;
          case "eldritch_invocation": 
            const eldritch_invocations: EldritchInvocation[] = [];
            body.objects.forEach((o: any) => {
              eldritch_invocations.push(new EldritchInvocation(o));
            });
            this.eldritch_invocations = eldritch_invocations;
            response = eldritch_invocations;
          break;
          case "equipment_pack": 
            const equipment_packs: EquipmentPack[] = [];
            body.objects.forEach((o: any) => {
              equipment_packs.push(new EquipmentPack(o));
            });
            this.equipment_packs = equipment_packs;
            response = equipment_packs;
          break;
          case "pact_boon": 
            const pact_boons: PactBoon[] = [];
            body.objects.forEach((o: any) => {
              pact_boons.push(new PactBoon(o));
            });
            this.pact_boons = pact_boons;
            response = pact_boons;
          break;
          case "feat": 
            const feats: Feat[] = [];
            body.objects.forEach((o: any) => {
              feats.push(new Feat(o));
            });
            this.feats = feats;
            response = feats;
          break;
          case "game_class": 
            const game_classes: GameClass[] = [];
            body.objects.forEach((o: any) => {
              game_classes.push(new GameClass(o));
            });
            this.game_classes = game_classes;
            response = game_classes;
          break;
          case "magic_item": 
            const magic_items: MagicItem[] = [];
            body.objects.forEach((o: any) => {
              magic_items.push(new MagicItem(o));
            });
            this.magic_items = magic_items;
            if (!this.base_items) {
              await this.getObjects("base_item");
            }
            this.magic_items.filter(item => !item.base_item).forEach(item => {
              if (this.base_items) {
                const obj_finder = this.base_items.filter(o => o._id === item.base_item_id);
                if (obj_finder.length === 1) {
                  item.base_item = obj_finder[0];
                }
              }
            });
            response = magic_items;
          break;
          case "magic_item_keyword": 
            const magic_item_keywords: MagicItemKeyword[] = [];
            body.objects.forEach((o: any) => {
              magic_item_keywords.push(new MagicItemKeyword(o));
            });
            this.magic_item_keywords = magic_item_keywords;
            response = magic_item_keywords;
          break;
          case "magic_item_template": 
          break;
          case "race": 
            const races: Race[] = [];
            body.objects.forEach((o: any) => {
              races.push(new Race(o));
            });
            this.races = races;
            if (!this.subraces) {
              await this.getObjects("subrace");
            }
            this.races.filter(race => race.subraces.length === 0).forEach(race => {
              if (this.subraces) {
                const obj_finder = this.subraces.filter(o => o.race_id === race._id);
                obj_finder.forEach(sub => {
                  race.subraces.push(sub);
                });
              }
            });
            response = races;
          break;
          case "subrace": 
            const subraces: Subrace[] = [];
            body.objects.forEach((o: any) => {
              subraces.push(new Subrace(o));
            });
            this.subraces = subraces;
            response = subraces;
          break;
          case "resource": 
            const resources: Resource[] = [];
            body.objects.forEach((o: any) => {
              resources.push(new Resource(o));
            });
            this.resources = resources;
            response = resources;
          break;
          case "spell_slot_type": 
            const spell_slot_types: SpellSlotType[] = [];
            body.objects.forEach((o: any) => {
              spell_slot_types.push(new SpellSlotType(o));
            });
            this.spell_slot_types = spell_slot_types;
            response = spell_slot_types;
          break;
          case "subclass": 
            const subclasses: Subclass[] = [];
            body.objects.forEach((o: any) => {
              subclasses.push(new Subclass(o));
            });
            this.subclasses = subclasses;
            response = subclasses;
          break;
          case "user": 
            const users: User[] = [];
            body.objects.forEach((o: any) => {
              users.push(new User(o));
            });
            this.users = users;
            response = users;
          break;
          case "weapon_keyword": 
            const weapon_keywords: WeaponKeyword[] = [];
            body.objects.forEach((o: any) => {
              weapon_keywords.push(new WeaponKeyword(o));
            });
            this.weapon_keywords = weapon_keywords;
            response = weapon_keywords;
          break;
          case "template": 
            const template_bases: TemplateBase[] = [];
            body.objects.forEach((o: any) => {
              switch (o.type) {
                case "Ability":
                  template_bases.push(new AbilityTemplate(o));
                  break;
                case "SpellAsAbility":
                  template_bases.push(new SpellAsAbilityTemplate(o));
                  break;
                case "ItemAffectingAbility":
                  template_bases.push(new ItemAffectingAbilityTemplate(o));
                  break;
                case "Spell":
                  template_bases.push(new SpellTemplate(o));
                  break;
                case "Feature":
                  template_bases.push(new FeatureTemplate(o));
                  break;
                case "FeatureBase":
                  template_bases.push(new FeatureBaseTemplate(o));
                  break;
                case "FeatureChoice":
                  template_bases.push(new FeatureChoiceTemplate(o));
                  break;
                case "SummonStatBlock":
                  template_bases.push(new SummonStatBlockTemplate(o));
                break;
                case "MagicItem":
                break;
              }
            });
            this.template_bases = template_bases;
            response = template_bases;
          break;
          case "language": 
            const languages: Language[] = [];
            body.objects.forEach((o: any) => {
              languages.push(new Language(o));
            });
            this.languages = languages;
            response = languages;
          break;
          case "special_feature": 
            const special_features: SpecialFeature[] = [];
            body.objects.forEach((o: any) => {
              special_features.push(new SpecialFeature(o));
            });
            this.special_features = special_features;
            response = special_features;
          break;
          case "tool": 
            const tools: Tool[] = [];
            body.objects.forEach((o: any) => {
              tools.push(new Tool(o));
            });
            this.tools = tools;
            response = tools;
          break;
          case "sense": 
            const senses: Sense[] = [];
            body.objects.forEach((o: any) => {
              senses.push(new Sense(o));
            });
            this.senses = senses;
            response = senses;
          break;
        }
      }
      if (sessionName !== null) {
        let expiresAt: string | Date = new Date();
        if (noExpiry) 
          expiresAt = "never";
        else 
          expiresAt.setHours(expiresAt.getHours() + 1);
        const sessionObj: any = {
          expiresAt
        };
        sessionObj[data_type] = response;
        sessionStorage.setItem(sessionName, JSON.stringify(sessionObj));
      }
      return response;
    };
  };

  getSessionData = (sessionName: string) => {
    const sessionStr = sessionStorage.getItem(sessionName);
    if (sessionStr !== null) {
      const sessionObj = JSON.parse(sessionStr);
      if (sessionObj.expiresAt !== undefined && 
        (sessionObj.expiresAt === "never" || new Date(sessionObj.expiresAt) > new Date())) {
        return sessionObj.response;
      }
    }
    return null;
  };

  // 5e API Calls
  get5eObjects = async (data_type: string, refresh = false) => {
    if (refresh) {
      return this.get5eObjectsFromAPI(data_type);
    }
    else {
      const data = this.get5eSessionData(data_type);
      if (data !== null) {
        return data;
      }
      else {
        return this.get5eObjectsFromAPI(data_type);
      }
    }
  };
  get5eObjectsFromAPI = async (data_type: string) => {
    if (this.real) {
      const response = await this.fetch5eData(
        `https://www.dnd5eapi.co/api/${data_type}`
      );
      const data = await this.process5eResponse(response, data_type, null, data_type);
      return data;
    } else {
      return [{ _id: -1, vttID: -1, Name: "Alice" }];
    }
  };
  get5eObjectFromAPI = async (url: string) => {
    const response = await this.fetch5eData(
      `https://www.dnd5eapi.co${url}`
    );
    const data = await this.process5eResponse(response);
    return data;
  };
  fetch5eData = async (path: string, options: any = {}) => {
    return await fetch(`${path}`, {
      mode: "cors",
      ...options,
      headers: {
        Accept: "application/json",
        ...options.headers
      }
    })
      .then(this.checkStatus)
      .catch(this.logErrorReason);
  };
  process5eResponse = async (response: any, data_type: string | null = null, retry: Function | null = null, sessionName: string | null = null, noExpiry: boolean = false) => {
    const body = await response.json();
    if (response.status !== 200) { 
      throw Error(body.message);
    } else if (body.error !== undefined && retry) {
      return retry();
    } else if (data_type) {
      let response: any = body;
      if (sessionName !== null) {
        let expiresAt: string | Date = new Date();
        if (noExpiry) 
          expiresAt = "never";
        else 
          expiresAt.setHours(expiresAt.getHours() + 1);
        const sessionObj: any = {
          expiresAt
        };
        sessionObj[data_type] = response;
        sessionStorage.setItem(sessionName, JSON.stringify(sessionObj));
      }
      return response;
    } else {
      return body;
    }
  };
  get5eSessionData = (sessionName: string) => {
    const sessionStr = sessionStorage.getItem(`5e_${sessionName}`);
    if (sessionStr !== null) {
      const sessionObj = JSON.parse(sessionStr);
      if (sessionObj.expiresAt !== undefined && 
        (sessionObj.expiresAt === "never" || sessionObj.expiresAt > new Date())) {
        return sessionObj.body;
      }
    }
    return null;
  };
}
