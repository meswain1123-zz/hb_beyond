

// This is our special type of Error that represents
// when a request got a 401 Unauthorized response
class UnauthorizedError {
  name: string;
  message: string;
  // response: string | null;

  constructor(message: string) {
    this.name = "UnauthorizedError";
    this.message = message;
    // this.response = null;
  }
}
export class APIClass {
  images: string[];
  
  constructor() {
    this.images = [];
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
      // unauthorizedError.response = response;
      return Promise.reject(unauthorizedError);
    } else {
      var error = new Error(response.statusText);
      // error.response = response;
      return Promise.reject(error);
    }
  };

  // getObjectsFromAPI = async (data_type: string) => {
  //   const response = await this.fetchData(
  //     `/api/image/getObjects/${data_type}`
  //   );
  //   const data = await this.processResponse(response, data_type, null, data_type);
  //   return data;
  // };
  // getFullObject = async (data_type: string, id: string, refresh = false) => {
  //   if (refresh) {
  //     return this.getObjectsFromAPI(data_type);
  //   } else {
  //     let data: any = null;
  //     switch(data_type) {
  //       case "spell": 
  //         if (!this.spells) {
  //           await this.getObjects("spell");
  //         }
  //         if (this.spells) {
  //           data = this.spells.filter(o => o._id === id);
  //         }
  //       break;
  //       case "skill": 
  //         if (!this.skills) {
  //           await this.getObjects("skill");
  //         }
  //         if (this.skills) {
  //           data = this.skills.filter(o => o._id === id);
  //         }
  //       break;
  //       case "spell_list": 
  //         if (!this.spell_lists) {
  //           await this.getObjects("spell_list");
  //         }
  //         if (this.spell_lists) {
  //           data = this.spell_lists.filter(o => o._id === id);
  //         }
  //       break;
  //       case "armor_type": 
  //         if (!this.armor_types) {
  //           await this.getObjects("armor_type");
  //         }
  //         if (this.armor_types) {
  //           data = this.armor_types.filter(o => o._id === id);
  //         }
  //       break;
  //       case "background": 
  //         if (!this.backgrounds) {
  //           await this.getObjects("background");
  //         }
  //         if (this.backgrounds) {
  //           data = this.backgrounds.filter(o => o._id === id);
  //         }
  //       break;
  //       case "base_item": 
  //         if (!this.base_items) {
  //           await this.getObjects("base_item");
  //         }
  //         if (this.base_items) {
  //           data = this.base_items.filter(o => o._id === id);
  //         }
  //       break;
  //       case "campaign": 
  //         if (!this.campaigns) {
  //           await this.getObjects("campaign");
  //         }
  //         if (this.campaigns) {
  //           data = this.campaigns.filter(o => o._id === id);
  //         }
  //       break;
  //       case "character": 
  //         if (!this.backgrounds) {
  //           await this.getObjects("background");
  //         }
  //         if (!this.spells) {
  //           await this.getObjects("spell");
  //         }
  //         if (!this.characters) {
  //           await this.getObjects("character");
  //         }
  //         if (!this.base_items) {
  //           await this.getObjects("base_item");
  //         }
  //         if (!this.magic_items) {
  //           await this.getObjects("magic_item");
  //         }
  //         if (!this.game_classes) {
  //           await this.getObjects("game_class");
  //         }
  //         if (!this.subclasses) {
  //           await this.getObjects("subclass");
  //         }
  //         if (!this.subraces) {
  //           await this.getObjects("subrace");
  //         }
  //         if (!this.races) {
  //           await this.getObjects("race");
  //         }
  //         if (!this.spell_slot_types) {
  //           await this.getObjects("spell_slot_type");
  //         }
  //         if (this.characters) {
  //           data = this.characters.filter(o => o._id === id);
  //           data.forEach((char: Character) => {
  //             if (char.background.background_id !== "" && !char.background.background) {
  //               if (this.backgrounds) {
  //                 const obj_finder = this.backgrounds.filter(o => o._id === char.background.background_id);
  //                 if (obj_finder.length === 1) {
  //                   char.background.connectBackground(obj_finder[0]);
  //                 }
  //               }
  //             }
  //             if (char.race.race_id && !char.race.race) {
  //               if (this.races) {
  //                 const obj_finder = this.races.filter(o => o._id === char.race.race_id);
  //                 if (obj_finder.length === 1) {
  //                   char.race.connectRace(obj_finder[0]);
  //                 }
  //               }
  //             }
  //             if (char.race.subrace && char.race.subrace.subrace_id && !char.race.subrace.subrace) {
  //               if (this.subraces) {
  //                 const obj_finder = this.subraces.filter(o => char.race.subrace && o._id === char.race.subrace.subrace_id);
  //                 if (obj_finder.length === 1) {
  //                   char.race.subrace.connectSubrace(obj_finder[0]);
  //                 }
  //               }
  //             }
  //             char.items.forEach(item => {
  //               if (item.magic_item_id && !item.magic_item) {
  //                 if (this.magic_items) {
  //                   const obj_finder = this.magic_items.filter(o => o._id === item.magic_item_id);
  //                   if (obj_finder.length === 1) {
  //                     item.connectMagicItem(obj_finder[0]);
  //                   }
  //                 }
  //               } else if (item.base_item_id && !item.base_item) {
  //                 if (this.base_items) {
  //                   const obj_finder = this.base_items.filter(o => o._id === item.base_item_id);
  //                   if (obj_finder.length === 1) {
  //                     item.connectBaseItem(obj_finder[0]);
  //                   }
  //                 }
  //               }
  //             });
  //             char.classes.forEach(char_class => {
  //               if (char_class.game_class_id && !char_class.game_class) {
  //                 if (this.game_classes) {
  //                   const obj_finder = this.game_classes.filter(o => o._id === char_class.game_class_id);
  //                   if (obj_finder.length === 1) {
  //                     char_class.connectGameClass(obj_finder[0]);
  //                   }
  //                 }
  //               }
  //               if (char_class.subclass_id && !char_class.subclass) {
  //                 if (this.subclasses) {
  //                   const obj_finder = this.subclasses.filter(o => o._id === char_class.subclass_id);
  //                   if (obj_finder.length === 1) {
  //                     char_class.connectSubclass(obj_finder[0]);
  //                   }
  //                 }
  //               }
  //             });
  //             char.spells.forEach(char_spell => {
  //               if (char_spell.spell_id && !char_spell.spell) {
  //                 if (this.spells) {
  //                   const obj_finder = this.spells.filter(o => o._id === char_spell.spell_id);
  //                   if (obj_finder.length === 1) {
  //                     char_spell.connectSpell(obj_finder[0]);
  //                   }
  //                 }
  //               }
  //             });
  //           });
  //         }
  //       break;
  //       case "eldritch_invocation": 
  //         if (!this.eldritch_invocations) {
  //           await this.getObjects("eldritch_invocation");
  //         }
  //         if (this.eldritch_invocations) {
  //           data = this.eldritch_invocations.filter(o => o._id === id);
  //         }
  //       break;
  //       case "equipment_pack": 
  //         if (!this.equipment_packs) {
  //           await this.getObjects("equipment_pack");
  //         }
  //         if (this.equipment_packs) {
  //           data = this.equipment_packs.filter(o => o._id === id);
  //         }
  //       break;
  //       case "pact_boon": 
  //         if (!this.pact_boons) {
  //           await this.getObjects("pact_boon");
  //         }
  //         if (this.pact_boons) {
  //           data = this.pact_boons.filter(o => o._id === id);
  //         }
  //       break;
  //       case "feat": 
  //         if (!this.feats) {
  //           await this.getObjects("feat");
  //         }
  //         if (this.feats) {
  //           data = this.feats.filter(o => o._id === id);
  //         }
  //       break;
  //       case "game_class": 
  //         if (!this.game_classes) {
  //           await this.getObjects("game_class");
  //         }
  //         if (this.game_classes) {
  //           data = this.game_classes.filter(o => o._id === id);
  //         }
  //       break;
  //       case "magic_item": 
  //         if (!this.magic_items) {
  //           await this.getObjects("magic_item");
  //         }
  //         if (this.magic_items) {
  //           data = this.magic_items.filter(o => o._id === id);
  //         }
  //       break;
  //       case "magic_item_keyword":
  //         if (!this.magic_item_keywords) {
  //           await this.getObjects("magic_item_keyword");
  //         }
  //         if (this.magic_item_keywords) {
  //           data = this.magic_item_keywords.filter(o => o._id === id);
  //         }
  //       break;
  //       case "magic_item_template": 
  //         // if (!this.magic_item_templates) {
  //         //   await this.getObjects("magic_item_template");
  //         // }
  //         // if (this.magic_item_templates) {
  //         //   data = this.magic_item_templates.filter(o => o._id === id);
  //         // }
  //       break;
  //       case "race": 
  //         if (!this.races) {
  //           await this.getObjects("race");
  //         }
  //         if (this.races) {
  //           data = this.races.filter(o => o._id === id);
  //         }
  //       break;
  //       case "subrace": 
  //         if (!this.subraces) {
  //           await this.getObjects("subrace");
  //         }
  //         if (this.subraces) {
  //           data = this.subraces.filter(o => o._id === id);
  //         }
  //       break;
  //       case "resource": 
  //         if (!this.resources) {
  //           await this.getObjects("resource");
  //         }
  //         if (this.resources) {
  //           data = this.resources.filter(o => o._id === id);
  //         }
  //       break;
  //       case "spell_slot_type": 
  //         if (!this.spell_slot_types) {
  //           await this.getObjects("spell_slot_type");
  //         }
  //         if (this.spell_slot_types) {
  //           data = this.spell_slot_types.filter(o => o._id === id);
  //         }
  //       break;
  //       case "subclass": 
  //         if (!this.subclasses) {
  //           await this.getObjects("subclass");
  //         }
  //         if (this.subclasses) {
  //           data = this.subclasses.filter(o => o._id === id);
  //         }
  //       break;
  //       case "user": 
  //         if (!this.users) {
  //           await this.getObjects("user");
  //         }
  //         if (this.users) {
  //           data = this.users.filter(o => o._id === id);
  //         }
  //       break;
  //       case "weapon_keyword": 
  //         if (!this.weapon_keywords) {
  //           await this.getObjects("weapon_keyword");
  //         }
  //         if (this.weapon_keywords) {
  //           data = this.weapon_keywords.filter(o => o._id === id);
  //         }
  //       break;
  //       case "template": 
  //         if (!this.template_bases) {
  //           await this.getObjects("template_base");
  //         }
  //         if (this.template_bases) {
  //           data = this.template_bases.filter(o => o._id === id);
  //         }
  //       break;
  //       case "language": 
  //         if (!this.languages) {
  //           await this.getObjects("language");
  //         }
  //         if (this.languages) {
  //           data = this.languages.filter(o => o._id === id);
  //         }
  //       break;
  //       case "special_feature": 
  //         if (!this.special_features) {
  //           await this.getObjects("special_feature");
  //         }
  //         if (this.special_features) {
  //           data = this.special_features.filter(o => o._id === id);
  //         }
  //       break;
  //       case "tool": 
  //         if (!this.tools) {
  //           await this.getObjects("tool");
  //         }
  //         if (this.tools) {
  //           data = this.tools.filter(o => o._id === id);
  //         }
  //       break;
  //       case "sense": 
  //         if (!this.senses) {
  //           await this.getObjects("sense");
  //         }
  //         if (this.senses) {
  //           data = this.senses.filter(o => o._id === id);
  //         }
  //       break;
  //       default:
  //         data = this.getSessionData(data_type);
  //       break;
  //     }
  //     if (data !== null) {
  //       return data;
  //     } else {
  //       return this.getObjectsFromAPI(data_type);
  //     }
  //   }
  // };

  wakeUp() {
    fetch(`/wake-up`)
      .then(res => {
        // if (res.ok) {
        //   return this.setState({ loading: false })  
        // }
        const msg = 'Something is went wrong with Heroku'; 
        console.log(msg);
        // this.toast(msg, 'custom', 2000, toastColor)
      })
  }

  upload = async (image: any, data_type: string, id: string) => {
    // const response = await this.postData("/image-upload", image);
    const response = await this.uploadData(`/api/image/upload/${data_type}/${id}`, image);
    const res = await this.processResponse(response);
    return res;
  };

  uploadData = async (path: string, data: any) => {
    return await fetch(`${path}`, {
      method: 'POST',
      body: data
    })
      .then(this.checkStatus)
      .catch(this.logErrorReason);
  };

  // deleteObject = async (data_type: string, object_id: string) => {
  //   if (this.real) {
  //     const response = await this.deleteData("/api/beyond/deleteObject", { data_type, object_id });
  //     const res = await this.processResponse(response, data_type, null);
  //     if (res.message.includes("deleted!")) {
  //       switch(data_type) {
  //         case "spell":
  //           if (this.spells) {
  //             this.spells = this.spells.filter(o => o._id !== object_id);
  //           }
  //         break;
  //         case "skill":
  //           if (this.skills) {
  //             this.skills = this.skills.filter(o => o._id !== object_id);
  //           }
  //         break;
  //         case "spell_list": 
  //           if (this.spell_lists) {
  //             this.spell_lists = this.spell_lists.filter(o => o._id !== object_id);
  //           }
  //         break;
  //         case "armor_type": 
  //           if (this.armor_types) {
  //             this.armor_types = this.armor_types.filter(o => o._id !== object_id);
  //           } 
  //         break;
  //         case "background": 
  //           if (this.backgrounds) {
  //             this.backgrounds = this.backgrounds.filter(o => o._id !== object_id);
  //           }
  //         break;
  //         case "base_item": 
  //           if (this.base_items) {
  //             this.base_items = this.base_items.filter(o => o._id !== object_id);
  //           }
  //         break;
  //         case "campaign":
  //           if (this.campaigns) {
  //             this.campaigns = this.campaigns.filter(o => o._id !== object_id);
  //           }
  //         break;
  //         case "character": 
  //           if (this.characters) {
  //             this.characters = this.characters.filter(o => o._id !== object_id);
  //           }
  //         break;
  //         case "eldritch_invocation": 
  //           if (this.eldritch_invocations) {
  //             this.eldritch_invocations = this.eldritch_invocations.filter(o => o._id !== object_id);
  //           }
  //         break;
  //         case "equipment_pack": 
  //           if (this.equipment_packs) {
  //             this.equipment_packs = this.equipment_packs.filter(o => o._id !== object_id);
  //           }
  //         break;
  //         case "pact_boon": 
  //           if (this.pact_boons) {
  //             this.pact_boons = this.pact_boons.filter(o => o._id !== object_id);
  //           }
  //         break;
  //         case "feat": 
  //           if (this.feats) {
  //             this.feats = this.feats.filter(o => o._id !== object_id);
  //           }
  //         break;
  //         case "game_class": 
  //           if (this.game_classes) {
  //             this.game_classes = this.game_classes.filter(o => o._id !== object_id);
  //           }
  //         break;
  //         case "magic_item": 
  //           if (this.magic_items) {
  //             this.magic_items = this.magic_items.filter(o => o._id !== object_id);
  //           }
  //         break;
  //         case "magic_item_keyword": 
  //           if (this.magic_item_keywords) {
  //             this.magic_item_keywords = this.magic_item_keywords.filter(o => o._id !== object_id);
  //           }
  //         break;
  //         case "magic_item_template": 
  //           // if (this.magic_item_templates) {
  //           //   this.magic_item_templates = this.magic_item_templates.filter(o => o._id !== object_id);
  //           // }
  //         break;
  //         case "race": 
  //           if (this.races) {
  //             this.races = this.races.filter(o => o._id !== object_id);
  //           }
  //         break;
  //         case "subrace": 
  //           if (this.subraces) {
  //             this.subraces = this.subraces.filter(o => o._id !== object_id);
  //           }
  //         break;
  //         case "resource":
  //           if (this.resources) {
  //             this.resources = this.resources.filter(o => o._id !== object_id);
  //           }
  //         break;
  //         case "spell_slot_type":
  //           if (this.spell_slot_types) {
  //             this.spell_slot_types = this.spell_slot_types.filter(o => o._id !== object_id);
  //           }
  //         break;
  //         case "subclass":
  //           if (this.subclasses) {
  //             this.subclasses = this.subclasses.filter(o => o._id !== object_id);
  //           }
  //         break;
  //         case "user":
  //           if (this.users) {
  //             this.users = this.users.filter(o => o._id !== object_id);
  //           }
  //         break;
  //         case "weapon_keyword":
  //           if (this.weapon_keywords) {
  //             this.weapon_keywords = this.weapon_keywords.filter(o => o._id !== object_id);
  //           }
  //         break;
  //         case "template":
  //           if (this.template_bases) {
  //             this.template_bases = this.template_bases.filter(o => o._id !== object_id);
  //           }
  //         break;
  //         case "language":
  //           if (this.languages) {
  //             this.languages = this.languages.filter(o => o._id !== object_id);
  //           }
  //         break;
  //         case "special_feature":
  //           if (this.special_features) {
  //             this.special_features = this.special_features.filter(o => o._id !== object_id);
  //           }
  //         break;
  //         case "tool":
  //           if (this.tools) {
  //             this.tools = this.tools.filter(o => o._id !== object_id);
  //           }
  //         break;
  //         case "sense":
  //           if (this.senses) {
  //             this.senses = this.senses.filter(o => o._id !== object_id);
  //           }
  //         break;
  //       }
  //     }
  //     return res;
  //   } else {
  //     return "success";
  //   }
  // };

  // updateObject = async (data_type: string, obj: ModelBase) => {
  //   if (this.real) {
  //     const response = await this.patchData("/api/beyond/updateObject", { data_type, obj: obj.toDBObj() });
  //     const res = await this.processResponse(response, data_type, null);
  //     if (res.message.includes("updated!")) {
  //       switch(data_type) {
  //         case "spell":
  //           if (this.spells) {
  //             const objects: Spell[] = this.spells;
  //             const objFinder = objects.filter(o => o._id === obj._id);
  //             if (objFinder.length === 1) {
  //               const updated = objFinder[0];
  //               updated.copy(obj as Spell);
  //               this.spells = objects;
  //             }
  //           }
  //         break;
  //         case "skill":
  //           if (this.skills) {
  //             const objects: Skill[] = this.skills;
  //             const objFinder = objects.filter(o => o._id === obj._id);
  //             if (objFinder.length === 1) {
  //               const updated = objFinder[0];
  //               updated.copy(obj as Skill);
  //               this.skills = objects;
  //             }
  //           }
  //         break;
  //         case "spell_list": 
  //           if (this.spell_lists) {
  //             const objects: SpellList[] = this.spell_lists;
  //             const objFinder = objects.filter(o => o._id === obj._id);
  //             if (objFinder.length === 1) {
  //               const updated = objFinder[0];
  //               updated.copy(obj as SpellList);
  //               this.spell_lists = objects;
  //             }
  //           }
  //         break;
  //         case "armor_type": 
  //           if (this.armor_types) {
  //             const objects: ArmorType[] = this.armor_types;
  //             const objFinder = objects.filter(o => o._id === obj._id);
  //             if (objFinder.length === 1) {
  //               const updated = objFinder[0];
  //               updated.copy(obj as ArmorType);
  //               this.armor_types = objects;
  //             }
  //           } 
  //         break;
  //         case "background": 
  //           if (this.backgrounds) {
  //             const objects: Background[] = this.backgrounds;
  //             const objFinder = objects.filter(o => o._id === obj._id);
  //             if (objFinder.length === 1) {
  //               const updated = objFinder[0];
  //               updated.copy(obj as Background);
  //               this.backgrounds = objects;
  //             }
  //           }
  //         break;
  //         case "base_item": 
  //           if (this.base_items) {
  //             const objects: BaseItem[] = this.base_items;
  //             const objFinder = objects.filter(o => o._id === obj._id);
  //             if (objFinder.length === 1) {
  //               const updated = objFinder[0];
  //               updated.copy(obj as BaseItem);
  //               this.base_items = objects;
  //             }
  //           }
  //         break;
  //         case "campaign":
  //           if (this.campaigns) {
  //             const objects: Campaign[] = this.campaigns;
  //             const objFinder = objects.filter(o => o._id === obj._id);
  //             if (objFinder.length === 1) {
  //               const updated = objFinder[0];
  //               updated.copy(obj as Campaign);
  //               this.campaigns = objects;
  //             }
  //           }
  //         break;
  //         case "character": 
  //           if (this.characters) {
  //             const objects: Character[] = this.characters;
  //             const objFinder = objects.filter(o => o._id === obj._id);
  //             if (objFinder.length === 1) {
  //               const updated = objFinder[0];
  //               updated.copy(obj as Character);
  //               this.characters = objects;
  //             }
  //           }
  //         break;
  //         case "eldritch_invocation": 
  //           if (this.eldritch_invocations) {
  //             const objects: EldritchInvocation[] = this.eldritch_invocations;
  //             const objFinder = objects.filter(o => o._id === obj._id);
  //             if (objFinder.length === 1) {
  //               const updated = objFinder[0];
  //               updated.copy(obj as EldritchInvocation);
  //               this.eldritch_invocations = objects;
  //             }
  //           }
  //         break;
  //         case "equipment_pack": 
  //           if (this.equipment_packs) {
  //             const objects: EquipmentPack[] = this.equipment_packs;
  //             const objFinder = objects.filter(o => o._id === obj._id);
  //             if (objFinder.length === 1) {
  //               const updated = objFinder[0];
  //               updated.copy(obj as EquipmentPack);
  //               this.equipment_packs = objects;
  //             }
  //           }
  //         break;
  //         case "pact_boon": 
  //           if (this.pact_boons) {
  //             const objects: PactBoon[] = this.pact_boons;
  //             const objFinder = objects.filter(o => o._id === obj._id);
  //             if (objFinder.length === 1) {
  //               const updated = objFinder[0];
  //               updated.copy(obj as PactBoon);
  //               this.pact_boons = objects;
  //             }
  //           }
  //         break;
  //         case "feat": 
  //           if (this.feats) {
  //             const objects: Feat[] = this.feats;
  //             const objFinder = objects.filter(o => o._id === obj._id);
  //             if (objFinder.length === 1) {
  //               const updated = objFinder[0];
  //               updated.copy(obj as Feat);
  //               this.feats = objects;
  //             }
  //           }
  //         break;
  //         case "game_class": 
  //           if (this.game_classes) {
  //             const objects: GameClass[] = this.game_classes;
  //             const objFinder = objects.filter(o => o._id === obj._id);
  //             if (objFinder.length === 1) {
  //               const updated = objFinder[0];
  //               updated.copy(obj as GameClass);
  //               this.game_classes = objects;
  //             }
  //           }
  //         break;
  //         case "magic_item": 
  //           if (this.magic_items) {
  //             const objects: MagicItem[] = this.magic_items;
  //             const objFinder = objects.filter(o => o._id === obj._id);
  //             if (objFinder.length === 1) {
  //               const updated = objFinder[0];
  //               updated.copy(obj as MagicItem);
  //               this.magic_items = objects;
  //             }
  //           }
  //         break;
  //         case "magic_item_keyword": 
  //           if (this.magic_item_keywords) {
  //             const objects: MagicItemKeyword[] = this.magic_item_keywords;
  //             const objFinder = objects.filter(o => o._id === obj._id);
  //             if (objFinder.length === 1) {
  //               const updated = objFinder[0];
  //               updated.copy(obj as MagicItemKeyword);
  //               this.magic_item_keywords = objects;
  //             }
  //           }
  //         break;
  //         case "magic_item_template": 
  //           // if (this.magic_item_templates) {
  //           //   const objects: MagicItemTemplate[] = this.magic_item_templates;
  //           //   const objFinder = objects.filter(o => o._id === obj._id);
  //           //   if (objFinder.length === 1) {
  //           //     const updated = objFinder[0];
  //           //     updated.copy(obj as MagicItemTemplate);
  //           //     this.magic_item_templates = objects;
  //           //   }
  //           // }
  //         break;
  //         case "race": 
  //           if (this.races) {
  //             const objects: Race[] = this.races;
  //             const objFinder = objects.filter(o => o._id === obj._id);
  //             if (objFinder.length === 1) {
  //               const updated = objFinder[0];
  //               updated.copy(obj as Race);
  //               this.races = objects;
  //             }
  //           }
  //         break;
  //         case "subrace": 
  //           if (this.subraces) {
  //             const objects: Subrace[] = this.subraces;
  //             const objFinder = objects.filter(o => o._id === obj._id);
  //             if (objFinder.length === 1) {
  //               const updated = objFinder[0];
  //               updated.copy(obj as Subrace);
  //               this.subraces = objects;
  //             }
  //           }
  //         break;
  //         case "resource":
  //           if (this.resources) {
  //             const objects: Resource[] = this.resources;
  //             const objFinder = objects.filter(o => o._id === obj._id);
  //             if (objFinder.length === 1) {
  //               const updated = objFinder[0];
  //               updated.copy(obj as Resource);
  //               this.resources = objects;
  //             }
  //           }
  //         break;
  //         case "spell_slot_type":
  //           if (this.spell_slot_types) {
  //             const objects: SpellSlotType[] = this.spell_slot_types;
  //             const objFinder = objects.filter(o => o._id === obj._id);
  //             if (objFinder.length === 1) {
  //               const updated = objFinder[0];
  //               updated.copy(obj as SpellSlotType);
  //               this.spell_slot_types = objects;
  //             }
  //           }
  //         break;
  //         case "subclass":
  //           if (this.subclasses) {
  //             const objects: Subclass[] = this.subclasses;
  //             const objFinder = objects.filter(o => o._id === obj._id);
  //             if (objFinder.length === 1) {
  //               const updated = objFinder[0];
  //               updated.copy(obj as Subclass);
  //               this.subclasses = objects;
  //             }
  //           }
  //         break;
  //         case "user":
  //           if (this.users) {
  //             const objects: User[] = this.users;
  //             const objFinder = objects.filter(o => o._id === obj._id);
  //             if (objFinder.length === 1) {
  //               const updated = objFinder[0];
  //               updated.copy(obj as User);
  //               this.users = objects;
  //             }
  //           }
  //         break;
  //         case "weapon_keyword":
  //           if (this.weapon_keywords) {
  //             const objects: WeaponKeyword[] = this.weapon_keywords;
  //             const objFinder = objects.filter(o => o._id === obj._id);
  //             if (objFinder.length === 1) {
  //               const updated = objFinder[0];
  //               updated.copy(obj as WeaponKeyword);
  //               this.weapon_keywords = objects;
  //             }
  //           }
  //         break;
  //         case "template":
  //           if (this.template_bases) {
  //             const objects: TemplateBase[] = this.template_bases;
  //             const objFinder = objects.filter(o => o._id === obj._id);
  //             if (objFinder.length === 1) {
  //               const updated = objFinder[0];
  //               if (updated.type === "Ability") {
  //                 updated.copy(obj as AbilityTemplate);
  //               } else if (updated.type === "SpellAsAbility") {
  //                 updated.copy(obj as SpellAsAbilityTemplate);
  //               } else if (updated.type === "ItemAffectingAbility") {
  //                 updated.copy(obj as ItemAffectingAbilityTemplate);
  //               } else if (updated.type === "Spell") {
  //                 updated.copy(obj as SpellTemplate);
  //               } else if (updated.type === "FeatureBase") {
  //                 updated.copy(obj as FeatureBaseTemplate);
  //               } else if (updated.type === "FeatureChoice") {
  //                 updated.copy(obj as FeatureChoiceTemplate);
  //               } else if (updated.type === "Feature") {
  //                 updated.copy(obj as FeatureTemplate);
  //               // } else if (updated.type === "MagicItem") {
  //               //   updated.copy(obj as MagicItemTemplate);
  //               }
  //               this.template_bases = objects;
  //             }
  //           }
  //         break;
  //         case "language":
  //           if (this.languages) {
  //             const objects: Language[] = this.languages;
  //             const objFinder = objects.filter(o => o._id === obj._id);
  //             if (objFinder.length === 1) {
  //               const updated = objFinder[0];
  //               updated.copy(obj as Language);
  //               this.languages = objects;
  //             }
  //           }
  //         break;
  //         case "special_feature":
  //           if (this.special_features) {
  //             const objects: SpecialFeature[] = this.special_features;
  //             const objFinder = objects.filter(o => o._id === obj._id);
  //             if (objFinder.length === 1) {
  //               const updated = objFinder[0];
  //               updated.copy(obj as SpecialFeature);
  //               this.special_features = objects;
  //             }
  //           }
  //         break;
  //         case "tool":
  //           if (this.tools) {
  //             const objects: Tool[] = this.tools;
  //             const objFinder = objects.filter(o => o._id === obj._id);
  //             if (objFinder.length === 1) {
  //               const updated = objFinder[0];
  //               updated.copy(obj as Tool);
  //               this.tools = objects;
  //             }
  //           }
  //         break;
  //         case "sense":
  //           if (this.senses) {
  //             const objects: Sense[] = this.senses;
  //             const objFinder = objects.filter(o => o._id === obj._id);
  //             if (objFinder.length === 1) {
  //               const updated = objFinder[0];
  //               updated.copy(obj as Sense);
  //               this.senses = objects;
  //             }
  //           }
  //         break;
  //       }
  //     }
  //     return res;
  //   } else {
  //     return "success";
  //   }
  // };

  // upsertObject = async (data_type: string, obj: ModelBase) => {
  //   if (this.real) {
  //     if (obj._id && obj._id !== "") {
  //       this.updateObject(data_type, obj).then((res: any) => {
  //         return res;
  //       });
  //     } else {
  //       this.createObject(data_type, obj).then((res: any) => {
  //         return res;
  //       });
  //     }
  //   } else {
  //     return -1;
  //   }
  // };

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
      body: data
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

  processResponse = async (response: any) => {
    const body = await response.json();
    if (response.status !== 200) { 
      throw Error(body.message);
    } else {
      let response: any = body;
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
}
