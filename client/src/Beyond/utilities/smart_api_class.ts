
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
  FightingStyle,
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
  ModelBase,
  SmartHash
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
  smart_hash: SmartHash;
  
  constructor() {
    this.real = true;
    this.smart_hash = {};
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
  getObjects = async (data_type: string, filter: any = {}, skip: number = 0, take: number = -1, refresh = false) => {
    if (refresh) {
      return this.getObjectsFromAPI(data_type, filter, skip, take);
    } else {
      if (this.smart_hash[data_type]) {
        return this.smart_hash[data_type];
      } else {
        return this.getObjectsFromAPI(data_type, filter, skip, take);
      }
    }
  };
  getObjectsFromAPI = async (data_type: string, filter: any = {}, skip: number = 0, take: number = -1) => {
    if (this.real) {
      const response = await this.postData(
        `/api/beyond/getObjects/${data_type}`, { filter, skip, take }
      );
      const data = await this.processResponse(response, data_type, null, data_type);
      return data;
    } else {
      return [{ _id: -1, vttID: -1, Name: "Alice" }];
    }
  };
  getObjectFromAPI = async (data_type: string, id: string) => {
    if (this.real) {
      const response = await this.fetchData(
        `/api/beyond/getObject/${data_type}/${id}`
      );
      const data = await this.processResponse(response, data_type, null, data_type);
      if (data.length === 1) {
        return data[0];
      }
      return null;
    } else {
      return { _id: -1, vttID: -1, Name: "Alice" };
    }
  };
  getFullObject = async (data_type: string, id: string, refresh = false) => {
    if (refresh) {
      let obj = await this.getObjectFromAPI(data_type, id);
      if (obj) {
        return this.connectObject(obj);
      }
      return null;
    } else {
      const data: ModelBase[] = this.smart_hash[data_type];
      
      if (data) {
        const objects = data.filter(o => o._id === id);
        if (objects.length === 1) {
          let obj = objects[0];
          return this.connectObject(obj);
        } else {
          let obj = await this.getObjectFromAPI(data_type, id);
          if (obj) {
            return this.connectObject(obj);
          }
          return null;
        }
      } else {
        let obj = await this.getObjectFromAPI(data_type, id);
        if (obj) {
          return this.connectObject(obj);
        }
        return null;
      }
    }
  };
  getObjectCount = async (data_type: string, filter: any = {}) => {
    if (this.real) {
      const response = await this.postData(
        `/api/beyond/getObjectCount/${data_type}`, { filter }
      );
      const data = await this.processResponse(response, data_type, null, data_type);
      return data;
    } else {
      return [{ _id: -1, vttID: -1, Name: "Alice" }];
    }
  };

  connectObject = async (obj: ModelBase) => {
    if (obj instanceof Character) {    
      const char = obj as Character;
      if (!char.race.race) {
        if (!this.smart_hash.race) {
          await this.getObjects("race");
        }
        const obj_finder = this.smart_hash.race.filter(o => o._id === char.race.race_id);
        if (obj_finder.length === 1) {
          const race = obj_finder[0];
          if (!char.race.subrace) {
            char.race.connectRace(race as Race);
          } else {
            if (!this.smart_hash.subrace) {
              await this.getObjects("subrace");
            }
            const obj_finder2 = this.smart_hash.subrace.filter(o => char.race.subrace && o._id === char.race.subrace.subrace_id);
            if (obj_finder2.length === 1) {
              char.race.connectRace(race as Race, obj_finder2[0] as Subrace);
            }
          }
        }
      }
      if (!char.background.background) {
        if (!this.smart_hash.background) {
          await this.getObjects("background");
        }
        const obj_finder = this.smart_hash.background.filter(o => o._id === char.background.background_id);
        if (obj_finder.length === 1) {
          char.background.connectBackground(obj_finder[0] as Background);
        }
      }
    }
    return obj;
  };

  createObject = async (obj: ModelBase) => {
    if (this.real) {
      let data_type = this.get_data_type(typeof obj);
      const response = await this.postData("/api/beyond/createObject", { data_type, obj: obj.toDBObj() });
      const res = await this.processResponse(response, data_type, null);
      if (res.id) {
        obj._id = res.id;
        if (!this.smart_hash[data_type]) {
          this.smart_hash[data_type] = [];
        }
        switch(data_type) {
          case "spell":
            this.smart_hash[data_type].push(obj as Spell);
          break;
          case "skill":
            this.smart_hash[data_type].push(obj as Skill);
          break;
          case "condition":
            this.smart_hash[data_type].push(obj as Condition);
          break;
          case "spell_list": 
            this.smart_hash[data_type].push(obj as SpellList);
          break;
          case "armor_type": 
            this.smart_hash[data_type].push(obj as ArmorType);
          break;
          case "background": 
            this.smart_hash[data_type].push(obj as Background);
          break;
          case "base_item": 
            this.smart_hash[data_type].push(obj as BaseItem);
          break;
          case "campaign":
            this.smart_hash[data_type].push(obj as Campaign);
          break;
          case "character": 
            this.smart_hash[data_type].push(obj as Character);
          break;
          case "creature": 
            this.smart_hash[data_type].push(obj as Creature);
          break;
          case "eldritch_invocation": 
            this.smart_hash[data_type].push(obj as EldritchInvocation);
          break;
          case "fighting_style": 
            this.smart_hash[data_type].push(obj as FightingStyle);
          break;
          case "equipment_pack": 
            this.smart_hash[data_type].push(obj as EquipmentPack);
          break;
          case "pact_boon": 
            this.smart_hash[data_type].push(obj as PactBoon);
          break;
          case "feat": 
            this.smart_hash[data_type].push(obj as Feat);
          break;
          case "game_class": 
            this.smart_hash[data_type].push(obj as GameClass);
          break;
          case "magic_item": 
            this.smart_hash[data_type].push(obj as MagicItem);
          break;
          case "magic_item_keyword": 
            this.smart_hash[data_type].push(obj as MagicItemKeyword);
          break;
          case "magic_item_template": 
          break;
          case "race": 
            this.smart_hash[data_type].push(obj as Race);
          break;
          case "subrace": 
            this.smart_hash[data_type].push(obj as Subrace);
          break;
          case "resource":
            this.smart_hash[data_type].push(obj as Resource);
          break;
          case "spell_slot_type":
            this.smart_hash[data_type].push(obj as SpellSlotType);
          break;
          case "subclass":
            this.smart_hash[data_type].push(obj as Subclass);
          break;
          case "user":
            this.smart_hash[data_type].push(obj as User);
          break;
          case "weapon_keyword":
            this.smart_hash[data_type].push(obj as WeaponKeyword);
          break;
          case "template":
            const template: TemplateBase = obj as TemplateBase;
            if (template.type === "Ability") {
              this.smart_hash[data_type].push(obj as AbilityTemplate);
            } else if (template.type === "SpellAsAbility") {
              this.smart_hash[data_type].push(obj as SpellAsAbilityTemplate);
            } else if (template.type === "ItemAffectingAbility") {
              this.smart_hash[data_type].push(obj as ItemAffectingAbilityTemplate);
            } else if (template.type === "Spell") {
              this.smart_hash[data_type].push(obj as SpellTemplate);
            } else if (template.type === "FeatureBase") {
              this.smart_hash[data_type].push(obj as FeatureBaseTemplate);
            } else if (template.type === "FeatureChoice") {
              this.smart_hash[data_type].push(obj as FeatureChoiceTemplate);
            } else if (template.type === "Feature") {
              this.smart_hash[data_type].push(obj as FeatureTemplate);
            } else if (template.type === "SummonStatBlock") {
              this.smart_hash[data_type].push(obj as SummonStatBlockTemplate);
            }
          break;
          case "language":
            this.smart_hash[data_type].push(obj as Language);
          break;
          case "special_feature":
            this.smart_hash[data_type].push(obj as SpecialFeature);
          break;
          case "tool":
            this.smart_hash[data_type].push(obj as Tool);
          break;
          case "sense":
            this.smart_hash[data_type].push(obj as Sense);
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
      const data_type = this.get_data_type(typeof obj);
      const object_id = obj._id;
      const response = await this.deleteData("/api/beyond/deleteObject", { data_type, object_id });
      const res = await this.processResponse(response, data_type, null);
      if (res.message.includes("deleted!") && this.smart_hash[data_type]) {
        this.smart_hash[data_type] = this.smart_hash[data_type].filter(o => o._id !== object_id);
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
      const data_type = this.get_data_type(typeof obj);
      const response = await this.patchData("/api/beyond/updateObject", { data_type, obj: obj.toDBObj() });
      const res = await this.processResponse(response, data_type, null);
      if (res.message.includes("updated!") && this.smart_hash[data_type]) {
        const objects = this.smart_hash[data_type];
        const objFinder = objects.filter(o => o._id === obj._id);
        if (objFinder.length === 1) {
          const updated = objFinder[0];
          updated.copy(obj);
          this.smart_hash[data_type] = objects;
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
        const res = await this.updateObject(obj);
        return res;
      } else {
        const res = await this.createObject(obj);
        return res;
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

  get_data_type(class_name: string) {
    const template_types = ["AbilityTemplate","SpellAsAbilityTemplate","ItemAffectingAbilityTemplate","SummonStatBlockTemplate","FeatureBaseTemplate","FeatureChoiceTemplate","FeatureTemplate","MagicItemTemplate","SpellTemplate","TemplateBase","template"];
    if (template_types.includes(class_name)) {
      return "template";
    } else {
      let data_type = "";
      for (let i = 0; i < class_name.length; ++i) {
        const char = class_name[i];
        if (this.isUpper(char)) {
          data_type += "_";
        }
        data_type += char.toLowerCase();
      }
      return data_type;
    }
  }

  always_store(data_type: string) {
    const dont_store = ["spell","creature","baseItem","magic_item"];
    return !dont_store.includes(data_type);
  }

  isUpper(str: string) {
    return !/[a-z]/.test(str) && /[A-Z]/.test(str);
  }

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
            response = spells;
          break;
          case "skill":
            const skills: Skill[] = [];
            body.objects.forEach((o: any) => {
              skills.push(new Skill(o));
            });
            response = skills;
          break;
          case "condition":
            const conditions: Condition[] = [];
            body.objects.forEach((o: any) => {
              conditions.push(new Condition(o));
            });
            response = conditions;
          break;
          case "spell_list": 
            const spell_lists: SpellList[] = [];
            body.objects.forEach((o: any) => {
              spell_lists.push(new SpellList(o));
            });
            response = spell_lists;
          break;
          case "armor_type": 
            const armor_types: ArmorType[] = [];
            body.objects.forEach((o: any) => {
              armor_types.push(new ArmorType(o));
            });
            response = armor_types;
          break;
          case "background": 
            const backgrounds: Background[] = [];
            body.objects.forEach((o: any) => {
              backgrounds.push(new Background(o));
            });
            response = backgrounds;
          break;
          case "base_item": 
            const base_items: BaseItem[] = [];
            body.objects.forEach((o: any) => {
              base_items.push(new BaseItem(o));
            });
            if (!this.smart_hash.armor_type) {
              await this.getObjects("armor_type");
            }
            if (!this.smart_hash.weapon_keyword) {
              await this.getObjects("weapon_keyword");
            }
            base_items.forEach(base => {
              const item = base as BaseItem;
              if (item.item_type === "Armor" && item.armor_type_name === "") {
                if (this.smart_hash.armor_type) {
                  const obj_finder = this.smart_hash.armor_type.filter(o => o._id === item.armor_type_id);
                  if (obj_finder.length === 1) {
                    item.armor_type_name = obj_finder[0].name;
                  }
                }
              } else if (item.item_type === "Weapon" && item.weapon_keyword_names.length === 0) {
                if (this.smart_hash.weapon_keyword) {
                  const obj_finder = this.smart_hash.weapon_keyword.filter(o => item.weapon_keyword_ids.includes(o._id));
                  obj_finder.forEach(mb => {
                    const kw = mb as WeaponKeyword;
                    if (kw.display_in_equipment) {
                      item.weapon_keyword_names.push(kw.name);
                    }
                  });
                }
              }
            });
            response = base_items;
          break;
          case "campaign": 
            const campaigns: Campaign[] = [];
            body.objects.forEach((o: any) => {
              campaigns.push(new Campaign(o));
            });
            response = campaigns;
          break;
          case "character": 
            const characters: Character[] = [];
            body.objects.forEach((o: any) => {
              characters.push(new Character(o));
            });
            response = characters;
          break;
          case "creature": 
            const creatures: Creature[] = [];
            body.objects.forEach((o: any) => {
              creatures.push(new Creature(o));
            });
            response = creatures;
          break;
          case "eldritch_invocation": 
            const eldritch_invocations: EldritchInvocation[] = [];
            body.objects.forEach((o: any) => {
              eldritch_invocations.push(new EldritchInvocation(o));
            });
            response = eldritch_invocations;
          break;
          case "fighting_style": 
            const fighting_styles: FightingStyle[] = [];
            body.objects.forEach((o: any) => {
              fighting_styles.push(new FightingStyle(o));
            });
            response = fighting_styles;
          break;
          case "equipment_pack": 
            const equipment_packs: EquipmentPack[] = [];
            body.objects.forEach((o: any) => {
              equipment_packs.push(new EquipmentPack(o));
            });
            response = equipment_packs;
          break;
          case "pact_boon": 
            const pact_boons: PactBoon[] = [];
            body.objects.forEach((o: any) => {
              pact_boons.push(new PactBoon(o));
            });
            response = pact_boons;
          break;
          case "feat": 
            const feats: Feat[] = [];
            body.objects.forEach((o: any) => {
              feats.push(new Feat(o));
            });
            response = feats;
          break;
          case "game_class": 
            const game_classes: GameClass[] = [];
            body.objects.forEach((o: any) => {
              game_classes.push(new GameClass(o));
            });
            response = game_classes;
          break;
          case "magic_item": 
            const magic_items: MagicItem[] = [];
            body.objects.forEach((o: any) => {
              magic_items.push(new MagicItem(o));
            });
            if (!this.smart_hash.base_item) {
              await this.getObjects("base_item");
            }
            magic_items.forEach(base => {
              const item = base as MagicItem;
              if (this.smart_hash.base_item && !item.base_item) {
                const obj_finder = this.smart_hash.base_item.filter(o => o._id === item.base_item_id);
                if (obj_finder.length === 1) {
                  item.base_item = obj_finder[0] as BaseItem;
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
            response = magic_item_keywords;
          break;
          case "magic_item_template": 
          break;
          case "race": 
            const races: Race[] = [];
            body.objects.forEach((o: any) => {
              races.push(new Race(o));
            });
            if (!this.smart_hash.subrace) {
              await this.getObjects("subrace");
            }
            races.forEach(base => {
              const race = base as Race;
              if (this.smart_hash.subrace && race.subraces.length === 0) {
                this.smart_hash.subrace.forEach(mb => {
                  const sub = mb as Subrace;
                  if (sub.race_id === race._id) {
                    race.subraces.push(sub);
                  }
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
            response = subraces;
          break;
          case "resource": 
            const resources: Resource[] = [];
            body.objects.forEach((o: any) => {
              resources.push(new Resource(o));
            });
            response = resources;
          break;
          case "spell_slot_type": 
            const spell_slot_types: SpellSlotType[] = [];
            body.objects.forEach((o: any) => {
              spell_slot_types.push(new SpellSlotType(o));
            });
            response = spell_slot_types;
          break;
          case "subclass": 
            const subclasses: Subclass[] = [];
            body.objects.forEach((o: any) => {
              subclasses.push(new Subclass(o));
            });
            response = subclasses;
          break;
          case "user": 
            const users: User[] = [];
            body.objects.forEach((o: any) => {
              users.push(new User(o));
            });
            response = users;
          break;
          case "weapon_keyword": 
            const weapon_keywords: WeaponKeyword[] = [];
            body.objects.forEach((o: any) => {
              weapon_keywords.push(new WeaponKeyword(o));
            });
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
            response = template_bases;
          break;
          case "language": 
            const languages: Language[] = [];
            body.objects.forEach((o: any) => {
              languages.push(new Language(o));
            });
            response = languages;
          break;
          case "special_feature": 
            const special_features: SpecialFeature[] = [];
            body.objects.forEach((o: any) => {
              special_features.push(new SpecialFeature(o));
            });
            response = special_features;
          break;
          case "tool": 
            const tools: Tool[] = [];
            body.objects.forEach((o: any) => {
              tools.push(new Tool(o));
            });
            response = tools;
          break;
          case "sense": 
            const senses: Sense[] = [];
            body.objects.forEach((o: any) => {
              senses.push(new Sense(o));
            });
            response = senses;
          break;
        }
        if (this.always_store(data_type)) {
          this.smart_hash[data_type] = response;
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
