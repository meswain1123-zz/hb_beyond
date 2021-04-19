import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Redirect } from "react-router-dom";
import GnomeRanger from "../../assets/img/characters/Gnome Ranger.png";
import ShieldImage from "../../assets/img/Shield.png";
import ListImage from "../../assets/img/List.png";
import PeopleImage from "../../assets/img/People.png";
import {
  Settings,
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
  CreatureInstance
} from "../../models";
import { 
  DAMAGE_TYPES
} from "../../models/Constants";
import StringBox from "../../components/input/StringBox";
import CheckBox from "../../components/input/CheckBox";
import ToggleButtonBox from '../../components/input/ToggleButtonBox';

import CharacterViewEquipment from "../../components/model_inputs/character/CharacterViewEquipment";
import CharacterFeatures from "../../components/model_inputs/character/CharacterFeatures";
import CharacterSpells from '../../components/model_inputs/character/CharacterSpells';
import CharacterProficiencies from '../../components/model_inputs/character/CharacterProficiencies';
import CharacterNotes from '../../components/model_inputs/character/CharacterNotes';
import CharacterDescription from '../../components/model_inputs/character/CharacterDescription';
import DamageTypeImage from "../../components/model_inputs/display/DamageTypeImage";
import CharacterActions from '../../components/model_inputs/character/CharacterActions';
import CharacterAbilityScores from '../../components/model_inputs/character/CharacterAbilityScores';
import CharacterSavingThrows from '../../components/model_inputs/character/CharacterSavingThrows';
import CharacterSenses from '../../components/model_inputs/character/CharacterSenses';
import CharacterSkills from '../../components/model_inputs/character/CharacterSkills';

import CreatureInstanceInput from '../../components/model_inputs/creature/CreatureInstance';

import ViewSpell from "../../components/model_inputs/ViewSpell";

import API from "../../utilities/smart_api";
import { APIClass } from "../../utilities/smart_api_class";
import imageAPI from "../../utilities/image_api";
import { APIClass as ImageAPIClass } from "../../utilities/image_api_class";
import CharacterUtilities from "../../utilities/character_utilities";
import { CharacterUtilitiesClass } from "../../utilities/character_utilities_class";


interface AppState {
  height: number;
  width: number;
}

interface RootState {
  app: AppState
}

interface MatchParams {
  id: string;
}

const mapState = (state: RootState) => ({
  height: state.app.height,
  width: state.app.width
})

