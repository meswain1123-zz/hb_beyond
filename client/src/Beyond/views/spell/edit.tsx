import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Redirect } from "react-router-dom";
import {
  ArrowBack, Add
} from "@material-ui/icons";
import {
  Grid, 
  Button, 
  Tooltip, Fab,
} from "@material-ui/core";

import { 
  Spell, 
  TemplateBase,
  SpellTemplate,
  AbilityEffect,
  IStringHash,
  Condition,
  Potence,
  SlotLevel
} from "../../models";
import { 
  ABILITY_SCORES, 
  DURATIONS,
  COMPONENTS,
  CASTING_TIMES,
  SCHOOLS,
  DAMAGE_TYPES
} from "../../models/Constants";

import StringBox from "../../components/input/StringBox";
import SelectStringBox from "../../components/input/SelectStringBox";
import CheckBox from "../../components/input/CheckBox";
import ToggleButtonBox from "../../components/input/ToggleButtonBox";
import CenteredMenu from "../../components/input/CenteredMenu";
import StringToJSONBox from "../../components/input/StringToJSONBox";

import TemplateBox from "../../components/model_inputs/TemplateBox";
import AbilityEffectInput from "../../components/model_inputs/feature/AbilityEffect";

import ModelBaseDetails from "../../components/model_inputs/ModelBaseDetails";

import API from "../../utilities/smart_api";
import { APIClass } from "../../utilities/smart_api_class";

import DataUtilities from "../../utilities/data_utilities";
import { DataUtilitiesClass } from "../../utilities/data_utilities_class";



interface AppState {
  source_book: string;
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
  source_book: state.app.source_book,
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
  obj: Spell;
  processing: boolean;
  loading: boolean;
  show_effect: string;
  reloading: boolean;
  view: string;
  conditions: Condition[] | null;
}

