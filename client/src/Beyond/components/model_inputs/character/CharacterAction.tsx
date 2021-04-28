import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  Grid, 
  Drawer,
  Popover,
} from "@material-ui/core";

import { 
  Attack,
  Ability,
  Character,
  CharacterAbility,
  CharacterItem,
  CharacterSpell,
  INumHash,
  ItemAffectingAbility,
  SpellAsAbility,
  RollPlus,
  Reroll
} from "../../../models";

import ButtonBox from "../../input/ButtonBox";

import ViewSpell from "../ViewSpell";
import CharacterSpellDetails from './CharacterSpellDetails';
import CharacterAbilityDetails from './CharacterAbilityDetails';

import Roller from "../Roller";

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
  level: number;
  show_casting_time: boolean;
  action: any;
  group: string;
  onChange: () => void; // For slots, resources, and concentration
}

export interface State {
  reloading: boolean;
  drawer: string;
  edit_view: string;
  selected_spell: CharacterSpell | null;
  selected_level: number | null;
  selected_ability: CharacterAbility | null;
  levels: INumHash;
  concentration: boolean;
  ritual: boolean;
  popoverAnchorEl: HTMLDivElement | null;
  popoverAction: CharacterSpell | Attack | CharacterAbility | null;
  popoverActionLevel: number;
  popoverWeapon: CharacterItem | null;
  popoverMode: string;
}

