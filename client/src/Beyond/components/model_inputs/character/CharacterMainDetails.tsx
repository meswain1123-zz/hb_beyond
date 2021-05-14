import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Redirect } from "react-router-dom";
import GnomeRanger from "../../../assets/img/characters/Gnome Ranger.png";
import {
  Apps,
  Clear,
  Star,
  StarBorder
} from "@material-ui/icons";
import {
  Grid, 
  Drawer,
  Tooltip, Fab,
} from "@material-ui/core";
import { 
  ArmorType,
  Character,
  Condition,
  EldritchInvocation,
  Skill,
  WeaponKeyword,
  Spell,
  SpellSlotType,
  DamageMultiplierSimple,
  CreatureInstance,
  CharacterResource,
  CharacterSlot
} from "../../../models";
import { 
  DAMAGE_TYPES
} from "../../../models/Constants";

import CharacterViewEquipment from "./CharacterViewEquipment";
import CharacterFeatures from "./CharacterFeatures";
import CharacterSpells from './CharacterSpells';
import CharacterProficiencies from './CharacterProficiencies';
import CharacterNotes from './CharacterNotes';
import CharacterDescription from './CharacterDescription';
import DamageTypeImage from "../display/DamageTypeImage";
import CharacterActions from './CharacterActions';
import CharacterAbilityScores from './CharacterAbilityScores';
import CharacterSavingThrows from './CharacterSavingThrows';
import CharacterSenses from './CharacterSenses';
import CharacterSkills from './CharacterSkills';
import CharacterResourceBoxes from "./CharacterResourceBoxes";
import DisplayObjects from "../display/DisplayObjects";

import CreatureInstanceInput from '../creature/CreatureInstance';

import ViewSpell from "../ViewSpell";

import API from "../../../utilities/smart_api";
import { APIClass } from "../../../utilities/smart_api_class";
import imageAPI from "../../../utilities/image_api";
import { APIClass as ImageAPIClass } from "../../../utilities/image_api_class";
import CharacterUtilities from "../../../utilities/character_utilities";
import { CharacterUtilitiesClass } from "../../../utilities/character_utilities_class";
import DataUtilities from "../../../utilities/data_utilities";
import { DataUtilitiesClass } from "../../../utilities/data_utilities_class";


interface AppState {
  height: number;
  width: number;
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
  height: state.app.height,
  width: state.app.width
})

const mapDispatch = {
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  obj: Character; 
  bar3_mode: string;
  onChange: () => void;
}

export interface State { 
  redirectTo: string | null;
  armor_types: ArmorType[] | null;
  conditions: Condition[] | null;
  weapon_keywords: WeaponKeyword[] | null;
  skills: Skill[] | null;
  spells: Spell[] | null;
  spell_slot_types: SpellSlotType[] | null;
  eldritch_invocations: EldritchInvocation[] | null;
  loading: boolean;
  reloading: boolean;
  view: string;
  menu_open: string;
  minion: CreatureInstance | null;
}


