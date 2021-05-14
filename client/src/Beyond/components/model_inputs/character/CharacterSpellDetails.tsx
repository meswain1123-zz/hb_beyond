import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  ExpandMore
} from "@material-ui/icons";
import {
  Grid, 
  Popover,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "@material-ui/core";

import { 
  Character,
  CharacterSpecialSpell,
  CharacterSpell,
  CreatureInstance,
  RollPlus,
} from "../../../models";

import ToggleButtonBox from "../../input/ToggleButtonBox";
import ButtonBox from "../../input/ButtonBox";
import StringBox from '../../input/StringBox';

import ViewSpell from "../ViewSpell";

import Roller from "../Roller";
import CharacterSummonTransformOptions from "./CharacterSummonTransformOptions";

import CharacterCastButton from "./CharacterCastButton";
import CharacterResourceBoxes from "./CharacterResourceBoxes";

import API from "../../../utilities/smart_api";
import { APIClass } from "../../../utilities/smart_api_class";
import CharacterUtilities from "../../../utilities/character_utilities";
import { CharacterUtilitiesClass } from "../../../utilities/character_utilities_class";


interface AppState {
  width: number;
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
  width: state.app.width
})

const mapDispatch = {
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  obj: Character;
  spell: CharacterSpell;
  level: number;
  onChange: (change_types: string[]) => void;
  onClose: () => void;
}

export interface State {
  search_string: string;
  view: string;
  level: number;
  selected_option: any;
  popoverAnchorEl: HTMLDivElement | null;
  popoverMode: string;
}