class CharacterAction extends Component<Props, State> {
  public static defaultProps = {
    show_casting_time: false,
    level: -1
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      reloading: false,
      drawer: "",
      edit_view: "",
      selected_spell: null,
      selected_level: null,
      selected_ability: null,
      levels: {},
      concentration: false,
      ritual: false,
      popoverAnchorEl: null,
      popoverAction: null,
      popoverActionLevel: -1,
      popoverWeapon: null,
      popoverMode: ""
    };
    this.api = API.getInstance();
    this.char_util = CharacterUtilities.getInstance();
  }

  api: APIClass;
  char_util: CharacterUtilitiesClass;

  componentDidMount() {
  }

  updateCharacter(reload: boolean) {
    this.api.updateObject(this.props.obj).then((res: any) => {
      if (reload) {
        this.setState({ 
          popoverAnchorEl: null, 
          popoverAction: null, 
          popoverActionLevel: -1, 
          popoverWeapon: null,
          popoverMode: "", 
          reloading: true 
        }, () => {
          this.setState({ reloading: false }, () => {
            this.props.onChange();
          });
        });
      } else {
        this.setState({
          popoverAnchorEl: null, 
          popoverAction: null, 
          popoverActionLevel: -1, 
          popoverWeapon: null,
          popoverMode: ""
        }, () => {
          this.props.onChange();
        });
      }
    });
  }

  render() {
    const action = this.props.action;
    const group2 = this.props.group;
    if (action instanceof CharacterItem) {
      const weapon = action;
      return (
        <Grid item container spacing={0} direction="row">
          <Grid item xs={1}>
            
          </Grid>
          <Grid item xs={3} 
            container spacing={0} 
            direction="column">
            { weapon.name }
          </Grid>
          <Grid item xs={2}>
            { weapon.range === 0 ? "Melee" : `${weapon.range} feet` }
          </Grid>
          { this.renderWeaponAttacks(weapon, group2) }
          { this.renderExtras() }
        </Grid>    
      );
    } else if (action instanceof CharacterSpell) {
      const spell = action;
      const level = this.props.level === -1 ? spell.level : this.props.level;
      let slots = this.props.obj.slots.filter(o => o.level === level);
      let level2 = level;
      if (slots.length === 0) {
        level2 = 9; 
        this.props.obj.slots.filter(o => o.level > level).forEach(s => {
          if (s.level < level2) {
            level2 = s.level;
          }
        });
      }
      return (
        <Grid item container spacing={0} direction="row">
          <Grid item xs={1}>
            { this.renderCastButton(spell, level2) }
          </Grid>
          <Grid item xs={3} container spacing={0} direction="column" onClick={() => {
            this.setState({ 
              drawer: "details", 
              selected_spell: spell, 
              selected_level: level2 
            });
          }}>
            <ViewSpell spell={spell} show_ritual />
          </Grid>
          { this.props.show_casting_time ? 
            <Grid item xs={2} container spacing={0} direction="row">
              <Grid item xs={6}>
                { spell.casting_time_string }
              </Grid>
              <Grid item xs={6}>
                { spell.range_string }
              </Grid>
            </Grid>
          :
            <Grid item xs={2}>
              { spell.range_string }
            </Grid>
          }
          { this.renderSpellAttacks(spell, level2) }
          { this.renderExtras() }
        </Grid>
      );
    } else if (action instanceof CharacterAbility) {
      return (
        <Grid item container spacing={1} direction="row">
          <Grid item xs={1}>
            { this.renderUseButton(action) }
          </Grid>
          <Grid item xs={3} container spacing={0} direction="column" onClick={() => this.setState({ drawer: "details", selected_ability: action })}>
            <Grid item>{ action.name }</Grid>
            <Grid item style={{ 
              lineHeight: "1.1",
              fontSize: "10px",
              color: "gray"
            }}>
              { action.source_name }
            </Grid>
          </Grid>
          { this.props.show_casting_time && (action.the_ability instanceof Ability) ? 
            <Grid item xs={2} container spacing={0} direction="row">
              <Grid item xs={6}>
                { action.the_ability.casting_time }
              </Grid>
              <Grid item xs={6}>
                { action.the_ability.range }
              </Grid>
            </Grid>
          : (action.the_ability instanceof Ability) ?
            <Grid item xs={2}>
              { action.the_ability.range }
            </Grid>
          : (action.the_ability instanceof SpellAsAbility) ?
            <Grid item xs={2}>
              { action.the_ability.spell && action.the_ability.spell.range }
            </Grid>
          :
            <Grid item xs={2}></Grid>
          }
          { this.renderSpellAttacks(action, action.level) }
          { this.renderExtras() }
        </Grid>
      );
    } else return null;
  }

  renderExtras() {
    return [
      <Drawer key="drawer" anchor="right" 
        open={ this.state.drawer === "details" } 
        onClose={() => {
          this.setState({ drawer: "" });
        }}>
        { this.state.selected_spell && this.state.selected_level !== null &&
          <CharacterSpellDetails
            obj={this.props.obj}
            spell={this.state.selected_spell}
            level={this.state.selected_level}
            onChange={() => {
              this.updateCharacter(true);
            }}
            onClose={() => {
              this.setState({ drawer: "", selected_spell: null, selected_level: null });
            }}
          />
        }
        { this.state.selected_ability &&
          <CharacterAbilityDetails
            obj={this.props.obj}
            ability={this.state.selected_ability}
            onChange={() => {
              this.updateCharacter(true);
            }}
            onClose={() => {
              this.setState({ drawer: "", selected_ability: null });
            }}
          />
        }
      </Drawer>,
      <Popover key="cast_options"
        open={ this.state.popoverAnchorEl !== null && this.state.popoverMode === "Cast" }
        anchorEl={this.state.popoverAnchorEl}
        onClose={() => {
          this.setState({ popoverAnchorEl: null, popoverAction: null, popoverActionLevel: -1, popoverMode: "" });
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        { this.renderCastOptions() }
      </Popover>,
      <Popover key="rolls"
        open={ this.state.popoverAnchorEl !== null && this.state.popoverMode !== "Cast" }
        anchorEl={this.state.popoverAnchorEl}
        onClose={() => {
          this.setState({ popoverAnchorEl: null, popoverAction: null, popoverActionLevel: -1, popoverMode: "" });
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
    ];
  }

  renderWeaponAttacks(weapon: CharacterItem, group2: string) {
    const filtered = weapon.attacks.filter(o => (group2 !== "bonus_actions" && !o.bonus_action) || (group2 === "bonus_actions" && o.bonus_action));
    if (filtered.length > 0) {
      return (
        <Grid item xs={6} container spacing={0} direction="column">
          { filtered.map((attack, key) => {
            return (
              <Grid item key={key} container spacing={0} direction="row">
                <Grid item xs={6}>
                  <ButtonBox
                    name={ attack.attack_string }
                    onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                      this.setState({ popoverAction: attack, popoverMode: "Attack" });
                      this.setPopoverAnchorEl(event.currentTarget);
                    }} 
                  />
                </Grid>
                <Grid item xs={6}>
                  <ButtonBox
                    name={ attack.damage_string }
                    find_images
                    onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                      this.setState({ popoverAction: attack, popoverMode: "Damage", popoverWeapon: weapon });
                      this.setPopoverAnchorEl(event.currentTarget);
                    }} 
                  />
                </Grid>
              </Grid>
            );
          })}
        </Grid>
      );
    } else return null;
  }

  renderSpellAttacks(spell: CharacterSpell | CharacterAbility, level2: number) {
    // console.log(spell);
    return (
      <Grid item xs={6} container spacing={0} direction="row">
        <Grid item xs={6} style={{
            display: "flex",
            justifyContent: "center"
          }}>
          { spell.use_attack ?
            <ButtonBox
              name={ spell.attack_string }
              onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                this.setState({ popoverAction: spell, popoverActionLevel: level2, popoverMode: "Attack" })
                this.setPopoverAnchorEl(event.currentTarget);
              }} 
            />
          :
            <span>
              { spell.attack_string }
            </span> 
          }
        </Grid>
        <Grid item xs={6} style={{
            display: "flex",
            justifyContent: "center"
          }}>
          { !["Control","Utility","Summon","Transform"].includes(spell.effect_string) ?
            <ButtonBox
              fontSize={9}
              name={ spell.get_potence_string(level2, this.props.obj) }
              image={ spell.effect_string }
              onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                this.setState({ popoverAction: spell, popoverActionLevel: level2, popoverMode: "Damage" })
                this.setPopoverAnchorEl(event.currentTarget);
              }} 
            />
          :
            <span>
              { spell.effect_string }
            </span> 
          }
        </Grid>
      </Grid>
    );
  }

  renderCastButton(spell: CharacterSpell, level: number) {
    const self_condition_ids = spell.self_condition();
    if (spell.level === 0 || spell.at_will) {
      if (spell.spell && spell.spell.concentration) {
        if (this.props.obj.concentrating_on) {
          return (
            <ButtonBox name="At Will"
              onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                this.setState({ popoverAction: spell, popoverActionLevel: level, popoverMode: "Cast" })
                this.setPopoverAnchorEl(event.currentTarget);
              }} 
            />
          );
        } else {
          return (
            <ButtonBox name="At Will"
              onClick={() => {
                this.props.obj.concentrating_on = spell;
                if (self_condition_ids.length > 0) {
                  // Apply the conditions
                  const obj = this.props.obj;
                  self_condition_ids.forEach(cond_id => {
                    obj.conditions.push(cond_id);
                  });
                  if (obj instanceof Character) {
                    this.char_util.recalcAll(obj);
                  }
                }
                this.updateCharacter(false);
              }} 
            />
          );
        }
      } else {
        return (
          <ButtonBox 
            disabled={self_condition_ids.length === 0}
            name="At Will"
            onClick={() => {
              // Apply the conditions
              const obj = this.props.obj;
              self_condition_ids.forEach(cond_id => {
                obj.conditions.push(cond_id);
              });
              if (obj instanceof Character) {
                this.char_util.recalcAll(obj);
              }
            }}
          />
        );
      }
    } else if (spell.ritual_only) {
      return (
        <ButtonBox 
          disabled={self_condition_ids.length === 0} 
          name="Ritual Only" 
          onClick={() => {
            // Apply the conditions
            const obj = this.props.obj;
            self_condition_ids.forEach(cond_id => {
              obj.conditions.push(cond_id);
            });
            if (obj instanceof Character) {
              this.char_util.recalcAll(obj);
            }
          }}
        />
      );
    } else {
      // Get the slots for the level
      const slots = this.props.obj.slots.filter(o => o.level === level);
      if (slots.length === 1) {
        const slot = slots[0];
        if (spell.spell && spell.spell.concentration) { 
          if (this.props.obj.concentrating_on) {
            return (
              <ButtonBox name={ spell.level < level ? "Upcast" : "Cast" }
                disabled={slot.used === slot.total}
                onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                  this.setState({ popoverAction: spell, popoverActionLevel: level, popoverMode: "Cast" })
                  this.setPopoverAnchorEl(event.currentTarget);
                }} 
              />
            );
          } else {
            return (
              <ButtonBox name={ spell.level < level ? "Upcast" : "Cast" }
                disabled={slot.used === slot.total}
                onClick={() => {
                  slot.used++;
                  this.props.obj.concentrating_on = spell;
                  if (self_condition_ids.length > 0) {
                    // Apply the conditions
                    const obj = this.props.obj;
                    self_condition_ids.forEach(cond_id => {
                      obj.conditions.push(cond_id);
                    });
                    if (obj instanceof Character) {
                      this.char_util.recalcAll(obj);
                    }
                  }
                  this.updateCharacter(slot.used === slot.total);
                }} 
              />
            );
          }
        } else {
          return (
            <ButtonBox name={ spell.level < level ? "Upcast" : "Cast" }
              disabled={slot.used === slot.total}
              onClick={() => {
                slot.used++;
                if (self_condition_ids.length > 0) {
                  // Apply the conditions
                  const obj = this.props.obj;
                  self_condition_ids.forEach(cond_id => {
                    obj.conditions.push(cond_id);
                  });
                  if (obj instanceof Character) {
                    this.char_util.recalcAll(obj);
                  }
                }
                this.updateCharacter(slot.used === slot.total);
              }} 
            />
          );
        }
      } else {
        return (
          <ButtonBox name={ spell.level < level ? "Upcast" : "Cast" }
            disabled={slots.filter(o => o.used < o.total).length === 0}
            onClick={(event: React.MouseEvent<HTMLDivElement>) => {
              this.setState({ popoverAction: spell, popoverActionLevel: level, popoverMode: "Cast" })
              this.setPopoverAnchorEl(event.currentTarget);
            }} 
          />
        );
      }
    }
  }

  renderUseButton(ability: CharacterAbility) {
    // Need to make it check if the ability 
    // uses concentration or resources (or both)
    // for concentration then on click it 
    // sets concentrating_on to the ability.
    // If it uses resources then display 
    // them and on click 
    // it uses one of the resources.
    // If the resources are all used then 
    // it's disabled.

    let return_me: any = null;
    const the_ability = ability.the_ability;
    if (the_ability) {
      if (the_ability.resource_consumed && the_ability.resource_consumed !== "None") {
        return_me =
        (
          <ButtonBox name={ability.use_string(this.props.obj)}
            disabled={ability.disabled(this.props.obj)}
            onClick={(event: React.MouseEvent<HTMLDivElement>) => {
              let go = false;
              // Increment the resource
              if (the_ability.resource_consumed === "Special") {
                ability.special_resource_used++;
                go = true;
              } else if (the_ability.resource_consumed === "Slot") {
                // Look for slots of the appropriate level and type
                if (the_ability instanceof Ability || 
                  the_ability instanceof ItemAffectingAbility || 
                  the_ability instanceof SpellAsAbility) {
                  const filtered_slots = this.props.obj.slots.filter(o => 
                    o.level === the_ability.slot_level &&
                    (the_ability.slot_type === "" || o.type_id === the_ability.slot_type)
                  );
                  if (filtered_slots.length === 1) {
                    const slot = filtered_slots[0];
                    slot.used++;
                    go = true;
                  } else if (filtered_slots.length > 1) {
                    // Cast Options
                    this.setState({ popoverAction: ability, popoverActionLevel: the_ability.slot_level, popoverMode: "Cast" });
                    this.setPopoverAnchorEl(event.currentTarget);
                  }
                }
              } else {
                const resource_finder = this.props.obj.resources.filter(o => 
                  o.type_id === the_ability.resource_consumed);
                if (resource_finder.length === 1) {
                  const resource = resource_finder[0];
                  resource.used++;
                  go = true;
                }
              }
              if (go) {
                this.triggerAbilityEffect(ability);
              }
            }} 
          />
        );
      } else if (!(the_ability instanceof ItemAffectingAbility) && the_ability.concentration) {
        return_me = (
          <ButtonBox name="Use" 
            onClick={(event: React.MouseEvent<HTMLDivElement>) => {
              let go = false;
              // Increment the resource
              if (the_ability.resource_consumed === "Special") {
                ability.special_resource_used++;
                go = true;
              } else if (the_ability.resource_consumed === "Slot") {
                // Look for slots of the appropriate level and type
                if (the_ability instanceof Ability || 
                  the_ability instanceof ItemAffectingAbility || 
                  the_ability instanceof SpellAsAbility) {
                  const filtered_slots = this.props.obj.slots.filter(o => 
                    o.level === the_ability.slot_level &&
                    (the_ability.slot_type === "" || o.type_id === the_ability.slot_type)
                  );
                  if (filtered_slots.length === 1) {
                    const slot = filtered_slots[0];
                    slot.used++;
                    go = true;
                  } else if (filtered_slots.length > 1) {
                    // Cast Options
                    this.setState({ popoverAction: ability, popoverActionLevel: the_ability.slot_level, popoverMode: "Cast" });
                    this.setPopoverAnchorEl(event.currentTarget);
                  }
                }
              } else {
                const resource_finder = this.props.obj.resources.filter(o => 
                  o.type_id === the_ability.resource_consumed);
                if (resource_finder.length === 1) {
                  const resource = resource_finder[0];
                  resource.used++;
                  go = true;
                }
              }
              if (go) {
                this.triggerAbilityEffect(ability);
              }
            }} 
          />
        );
      } else {
        return_me = (
          <ButtonBox name="At Will" 
            disabled={ability.self_condition().length === 0}
            onClick={() => {
              this.triggerAbilityEffect(ability);
            }} 
          />
        );
      }
    }
    return return_me;
  }

  triggerAbilityEffect(ability: CharacterAbility) {
    const self_condition_ids = ability.self_condition();
    const the_ability = ability.the_ability;
    if (the_ability) {
      if (!(the_ability instanceof ItemAffectingAbility) && the_ability.concentration) {
        // Set the concentration
        this.props.obj.concentrating_on = ability;
      }
      if (self_condition_ids.length > 0) {
        // Apply the conditions
        const obj = this.props.obj;
        self_condition_ids.forEach(cond_id => {
          obj.conditions.push(cond_id);
        });
        this.char_util.recalcAll(obj);
      }
      this.updateCharacter(true);
    }
  }

  renderCastOptions() {
    if (this.state.popoverAction instanceof CharacterSpell) {
      const spell = this.state.popoverAction;
      const level = this.state.popoverActionLevel;
      if (spell && spell.spell) {
        const self_condition_ids = spell.self_condition();
        if ((spell.level === 0 || spell.at_will) && spell.spell.concentration && this.props.obj.concentrating_on) {
          return (
            <div>
              You're already concentrating on 
              { (this.props.obj.concentrating_on instanceof CharacterSpell || this.props.obj.concentrating_on instanceof CharacterAbility) &&
                <ViewSpell spell={this.props.obj.concentrating_on} show_ritual />
              }
              <ButtonBox name={ spell.level < level ? "Upcast Anyway" : "Cast Anyway" }
                onClick={() => {
                  this.props.obj.concentrating_on = spell;
                  if (self_condition_ids.length > 0) {
                    // Apply the conditions
                    const obj = this.props.obj;
                    self_condition_ids.forEach(cond_id => {
                      obj.conditions.push(cond_id);
                    });
                    if (obj instanceof Character) {
                      this.char_util.recalcAll(obj);
                    }
                  }
                  this.updateCharacter(false);
                }} 
              />
            </div>
          );
        } else if (spell.ritual_only) {
          return null;
        } else {
          // Get the slots for the level
          const slots = this.props.obj.slots.filter(o => o.level === level);
          if (slots.length === 1) {
            const slot = slots[0];
            if (spell.spell.concentration && this.props.obj.concentrating_on) {
              return (
                <div>
                  You're already concentrating on <ViewSpell spell={this.props.obj.concentrating_on} show_ritual />
                  <ButtonBox name={ spell.level < level ? "Upcast Anyway" : "Cast Anyway" }
                    disabled={slot.used === slot.total}
                    onClick={() => {
                      slot.used++;
                      this.props.obj.concentrating_on = spell;
                      if (self_condition_ids.length > 0) {
                        // Apply the conditions
                        const obj = this.props.obj;
                        self_condition_ids.forEach(cond_id => {
                          obj.conditions.push(cond_id);
                        });
                        if (obj instanceof Character) {
                          this.char_util.recalcAll(obj);
                        }
                      }
                      this.updateCharacter(slot.used === slot.total);
                    }} 
                  />
                </div>
              );
            }
          } else {
            if (spell.spell.concentration && this.props.obj.concentrating_on) {
              return (
                <div>
                  You're already concentrating on <ViewSpell spell={this.props.obj.concentrating_on} show_ritual />
                  <div>
                    { slots.map((slot, key) => {
                      return (
                        <ButtonBox key={key} name={slot.slot_name}
                          disabled={slot.used === slot.total}
                          onClick={() => {
                            slot.used++;
                            this.props.obj.concentrating_on = spell;
                            if (self_condition_ids.length > 0) {
                              // Apply the conditions
                              const obj = this.props.obj;
                              self_condition_ids.forEach(cond_id => {
                                obj.conditions.push(cond_id);
                              });
                              if (obj instanceof Character) {
                                this.char_util.recalcAll(obj);
                              }
                            }
                            this.updateCharacter(slot.used === slot.total);
                          }} 
                        />
                      );
                    })}
                  </div>
                </div>
              );
            } else {
              return (
                <div>
                  { slots.map((slot, key) => {
                    return (
                      <ButtonBox key={key} name={slot.slot_name}
                        disabled={slot.used === slot.total}
                        onClick={() => {
                          slot.used++;
                          if (self_condition_ids.length > 0) {
                            // Apply the conditions
                            const obj = this.props.obj;
                            self_condition_ids.forEach(cond_id => {
                              obj.conditions.push(cond_id);
                            });
                            if (obj instanceof Character) {
                              this.char_util.recalcAll(obj);
                            }
                          }
                          this.updateCharacter(slot.used === slot.total);
                        }} 
                      />
                    );
                  })}
                </div>
              );
            }
          }
        }
      } else {
        return null;
      }
    } else if (this.state.popoverAction instanceof CharacterAbility) {
      const ability = this.state.popoverAction;
      const the_ability = ability.the_ability;
      const self_condition_ids = ability.self_condition();
      
      if (the_ability && !(the_ability instanceof ItemAffectingAbility)) {
        if (the_ability.resource_consumed === "Slot") {
          // Get the slots for the level
          const level = this.state.popoverActionLevel;
          const slots = this.props.obj.slots.filter(o => o.level === level);
          
          if (slots.length === 1) {
            const slot = slots[0];
            if (the_ability.concentration && this.props.obj.concentrating_on) {
              return (
                <div>
                  You're already concentrating on <ViewSpell spell={this.props.obj.concentrating_on} show_ritual />
                  <ButtonBox name={ "Use Anyway" }
                    disabled={slot.used + the_ability.amount_consumed >= slot.total}
                    onClick={() => {
                      slot.used += the_ability.amount_consumed;
                      this.props.obj.concentrating_on = ability;
                      if (self_condition_ids.length > 0) {
                        // Apply the conditions
                        const obj = this.props.obj;
                        self_condition_ids.forEach(cond_id => {
                          obj.conditions.push(cond_id);
                        });
                        if (obj instanceof Character) {
                          this.char_util.recalcAll(obj);
                        }
                      }
                      this.updateCharacter(slot.used + the_ability.amount_consumed >= slot.total);
                    }} 
                  />
                </div>
              );
            } else {
              // It will never go here because then it wouldn't have done cast options
            }
          } else {
            if (the_ability.concentration && this.props.obj.concentrating_on) {
              return (
                <div>
                  You're already concentrating on <ViewSpell spell={this.props.obj.concentrating_on} show_ritual />
                  <div>
                    { slots.map((slot, key) => {
                      return (
                        <ButtonBox key={key} name={slot.slot_name}
                          disabled={slot.used === slot.total}
                          onClick={() => {
                            slot.used++;
                            this.props.obj.concentrating_on = ability;
                            if (self_condition_ids.length > 0) {
                              // Apply the conditions
                              const obj = this.props.obj;
                              self_condition_ids.forEach(cond_id => {
                                obj.conditions.push(cond_id);
                              });
                              if (obj instanceof Character) {
                                this.char_util.recalcAll(obj);
                              }
                            }
                            this.updateCharacter(slot.used === slot.total);
                          }} 
                        />
                      );
                    })}
                  </div>
                </div>
              );
            } else {
              return (
                <div>
                  { slots.map((slot, key) => {
                    return (
                      <ButtonBox key={key} name={slot.slot_name}
                        disabled={slot.used + the_ability.amount_consumed >= slot.total}
                        onClick={() => {
                          slot.used += the_ability.amount_consumed;
                          if (self_condition_ids.length > 0) {
                            // Apply the conditions
                            const obj = this.props.obj;
                            self_condition_ids.forEach(cond_id => {
                              obj.conditions.push(cond_id);
                            });
                            if (obj instanceof Character) {
                              this.char_util.recalcAll(obj);
                            }
                          }
                          this.updateCharacter(slot.used + the_ability.amount_consumed >= slot.total);
                        }} 
                      />
                    );
                  })}
                </div>
              );
            }
          }
        } else if (the_ability.resource_consumed === "Special") {
          if (the_ability.concentration && this.props.obj.concentrating_on) {
            return (
              <div>
                You're already concentrating on <ViewSpell spell={this.props.obj.concentrating_on} show_ritual />
                <ButtonBox name={ "Use Anyway" }
                  disabled={ability.special_resource_used + the_ability.amount_consumed >= ability.special_resource_amount}
                  onClick={() => {
                    ability.special_resource_used += the_ability.amount_consumed;
                    this.props.obj.concentrating_on = ability;
                    if (self_condition_ids.length > 0) {
                      // Apply the conditions
                      const obj = this.props.obj;
                      self_condition_ids.forEach(cond_id => {
                        obj.conditions.push(cond_id);
                      });
                      if (obj instanceof Character) {
                        this.char_util.recalcAll(obj);
                      }
                    }
                    this.updateCharacter(ability.special_resource_used + the_ability.amount_consumed >= ability.special_resource_amount);
                  }} 
                />
              </div>
            );
          } else {
            // It will never go here because then it wouldn't have done cast options
          }
        } else if (the_ability.resource_consumed === "None") {
          if (this.props.obj.concentrating_on) {
            return (
              <div>
                You're already concentrating on <ViewSpell spell={this.props.obj.concentrating_on} show_ritual />
                <ButtonBox name={ "Use Anyway" }
                  disabled={ability.special_resource_used === ability.special_resource_amount}
                  onClick={() => {
                    this.props.obj.concentrating_on = ability;
                    if (self_condition_ids.length > 0) {
                      // Apply the conditions
                      const obj = this.props.obj;
                      self_condition_ids.forEach(cond_id => {
                        obj.conditions.push(cond_id);
                      });
                      if (obj instanceof Character) {
                        this.char_util.recalcAll(obj);
                      }
                    }
                  }} 
                />
              </div>
            );
          }
        } else {
          // Get the resources
          const resources = this.props.obj.resources.filter(o => the_ability.resource_consumed);
          
          if (resources.length === 1) {
            const resource = resources[0];
            if (the_ability.concentration && this.props.obj.concentrating_on) {
              return (
                <div>
                  You're already concentrating on <ViewSpell spell={this.props.obj.concentrating_on} show_ritual />
                  <ButtonBox name={ "Use Anyway" }
                    disabled={resource.used + the_ability.amount_consumed >= resource.total}
                    onClick={() => {
                      resource.used += the_ability.amount_consumed;
                      this.props.obj.concentrating_on = ability;
                      if (self_condition_ids.length > 0) {
                        // Apply the conditions
                        const obj = this.props.obj;
                        self_condition_ids.forEach(cond_id => {
                          obj.conditions.push(cond_id);
                        });
                        if (obj instanceof Character) {
                          this.char_util.recalcAll(obj);
                        }
                      }
                      this.updateCharacter(resource.used + the_ability.amount_consumed >= resource.total);
                    }} 
                  />
                </div>
              );
            } else {
              // It will never go here because then it wouldn't have done cast options
            }
          }
        }
      }
      return null;
    }
  }

  renderRoll() {
    const mode = this.state.popoverMode;
    if (this.state.popoverAction instanceof CharacterSpell) {
      const spell = this.state.popoverAction;
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
          const level = this.state.popoverActionLevel;
          const potence = spell.get_potence(level, this.props.obj);
          let damage_rolls: RollPlus[] = [];
          if (potence) {
            const roll_plus = new RollPlus(potence.rolls);
            damage_rolls.push(roll_plus);
          }
          damage_rolls = [...damage_rolls,...spell.attack.damage_rolls];
          
          const rerolls: Reroll[] = [];
          this.props.obj.rerolls.forEach(r => {
            let good = false;
            if (r.allowed_armor_types.includes("All")) {
              // Check for required
              if (r.required_armor_types.includes("None")) {
                good = true;
              } else if (r.required_armor_types.includes("Any")) {
                good = this.props.obj.equipped_items.filter(o => 
                  o.base_item &&
                  o.base_item.item_type === "Armor" &&
                  o.base_item.name !== "Shield"
                ).length > 0;
              } else {
                const missing_armor_types = r.required_armor_types.filter(a =>
                  this.props.obj.equipped_items.filter(o =>
                    o.base_item &&
                    o.base_item.item_type === "Armor" &&
                    o.base_item.armor_type_id === a).length === 0);
                good = missing_armor_types.length === 0;
              }
            } else if (r.allowed_armor_types.includes("None")) {
              good = this.props.obj.equipped_items.filter(o => 
                o.base_item &&
                o.base_item.item_type === "Armor" &&
                o.base_item.name !== "Shield"
              ).length === 0;
            } else {
              const bad_armor_items = this.props.obj.equipped_items.filter(o =>
                o.base_item &&
                o.base_item.item_type === "Armor" &&
                !r.allowed_armor_types.includes(o.base_item.armor_type_id));
    
              good = bad_armor_items.length === 0;
            }
            if (good) {
              if (!r.required_weapon_keywords.includes("None")) {
              } else if (!r.allowed_damage_types.includes("All")) {
                good = false;
                for (let i = 0; i < damage_rolls.length; ++i) {
                  if (r.allowed_damage_types.includes(damage_rolls[i].type)) {
                    good = true;
                    break;
                  }
                }
              }
              rerolls.push(r);
            }
          });
          if (["Healing","Temp HP","Max HP"].includes(spell.effect_string)) {
            return (
              <Roller 
                name={spell.name}
                char={this.props.obj}
                rolls={damage_rolls} 
                rerolls={rerolls}
                type={spell.effect_string} 
              />
            );
          } else {
            return (
              <Roller 
                name={spell.name}
                char={this.props.obj}
                rolls={damage_rolls} 
                rerolls={rerolls}
                type="Damage" 
              />
            );
          }
        }
      }
    } else if (this.state.popoverAction instanceof Attack) {
      const attack = this.state.popoverAction;
      if (mode === "Attack") {
        return (
          <Roller 
            name={attack.type}
            char={this.props.obj}
            rolls={attack.attack_rolls} 
            type="Attack" 
          />
        );
      } else if (mode === "Damage") {
        const weapon = this.state.popoverWeapon;
        const rerolls: Reroll[] = [];
        if (weapon) {
          this.props.obj.rerolls.forEach(r => {
            let good = false;
            if (r.allowed_armor_types.includes("All")) {
              // Check for required
              if (r.required_armor_types.includes("None")) {
                good = true;
              } else if (r.required_armor_types.includes("Any")) {
                good = this.props.obj.equipped_items.filter(o => 
                  o.base_item &&
                  o.base_item.item_type === "Armor" &&
                  o.base_item.name !== "Shield"
                ).length > 0;
              } else {
                const missing_armor_types = r.required_armor_types.filter(a =>
                  this.props.obj.equipped_items.filter(o =>
                    o.base_item &&
                    o.base_item.item_type === "Armor" &&
                    o.base_item.armor_type_id === a).length === 0);
                good = missing_armor_types.length === 0;
              }
            } else if (r.allowed_armor_types.includes("None")) {
              good = this.props.obj.equipped_items.filter(o => 
                o.base_item &&
                o.base_item.item_type === "Armor" &&
                o.base_item.name !== "Shield"
              ).length === 0;
            } else {
              const bad_armor_items = this.props.obj.equipped_items.filter(o =>
                o.base_item &&
                o.base_item.item_type === "Armor" &&
                !r.allowed_armor_types.includes(o.base_item.armor_type_id));
    
              good = bad_armor_items.length === 0;
            }
            if (good) {
              if (!r.required_weapon_keywords.includes("None")) {
                for (let i = 0; i < r.required_weapon_keywords.length; ++i) {
                  if (weapon.weapon_keywords.filter(o => o._id === r.required_weapon_keywords[i]).length === 0) {
                    good = false;
                    break;
                  }
                }
              }
              if (good) {
                if (!r.excluded_weapon_keywords.includes("None")) {
                  for (let i = 0; i < weapon.weapon_keywords.length; ++i) {
                    if (r.excluded_weapon_keywords.includes(weapon.weapon_keywords[i]._id)) {
                      good = false;
                      break;
                    }
                  }
                }
              }
              if (good) {
                if (!r.allowed_damage_types.includes("All")) {
                  good = false;
                  for (let i = 0; i < attack.damage_rolls.length; ++i) {
                    if (r.allowed_damage_types.includes(attack.damage_rolls[i].type)) {
                      good = true;
                      break;
                    }
                  }
                }
              }
              if (good) {
                rerolls.push(r);
              }
            }
          });
        }
        return (
          <Roller 
            name={attack.type}
            char={this.props.obj}
            rolls={attack.damage_rolls} 
            rerolls={rerolls}
            type="Damage" 
          />
        );
      }
    } else {
      const ability = this.state.popoverAction;
      if (ability) {
        if (ability.spell) {
          if (mode === "Attack") {
            return (
              <Roller 
                name={ability.name}
                char={this.props.obj}
                rolls={ability.attack.attack_rolls} 
                type="Attack" 
              />
            );
          } else if (mode === "Damage") {
            const level = this.state.popoverActionLevel;
            const potence = ability.get_potence(level, this.props.obj);
            let damage_rolls: RollPlus[] = [];
            if (potence) {
              const roll_plus = new RollPlus(potence.rolls);
              damage_rolls.push(roll_plus);
            }
            damage_rolls = [...damage_rolls,...ability.attack.damage_rolls];
            
            const rerolls: Reroll[] = [];
            this.props.obj.rerolls.forEach(r => {
              let good = false;
              if (r.allowed_armor_types.includes("All")) {
                // Check for required
                if (r.required_armor_types.includes("None")) {
                  good = true;
                } else if (r.required_armor_types.includes("Any")) {
                  good = this.props.obj.equipped_items.filter(o => 
                    o.base_item &&
                    o.base_item.item_type === "Armor" &&
                    o.base_item.name !== "Shield"
                  ).length > 0;
                } else {
                  const missing_armor_types = r.required_armor_types.filter(a =>
                    this.props.obj.equipped_items.filter(o =>
                      o.base_item &&
                      o.base_item.item_type === "Armor" &&
                      o.base_item.armor_type_id === a).length === 0);
                  good = missing_armor_types.length === 0;
                }
              } else if (r.allowed_armor_types.includes("None")) {
                good = this.props.obj.equipped_items.filter(o => 
                  o.base_item &&
                  o.base_item.item_type === "Armor" &&
                  o.base_item.name !== "Shield"
                ).length === 0;
              } else {
                const bad_armor_items = this.props.obj.equipped_items.filter(o =>
                  o.base_item &&
                  o.base_item.item_type === "Armor" &&
                  !r.allowed_armor_types.includes(o.base_item.armor_type_id));
      
                good = bad_armor_items.length === 0;
              }
              if (good) {
                if (!r.required_weapon_keywords.includes("None")) {
                } else if (!r.allowed_damage_types.includes("All")) {
                  good = false;
                  for (let i = 0; i < damage_rolls.length; ++i) {
                    if (r.allowed_damage_types.includes(damage_rolls[i].type)) {
                      good = true;
                      break;
                    }
                  }
                }
                rerolls.push(r);
              }
            });
            if (["Healing","Temp HP","Max HP"].includes(ability.effect_string)) {
              return (
                <Roller 
                  name={ability.name}
                  char={this.props.obj}
                  rolls={damage_rolls} 
                  rerolls={rerolls}
                  type={ability.effect_string} 
                />
              );
            } else {
              return (
                <Roller 
                  name={ability.name}
                  char={this.props.obj}
                  rolls={damage_rolls} 
                  rerolls={rerolls}
                  type="Damage" 
                />
              );
            }
          }
        } else if (ability.the_ability instanceof Ability) {
          if (mode === "Attack") {
            return (
              <Roller 
                name={ability.name}
                char={this.props.obj}
                rolls={ability.attack.attack_rolls} 
                type="Attack" 
              />
            );
          } else if (mode === "Damage") {
            const level = this.state.popoverActionLevel;
            const potence = ability.get_potence(level, this.props.obj);
            let damage_rolls: RollPlus[] = [];
            if (potence) {
              const roll_plus = new RollPlus(potence.rolls);
              damage_rolls.push(roll_plus);
            }
            damage_rolls = [...damage_rolls,...ability.attack.damage_rolls];
            
            const rerolls: Reroll[] = [];
            this.props.obj.rerolls.forEach(r => {
              let good = false;
              if (r.allowed_armor_types.includes("All")) {
                // Check for required
                if (r.required_armor_types.includes("None")) {
                  good = true;
                } else if (r.required_armor_types.includes("Any")) {
                  good = this.props.obj.equipped_items.filter(o => 
                    o.base_item &&
                    o.base_item.item_type === "Armor" &&
                    o.base_item.name !== "Shield"
                  ).length > 0;
                } else {
                  const missing_armor_types = r.required_armor_types.filter(a =>
                    this.props.obj.equipped_items.filter(o =>
                      o.base_item &&
                      o.base_item.item_type === "Armor" &&
                      o.base_item.armor_type_id === a).length === 0);
                  good = missing_armor_types.length === 0;
                }
              } else if (r.allowed_armor_types.includes("None")) {
                good = this.props.obj.equipped_items.filter(o => 
                  o.base_item &&
                  o.base_item.item_type === "Armor" &&
                  o.base_item.name !== "Shield"
                ).length === 0;
              } else {
                const bad_armor_items = this.props.obj.equipped_items.filter(o =>
                  o.base_item &&
                  o.base_item.item_type === "Armor" &&
                  !r.allowed_armor_types.includes(o.base_item.armor_type_id));
      
                good = bad_armor_items.length === 0;
              }
              if (good) {
                if (!r.required_weapon_keywords.includes("None")) {
                } else if (!r.allowed_damage_types.includes("All")) {
                  good = false;
                  for (let i = 0; i < damage_rolls.length; ++i) {
                    if (r.allowed_damage_types.includes(damage_rolls[i].type)) {
                      good = true;
                      break;
                    }
                  }
                }
                rerolls.push(r);
              }
            });
            if (["Healing","Temp HP","Max HP"].includes(ability.effect_string)) {
              return (
                <Roller 
                  name={ability.name}
                  char={this.props.obj}
                  rolls={damage_rolls} 
                  rerolls={rerolls}
                  type={ability.effect_string} 
                />
              );
            } else {
              return (
                <Roller 
                  name={ability.name}
                  char={this.props.obj}
                  rolls={damage_rolls} 
                  rerolls={rerolls}
                  type="Damage" 
                />
              );
            }
          }
        }
      }
    }
    return null;
  }

  setPopoverAnchorEl(el: HTMLDivElement | null) {
    this.setState({ popoverAnchorEl: el });
  }
}

export default connector(CharacterAction);