class CharacterMainDetails extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirectTo: null,
      armor_types: null,
      conditions: null,
      weapon_keywords: null,
      skills: null,
      spells: null,
      spell_slot_types: null,
      eldritch_invocations: null,
      loading: false,
      reloading: false,
      view: "spells", // "main", // 
      menu_open: "",
      minion: null
    };
    this.api = API.getInstance();
    this.image_api = imageAPI.getInstance();
    this.char_util = CharacterUtilities.getInstance();
    this.data_util = DataUtilities.getInstance();
  }

  api: APIClass;
  image_api: ImageAPIClass;
  char_util: CharacterUtilitiesClass;
  data_util: DataUtilitiesClass;

  componentDidMount() {
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getSetOfObjects(["armor_type","condition","spell","skill","spell_slot_type","eldritch_invocation","weapon_keyword"]).then((res: any) => {
        const armor_types: ArmorType[] = res.armor_type;
        const spells: Spell[] = res.spell;
        const all_conditions: Condition[] = res.condition;
        let conditions: Condition[] = all_conditions.filter(o => o.class_ids.length === 0 && o.subclass_ids.length === 0);
        if (conditions.length < all_conditions.length) {
          const class_ids: string[] = this.props.obj.classes.map(o => { return o.game_class_id; });
          const subclass_ids: string[] = this.props.obj.classes.map(o => { return o.subclass_id; });
          all_conditions.filter(o => o.class_ids.length > 0 || o.subclass_ids.length > 0).forEach(condition => {
            if (condition.subclass_ids.length > 0) {
              for (let i = 0; i < subclass_ids.length; ++i) {
                if (condition.subclass_ids.includes(subclass_ids[i])) {
                  conditions.push(condition);
                  break;
                }
              }
            } else {
              for (let i = 0; i < class_ids.length; ++i) {
                if (condition.class_ids.includes(class_ids[i])) {
                  conditions.push(condition);
                  break;
                }
              }
            }
          });
        }

        this.setState({ 
          armor_types,
          conditions,
          spells,
          skills: res.skill,
          spell_slot_types: res.spell_slot_type,
          eldritch_invocations: res.eldritch_invocation,
          weapon_keywords: res.weapon_keyword,
          loading: false 
        });
      });
    });
  }

  updateCharacter() {
    this.api.updateObject(this.props.obj).then((res: any) => {
      this.props.onChange();
    });
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.armor_types === null) {
      this.load();
      return <span>Loading</span>;
    } else if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else { 
      return (
        <Grid container spacing={1} direction="column" style={{ lineHeight: "1.5" }}>
          <Grid item container spacing={1} direction="row" 
            style={{ 
              backgroundColor: "#333333",
              color: "white" 
            }}>
            { this.renderBar3() }
          </Grid>
          <Grid item>
            Campaign info goes here
          </Grid>
          { this.renderSelectedView() }
          <Grid item style={{ height: "60px" }}>&nbsp;</Grid>
          { this.renderExtras() }
          <div style={{ 
            position: "fixed",
            zIndex: 999,
            right: 20,
            bottom: 10
          }}>
            <Tooltip title={`Change View`}>
              <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                onClick={ () => {
                  this.setState({ menu_open: "views" });
                }}>
                <Apps/>
              </Fab>
            </Tooltip>
          </div>
        </Grid>
      ); 
    }
  }

  renderExtras() {
    return [
      <Drawer key={0} anchor="right" 
        open={ this.state.menu_open === "char" } 
        onClose={() => {
          this.setState({ menu_open: "" });
        }}>
        <div style={{ 
            backgroundColor: "black",
            color: "white",
            border: "1px solid blue",
            height: "800px",
            width: "324px",
            overflowX: "hidden"
          }}>
          <Grid container spacing={1} direction="column"
            style={{ 
              backgroundColor: "black",
              color: "white",
              border: "1px solid blue",
              height: "800px",
              width: "320px",
              overflowX: "hidden"
            }}>
            <Grid item>&nbsp;</Grid>
            <Grid item 
              style={{
                display: "flex",
                justifyContent: "center"
              }}>
              <img src={ this.props.obj.image_url === "" ? GnomeRanger : this.props.obj.image_url } alt="logo" 
                style={{
                  width: "10em",
                  height: "10em",
                  border: "1px solid blue"
                }} 
              />
            </Grid>
            <Grid item
              style={{
                display: "flex",
                justifyContent: "center"
              }}>
              <div>
                { this.props.obj.name }
              </div>
            </Grid>
            <Grid item
              style={{
                display: "flex",
                justifyContent: "center"
              }}>
              <div style={{ fontSize: "10px", height: "16px" }}>
                { this.props.obj.race.subrace && this.props.obj.race.subrace.subrace ? this.props.obj.race.subrace.subrace.name : (this.props.obj.race.race ? this.props.obj.race.race.name : "") } 
              </div>
            </Grid>
            <Grid item
              style={{
                display: "flex",
                justifyContent: "center"
              }}>
              <div style={{ fontSize: "10px", height: "16px" }}>
                Level { this.props.obj.character_level }
              </div>
            </Grid>
            { this.props.obj.classes.map((char_class, key) => (
              <Grid item key={key}>
                { char_class.game_class && <span> { char_class.game_class.name }{ char_class.subclass && <span> { char_class.subclass.name }</span> } { char_class.level } </span> }
              </Grid>
            ))}
            <Grid item container spacing={1} direction="column"
              style={{ 
                backgroundColor: "#333333",
                color: "white",
                border: "1px solid #999999",
                padding: "0px"
              }}>
              <Grid item container spacing={0} direction="row"
                style={{ 
                  backgroundColor: "#333333",
                  color: "white",
                  border: "1px solid #555555"
                }}>
                <Grid item xs={2}>&nbsp;</Grid>
                <Grid item xs={8}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    this.setState({ redirectTo: `/beyond/character/edit/${this.props.obj._id}` });
                  }}>
                  Edit Character
                </Grid>
                <Grid item xs={2}>&nbsp;</Grid>
              </Grid>
              <Grid item container spacing={0} direction="row"
                style={{ 
                  backgroundColor: "#333333",
                  color: "white",
                  border: "1px solid #555555"
                }}>
                <Grid item xs={2}>&nbsp;</Grid>
                <Grid item xs={8}
                  style={{ cursor: "pointer" }}>
                  <input type='file' id='single' 
                    onChange={(e: any) => {
                      const errs: string[] = []; 
                      const files = Array.from(e.target.files);
                      
                      const formData = new FormData();
                      const types = ['image/png', 'image/jpeg', 'image/gif'];

                      files.forEach((file: any, i) => {

                        if (types.every(type => file.type !== type)) {
                          errs.push(`'${file.type}' is not a supported format`);
                        }

                        if (file.size > 150000) {
                          errs.push(`'${file.name}' is too large, please pick a smaller file`);
                        }

                        formData.append(`${i}`, file);
                      });
                      this.image_api.upload(formData, "character", this.props.obj._id).then((res: any) => {
                        if (res && res.length) {
                          const file_data = res[0];
                          const obj = this.props.obj;
                          obj.image_url = file_data.url;
                          this.api.updateObject(obj).then((res: any) => {
                            this.props.onChange();
                          });
                        }
                      });
                    }} 
                  /> Set Character Image (Later I'll make a control for selecting from built in images, but it will also have this upload option)
                </Grid>
                <Grid item xs={2}>&nbsp;</Grid>
              </Grid>
              <Grid item container spacing={0} direction="row"
                style={{ 
                  backgroundColor: "#333333",
                  color: "white",
                  border: "1px solid #555555"
                }}>
                <Grid item xs={2}>&nbsp;</Grid>
                <Grid item xs={8} style={{ cursor: "pointer" }}
                  onClick={() => {
                    this.setState({ menu_open: "short" });
                  }}>
                  Short Rest
                </Grid>
                <Grid item xs={2}>&nbsp;</Grid>
              </Grid>
              <Grid item container spacing={0} direction="row"
                style={{ 
                  backgroundColor: "#333333",
                  color: "white",
                  border: "1px solid #555555"
                }}>
                <Grid item xs={2}>&nbsp;</Grid>
                <Grid item xs={8} style={{ cursor: "pointer" }}
                  onClick={() => {
                    this.setState({ menu_open: "long" });
                  }}>
                  Long Rest
                </Grid>
                <Grid item xs={2}>&nbsp;</Grid>
              </Grid>
              <Grid item container spacing={0} direction="row"
                style={{ 
                  backgroundColor: "#333333",
                  color: "white",
                  border: "1px solid #555555"
                }}>
                <Grid item xs={2}>&nbsp;</Grid>
                <Grid item xs={8} style={{ cursor: "pointer" }}
                  onClick={() => {
                    this.setState({ menu_open: "portrait" });
                  }}>
                  Change Portrait
                </Grid>
                <Grid item xs={2}>&nbsp;</Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </Drawer>,
      <Drawer key={1} anchor="right" 
        open={ this.state.menu_open === "views" } 
        onClose={() => {
          this.setState({ menu_open: "" });
        }}>
        <div style={{ 
            backgroundColor: "black",
            color: "white",
            border: "1px solid blue",
            height: "800px",
            width: "324px",
            overflowX: "hidden"
          }}>
          <Grid container spacing={1} direction="column"
            style={{ 
              backgroundColor: "black",
              color: "white",
              border: "1px solid blue",
              height: "800px",
              width: "320px",
              overflowX: "hidden"
            }}>
            <Grid item>&nbsp;</Grid>
            <Grid item container spacing={1} direction="row"
              style={{ 
                backgroundColor: "#333333",
                color: "white",
                border: "1px solid #999999",
                padding: "0px"
              }}>
              <Grid item xs={12} container spacing={0} direction="row"
                style={{ 
                  backgroundColor: "#333333",
                  color: "white",
                  border: "1px solid #555555", 
                  cursor: "pointer"
                }}
                onClick={() => {
                  this.setState({ view: "main", menu_open: "" });
                }}>
                <Grid item xs={2}>&nbsp;</Grid>
                <Grid item xs={8}>
                  Abilities, Saves, Senses
                </Grid>
                <Grid item xs={2}>&nbsp;</Grid>
              </Grid>
              <Grid item xs={6} container spacing={0} direction="row"
                style={{ 
                  backgroundColor: "#333333",
                  color: "white",
                  border: "1px solid #555555", 
                  cursor: "pointer"
                }}
                onClick={() => {
                  this.setState({ view: "skills", menu_open: "" });
                }}>
                <Grid item xs={2}>&nbsp;</Grid>
                <Grid item xs={8}>
                  Skills
                </Grid>
                <Grid item xs={2}>&nbsp;</Grid>
              </Grid>
              <Grid item xs={6} container spacing={0} direction="row"
                style={{ 
                  backgroundColor: "#333333",
                  color: "white",
                  border: "1px solid #555555", 
                  cursor: "pointer"
                }}
                onClick={() => {
                  this.setState({ view: "actions", menu_open: "" });
                }}>
                <Grid item xs={2}>&nbsp;</Grid>
                <Grid item xs={8}>
                  Actions
                </Grid>
                <Grid item xs={2}>&nbsp;</Grid>
              </Grid>
              <Grid item xs={6} container spacing={0} direction="row"
                style={{ 
                  backgroundColor: "#333333",
                  color: "white",
                  border: "1px solid #555555", 
                  cursor: "pointer"
                }}
                onClick={() => {
                  this.setState({ view: "equipment", menu_open: "" });
                }}>
                <Grid item xs={2}>&nbsp;</Grid>
                <Grid item xs={8}>
                  Equipment
                </Grid>
                <Grid item xs={2}>&nbsp;</Grid>
              </Grid>
              <Grid item xs={6} container spacing={0} direction="row"
                style={{ 
                  backgroundColor: "#333333",
                  color: "white",
                  border: "1px solid #555555", 
                  cursor: "pointer"
                }}
                onClick={() => {
                  this.setState({ view: "spells", menu_open: "" });
                }}>
                <Grid item xs={2}>&nbsp;</Grid>
                <Grid item xs={8}>
                  Spells
                </Grid>
                <Grid item xs={2}>&nbsp;</Grid>
              </Grid>
              <Grid item xs={6} container spacing={0} direction="row"
                style={{ 
                  backgroundColor: "#333333",
                  color: "white",
                  border: "1px solid #555555", 
                  cursor: "pointer"
                }}
                onClick={() => {
                  this.setState({ view: "features", menu_open: "" });
                }}>
                <Grid item xs={2}>&nbsp;</Grid>
                <Grid item xs={8}>
                  Features &amp; Traits
                </Grid>
                <Grid item xs={2}>&nbsp;</Grid>
              </Grid>
              <Grid item xs={6} container spacing={0} direction="row"
                style={{ 
                  backgroundColor: "#333333",
                  color: "white",
                  border: "1px solid #555555", 
                  cursor: "pointer"
                }}
                onClick={() => {
                  this.setState({ view: "profs", menu_open: "" });
                }}>
                <Grid item xs={2}>&nbsp;</Grid>
                <Grid item xs={8}>
                  Proficiencies &amp; Languages
                </Grid>
                <Grid item xs={2}>&nbsp;</Grid>
              </Grid>
              <Grid item xs={6} container spacing={0} direction="row"
                style={{ 
                  backgroundColor: "#333333",
                  color: "white",
                  border: "1px solid #555555", 
                  cursor: "pointer"
                }}
                onClick={() => {
                  this.setState({ view: "description", menu_open: "" });
                }}>
                <Grid item xs={2}>&nbsp;</Grid>
                <Grid item xs={8}>
                  Description
                </Grid>
                <Grid item xs={2}>&nbsp;</Grid>
              </Grid>
              <Grid item xs={6} container spacing={0} direction="row"
                style={{ 
                  backgroundColor: "#333333",
                  color: "white",
                  border: "1px solid #555555", 
                  cursor: "pointer"
                }}
                onClick={() => {
                  this.setState({ view: "notes", menu_open: "" });
                }}>
                <Grid item xs={2}>&nbsp;</Grid>
                <Grid item xs={8}>
                  Notes
                </Grid>
                <Grid item xs={2}>&nbsp;</Grid>
              </Grid>
              <Grid item xs={12} container spacing={0} direction="row"
                style={{ 
                  backgroundColor: "#333333",
                  color: "white",
                  border: "1px solid #555555", 
                  cursor: "pointer"
                }}
                onClick={() => {
                  this.setState({ view: "extras", menu_open: "" });
                }}>
                <Grid item xs={2}>&nbsp;</Grid>
                <Grid item xs={8}>
                  Extras
                </Grid>
                <Grid item xs={2}>&nbsp;</Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </Drawer>,
      <Drawer key={3} anchor="right" 
        open={ this.state.menu_open === "minion" } 
        onClose={() => {
          this.setState({ menu_open: "" });
        }}>
        { this.renderMinionStatBlock() }
      </Drawer>
    ];
  }

  renderBar3() {
    let return_me: any[] = [];
    return_me.push(
      <span key="adv" style={{ 
        border: "1px solid lightgray" 
      }}>
        <Grid container spacing={0} direction="column" 
          style={{ 
            cursor: "pointer"
          }}>
          <Grid item
            style={{
              display: "flex",
              color: (this.props.obj.advantage === true ? "green" : "lightgray"),
              fontWeight: (this.props.obj.advantage === true ? "bold" : "normal")
            }}
            onClick={() => {
              const obj = this.props.obj;
              if (obj.advantage === true) {
                obj.advantage = null;
              } else {
                obj.advantage = true;
              }
              this.updateCharacter();
            }}>
            ADV
          </Grid>
          <Grid item
            style={{
              display: "flex",
              color: (this.props.obj.advantage === false ? "red" : "lightgray"),
              fontWeight: (this.props.obj.advantage === false ? "bold" : "normal")
            }}
            onClick={() => {
              const obj = this.props.obj;
              if (obj.advantage === false) {
                obj.advantage = null;
              } else {
                obj.advantage = false;
              }
              this.updateCharacter();
            }}>
            DISADV
          </Grid>
        </Grid>
      </span>
    );
    if (this.props.obj.concentrating_on) {
      return_me.push(
        <span key="conc" 
          style={{ margin: "4px" }}>
          Concentrating on 
          <Grid container spacing={0} direction="row">
            <Grid item xs={9}>
              <ViewSpell spell={this.props.obj.concentrating_on} show_ritual />
            </Grid>
            <Grid item xs={3}>
              <Clear style={{ cursor: "pointer" }} 
                onClick={() => {
                  const obj = this.props.obj;
                  obj.concentrating_on = null;
                  this.api.updateObject(obj).then((res: any) => {
                    this.props.onChange();
                  });
                }} 
              />
            </Grid>
          </Grid> 
        </span>
      );
    }
    if (this.props.bar3_mode === "Defenses") {
      // Iterate through damage_multipliers
      DAMAGE_TYPES.forEach(dmg => {
        const multipliers = this.props.obj.damage_multipliers.filter(o => o.damage_type === dmg);
        const vuln = multipliers.filter(o => o.multiplier === 2).length > 0;
        const resist = multipliers.filter(o => o.multiplier === 0.5).length > 0;
        const immune = multipliers.filter(o => o.multiplier === 0).length > 0;
        const vuln_ff = multipliers.filter(o => o.multiplier === 2 && o.from_feature).length > 0;
        const resist_ff = multipliers.filter(o => o.multiplier === 0.5 && o.from_feature).length > 0;
        const immune_ff = multipliers.filter(o => o.multiplier === 0 && o.from_feature).length > 0;
        return_me.push(
          <span key={dmg} style={{ 
            border: "1px solid lightgray" 
          }}>
            <Grid container spacing={0} direction="row" 
              style={{ 
                width: "80px"
              }}>
              <Grid item xs={4} container spacing={0} direction="column">
                <Grid item>&nbsp;</Grid>
                <Grid item>
                  <DamageTypeImage image={dmg} size={25} color="white" />
                </Grid>
                <Grid item>&nbsp;</Grid>
              </Grid>
              <Grid item xs={8} container spacing={0} direction="column">
                <Grid item style={{
                  color: (vuln ? "red" : "darkgray"),
                  fontWeight: (vuln_ff ? "bold" : "normal"),
                  cursor: "pointer"
                }} onClick={() => {
                  if (!vuln_ff) {
                    const obj = this.props.obj;
                    if (vuln) {
                      obj.extra_damage_multipliers = obj.extra_damage_multipliers.filter(o => o.damage_type !== dmg || o.multiplier !== 2);
                      obj.damage_multipliers = obj.damage_multipliers.filter(o => o.damage_type !== dmg || o.multiplier !== 2);
                    } else {
                      const dm = new DamageMultiplierSimple();
                      dm.damage_type = dmg;
                      dm.multiplier = 2;
                      obj.extra_damage_multipliers.push(dm);
                      obj.damage_multipliers.push(dm);
                    }
                    this.updateCharacter();
                  }
                }}>
                  <Tooltip title={`Vulnerable to ${dmg}`}>
                    <span>x 2</span>
                  </Tooltip>
                </Grid>
                <Grid item style={{
                  color: (resist ? "blue" : "darkgray"),
                  fontWeight: (resist_ff ? "bold" : "normal"),
                  cursor: "pointer"
                }} onClick={() => {
                  if (!resist_ff) {
                    const obj = this.props.obj;
                    if (resist) {
                      obj.extra_damage_multipliers = obj.extra_damage_multipliers.filter(o => o.damage_type !== dmg || o.multiplier !== 0.5);
                      obj.damage_multipliers = obj.damage_multipliers.filter(o => o.damage_type !== dmg || o.multiplier !== 0.5);
                    } else {
                      const dm = new DamageMultiplierSimple();
                      dm.damage_type = dmg;
                      dm.multiplier = 0.5;
                      obj.extra_damage_multipliers.push(dm);
                      obj.damage_multipliers.push(dm);
                    }
                    this.updateCharacter();
                  }
                }}>
                  <Tooltip title={`Resistant to ${dmg}`}>
                    <span>x 1/2</span>
                  </Tooltip>
                </Grid>
                <Grid item style={{
                  color: (immune ? "green" : "darkgray"),
                  fontWeight: (immune_ff ? "bold" : "normal"),
                  cursor: "pointer"
                }} onClick={() => {
                  if (!immune_ff) {
                    const obj = this.props.obj;
                    if (immune) {
                      obj.extra_damage_multipliers = obj.extra_damage_multipliers.filter(o => o.damage_type !== dmg || o.multiplier !== 0);
                      obj.damage_multipliers = obj.damage_multipliers.filter(o => o.damage_type !== dmg || o.multiplier !== 0);
                    } else {
                      const dm = new DamageMultiplierSimple();
                      dm.damage_type = dmg;
                      dm.multiplier = 0;
                      obj.extra_damage_multipliers.push(dm);
                      obj.damage_multipliers.push(dm);
                    }
                    this.updateCharacter();
                  }
                }}>
                  <Tooltip title={`Immune to ${dmg}`}>
                    <span>x 0</span>
                  </Tooltip>
                </Grid>
              </Grid>
            </Grid>
          </span>
        );
      });
    } else if (this.props.bar3_mode === "Conditions") {
      // Iterate through conditions
      if (this.state.conditions) {
        this.state.conditions.filter(o => o.level === -1 && this.props.obj.favorite_conditions.includes(o._id)).forEach(cond => {
          return_me.push(this.renderCondition(cond, true));
        });
        this.state.conditions.filter(o => o.level === -1 && !this.props.obj.favorite_conditions.includes(o._id)).forEach(cond => {
          return_me.push(this.renderCondition(cond, false));
        });
      }
    } else if (this.props.bar3_mode === "Resources") {
      const slot_types = Array.from(new Set(this.props.obj.slots.map(o => o.slot_name)));
      slot_types.forEach(slot_name => {
        return_me.push(this.renderSlotsForType(slot_name));
      });
      this.props.obj.resources.forEach(resource => {
        return_me.push(this.renderResource(resource));
      });
      // return_me = [...return_me, ...this.renderSlots(), ...this.renderResources()]
    } else if (this.props.bar3_mode === "Minions") {
      // Iterate through character's minions
      this.props.obj.minions.forEach(minion => {
        return_me.push(this.renderMinion(minion));
      });
    }
    return (
      <Grid item xs={12}>
        <div
          style={{
            display: "flex",
            borderTop: "1px solid lightgray",
            minHeight: "76px",
            width: `${this.props.width - 60}px`,
            overflowX: "auto" 
          }}>
          { return_me }
        </div>
      </Grid>
    );
  }

  renderSlotsForType(slot_name: string) {
    const slots = this.props.obj.slots.filter(o => o.slot_name === slot_name);
    const groups: any = [];
    let group: any = [];
    // const width = slots.length < 4 ? 12 : slots.length < 7 ? 6 : 4;
    for (let i = 0; i < slots.length; ++i) {
      const slot = slots[i];
      group.push(this.renderSlot(slot));
      if (i % 3 === 2 || i === slots.length - 1) {
        groups.push(
          <span key={i}>
            { group }
          </span>
          // <Grid item xs={width} key={i}>
          //   { group }
          // </Grid>
        );
        group = [];
      }
    }
    return (
      <span key={slot_name} style={{ 
        border: "1px solid lightgray" 
      }}>
        <Grid container spacing={0} direction="row">
          <Grid item xs={12}
            style={{
              fontWeight: "bold"
            }}>
            { slot_name }
          </Grid>
          <Grid item xs={12}
            style={{
              display: "flex",
              justifyContent: "center"
            }}>
            { groups }
          </Grid>
        </Grid>
      </span>
    );
  }

  renderSlot(slot: CharacterSlot) {
    return (
      <Grid item key={slot.level}>
        <div style={{ 
          display: "inline", 
          fontSize: "15px", 
          fontWeight: "bold",
          verticalAlign: "top" 
        }}>{ slot.level }&nbsp;</div>
        <CharacterResourceBoxes 
          resource={slot}
          show_type={false}
          character={this.props.obj}
          onChange={() => {
            this.setState({ });
          }}
        />
      </Grid>
    );
  }

  renderResource(resource: CharacterResource) {
    return (
      <span key={resource.type_id} style={{ 
        border: "1px solid lightgray" 
      }}>
        <Grid container spacing={0} direction="column">
          <Grid item 
            style={{
              fontWeight: "bold"
            }}>
            <DisplayObjects type="resource" ids={[resource.type_id]} />
            { resource.size > 1 && ` (d${resource.size})` }
          </Grid>
          <Grid item>
            <CharacterResourceBoxes 
              resource={resource}
              character={this.props.obj}
              onChange={() => {
                this.setState({ });
              }}
            />
          </Grid>
        </Grid>
      </span>
    );
  }

  renderCondition(cond: Condition, is_favorite: boolean) {
    const has_cond = this.props.obj.conditions.filter(o => o === cond._id).length > 0;
    const has_immunity = this.props.obj.condition_immunities.filter(o => o === cond._id).length > 0;
    return (
      <span key={cond._id} style={{ 
        border: "1px solid lightgray" 
      }}>
        <Tooltip title={`${cond.name}: ${cond.description}`}>
          <Grid container spacing={0} direction="column" 
            style={{ 
              cursor: "pointer"
            }}>
            <Grid item
              style={{
                display: "flex"
              }}>
              <span onClick={() => {
                const obj = this.props.obj;
                if (is_favorite) {
                  obj.favorite_conditions = obj.favorite_conditions.filter(o => o !== cond._id);
                } else {
                  obj.favorite_conditions.push(cond._id);
                }
                this.char_util.recalcAll(obj);
                this.updateCharacter();
              }}>
                { is_favorite ? <Star/> : <StarBorder/> }
              </span>
              <span style={{ 
                  color: (has_cond ? "green" : "lightgray"),
                  fontWeight: (has_cond ? "bold" : "normal")  
                }} onClick={() => {
                if (!has_immunity) {
                  const obj = this.props.obj;
                  if (has_cond) {
                    obj.conditions = obj.conditions.filter(o => o !== cond._id);
                  } else {
                    obj.conditions.push(cond._id);
                  }
                  this.char_util.recalcAll(obj);
                  this.updateCharacter();
                }
              }}>
                { cond.name }
              </span>
            </Grid>
            <Grid item style={{ 
              color: (has_immunity ? "blue" : "lightgray"),
              fontWeight: (has_immunity ? "bold" : "normal")  
            }} onClick={() => {
              if (cond.immunity_exists) {
                const obj = this.props.obj;
                if (!has_immunity) {
                  obj.condition_immunities.push(cond._id);
                  if (has_cond) {
                    obj.conditions = obj.conditions.filter(o => o !== cond._id);
                    this.char_util.recalcAll(obj);
                  }
                } else {
                  obj.condition_immunities = obj.condition_immunities.filter(o => o !== cond._id);
                }
                this.updateCharacter();
              }
            }}>
              { cond.immunity_exists ? <span>Immunity</span> : <span>&nbsp;</span>}
            </Grid>
          </Grid>
        </Tooltip>
      </span>
    );
  }

  renderMinion(minion: CreatureInstance) {
    return (
      <span key={minion.true_id} style={{ 
        border: "1px solid lightgray" 
      }}>
        <Tooltip title={`${minion.name}: ${minion.creature_type}`}>
          <Grid container spacing={0} direction="column" 
            style={{ 
              cursor: "pointer"
            }}>
            <Grid item
              style={{
                display: "flex"
              }}
              onClick={() => {
                this.setState({ 
                  menu_open: "minion",
                  minion
                });
              }}>
              { minion.name }
            </Grid>
            <Grid container spacing={0} direction="row" 
              style={{ 
                margin: "1px",
                width: "80px" 
              }}>
              <Grid item xs={5} onClick={() => {
                this.setState({ 
                  menu_open: "minion",
                  minion
                });
              }}>
                { minion.current_hit_points } 
                { minion.temp_hit_points > 0 && <span style={{ color: "blue" }}>+{minion.temp_hit_points}</span> } 
              </Grid>
              <Grid item xs={7} onClick={() => {
                this.setState({ 
                  menu_open: "minion",
                  minion
                });
              }}>
                &nbsp;/&nbsp;
                { minion.override_max_hit_points > minion.max_hit_points ? 
                  <span style={{ color: "green" }}>{ minion.override_max_hit_points }</span> 
                  : 
                  (minion.override_max_hit_points > -1 ? <span style={{ color: "red" }}>{ minion.override_max_hit_points }</span> : minion.max_hit_points) 
                } 
                { minion.max_hit_points_modifier > 0 ? <span style={{ color: "green" }}>+{minion.max_hit_points_modifier}</span> : (minion.max_hit_points_modifier < 0 && <span style={{ color: "red" }}>{minion.max_hit_points_modifier}</span>) }
              </Grid>
            </Grid>
            <Grid item
              style={{ 
                display: "flex",
                justifyContent: "right"
              }}>
              <Clear
                onClick={() => {
                  const obj = this.props.obj;
                  obj.minions = obj.minions.filter(o => o.true_id !== minion.true_id);
                  this.api.updateObject(obj).then((res: any) => {
                    // this.props.onChange();
                    this.setState({ });
                  });
                }} 
              />
            </Grid>
          </Grid>
        </Tooltip>
      </span>
    );
  }

  renderMinionStatBlock() {
    const minion = this.state.minion;
    if (minion) {
      return (
        <div style={{ 
          border: "1px solid blue",
          height: "800px",
          width: "324px",
          overflowX: "hidden"
        }}>
          <CreatureInstanceInput
            obj={this.props.obj}
            creature_instance={minion}
            onChange={() => {
              this.setState({ });
            }}
          />
        </div>
      );
    }
    return null;
  }

  renderSelectedView() {
    let return_me: any = <Grid item>{this.state.view} Coming Soon</Grid>;
    switch (this.state.view) {
      case "main":
        return_me = [
          this.renderSpacer("0"),
          <CharacterAbilityScores key="abilities" obj={this.props.obj} 
            onChange={() => {
              const obj = this.props.obj;
              this.char_util.recalcAll(obj);
              this.props.onChange();
            }}
          />,
          this.renderSpacer("1"),
          <CharacterSavingThrows key="saves" obj={this.props.obj} 
            onChange={() => {
              const obj = this.props.obj;
              this.char_util.recalcAll(obj);
              this.props.onChange();
            }}
          />,
          this.renderSpacer("2"),
          <CharacterSenses key="senses" obj={this.props.obj} 
            onChange={() => {
              const obj = this.props.obj;
              this.char_util.recalcAll(obj);
              this.props.onChange();
            }}
          />,
        ];
      break;
      case "skills":
        return_me = 
          <CharacterSkills obj={this.props.obj} 
            onChange={() => {
              const obj = this.props.obj;
              this.char_util.recalcAll(obj);
              this.props.onChange();
            }}
          />;
      break;
      case "equipment":
        return_me = 
          <CharacterViewEquipment 
            obj={this.props.obj}
            onChange={() => {
              const obj = this.props.obj;
              this.char_util.recalcAll(obj);
              this.props.onChange();
            }}
          />;
      break;
      case "features":
        return_me = 
          <CharacterFeatures 
            obj={this.props.obj}
            onChange={() => {
              const obj = this.props.obj;
              this.char_util.recalcAll(obj);
              this.props.onChange();
            }}
          />;
      break;
      case "spells":
        return_me = 
          <CharacterSpells 
            obj={this.props.obj}
            onChange={() => {
              this.setState({ });
              // this.props.onChange();
            }}
          />;
      break;
      case "actions":
        return_me = 
          <CharacterActions 
            obj={this.props.obj}
            onChange={() => {
              this.setState({ });
              // this.props.onChange();
            }}
          />;
      break;
      case "profs":
        return_me = 
          <CharacterProficiencies 
            obj={this.props.obj}
            onChange={() => {
              // const obj = this.props.obj;
              // this.api.updateObject(obj).then((res: any) => {
              //   this.props.onChange();
              // });
            }}
          />;
      break;
      case "notes":
        return_me = 
          <CharacterNotes 
            obj={this.props.obj}
            onChange={() => {
              // const obj = this.props.obj;
              // this.api.updateObject(obj).then((res: any) => {
              //   this.props.onChange();
              // });
            }}
          />;
      break;
      case "description":
        return_me = 
          <CharacterDescription
            obj={this.props.obj}
            onChange={() => {
              // const obj = this.props.obj;
              // this.api.updateObject(obj).then((res: any) => {
              //   this.props.onChange();
              // });
            }}
          />;
      break;
    }
    return return_me;
  }

  renderSpacer(key: string) {
    return <Grid item key={key}>&nbsp;</Grid>;
  }
}

export default connector(CharacterMainDetails);