class CharacterSpellDetails extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      search_string: "",
      view: "", 
      level: -1,
      selected_option: null,
      popoverAnchorEl: null,
      popoverMode: ""
    };
    this.api = API.getInstance();
    this.char_util = CharacterUtilities.getInstance();
  }

  api: APIClass;
  char_util: CharacterUtilitiesClass;

  componentDidMount() {
  }

  get_level_string(): string {
    const level = this.state.level;
    let level_str = "";
    if (level === 0) {
      level_str = "Cantrip";
    } else if (level === 1) {
      level_str = "1st";
    } else if (level === 2) {
      level_str = "2nd";
    } else if (level === 3) {
      level_str = "3rd";
    } else {
      level_str = `${level}th`;
    }
    return level_str;
  }

  load() {
    if (this.props.level === -1) {
      this.setState({ level: this.props.spell.level });
    } else {
      this.setState({ level: this.props.level });
    }
  }

  render() {
    if (this.state.level === -1) {
      this.load();
      return (<span>Loading...</span>);
    } else {
      let the_spell = this.props.spell.the_spell;
      let show_ritual = false;
      if (this.props.spell.source_type === "Class" && this.props.obj instanceof Character) {
        // Check if their class can do rituals
        const class_finder = this.props.obj.classes.filter(o => o.game_class_id === this.props.spell.source_id);
        if (class_finder.length === 1) {
          const char_class = class_finder[0];
          show_ritual = char_class.ritual_casting;
        }
      } 
      if (the_spell) {
        const spell = this.props.spell;
        const level = this.state.level === -1 ? this.props.spell.level : this.state.level;
        const potence = this.props.spell.get_potence(level, this.props.obj);
        return (
          <div 
            style={{ 
              backgroundColor: "white",
              color: "black",
              border: "1px solid blue",
              height: "800px",
              width: "324px",
              overflowX: "hidden",
              padding: "4px",
              fontSize: "11px"
            }}>
            <Grid container spacing={1} direction="column"
              style={{ 
                backgroundColor: "white",
                color: "black",
                minHeight: "800px",
                width: "316px",
                overflowX: "hidden"
              }}>
              <Grid item style={{ width: "316px" }}>
                <ViewSpell spell={this.props.spell}
                  show_level 
                  show_ritual={show_ritual}
                  fontSize={20}
                  fontWeight={"bold"}
                />
              </Grid>
              <Grid item style={{ width: "316px" }}>
                { this.props.spell.level_and_school }
              </Grid>
              <Grid item container spacing={0} direction="row">
                <Grid item xs={6}>
                  <CharacterCastButton
                    obj={this.props.spell}
                    character={this.props.obj}
                    level={level}
                    onChange={(change_types: string[]) => {
                      this.props.onChange(change_types);
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  { this.renderLevelOptions() }
                </Grid>
              </Grid>
              { spell.use_attack &&
                <Grid item style={{
                  display: "flex",
                  justifyContent: "center"
                }}>
                  <ButtonBox
                    name={ `Attack: ${spell.attack_string}` }
                    onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                      this.setState({ 
                        popoverMode: "Attack", 
                        popoverAnchorEl: event.currentTarget 
                      });
                    }} 
                  />
                </Grid>
              }
              { !["Control","Utility","Summon","Transform","Create Resource"].includes(spell.effect_string) &&
                <Grid item style={{
                  display: "flex",
                  justifyContent: "center"
                }}>
                  <ButtonBox
                    fontSize={9}
                    name={ spell.get_potence_string(this.state.level, this.props.obj) }
                    image={ spell.effect_string }
                    onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                      this.setState({ 
                        popoverAnchorEl: event.currentTarget, 
                        popoverMode: "Damage" 
                      });
                    }} 
                  />
                </Grid>
              }
              { potence && ["Summon","Transform"].includes(spell.effect_string) &&
                <Grid item style={{
                  display: "flex",
                  justifyContent: "center"
                }} container spacing={1} direction="row">
                  <Grid item xs={9}>
                    <CharacterSummonTransformOptions 
                      name="Choose"
                      obj={this.props.obj}
                      spell={spell}
                      potence={potence}
                      value={this.state.selected_option}
                      onChange={(selected_option: any) => {
                        this.setState({ selected_option });
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <ButtonBox 
                      disabled={ this.state.selected_option === null }
                      name={spell.effect_string}
                      onClick={() => {
                        for (let i = 0; i < this.state.selected_option.count; ++i) {
                          const creature_instance = new CreatureInstance();
                          if (this.state.selected_option.creature) {
                            creature_instance.copyCreature(this.state.selected_option.creature);
                          } else if (this.state.selected_option.summon) {
                            creature_instance.copySummonStatBlock(
                              this.state.selected_option.summon, 
                              this.props.obj, this.props.spell.source_id, this.props.spell.level, this.state.level
                            );
                          }
                          if (i > 0) {
                            creature_instance.name += ` ${i}`;
                          }
                          this.props.obj.minions.push(creature_instance);
                        }
                        this.props.onChange(["Minions"]);
                      }}
                    />
                  </Grid>
                </Grid>
              }
              { potence && potence.extra.length > 0 &&
                <Grid item>
                  { potence.extra }
                </Grid>
              }
              <Grid item style={{ width: "316px", fontWeight: "bold" }}>
                <Accordion>
                  <AccordionSummary 
                    style={{
                      backgroundColor: "lightgray",
                      color: "black",
                      fontWeight: "bold",
                      height: "30px"
                    }}
                    expandIcon={<ExpandMore />}>
                    Customize
                  </AccordionSummary>
                  <AccordionDetails>
                    <div style={{
                      width: "100%"
                    }}>
                      <Grid container spacing={1} direction="row">
                        <Grid item xs={4}>
                          <StringBox
                            name="To hit Override"
                            value={ this.props.spell.customizations.spell_attack ? `${this.props.spell.customizations.spell_attack}` : "" }
                            type="number"
                            onBlur={(value: string) => {
                              if (value === "") {
                                delete this.props.spell.customizations.spell_attack;
                              } else {
                                try {
                                  this.props.spell.customizations.spell_attack = +value;
                                } catch {}
                              }
                              // this.props.onChange();
                            }}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <StringBox
                            name="To hit Bonus"
                            value={ this.props.spell.customizations.spell_attack_bonus ? `${this.props.spell.customizations.spell_attack_bonus}` : "" }
                            type="number"
                            onBlur={(value: string) => {
                              if (value === "") {
                                delete this.props.spell.customizations.spell_attack_bonus;
                              } else {
                                try {
                                  this.props.spell.customizations.spell_attack_bonus = +value;
                                } catch {}
                              }
                              // this.props.onChange();
                            }}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <StringBox
                            name="Damage Bonus"
                            value={ this.props.spell.customizations.damage_bonus ? `${this.props.spell.customizations.damage_bonus}` : "" }
                            type="number"
                            onBlur={(value: string) => {
                              if (value === "") {
                                delete this.props.spell.customizations.damage_bonus;
                              } else {
                                try {
                                  this.props.spell.customizations.damage_bonus = +value;
                                } catch {}
                              }
                              // this.props.onChange();
                            }}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <StringBox
                            name="DC Override"
                            value={ this.props.spell.customizations.spell_dc ? `${this.props.spell.customizations.spell_dc}` : "" }
                            type="number"
                            onBlur={(value: string) => {
                              if (value === "") {
                                delete this.props.spell.customizations.spell_dc;
                              } else {
                                try {
                                  this.props.spell.customizations.spell_dc = +value;
                                } catch {}
                              }
                              // this.props.onChange();
                            }}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <StringBox
                            name="DC Bonus"
                            value={ this.props.spell.customizations.spell_dc_bonus ? `${this.props.spell.customizations.spell_dc_bonus}` : "" }
                            type="number"
                            onBlur={(value: string) => {
                              if (value === "") {
                                delete this.props.spell.customizations.spell_dc_bonus;
                              } else {
                                try {
                                  this.props.spell.customizations.spell_dc_bonus = +value;
                                } catch {}
                              }
                              // this.props.onChange();
                            }}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <ToggleButtonBox
                            name="Display As Attack"
                            value={ this.props.spell.customizations.display_as_attack ? this.props.spell.customizations.display_as_attack === "true" : false }
                            onToggle={() => {
                              if (this.props.spell.customizations.display_as_attack) {
                                delete this.props.spell.customizations.display_as_attack;
                              } else {
                                try {
                                  this.props.spell.customizations.display_as_attack = "true";
                                } catch {}
                              }
                              // this.props.onChange();
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <StringBox
                            name="Name"
                            value={ this.props.spell._name }
                            onBlur={(value: string) => {
                              this.props.spell._name = value;
                              // this.props.onChange();
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <StringBox
                            name="Notes"
                            multiline
                            value={ this.props.spell.customizations.notes ? `${this.props.spell.customizations.notes}` : "" }
                            onBlur={(value: string) => {
                              if (value === "") {
                                delete this.props.spell.customizations.notes;
                              } else {
                                try {
                                  this.props.spell.customizations.notes = value;
                                } catch {}
                              }
                              // this.props.onChange();
                            }}
                          />
                        </Grid>
                      </Grid>
                    </div>
                  </AccordionDetails>
                </Accordion>
              </Grid>
              <Grid item>
                <b>Casting Time: </b><em style={{ fontStyle: "normal" }}>{ this.props.spell.casting_time_string }</em>
              </Grid>
              <Grid item>
               <b>Range/Area: </b><em style={{ fontStyle: "normal" }}>{ this.props.spell.range_string }</em>
              </Grid>
              <Grid item>
                <b>Components: </b><em style={{ fontStyle: "normal" }}>{ this.props.spell.components_string }</em>
              </Grid>
              <Grid item>
                <b>Duration: </b><em style={{ fontStyle: "normal" }}>{ this.props.spell.duration_string }</em>
              </Grid>
              { this.props.spell.use_attack &&
                <Grid item>
                  <b>Attack/Save: </b>
                  <em style={{ fontStyle: "normal" }}>
                    { this.props.spell.attack_string }
                  </em>
                </Grid>
              }
              <Grid item>
                { the_spell.description }
              </Grid>
              { spell instanceof CharacterSpecialSpell && spell.special_spell_feature &&
                <Grid item>
                  { spell.description }
                </Grid>
              }
            </Grid>
            <Popover key="rolls"
              open={ this.state.popoverAnchorEl !== null && this.state.popoverMode !== "" }
              anchorEl={this.state.popoverAnchorEl}
              onClose={() => {
                this.setState({ popoverAnchorEl: null, popoverMode: "" });
              }}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              { this.renderRoll() }
            </Popover>
          </div>
        );
      } else return null;
    }
  }

  renderLevelOptions() {
    const spell = this.props.spell;
    const level = this.state.level === -1 ? this.props.spell.level : this.state.level;
    if (spell instanceof CharacterSpecialSpell) {
      if (spell.special_spell_feature) {
        const ssf = spell.special_spell_feature;
        // "Normal","At Will","Only Special Resource","Or Special Resource","And Special Resource"
        const return_me: any[] = [];
        if (ssf.slot_override.includes("Special")) {
          // Need to show the Special Resources
          return_me.push(
            <CharacterResourceBoxes 
              key="special"
              resource={spell}
              character={this.props.obj}
              onChange={() => {
                // this.props.onChange(["Resources"]);
              }}
            />
          );
        }
        if (["At Will","Or Special Resource","And Special Resource"].includes(ssf.slot_override)) {
          // Need to show the slots for the level
          const slot_levels = Array.from(new Set(this.props.obj.slots.filter(o => o.level >= spell.level).map(o => o.level)));
          const slots = this.props.obj.slots.filter(o => o.level === level);
          if (slot_levels.length > 1) {
            return_me.push(
              <Grid key="slots" container spacing={0} direction="row">
                <Grid item xs={4}>
                  Level
                </Grid>
                <Grid item xs={8} container spacing={0} direction="row">
                  <Grid item xs={4}>
                    <ButtonBox
                      name=" - "
                      disabled={ level === Math.min(...slot_levels) }
                      onClick={() => {
                        this.setState({ level: Math.max(...slot_levels.filter(o => o < level)) });
                      }} 
                    />
                  </Grid>
                  <Grid item xs={4} style={{
                    display: "flex",
                    justifyContent: "center"
                  }}>
                    { level }
                  </Grid>
                  <Grid item xs={4}>
                    <ButtonBox
                      name=" + "
                      disabled={ level === Math.max(...slot_levels) }
                      onClick={() => {
                        this.setState({ level: Math.min(...slot_levels.filter(o => o > level)) });
                      }} 
                    />
                  </Grid>
                </Grid>
                { slots.map((slot, key) => {
                  return (
                    <Grid item key={key} xs={12}>
                      <CharacterResourceBoxes 
                        resource={slot}
                        character={this.props.obj}
                        onChange={() => {
                          this.props.onChange(["Resources"]);
                        }}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            );
          } else {
            return_me.push(
              <Grid key="slots" container spacing={0} direction="row">
                { slots.map((slot, key) => {
                  return (
                    <Grid item key={key} xs={12}>
                      <CharacterResourceBoxes 
                        resource={slot}
                        character={this.props.obj}
                        onChange={() => {
                          this.props.onChange(["Resources"]);
                        }}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            );
          }
        }
        return return_me;
      }
    } else {
      if (level > 0) { // and not at will and not ritual only
        const slot_levels = Array.from(new Set(this.props.obj.slots.filter(o => o.level >= this.props.spell.level).map(o => o.level)));
        const slots = this.props.obj.slots.filter(o => o.level === level);
        if (slot_levels.length > 1) {
          return (
            <Grid container spacing={0} direction="row">
              <Grid item xs={4}>
                Level
              </Grid>
              <Grid item xs={8} container spacing={0} direction="row">
                <Grid item xs={4}>
                  <ButtonBox
                    name=" - "
                    disabled={ level === Math.min(...slot_levels) }
                    onClick={() => {
                      this.setState({ level: Math.max(...slot_levels.filter(o => o < level)) });
                    }} 
                  />
                </Grid>
                <Grid item xs={4} style={{
                  display: "flex",
                  justifyContent: "center"
                }}>
                  { level }
                </Grid>
                <Grid item xs={4}>
                  <ButtonBox
                    name=" + "
                    disabled={ level === Math.max(...slot_levels) }
                    onClick={() => {
                      this.setState({ level: Math.min(...slot_levels.filter(o => o > level)) });
                    }} 
                  />
                </Grid>
              </Grid>
              { slots.map((slot, key) => {
                return (
                  <Grid item key={key} xs={12}>
                    <CharacterResourceBoxes 
                      resource={slot}
                      character={this.props.obj}
                      onChange={() => {
                        this.props.onChange(["Resources"]);
                      }}
                    />
                  </Grid>
                );
              })}
            </Grid>
          );
        } else {
          return (
            <Grid container spacing={0} direction="row">
              { slots.map((slot, key) => {
                return (
                  <Grid item key={key} xs={12}>
                    <CharacterResourceBoxes 
                      resource={slot}
                      character={this.props.obj}
                      onChange={() => {
                        this.props.onChange(["Resources"]);
                      }}
                    />
                  </Grid>
                );
              })}
            </Grid>
          );
        }
      }
    }
    return null;
  }

  renderRoll() {
    const mode = this.state.popoverMode;
    const spell = this.props.spell;
    if (spell && spell.spell) {
      if (mode === "Attack") {
        return (
          <Roller 
            name={spell.name}
            char={this.props.obj}
            rolls={spell.attack.attack_rolls} 
            type="Attack" 
          />
        );
      } else if (mode === "Damage") {
        const level = this.state.level;
        const potence = spell.get_potence(level, this.props.obj);
        let damage_rolls: RollPlus[] = [];
        if (potence) {
          const roll_plus = new RollPlus(potence.rolls);
          damage_rolls.push(roll_plus);
        }
        damage_rolls = [...damage_rolls,...spell.attack.damage_rolls];
        if (["Healing","Temp HP","Max HP"].includes(spell.effect_string)) {
          return (
            <Roller 
              name={spell.name}
              char={this.props.obj}
              rolls={damage_rolls} 
              type={spell.effect_string} 
            />
          );
        } else {
          return (
            <Roller 
              name={spell.name}
              char={this.props.obj}
              rolls={damage_rolls} 
              type="Damage" 
            />
          );
        }
      }
    }
    return null;
  }
}

export default connector(CharacterSpellDetails);