const mapDispatch = {
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & RouteComponentProps<MatchParams> & { }

export interface State { 
  redirectTo: string | null;
  obj: Character;
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
  bar3_mode: string;
}


class CharacterDetails extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirectTo: null,
      obj: new Character(),
      armor_types: null,
      conditions: null,
      weapon_keywords: null,
      skills: null,
      spells: null,
      spell_slot_types: null,
      eldritch_invocations: null,
      loading: false,
      reloading: false,
      view: "actions", // "main", // 
      menu_open: "",
      minion: null,
      bar3_mode: "Minions" // "Conditions" // 
    };
    this.api = API.getInstance();
    this.image_api = imageAPI.getInstance();
    this.char_util = CharacterUtilities.getInstance();
  }

  api: APIClass;
  image_api: ImageAPIClass;
  char_util: CharacterUtilitiesClass;

  componentDidMount() {
  }

  // Loads the editing Character into state
  load_object(id: string) {
    this.api.getFullObject("character", id).then((res: any) => {
      if (res && res.length === 1) {
        const obj = res[0];
        this.char_util.recalcAll(obj);
        this.setState({ 
          obj
        });
      }
    });
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getSetOfObjects(["armor_type","condition","spell","skill","spell_slot_type","eldritch_invocation","weapon_keyword"]).then((res: any) => {
        const armor_types: ArmorType[] = res.armor_type;
        const spells: Spell[] = res.spell;
        this.setState({ 
          armor_types,
          conditions: res.condition,
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

  updateCharacter(obj: Character) {
    this.api.updateObject(obj).then((res: any) => {
      this.setState({ obj });
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
      let { id } = this.props.match.params;
      if (id !== undefined && this.state.obj._id !== id) {
        this.load_object(id);
        return (<span>Loading...</span>);
      } else {
        return (
          <Grid container spacing={1} direction="column" style={{ lineHeight: "1.5" }}>
            <Grid item container spacing={1} direction="row" 
              style={{ 
                backgroundColor: "#333333",
                color: "white" 
              }}>
              { this.renderBar1() }
              { this.renderBar2() }
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
              <img src={ this.state.obj.image_url === "" ? GnomeRanger : this.state.obj.image_url } alt="logo" 
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
                { this.state.obj.name }
              </div>
            </Grid>
            <Grid item
              style={{
                display: "flex",
                justifyContent: "center"
              }}>
              <div style={{ fontSize: "10px", height: "16px" }}>
                { this.state.obj.race.subrace && this.state.obj.race.subrace.subrace ? this.state.obj.race.subrace.subrace.name : (this.state.obj.race.race ? this.state.obj.race.race.name : "") } 
              </div>
            </Grid>
            <Grid item
              style={{
                display: "flex",
                justifyContent: "center"
              }}>
              <div style={{ fontSize: "10px", height: "16px" }}>
                Level { this.state.obj.character_level }
              </div>
            </Grid>
            { this.state.obj.classes.map((char_class, key) => (
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
                    this.setState({ redirectTo: `/beyond/character/edit/${this.state.obj._id}` });
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
                      this.image_api.upload(formData, "character", this.state.obj._id).then((res: any) => {
                        if (res && res.length) {
                          const file_data = res[0];
                          const obj = this.state.obj;
                          obj.image_url = file_data.url;
                          this.api.updateObject(obj).then((res: any) => {
                            this.setState({ obj });
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
      <Drawer key={2} anchor="right" 
        open={ this.state.menu_open === "hp" } 
        onClose={() => {
          this.setState({ menu_open: "" });
        }}>
        { this.renderHPStuff() }
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

  renderHPStuff() {
    const undying = false; // Some features give the ability to continue going when at 0 hp
    return (
      <div style={{ 
        border: "1px solid blue",
        height: "800px",
        width: "324px",
        overflowX: "hidden"
      }}>
        <Grid container spacing={1} direction="column"
          style={{ 
            border: "1px solid blue",
            height: "800px",
            width: "320px",
            overflowX: "hidden",
            padding: "10px",
            fontWeight: "bold"
          }}>
          <Grid item
            style={{
              display: "flex",
              justifyContent: "center",
              fontSize: "20px"
            }}>
            HP Management
          </Grid>
          <Grid item container spacing={0} direction="row">
            <Grid item xs={4}
              style={{
                display: "flex",
                justifyContent: "center"
              }}>
              Current HP
            </Grid>
            <Grid item xs={4}
              style={{
                display: "flex",
                justifyContent: "center"
              }}>
              Max HP
            </Grid>
            <Grid item xs={4}
              style={{
                display: "flex",
                justifyContent: "center"
              }}>
              Temp HP
            </Grid>
            <Grid item xs={4}
              style={{
                display: "flex",
                justifyContent: "center"
              }}>
              { !this.state.reloading &&
                <StringBox 
                  name=""
                  value={`${this.state.obj.current_hit_points}`}
                  type="number"
                  onBlur={(changed: string) => {
                    const obj = this.state.obj;
                    obj.current_hit_points = +changed;
                    if (obj.current_hit_points < 0) {
                      obj.current_hit_points = 0;
                    } else if (obj.override_max_hit_points === -1) {
                      if (obj.current_hit_points > (obj.max_hit_points + obj.max_hit_points_modifier)) {
                        obj.current_hit_points = obj.max_hit_points + obj.max_hit_points_modifier;
                      }
                    } else {
                      if (obj.current_hit_points > obj.override_max_hit_points + obj.max_hit_points_modifier) {
                        obj.current_hit_points = obj.override_max_hit_points + obj.max_hit_points_modifier;
                      }
                    }
                    this.api.updateObject(obj).then((res: any) => {
                      this.setState({ obj });
                    });
                  }}
                />
              }
            </Grid>
            <Grid item xs={4}
              style={{
                display: "flex",
                justifyContent: "center",
                fontSize: "20px"
              }}>
              { this.state.obj.max_hit_points }
            </Grid>
            <Grid item xs={4}>
              <StringBox 
                name=""
                value={`${this.state.obj.temp_hit_points}`}
                type="number"
                onBlur={(changed: string) => {
                  const obj = this.state.obj;
                  obj.temp_hit_points = +changed;
                  this.api.updateObject(obj).then((res: any) => {
                    this.setState({ obj });
                  });
                }}
              />
            </Grid>
          </Grid>
          <Grid item container spacing={0} direction="row" style={{ borderTop: "1px solid lightgray" }}>
            <Grid item xs={6}
              style={{
                display: "flex",
                justifyContent: "center"
              }}>
              Max HP Modifier
            </Grid>
            <Grid item xs={6}
              style={{
                display: "flex",
                justifyContent: "center"
              }}>
              Override Max HP
            </Grid>
            <Grid item xs={6}
              style={{
                display: "flex",
                justifyContent: "center"
              }}>
              <StringBox 
                name=""
                value={ this.state.obj.max_hit_points_modifier === 0 ? "" : `${this.state.obj.max_hit_points_modifier}` }
                type="number"
                onBlur={(changed: string) => {
                  const obj = this.state.obj;
                  if (changed === "") {
                    obj.max_hit_points_modifier = 0;
                  } else {
                    obj.max_hit_points_modifier = +changed;
                  }
                  if (obj.override_max_hit_points === -1) {
                    if (obj.current_hit_points > (obj.max_hit_points + obj.max_hit_points_modifier)) {
                      obj.current_hit_points = obj.max_hit_points + obj.max_hit_points_modifier;
                    }
                  } else {
                    if (obj.current_hit_points > obj.override_max_hit_points + obj.max_hit_points_modifier) {
                      obj.current_hit_points = obj.override_max_hit_points + obj.max_hit_points_modifier;
                    }
                  }
                  this.api.updateObject(obj).then((res: any) => {
                    this.setState({ obj, reloading: true }, () => {
                      this.setState({ reloading: false });
                    });
                  });
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <StringBox 
                name=""
                value={ this.state.obj.override_max_hit_points === -1 ? "" : `${this.state.obj.override_max_hit_points}`}
                type="number"
                onBlur={(changed: string) => {
                  const obj = this.state.obj;
                  if (changed === "") {
                    obj.override_max_hit_points = -1;
                  } else {
                    obj.override_max_hit_points = +changed;
                  }
                  if (obj.override_max_hit_points === -1) {
                    if (obj.current_hit_points > (obj.max_hit_points + obj.max_hit_points_modifier)) {
                      obj.current_hit_points = obj.max_hit_points + obj.max_hit_points_modifier;
                    }
                  } else {
                    if (obj.current_hit_points > obj.override_max_hit_points + obj.max_hit_points_modifier) {
                      obj.current_hit_points = obj.override_max_hit_points + obj.max_hit_points_modifier;
                    }
                  }
                  this.api.updateObject(obj).then((res: any) => {
                    this.setState({ obj, reloading: true }, () => {
                      this.setState({ reloading: false });
                    });
                  });
                }}
              />
            </Grid>
          </Grid>
          { this.state.obj.current_hit_points === 0 && 
            this.state.obj.temp_hit_points === 0 && 
            !undying && this.renderDeathSaves()
          }
        </Grid>
      </div>
    );
  }

  renderDeathSaves() {
    const fails: any[] = [];
    const successes: any[] = [];
    const obj = this.state.obj;
    for (let i = 0; i < 3; ++i) {
      fails.push(
        <CheckBox key={i}
          size={48}
          name=""
          value={obj.death_save_fails > i}
          onChange={(changed: boolean) => {
            if (changed) {
              obj.death_save_fails++;
            } else {
              obj.death_save_fails--;
            }
            this.api.updateObject(obj).then((res: any) => {
              this.setState({ obj });
            });
          }}
        />
      );
      successes.push(
        <CheckBox key={i}
          size={48}
          name=""
          value={obj.death_save_successes > i}
          onChange={(changed: boolean) => {
            if (changed) {
              obj.death_save_successes++;
            } else {
              obj.death_save_successes--;
            }
            this.api.updateObject(obj).then((res: any) => {
              this.setState({ obj });
            });
          }}
        />
      );
    }
    return (
      <Grid item container spacing={0} direction="row" style={{ borderTop: "1px solid lightgray" }}>
        <Grid item xs={12}>
          Death Saves
        </Grid>
        <Grid item xs={6}
          style={{
            display: "flex",
            justifyContent: "center"
          }}>
          Failures
        </Grid>
        <Grid item xs={6}
          style={{
            display: "flex",
            justifyContent: "center"
          }}>
          Successes
        </Grid>
        <Grid item xs={6}>
          { fails }
        </Grid>
        <Grid item xs={6}>
          { successes }
        </Grid>
      </Grid>
    );
  }

  renderBar1() {
    return [
      <Grid item key="char" xs={10} style={{ cursor: "pointer" }}
        onClick={() => {
          this.setState({ menu_open: "char" });
        }}>
        <div style={{ float: "left" }}>
          <img src={ this.state.obj.image_url === "" ? GnomeRanger : this.state.obj.image_url } alt="logo" 
            style={{
              width: "5em",
              height: "5em",
              border: "1px solid blue"
            }} 
          />
        </div>
        <div style={{ float: "left", marginLeft: "4px" }}>
          <Grid container spacing={0} direction="column">
            <Grid item>
              <div className={"MuiTypography-root MuiListItemText-primary header"}>
                { this.state.obj.name } <Settings />
              </div>
              <div style={{ fontSize: "10px", height: "16px" }}>
                { this.state.obj.race.subrace && this.state.obj.race.subrace.subrace ? this.state.obj.race.subrace.subrace.name : (this.state.obj.race.race ? this.state.obj.race.race.name : "") } 
                { this.state.obj.classes.map((char_class, key) => (
                  <span key={key}>
                    { char_class.game_class && <span> { char_class.game_class.name }{ char_class.subclass && <span> { char_class.subclass.name }</span> } { char_class.level } </span> }
                  </span>
                ))}
              </div>
              <div style={{ fontSize: "10px", height: "16px" }}>
                Level { this.state.obj.character_level }
              </div>
            </Grid>
          </Grid>
        </div>
      </Grid>,
      <Grid item key="hp" xs={2} container spacing={0} direction="column">
        { this.renderHPSmall() }
        <Grid item>
          <div>
          <ToggleButtonBox 
            name="Inspiration"
            value={this.state.obj.inspiration > 0}
            fontSize={10}
            height={16}
            color="white"
            lineHeight={1.5}
            onToggle={() => {
              const obj = this.state.obj;
              obj.inspiration = obj.inspiration === 0 ? 1 : 0;
              this.api.updateObject(obj).then((res: any) => {
                this.setState({ obj });
              });
            }}
          /></div>
        </Grid>
      </Grid>
    ];
  }

  renderBar2() {
    return [
      <Grid item key="info" xs={10} style={{ borderTop: "1px solid lightgray" }}>
        <Grid container spacing={1} direction="row">
          <Grid item xs={3} container spacing={0} direction="column">
            <Grid item>
              <div style={{
                fontSize: "11px",
                fontWeight: "bold",
                textAlign: "center"
              }}>
                Proficiency
              </div>
            </Grid>
            <Grid item>
              <div style={{
                fontSize: "24px",
                fontWeight: "bold",
                textAlign: "center"
              }}>
                { `+${this.state.obj.proficiency_modifier}` }
              </div>
            </Grid>
            <Grid item>
              <div style={{
                fontSize: "11px",
                fontWeight: "bold",
                textAlign: "center"
              }}>
                Bonus
              </div>
            </Grid>
          </Grid>
          <Grid item xs={3} container spacing={0} direction="column">
            <Grid item>
              <div style={{
                fontSize: "11px",
                fontWeight: "bold",
                textAlign: "center"
              }}>
                Walking
              </div>
            </Grid>
            <Grid item>
              <div style={{
                fontSize: "24px",
                fontWeight: "bold",
                textAlign: "center"
              }}>
                { this.state.obj.speed.walk } ft
              </div>
            </Grid>
            <Grid item>
              <div style={{
                fontSize: "11px",
                fontWeight: "bold",
                textAlign: "center"
              }}>
                Speed
              </div>
            </Grid>
          </Grid>
          <Grid item xs={3} container spacing={0} direction="column">
            <Grid item>
              <div style={{
                fontSize: "11px",
                fontWeight: "bold",
                textAlign: "center"
              }}>
                &nbsp;
              </div>
            </Grid>
            <Grid item>
              <div style={{
                fontSize: "24px",
                fontWeight: "bold",
                textAlign: "center"
              }}>
                { this.state.obj.initiative_modifier >= 0 ? `+${this.state.obj.initiative_modifier}` : `${this.state.obj.initiative_modifier}` }
              </div>
            </Grid>
            <Grid item>
              <div style={{
                fontSize: "11px",
                fontWeight: "bold",
                textAlign: "center"
              }}>
                Initiative
              </div>
            </Grid>
          </Grid>
          <Grid item xs={3} container spacing={0} direction="column">
            <Grid item>
              <div style={{
                fontSize: "11px",
                fontWeight: "bold",
                textAlign: "center"
              }}>
                Armor
              </div>
            </Grid>
            <Grid item>
              <div style={{
                fontSize: "24px",
                fontWeight: "bold",
                textAlign: "center"
              }}>
                { this.state.obj.armor_class }
              </div>
            </Grid>
            <Grid item>
              <div style={{
                fontSize: "11px",
                fontWeight: "bold",
                textAlign: "center"
              }}>
                Class
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>,
      <Grid item key="options" xs={2} container spacing={0} direction="row" style={{ borderTop: "1px solid lightgray" }}>
        <Grid item xs={6}>
          <ToggleButtonBox 
            name="Defenses"
            image={ShieldImage}
            color="white"
            value={ this.state.bar3_mode === "Defenses" }
            onToggle={() => {
              this.setState({ bar3_mode: (this.state.bar3_mode === "Defenses" ? "Conditions" : "Defenses") });
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <ToggleButtonBox 
            name="Conditions"
            image={ListImage}
            color="white"
            value={ this.state.bar3_mode === "Conditions" }
            onToggle={() => {
              this.setState({ bar3_mode: (this.state.bar3_mode === "Defenses" ? "Conditions" : "Defenses") });
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <ToggleButtonBox 
            name="Minions"
            image={PeopleImage}
            color="white"
            value={ this.state.bar3_mode === "Minions" }
            onToggle={() => {
              this.setState({ bar3_mode: (this.state.bar3_mode === "Minions" ? "Conditions" : "Minions") });
            }}
          />
        </Grid>
      </Grid>
    ];
  }

  renderBar3() {
    const return_me: any[] = [];
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
              color: (this.state.obj.advantage === true ? "green" : "lightgray"),
              fontWeight: (this.state.obj.advantage === true ? "bold" : "normal")
            }}
            onClick={() => {
              const obj = this.state.obj;
              if (obj.advantage === true) {
                obj.advantage = null;
              } else {
                obj.advantage = true;
              }
              this.updateCharacter(obj);
            }}>
            ADV
          </Grid>
          <Grid item
            style={{
              display: "flex",
              color: (this.state.obj.advantage === false ? "red" : "lightgray"),
              fontWeight: (this.state.obj.advantage === false ? "bold" : "normal")
            }}
            onClick={() => {
              const obj = this.state.obj;
              if (obj.advantage === false) {
                obj.advantage = null;
              } else {
                obj.advantage = false;
              }
              this.updateCharacter(obj);
            }}>
            DISADV
          </Grid>
        </Grid>
      </span>
    );
    if (this.state.obj.concentrating_on) {
      return_me.push(
        <span key="conc" 
          style={{ margin: "4px" }}>
          Concentrating on 
          <Grid container spacing={0} direction="row">
            <Grid item xs={9}>
              <ViewSpell spell={this.state.obj.concentrating_on} show_ritual />
            </Grid>
            <Grid item xs={3}>
              <Clear style={{ cursor: "pointer" }} 
                onClick={() => {
                  const obj = this.state.obj;
                  obj.concentrating_on = null;
                  this.api.updateObject(obj).then((res: any) => {
                    this.setState({ obj })
                  });
                }} 
              />
            </Grid>
          </Grid> 
        </span>
      );
    }
    if (this.state.bar3_mode === "Defenses") {
      // Iterate through damage_multipliers
      DAMAGE_TYPES.forEach(dmg => {
        const multipliers = this.state.obj.damage_multipliers.filter(o => o.damage_type === dmg);
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
                    const obj = this.state.obj;
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
                    this.updateCharacter(obj);
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
                    const obj = this.state.obj;
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
                    this.updateCharacter(obj);
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
                    const obj = this.state.obj;
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
                    this.updateCharacter(obj);
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
    } else if (this.state.bar3_mode === "Conditions") {
      // Iterate through conditions
      if (this.state.conditions) {
        this.state.conditions.filter(o => o.level === -1 && this.state.obj.favorite_conditions.includes(o._id)).forEach(cond => {
          return_me.push(this.renderCondition(cond, true));
        });
        this.state.conditions.filter(o => o.level === -1 && !this.state.obj.favorite_conditions.includes(o._id)).forEach(cond => {
          return_me.push(this.renderCondition(cond, false));
        });
      }
    } else if (this.state.bar3_mode === "Minions") {
      // Iterate through character's minions
      this.state.obj.minions.forEach(minion => {
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

  renderHPSmall() {
    return (
      <Grid item>
        <div style={{ margin: "4px" }}>
          <Grid container spacing={0} direction="column" 
            style={{
              border: "1px solid blue",
              textAlign: "center"
            }}>
            <Grid item style={{ 
              fontSize: "10px", 
              height: "16px", 
              margin: "1px",
              cursor: "pointer"
            }} onClick={() => {
              this.setState({ menu_open: "hp" });
            }}>
              Hit Points
            </Grid>
            <Grid item>
              <div style={{
                  display: "flex",
                  justifyContent: "center"
                }}>
                <Grid container spacing={0} direction="row" 
                  style={{ 
                    margin: "1px",
                    width: "80px" 
                  }}>
                  <Grid item xs={5} onClick={() => {
                    this.setState({ menu_open: "hp" });
                  }}>
                    { this.state.obj.current_hit_points } 
                    { this.state.obj.temp_hit_points > 0 && <span style={{ color: "blue" }}>+{this.state.obj.temp_hit_points}</span> } 
                  </Grid>
                  <Grid item xs={2} container spacing={0} direction="column" style={{ width: "10px", lineHeight: 1 }}>
                    <Grid item 
                      style={{ height: "8px", width: "10px", cursor: "pointer" }}
                      onClick={() => {
                        const obj = this.state.obj;
                        if (obj.override_max_hit_points === -1 ? (obj.current_hit_points >= (obj.max_hit_points + obj.max_hit_points_modifier)) : (obj.current_hit_points >= (obj.override_max_hit_points + obj.max_hit_points_modifier))) {

                        } else {
                          obj.current_hit_points++;
                          this.api.updateObject(obj).then((res: any) => {
                            this.setState({ obj });
                          });
                        }
                      }}>
                      +
                    </Grid>
                    <Grid item 
                      style={{ height: "8px", width: "10px", cursor: "pointer" }}
                      onClick={() => {
                        const obj = this.state.obj;
                        if (obj.temp_hit_points > 0) {
                          obj.temp_hit_points--;
                          this.api.updateObject(obj).then((res: any) => {
                            this.setState({ obj });
                          });
                        } else if (obj.current_hit_points > 0) {
                          obj.current_hit_points--;
                          this.api.updateObject(obj).then((res: any) => {
                            this.setState({ obj });
                          });
                        }
                      }}>
                      -
                    </Grid>
                  </Grid>
                  <Grid item xs={5} onClick={() => {
                    this.setState({ menu_open: "hp" });
                  }}>
                    &nbsp;/&nbsp;
                    { this.state.obj.override_max_hit_points > this.state.obj.max_hit_points ? 
                      <span style={{ color: "green" }}>{ this.state.obj.override_max_hit_points }</span> 
                      : 
                      (this.state.obj.override_max_hit_points > -1 ? <span style={{ color: "red" }}>{ this.state.obj.override_max_hit_points }</span> : this.state.obj.max_hit_points) 
                    } 
                    { this.state.obj.max_hit_points_modifier > 0 ? <span style={{ color: "green" }}>+{this.state.obj.max_hit_points_modifier}</span> : (this.state.obj.max_hit_points_modifier < 0 && <span style={{ color: "red" }}>{this.state.obj.max_hit_points_modifier}</span>) }
                  </Grid>
                </Grid>
              </div>
            </Grid>
          </Grid>
        </div>
      </Grid>
    );
  }

  renderCondition(cond: Condition, is_favorite: boolean) {
    const has_cond = this.state.obj.conditions.filter(o => o === cond._id).length > 0;
    const has_immunity = this.state.obj.condition_immunities.filter(o => o === cond._id).length > 0;
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
                const obj = this.state.obj;
                if (is_favorite) {
                  obj.favorite_conditions = obj.favorite_conditions.filter(o => o !== cond._id);
                } else {
                  obj.favorite_conditions.push(cond._id);
                }
                this.char_util.recalcAll(obj);
                this.updateCharacter(obj);
              }}>
                { is_favorite ? <Star/> : <StarBorder/> }
              </span>
              <span style={{ 
                  color: (has_cond ? "green" : "lightgray"),
                  fontWeight: (has_cond ? "bold" : "normal")  
                }} onClick={() => {
                if (!has_immunity) {
                  const obj = this.state.obj;
                  if (has_cond) {
                    obj.conditions = obj.conditions.filter(o => o !== cond._id);
                  } else {
                    obj.conditions.push(cond._id);
                  }
                  this.char_util.recalcAll(obj);
                  this.updateCharacter(obj);
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
                const obj = this.state.obj;
                if (!has_immunity) {
                  obj.condition_immunities.push(cond._id);
                  if (has_cond) {
                    obj.conditions = obj.conditions.filter(o => o !== cond._id);
                    this.char_util.recalcAll(obj);
                  }
                } else {
                  obj.condition_immunities = obj.condition_immunities.filter(o => o !== cond._id);
                }
                this.updateCharacter(obj);
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
                  const obj = this.state.obj;
                  obj.minions = obj.minions.filter(o => o.true_id !== minion.true_id);
                  this.api.updateObject(obj).then((res: any) => {
                    this.setState({ obj })
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
            obj={this.state.obj}
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
          <CharacterAbilityScores key="abilities" obj={this.state.obj} 
            onChange={() => {
              const obj = this.state.obj;
              this.char_util.recalcAll(obj);
              this.setState({ obj });
            }}
          />,
          this.renderSpacer("1"),
          <CharacterSavingThrows key="saves" obj={this.state.obj} 
            onChange={() => {
              const obj = this.state.obj;
              this.char_util.recalcAll(obj);
              this.setState({ obj });
            }}
          />,
          this.renderSpacer("2"),
          <CharacterSenses key="senses" obj={this.state.obj} 
            onChange={() => {
              const obj = this.state.obj;
              this.char_util.recalcAll(obj);
              this.setState({ obj });
            }}
          />,
        ];
      break;
      case "skills":
        return_me = 
          <CharacterSkills obj={this.state.obj} 
            onChange={() => {
              const obj = this.state.obj;
              this.char_util.recalcAll(obj);
              this.setState({ obj });
            }}
          />;
      break;
      case "equipment":
        return_me = 
          <CharacterViewEquipment 
            obj={this.state.obj}
            onChange={() => {
              const obj = this.state.obj;
              this.char_util.recalcAll(obj);
              this.setState({ obj });
            }}
          />;
      break;
      case "features":
        return_me = 
          <CharacterFeatures 
            obj={this.state.obj}
            onChange={() => {
              const obj = this.state.obj;
              this.char_util.recalcAll(obj);
              this.setState({ obj });
            }}
          />;
      break;
      case "spells":
        return_me = 
          <CharacterSpells 
            obj={this.state.obj}
            onChange={() => {
              this.setState({ obj: this.state.obj });
            }}
          />;
      break;
      case "actions":
        return_me = 
          <CharacterActions 
            obj={this.state.obj}
            onChange={() => {
              this.setState({ obj: this.state.obj });
            }}
          />;
      break;
      case "profs":
        return_me = 
          <CharacterProficiencies 
            obj={this.state.obj}
            onChange={() => {
              const obj = this.state.obj;
              this.api.updateObject(obj).then((res: any) => {
                this.setState({ obj });
              });
            }}
          />;
      break;
      case "notes":
        return_me = 
          <CharacterNotes 
            obj={this.state.obj}
            onChange={() => {
              const obj = this.state.obj;
              this.api.updateObject(obj).then((res: any) => {
                this.setState({ obj });
              });
            }}
          />;
      break;
      case "description":
        return_me = 
          <CharacterDescription
            obj={this.state.obj}
            onChange={() => {
              const obj = this.state.obj;
              this.api.updateObject(obj).then((res: any) => {
                this.setState({ obj });
              });
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

export default connector(CharacterDetails);
