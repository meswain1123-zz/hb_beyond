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
  CharacterAbility,
  CharacterSpecialSpell,
  CharacterSpell,
  CreatureInstance,
  RollPlus,
  AbilityEffect
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
  character: Character;
  obj: CharacterSpell | CharacterAbility;
  level: number;
  onChange: (change_types: string[]) => void;
  onClose: () => void;
}

export interface State {
  search_string: string;
  view: string;
  level: number;
  selected_option: any;
  popoverEffect: AbilityEffect | null;
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
      popoverEffect: null,
      popoverAnchorEl: null,
      popoverMode: ""
    };
    this.api = API.getInstance();
    this.char_util = CharacterUtilities.getInstance();
  }

  api: APIClass;
  char_util: CharacterUtilitiesClass;

  componentDidMount() {
    this.load();
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
      this.setState({ level: this.props.obj.level.value });
    } else {
      this.setState({ level: this.props.level });
    }
  }

  render() {
    if (this.state.level === -1) {
      return (<span>Loading...</span>);
    } else if (this.props.obj instanceof CharacterSpell) {
      console.log(this.props.obj);
      let the_spell = this.props.obj.the_spell;
      let show_ritual = false;
      if (this.props.obj.source_type === "Class" && this.props.character instanceof Character) {
        // Check if their class can do rituals
        const class_finder = this.props.character.classes.filter(o => o.game_class_id === this.props.obj.source_id);
        if (class_finder.length === 1) {
          const char_class = class_finder[0];
          show_ritual = char_class.ritual_casting;
        }
      } 
      if (the_spell) {
        const obj = this.props.obj;
        const level = this.state.level === -1 ? this.props.obj.level.value : this.state.level;
        const potence = this.props.obj.get_potence(level, this.props.character);
        const class_finder = this.props.character.classes.filter(o => o.game_class_id === obj.source_id || o.subclass_id === obj.source_id);
        let spell_attack = 0;
        let spell_dc = 0;
        if (class_finder.length === 1) {
          const char_class = class_finder[0];
          spell_attack = char_class.spell_attack;
          spell_dc = char_class.spell_dc;
        }
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
                <ViewSpell spell={this.props.obj}
                  show_level 
                  show_ritual={show_ritual}
                  fontSize={20}
                  fontWeight={"bold"}
                />
              </Grid>
              <Grid item style={{ width: "316px" }}>
                { this.props.obj.level_and_school }
              </Grid>
              <Grid item container spacing={0} direction="row">
                <Grid item xs={6}>
                  <CharacterCastButton
                    obj={this.props.obj}
                    character={this.props.character}
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
              { obj.spell && obj.spell.effects.map((effect, key) => {
                return (
                  <Grid item key={key} container spacing={1} direction="row"
                    style={{
                      display: "flex",
                      justifyContent: "center"
                    }}>
                    { effect.attack_type === "Save" ?
                      <Grid item xs={6} style={{
                        display: "flex",
                        justifyContent: "center"
                      }}>
                        { obj.spell && obj.spell.saving_throw_ability_score } { spell_dc }
                      </Grid> 
                    : effect.attack_type === "None" ?
                      <Grid item xs={6} style={{
                        display: "flex",
                        justifyContent: "center"
                      }}>
                        --
                      </Grid> 
                    :
                      <Grid item xs={6} style={{
                        display: "flex",
                        justifyContent: "center"
                      }}>
                        <ButtonBox
                          name={ `Attack: ${ spell_attack > 0 ? "+" + spell_attack : spell_attack }` }
                          onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                            this.setState({ 
                              popoverEffect: effect,
                              popoverMode: "Attack", 
                              popoverAnchorEl: event.currentTarget 
                            });
                          }} 
                        />
                      </Grid>
                    }
                    { !["Control","Utility","Summon","Transform","Create Resource"].includes(effect.type) &&
                      <Grid item xs={6} style={{
                        display: "flex",
                        justifyContent: "center"
                      }}>
                        <ButtonBox
                          fontSize={9}
                          name={ obj.get_potence_string(this.state.level, this.props.character, effect) }
                          image={ effect.type }
                          onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                            this.setState({ 
                              popoverEffect: effect,
                              popoverAnchorEl: event.currentTarget, 
                              popoverMode: "Damage" 
                            });
                          }} 
                        />
                      </Grid>
                    }
                    { potence && ["Summon","Transform"].includes(obj.effect_string) &&
                      <Grid item xs={6} style={{
                        display: "flex",
                        justifyContent: "center"
                      }} container spacing={1} direction="row">
                        <Grid item xs={9}>
                          <CharacterSummonTransformOptions 
                            name="Choose"
                            obj={this.props.character}
                            spell={obj}
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
                            name={obj.effect_string}
                            onClick={() => {
                              for (let i = 0; i < this.state.selected_option.count; ++i) {
                                const creature_instance = new CreatureInstance();
                                if (this.state.selected_option.creature) {
                                  creature_instance.copyCreature(this.state.selected_option.creature);
                                } else if (this.state.selected_option.summon) {
                                  creature_instance.copySummonStatBlock(
                                    this.state.selected_option.summon, 
                                    this.props.character, this.props.obj.source_id, this.props.obj.level.value, this.state.level
                                  );
                                }
                                if (i > 0) {
                                  creature_instance.name += ` ${i}`;
                                }
                                this.props.character.minions.push(creature_instance);
                              }
                              this.props.onChange(["Minions"]);
                            }}
                          />
                        </Grid>
                      </Grid>
                    }
                    { potence && potence.extra.length > 0 &&
                      <Grid item xs={12}>
                        { potence.extra }
                      </Grid>
                    }
                  </Grid>
                );
              })}
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
                            value={ this.props.obj.customizations.spell_attack ? `${this.props.obj.customizations.spell_attack}` : "" }
                            type="number"
                            onBlur={(value: string) => {
                              if (value === "") {
                                delete this.props.obj.customizations.spell_attack;
                              } else {
                                try {
                                  this.props.obj.customizations.spell_attack = +value;
                                } catch {}
                              }
                              // this.props.onChange();
                            }}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <StringBox
                            name="To hit Bonus"
                            value={ this.props.obj.customizations.spell_attack_bonus ? `${this.props.obj.customizations.spell_attack_bonus}` : "" }
                            type="number"
                            onBlur={(value: string) => {
                              if (value === "") {
                                delete this.props.obj.customizations.spell_attack_bonus;
                              } else {
                                try {
                                  this.props.obj.customizations.spell_attack_bonus = +value;
                                } catch {}
                              }
                              // this.props.onChange();
                            }}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <StringBox
                            name="Damage Bonus"
                            value={ this.props.obj.customizations.damage_bonus ? `${this.props.obj.customizations.damage_bonus}` : "" }
                            type="number"
                            onBlur={(value: string) => {
                              if (value === "") {
                                delete this.props.obj.customizations.damage_bonus;
                              } else {
                                try {
                                  this.props.obj.customizations.damage_bonus = +value;
                                } catch {}
                              }
                              // this.props.onChange();
                            }}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <StringBox
                            name="DC Override"
                            value={ this.props.obj.customizations.spell_dc ? `${this.props.obj.customizations.spell_dc}` : "" }
                            type="number"
                            onBlur={(value: string) => {
                              if (value === "") {
                                delete this.props.obj.customizations.spell_dc;
                              } else {
                                try {
                                  this.props.obj.customizations.spell_dc = +value;
                                } catch {}
                              }
                              // this.props.onChange();
                            }}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <StringBox
                            name="DC Bonus"
                            value={ this.props.obj.customizations.spell_dc_bonus ? `${this.props.obj.customizations.spell_dc_bonus}` : "" }
                            type="number"
                            onBlur={(value: string) => {
                              if (value === "") {
                                delete this.props.obj.customizations.spell_dc_bonus;
                              } else {
                                try {
                                  this.props.obj.customizations.spell_dc_bonus = +value;
                                } catch {}
                              }
                              // this.props.onChange();
                            }}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <ToggleButtonBox
                            name="Display As Attack"
                            value={ this.props.obj.customizations.display_as_attack ? this.props.obj.customizations.display_as_attack === "true" : false }
                            onToggle={() => {
                              if (this.props.obj.customizations.display_as_attack) {
                                delete this.props.obj.customizations.display_as_attack;
                              } else {
                                try {
                                  this.props.obj.customizations.display_as_attack = "true";
                                } catch {}
                              }
                              // this.props.onChange();
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <StringBox
                            name="Name"
                            value={ this.props.obj._name }
                            onBlur={(value: string) => {
                              if (this.props.obj instanceof CharacterSpell) {
                                this.props.obj._name = value;
                                // this.props.onChange();
                              }
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <StringBox
                            name="Notes"
                            multiline
                            value={ this.props.obj.customizations.notes ? `${this.props.obj.customizations.notes}` : "" }
                            onBlur={(value: string) => {
                              if (value === "") {
                                delete this.props.obj.customizations.notes;
                              } else {
                                try {
                                  this.props.obj.customizations.notes = value;
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
                <b>Casting Time: </b><em style={{ fontStyle: "normal" }}>{ this.props.obj.casting_time_string }</em>
              </Grid>
              <Grid item>
               <b>Range/Area: </b><em style={{ fontStyle: "normal" }}>{ this.props.obj.range_string }</em>
              </Grid>
              <Grid item>
                <b>Components: </b><em style={{ fontStyle: "normal" }}>{ this.props.obj.components_string }</em>
              </Grid>
              <Grid item>
                <b>Duration: </b><em style={{ fontStyle: "normal" }}>{ this.props.obj.duration_string }</em>
              </Grid>
              { this.props.obj.use_attack &&
                <Grid item>
                  <b>Attack/Save: </b>
                  <em style={{ fontStyle: "normal" }}>
                    { this.props.obj.attack_string }
                  </em>
                </Grid>
              }
              <Grid item>
                { the_spell.description }
              </Grid>
              { obj instanceof CharacterSpecialSpell && obj.special_spell_feature &&
                <Grid item>
                  { obj.description }
                </Grid>
              }
            </Grid>
            <Popover key="rolls"
              open={ this.state.popoverAnchorEl !== null && this.state.popoverMode !== "" }
              anchorEl={this.state.popoverAnchorEl}
              onClose={() => {
                this.setState({ popoverAnchorEl: null, popoverMode: "", popoverEffect: null });
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
    } else if (this.props.obj instanceof CharacterAbility) {
      const return_me: any[] = [];
      const the_ability = this.props.obj.the_ability;
      const level = this.state.level === -1 ? this.props.obj.level.value : this.state.level;
      return_me.push(
        <Grid item key="source" style={{ 
          lineHeight: "1.1",
          fontSize: "10px",
          color: "gray"
        }}>
          { this.props.obj.source_name }
        </Grid>
      );
      return_me.push(
        <Grid item key="name" style={{ 
          lineHeight: "1.1",
          fontSize: "15px",
          fontWeight: "bold"
        }}>
          { this.props.obj.name }
        </Grid>
      );
      if (the_ability) {
        if (the_ability.resource_consumed !== "Slot") {
          // Make this work more like with a spell
          return_me.push(
            <Grid item key="Cast" container spacing={0} direction="row">
              <Grid item xs={6}>
                <CharacterCastButton
                  obj={this.props.obj}
                  character={this.props.character}
                  level={level}
                  onChange={(change_types: string[]) => {
                    this.props.onChange(change_types);
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <CharacterResourceBoxes 
                  resource={this.props.obj}
                  character={this.props.character}
                  onChange={() => {
                    this.props.onChange(["Resources"]);
                  }}
                />
              </Grid>
            </Grid>
          );
        } else {
          // Make this work more like with a spell
          return_me.push(
            <Grid item key="Cast" container spacing={0} direction="row">
              <Grid item xs={6}>
                <CharacterCastButton
                  obj={this.props.obj}
                  character={this.props.character}
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
          );
        }
      }
      return_me.push(this.renderAttacks());
      if (the_ability) {
        return_me.push(
          <Grid item key="description">
            { the_ability.description }
          </Grid>
        );
      }
      if (this.props.obj.spell) {
        return_me.push(
          <Grid item key="spell_description">
            { this.props.obj.spell.description }
          </Grid>
        );
      }
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
          <Grid container spacing={0} direction="column">
            { return_me }
          </Grid>
        </div>
      );
    }
  }

  renderLevelOptions() {
    const obj = this.props.obj;
    const level = this.state.level === -1 ? this.props.obj.level.value : this.state.level;
    if (obj instanceof CharacterSpecialSpell) {
      if (obj.special_spell_feature) {
        const ssf = obj.special_spell_feature;
        // "Normal","At Will","Only Special Resource","Or Special Resource","And Special Resource"
        const return_me: any[] = [];
        if (ssf.slot_override.includes("Special")) {
          // Need to show the Special Resources
          return_me.push(
            <CharacterResourceBoxes 
              key="special"
              resource={obj}
              character={this.props.character}
              onChange={() => {
                // this.props.onChange(["Resources"]);
              }}
            />
          );
        }
        if (["At Will","Or Special Resource","And Special Resource"].includes(ssf.slot_override)) {
          // Need to show the slots for the level
          const slot_levels = Array.from(new Set(this.props.character.slots.filter(o => o.level.value >= obj.level.value).map(o => o.level.value)));
          const slots = this.props.character.slots.filter(o => o.level.value === level);
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
                        character={this.props.character}
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
                        character={this.props.character}
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
        const slot_levels = Array.from(new Set(this.props.character.slots.filter(o => o.level.value >= this.props.obj.level.value).map(o => o.level.value)));
        const slots = this.props.character.slots.filter(o => o.level.value === level);
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
                      character={this.props.character}
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
                      character={this.props.character}
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
    const obj = this.props.obj;
    if (obj && obj.spell) {
      if (mode === "Attack") {
        return (
          <Roller 
            name={obj.name}
            char={this.props.character}
            rolls={obj.attack.attack_rolls} 
            type="Attack" 
          />
        );
      } else if (mode === "Damage") {
        const effect = this.state.popoverEffect;
        const level = this.state.level;
        const potence = obj.get_potence(level, this.props.character, effect);
        let damage_rolls: RollPlus[] = [];
        if (potence) {
          const roll_plus = new RollPlus(potence.rolls);
          damage_rolls.push(roll_plus);
        }
        damage_rolls = [...damage_rolls,...obj.attack.damage_rolls];
        if (["Healing","Temp HP","Max HP"].includes(obj.effect_string)) {
          return (
            <Roller 
              name={obj.name}
              char={this.props.character}
              rolls={damage_rolls} 
              type={obj.effect_string} 
            />
          );
        } else {
          return (
            <Roller 
              name={obj.name}
              char={this.props.character}
              rolls={damage_rolls} 
              type="Damage" 
            />
          );
        }
      }
    }
    return null;
  }

  renderAttacks() {
    const ability = this.props.obj as CharacterAbility;
    const level = this.state.level === -1 ? ability.level.value : this.state.level;
    return (
      <Grid item key="attacks" container spacing={0} direction="row">
        { (ability.use_attack || ability.attack_string !== "--") &&
          <Grid item xs={12} style={{
              display: "flex",
              justifyContent: "center"
            }}>
            { ability.use_attack ?
              <ButtonBox
                name={ ability.attack_string }
                onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                  // this.setState({ popoverAction: ability, popoverActionLevel: level, popoverMode: "Attack" })
                  // this.setPopoverAnchorEl(event.currentTarget);
                }} 
              />
            :
              <span>
                { ability.attack_string }
              </span> 
            }
          </Grid>
        }
        { !["Control","Utility","None"].includes(ability.effect_string) &&
          <Grid item xs={12} style={{
              display: "flex",
              justifyContent: "center"
            }}>
            { !["Control","Utility","Summon","Transform","Create Resource"].includes(ability.effect_string) ?
              <ButtonBox
                fontSize={9}
                name={ ability.get_potence_string(level, this.props.character) }
                image={ ability.effect_string }
                onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                  // this.setState({ popoverAction: ability, popoverActionLevel: level, popoverMode: "Damage" })
                  // this.setPopoverAnchorEl(event.currentTarget);
                }} 
              />
            :
              <span>
                { ability.effect_string }
              </span> 
            }
          </Grid>
        }
      </Grid>
    );
  }
}

export default connector(CharacterSpellDetails);