class SpellEdit extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const obj = new Spell();
    if (this.props.source_book !== "Any") {
      obj.source_id = this.props.source_book;
    }
    this.state = {
      redirectTo: null,
      obj,
      processing: false,
      loading: false,
      show_effect: "",
      reloading: false,
      view: "Home",
      conditions: null
    };
    this.api = API.getInstance();
    this.data_util = DataUtilities.getInstance();
  }

  api: APIClass;
  data_util: DataUtilitiesClass;

  componentDidMount() {
    this.load();
  }

  submit() {
    this.setState({ processing: true }, () => {
      const obj = this.state.obj;
      this.api.upsertObject("spell", obj).then((res: any) => {
        this.setState({ processing: false, redirectTo: "/beyond/spell" });
      });
    });
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getSetOfObjects(["condition"]).then((res: any) => {
        const conditions: Condition[] = res.condition;

        let { id } = this.props.match.params;
        if (id !== undefined && this.state.obj._id !== id) {
          this.setState({ 
            conditions
          }, () => {
            this.load_object(id);
          });
        } else {
          this.setState({ 
            conditions, loading: false
          });
        }
      });
    });
  }

  // Loads the editing Creature into state
  load_object(id: string) {
    this.api.getFullObject("spell", id).then((res: any) => {
      if (res) {
        const obj = res;
        this.setState({ obj, loading: false });
      }
    });
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else { 
      const formHeight = this.props.height - (this.props.width > 600 ? 220 : 220);
      return (
        <Grid container spacing={1} direction="column">
          <Grid item container spacing={1} direction="row">
            <Grid item xs={3}>
              <Tooltip title={`Back to Spells`}>
                <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                  onClick={ () => {
                    this.setState({ redirectTo:`/beyond/spell` });
                  }}>
                  <ArrowBack/>
                </Fab>
              </Tooltip>
            </Grid>
            <Grid item xs={9}>
              <TemplateBox
                obj={this.state.obj}
                type="Spell"
                useTemplate={(template: TemplateBase) => {
                  const spell_template: SpellTemplate = template as SpellTemplate;
                  const obj = this.state.obj;
                  obj.copyTemplate(spell_template);
                  this.setState({ obj });
                }}
              />
            </Grid>
          </Grid>
          <Grid item>
            <span className={"MuiTypography-root MuiListItemText-primary header"}>
              { this.state.obj._id === "" ? "Create Spell" : `Edit ${this.state.obj.name}` }
            </span>
          </Grid>
          <Grid item 
            style={{ 
              height: `${formHeight}px`, 
              overflowY: "scroll", 
              overflowX: "hidden" 
            }}>
            <CenteredMenu
              options={["Home","Parse"]}
              selected={this.state.view}
              onSelect={(view: string) => {
                this.setState({ view });
              }}
            />
            { this.state.view === "Home" ?
              <Grid container spacing={1} direction="column">
                <Grid item>
                  <StringBox 
                    value={this.state.obj.name} 
                    message={this.state.obj.name.length > 0 ? "" : "Name Invalid"}
                    name="Name"
                    onBlur={(value: string) => {
                      const obj = this.state.obj;
                      obj.name = value;
                      this.setState({ obj });
                    }}
                  />
                </Grid>
                <Grid item container spacing={1} direction="row">
                  <Grid item xs={3}>
                    <SelectStringBox 
                      options={["0","1","2","3","4","5","6","7","8","9"]}
                      value={`${this.state.obj.level.value}`} 
                      name="Spell Level"
                      onChange={(value: string) => {
                        const obj = this.state.obj;
                        obj.level = new SlotLevel(+value);
                        this.setState({ obj });
                      }}
                    />
                  </Grid>
                  <Grid item xs={3} container spacing={1} direction="row">
                    <Grid item xs={9}>
                      <SelectStringBox 
                        name="Casting Time"
                        options={CASTING_TIMES}
                        value={this.state.obj.casting_time}
                        onChange={(value: string) => {
                          const obj = this.state.obj;
                          if (value === 'A') {
                            obj.casting_time = value;
                          } else if (value === 'BA') {
                            obj.casting_time = value;
                          } else if (value === 'RA') {
                            obj.casting_time = value;
                          } else if (value === 'Special') {
                            obj.casting_time = value;
                          } else if (value === 'Attack') {
                            obj.casting_time = value;
                          }
                          this.setState({ obj });
                        }}
                      /> 
                    </Grid>
                    <Grid item xs={3}>
                      <CheckBox 
                        name="R" 
                        value={this.state.obj.ritual} 
                        onChange={(e: boolean) => {
                          const obj = this.state.obj;
                          obj.ritual = e;
                          this.setState({ obj });
                        }} 
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={3} container spacing={1} direction="row">
                    <Grid item xs={6}>
                      <StringBox 
                        value={this.state.obj.range} 
                        name="Range"
                        onBlur={(value: string) => {
                          const obj = this.state.obj;
                          obj.range = value;
                          this.setState({ obj });
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <StringBox 
                        value={this.state.obj.range_2} 
                        name="Area"
                        onBlur={(value: string) => {
                          const obj = this.state.obj;
                          obj.range_2 = value;
                          this.setState({ obj });
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={3}>
                    <SelectStringBox 
                      name="Components"
                      options={COMPONENTS}
                      values={this.state.obj.components}
                      multiple
                      onChange={(values: string[]) => {
                        const obj = this.state.obj;
                        obj.components = values;
                        this.setState({ obj });
                      }}
                    /> 
                  </Grid>
                </Grid>
                <Grid item container spacing={1} direction="row">
                  <Grid item xs={4} container spacing={1} direction="row">
                    <Grid item xs={ this.state.obj.duration === "Instantaneous" ? 12 : 9}>
                      <SelectStringBox 
                        name="Duration"
                        options={DURATIONS}
                        value={ !DURATIONS.includes(this.state.obj.duration) ? "Special" : this.state.obj.duration }
                        onChange={(value: string) => {
                          const obj = this.state.obj;
                          obj.duration = value;
                          this.setState({ obj });
                        }}
                      /> 
                    </Grid>
                    { this.state.obj.duration !== "Instantaneous" && 
                      <Grid item xs={3}>
                        <CheckBox 
                          name="C" 
                          value={this.state.obj.concentration} 
                          onChange={(e: boolean) => {
                            const obj = this.state.obj;
                            obj.concentration = e;
                            this.setState({ obj });
                          }} 
                        />
                      </Grid>
                    } 
                    { (this.state.obj.duration === "Special" || !DURATIONS.includes(this.state.obj.duration)) && 
                      <Grid item xs={12}>
                        <StringBox 
                          name="Duration"
                          value={this.state.obj.duration === "Special" ? "" : this.state.obj.duration}
                          onBlur={(value: string) => {
                            const obj = this.state.obj;
                            obj.duration = value;
                            this.setState({ obj });
                          }}
                        /> 
                      </Grid>
                    } 
                  </Grid>
                  <Grid item xs={4}>
                    <SelectStringBox 
                      options={SCHOOLS}
                      value={this.state.obj.school} 
                      name="School"
                      onChange={(value: string) => {
                        const obj = this.state.obj;
                        obj.school = value;
                        this.setState({ obj });
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <SelectStringBox 
                      name="Saving Throw"
                      options={ABILITY_SCORES}
                      value={this.state.obj.saving_throw_ability_score}
                      onChange={(value: string) => {
                        const obj = this.state.obj;
                        obj.saving_throw_ability_score = value;
                        this.setState({ obj });
                      }}
                    /> 
                  </Grid>
                </Grid>
                { this.state.obj.components.includes("M") &&
                  <Grid item>
                    <StringBox 
                      name="Material Component"
                      value={this.state.obj.material_component}
                      onBlur={(value: string) => {
                        const obj = this.state.obj;
                        obj.material_component = value;
                        this.setState({ obj });
                      }}
                    /> 
                  </Grid>
                }
                <Grid item container spacing={1} direction="column">
                  <Grid item>
                    <span className={"MuiTypography-root MuiListItemText-primary header"}>
                      Effects
                    </span>
                    <Tooltip title={`Add Effect`}>
                      <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                        onClick={ () => {
                          const obj = this.state.obj;
                          const effect = new AbilityEffect();
                          obj.effects.push(effect);
                          this.setState({ obj, show_effect: effect.true_id });
                        }}>
                        <Add/>
                      </Fab>
                    </Tooltip>
                  </Grid>
                  { !this.state.reloading && this.state.obj.effects.map((effect, key) => {
                    let name = effect.type;
                    if (!["None","Self Condition"].includes(effect.type) && effect.attack_type !== "None") {
                      name += ` ${effect.attack_type}`
                    }
      
                    return (
                      <Grid item key={key} container spacing={1} direction="column">
                        <Grid item>
                          <ToggleButtonBox
                            name={ name }
                            value={ this.state.show_effect === effect.true_id }
                            onToggle={ () => { 
                              this.setState({ show_effect: (this.state.show_effect === effect.true_id ? "" : effect.true_id) });
                            }}
                          />
                        </Grid>
                        { this.state.show_effect === effect.true_id && 
                          <Grid item>
                            <AbilityEffectInput 
                              obj={effect}
                              slot_level={this.state.obj.level.value}
                              onChange={() => {
                                const obj = this.state.obj;
                                this.setState({ obj });
                              }}
                              onDelete={() => {
                                const obj = this.state.obj;
                                obj.effects = obj.effects.filter(o => o.true_id !== effect.true_id);
                                this.setState({ obj, reloading: true }, () => { this.setState({ reloading: false }); });
                              }}
                            />
                          </Grid>        
                        }
                      </Grid>
                    );
                  })}
                </Grid>
                <ModelBaseDetails key="description"
                  obj={this.state.obj}
                  onChange={() => {
                    const obj = this.state.obj;
                    this.setState({ obj });
                  }}
                />
              </Grid>
            : this.state.view === "Parse" &&
              <StringToJSONBox 
                onParseAll={(parse_me: string) => {
                  this.parse_all(parse_me);
                }}
              />
            }
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              disabled={this.state.processing}
              onClick={ () => { 
                this.submit();
              }}>
              Submit
            </Button>
            <Button
              variant="contained"
              disabled={this.state.processing}
              style={{ marginLeft: "4px" }}
              onClick={ () => { 
                this.setState({ redirectTo:`/beyond/spell` });
              }}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      ); 
    }
  }

  parse_all(parse_me: string) {
    let name = "";
    let description = "";
    let level = "";
    let school = "";
    let casting_time = "";
    let range = "";
    let components = "";
    let material = "";
    let duration = "";
    let saving_throw = "";
    let effects: IStringHash[] = [];

    const words = parse_me.split(" ");
    let currently_building = "";
    if (this.state.conditions) {
      for (let i = 0; i < words.length; ++i) {
        const word = this.data_util.clean_for_parse(words[i]);
        if (level === "") {
          const found = this.data_util.find_one_in_string(word, ["cantrip","1st-level","2nd-level","3rd-level","4th-level","5th-level","6th-level","7th-level","8th-level","9th-level"]);
          if (found !== "") {
            level = found;
          } else {
            name += word + " ";
          }
        } else if (school === "") {
          const found = this.data_util.find_one_in_string(word, SCHOOLS);
          if (found !== "") {
            school = found;
          }
        } else {
          if (casting_time === "") {
            currently_building += word + " ";
            const found = this.data_util.find_one_in_string(currently_building, 
              [
                "bonus action","reaction","action","1 minute",
                "10 minutes","1 hour","special"
              ]);
            if (found !== "") {
              if (found === "bonus action") {
                casting_time = "BA";
              } else if (found === "reaction") {
                casting_time = "RA";
              } else if (found === "action") {
                casting_time = "A";
              } else {
                casting_time = this.data_util.capitalize_firsts(found, true);
              }
              currently_building = "";
            }
          } else if (range === "") {
            if (word === "components") {
              range = currently_building.replace("range ","").trim();
              currently_building = word + " ";
            } else {
              currently_building += word + " ";
            }
          } else if (components === "") {
            if (word === "duration") {
              components = currently_building.replace("components ","").trim();
              currently_building = word + " ";
            } else {
              currently_building += words[i] + " ";
            }
          } else if (duration === "") {
            currently_building += word + " ";
            const found = this.data_util.find_one_in_string(currently_building, DURATIONS);
            if (found !== "") {
              duration = found;
              currently_building = "";
            }
          } else {
            description += words[i] + " ";
            if (saving_throw === "" && word === "throw" && words[i - 1].toLowerCase() === "saving") {
              saving_throw = this.data_util.ability_score_abbreviation(words[i - 2]);
            }
            if (word === "damage") {
              const damage_type = this.data_util.find_one_in_string(words[i - 1], DAMAGE_TYPES);
              if (damage_type !== "") {
                const dice_roll = this.data_util.parse_dice_roll(words[i - 2]);
                if (dice_roll.count !== 0) {
                  effects.push({ 
                    type: "Damage", 
                    str: `${words[i - 2]} ${words[i - 1]} ${word}`
                  });
                }
              }
            } else if (word === "save" && words[i - 1].toLowerCase() === "failed") {
              effects.push({ 
                type: "Save"
              });
            } else if (word === "attack") {
              const attack_type = this.data_util.find_one_in_string(`${words[i - 2]} ${words[i - 1]}`, ["ranged spell", "melee spell", "ranged", "melee"]);
              if (attack_type !== "") {
                effects.push({ 
                  type: "Attack", 
                  str: attack_type
                });
              }
            } else if (word === "level") {
              if (words[i - 2].toLowerCase() === "each" && 
                words[i - 1].toLowerCase() === "slot") {
                // back up ten steps and look for damage increases by
                let word2 = "";
                for (let j = i - 10; j < i; ++j) {
                  word2 = this.data_util.clean_for_parse(words[j]);
                  if (word2 === "damage") {
                    word2 = this.data_util.clean_for_parse(words[j + 1]);
                    if (word2 === "increases") {
                      word2 = this.data_util.clean_for_parse(words[j + 2]);
                      if (word2 === "by") {
                        const roll_increase = this.data_util.parse_dice_roll(words[j + 3]);
                        if (roll_increase.count > 0) {
                          effects.push({
                            type: "Increase",
                            str: words[j + 3]
                          });
                        }
                      }
                    }
                  }
                }
                // damage increases by 1d8, for each slot level
              }
            } else {
              const obj_finder = this.state.conditions.filter(o => o.name.toLowerCase() === word);
              if (obj_finder.length === 1) {
                if (name.includes("self")) {
                  effects.push({ 
                    type: "Self Condition", 
                    str: obj_finder[0]._id
                  });
                } else {
                  effects.push({ 
                    type: "Condition", 
                    str: obj_finder[0]._id
                  });
                }
              }
            }
          }
        }
      }
    }

    const pieces: IStringHash[] = [];
    if (name !== "") {
      pieces.push({
        type: "Name",
        str: name.trim()
      });
    }
    if (description !== "") {
      pieces.push({
        type: "Description",
        str: description.trim()
      });
    }
    if (level !== "") {
      pieces.push({
        type: "Level",
        str: level
      });
    }
    if (school !== "") {
      pieces.push({
        type: "School",
        str: school
      });
    }
    if (casting_time !== "") {
      pieces.push({
        type: "Casting Time",
        str: casting_time
      });
    }
    if (range !== "") {
      pieces.push({
        type: "Range",
        str: range
      });
    }
    if (components !== "") {
      pieces.push({
        type: "Components",
        str: components
      });
    }
    if (material !== "") {
      pieces.push({
        type: "Material",
        str: material
      });
    }
    if (duration !== "") {
      pieces.push({
        type: "Duration",
        str: duration
      });
    }
    if (saving_throw !== "") {
      pieces.push({
        type: "Saving Throw",
        str: saving_throw
      });
    }
    this.parse_pieces(pieces);
    this.parse_effects(effects);
  }

  parse_pieces(pieces: IStringHash[]) {
    const obj = this.state.obj;
    pieces.forEach(piece => {
      if (piece.type === "Name") {
        obj.name = this.data_util.capitalize_firsts(piece.str, true);
      } else if (piece.type === "Description") {
        obj.description = piece.str;
      } else if (piece.type === "Level") {
        if (piece.str === "cantrip") {
          obj.level = new SlotLevel(0);
        } else {
          obj.level = new SlotLevel(+piece.str[0]);
        }
      } else if (piece.type === "School") {
        obj.school = this.data_util.capitalize_first(piece.str, true);
      } else if (piece.type === "Casting Time") {
        if (piece.str === 'A') {
          obj.casting_time = piece.str;
        } else if (piece.str === 'BA') {
          obj.casting_time = piece.str;
        } else if (piece.str === 'RA') {
          obj.casting_time = piece.str;
        } else if (piece.str === 'Special') {
          obj.casting_time = piece.str;
        } else if (piece.str === 'Attack') {
          obj.casting_time = piece.str;
        }
      } else if (piece.type === "Range") {
        obj.range = this.data_util.capitalize_firsts(piece.str, true);
      } else if (piece.type === "Components") {
        obj.material_component = "";
        const words = piece.str.trim().split(" ");
        for (let i = 0; i < words.length; ++i) {
          const word = words[i];
          const cleaned = this.data_util.clean_for_parse(word);
          if (["v","s","m"].includes(cleaned)) {
            obj.components.push(cleaned.toUpperCase());
          } else if (obj.components.includes("M")) {
            obj.material_component += word + " ";
          }
        }
      } else if (piece.type === "Duration") {
        obj.duration = this.data_util.capitalize_firsts(piece.str, true);
      } else if (piece.type === "Saving Throw") {
        obj.saving_throw_ability_score = piece.str;
      } else {
        console.log(piece);
      } 
    });
    this.setState({ obj, view: "Home" });
  }

  parse_effects(pieces: IStringHash[]) {
    const obj = this.state.obj;
    let effect = new AbilityEffect();
    pieces.forEach(piece => {
      if (piece.type === "Damage") {
        if (effect.type !== "None") {
          if (effect.type === "Utility" || effect.attack_type === "Save") {
            effect.type = "Control";
          }
          obj.effects.push(effect);
          effect = new AbilityEffect();
        }
        const words = piece.str.split(" ");
        effect.type = this.data_util.capitalize_first(words[1]);
        effect.potence_type = obj.level.value === 0 ? "Character" : "Slot";
        const potence = new Potence();
        potence.rolls = this.data_util.parse_dice_roll(words[0]);
        potence.level = obj.level.value === 0 ? 1 : obj.level.value;
        effect.potences.push(potence);
      } else if (piece.type === "Attack") {
        if (effect.attack_type !== "None") {
          if (effect.type === "Utility" || effect.attack_type === "Save") {
            effect.type = "Control";
          }
          obj.effects.push(effect);
          effect = new AbilityEffect();
        }
        effect.attack_type = this.data_util.capitalize_firsts(piece.str);
      } else if (piece.type === "Save") {
        if (effect.attack_type === "None") {
          effect.attack_type = "Save";
        }
      } else if (piece.type === "Condition") {
        if (effect.type !== "None") {
          if (effect.type === "Utility" && effect.attack_type === "Save") {
            effect.type = "Control";
          }
          obj.effects.push(effect);
          effect = new AbilityEffect();
        }
        effect.type = "Utility";
      } else if (piece.type === "Self Condition") {
        if (effect.type !== "None") {
          if (effect.type === "Utility" || effect.attack_type === "Save") {
            effect.type = "Control";
          }
          obj.effects.push(effect);
          effect = new AbilityEffect();
        }
        effect.type = "Self Condition";
        effect.conditions_applied.push(piece.str);
      } else if (piece.type === "Increase") {
        if (effect.potences.length === 1) {
          const roll_increase = this.data_util.parse_dice_roll(piece.str);
          const first_potence = effect.potences[0];
          let level = first_potence.level + 1;
          let count = first_potence.rolls.count;
          while (level < 10) {
            count += roll_increase.count
            const potence = new Potence();
            potence.rolls.count = count;
            potence.rolls.size = first_potence.rolls.size;
            potence.level = level;
            effect.potences.push(potence);
            level++;
          }
        } else if (obj.effects.length > 0) {
          const roll_increase = this.data_util.parse_dice_roll(piece.str);
          const first_potence = obj.effects[0].potences[0];
          let level = first_potence.level + 1;
          let count = first_potence.rolls.count;
          while (level < 10) {
            count += roll_increase.count
            const potence = new Potence();
            potence.rolls.count = count;
            potence.rolls.size = first_potence.rolls.size;
            potence.level = level;
            obj.effects[0].potences.push(potence);
            level++;
          }
        }
      } else {
        console.log(piece);
      } 
    });
    if (effect.type === "None" || effect.type === "Utility") {
      if (effect.attack_type === "Save" || obj.saving_throw_ability_score !== "") {
        effect.type = "Control";
        effect.attack_type = "Save";
      } else {
        effect.type = "Utility";
      }
    }
    obj.effects.push(effect);
    this.setState({ obj, view: "Home" });
  }
}

export default connector(SpellEdit);
