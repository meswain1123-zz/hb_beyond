import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  Clear
} from "@material-ui/icons";
import {
  Grid, 
} from "@material-ui/core";

import { 
  Ability,
  Character,
  CharacterAbility,
  SpellAsAbility
} from "../../../models";

import CheckBox from "../../input/CheckBox";
import ButtonBox from "../../input/ButtonBox";

import DisplayObjects from "../display/DisplayObjects";
import ViewSpell from "../ViewSpell";

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
  ability: CharacterAbility;
  onChange: () => void;
  onClose: () => void;
}

export interface State {
  search_string: string;
  view: string;
  level: number;
}

class CharacterAbilityDetails extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      search_string: "",
      view: "",
      level: -1
    };
    this.api = API.getInstance();
    this.char_util = CharacterUtilities.getInstance();
  }

  api: APIClass;
  char_util: CharacterUtilitiesClass;

  componentDidMount() {
  }

  render() {
    const return_me: any[] = [];
    const the_ability = this.props.ability.the_ability;
    const self_condition_ids = this.props.ability.self_condition();
    if (the_ability instanceof Ability) {
      return_me.push(
        <Grid item key="source" style={{ 
          lineHeight: "1.1",
          fontSize: "10px",
          color: "gray"
        }}>
          { this.props.ability.source_name }
        </Grid>
      );
      return_me.push(
        <Grid item key="name" style={{ 
          lineHeight: "1.1",
          fontSize: "15px",
          fontWeight: "bold"
        }}>
          { this.props.ability.name }
        </Grid>
      );
      if (the_ability.resource_consumed && the_ability.resource_consumed !== "None") {
        if (the_ability.resource_consumed !== "Slot") {
          return_me.push(
            <Grid item key="resource" style={{ 
              lineHeight: "1.1",
              fontSize: "11px",
              fontWeight: "bold",
              borderTop: "1px solid lightgrey"
            }}>
              <span style={{ verticalAlign: "middle" }}>
                { 
                  the_ability.resource_consumed === "Special" ? 
                  "Limited Use " : 
                  <DisplayObjects type="resource" ids={[the_ability.resource_consumed]} />
                }
              </span>
              <span style={{ verticalAlign: "middle" }}>
                { this.renderResourceCheckboxes() }
              </span>
            </Grid>
          );
          if (the_ability.concentration && this.props.obj.concentrating_on) {
            return_me.push(
              <Grid item key="warning" style={{ 
                lineHeight: "1.1",
                fontSize: "11px",
                fontWeight: "bold",
                borderTop: "1px solid lightgrey"
              }}>
                Already Concentrating On
                { this.props.obj.concentrating_on &&
                  <Grid container spacing={0} direction="row">
                    <Grid item xs={9}>
                      <ViewSpell spell={this.props.obj.concentrating_on} show_ritual />
                    </Grid>
                    <Grid item xs={3}>
                      <Clear style={{ cursor: "pointer" }} 
                        onClick={() => {
                          this.props.obj.concentrating_on = null;
                          this.props.onChange();
                        }} 
                      />
                    </Grid>
                  </Grid> 
                }
              </Grid>
            );
          }
          return_me.push(
            <Grid item key="cast" style={{ 
              lineHeight: "1.1",
              fontSize: "11px",
              fontWeight: "bold",
              borderTop: "1px solid lightgrey"
            }}>
              <ButtonBox name="Use"
                disabled={this.props.ability.disabled(this.props.obj)}
                onClick={() => {
                  if (the_ability.concentration) {
                    // Set the concentration
                    this.props.obj.concentrating_on = this.props.ability;
                  }
                  // Increment the resource
                  if (the_ability.resource_consumed === "Special") {
                    this.props.ability.special_resource_used++;
                  } else {
                    const resource_finder = this.props.obj.resources.filter(o => 
                      o.type_id === the_ability.resource_consumed);
                    if (resource_finder.length === 1) {
                      const resource = resource_finder[0];
                      resource.used++;
                    }
                  }
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
                  this.props.onChange();
                  this.setState({ });
                }} 
              />
            </Grid>
          );
        } else {
          // Make this work more like with a spell
          return_me.push(
            <Grid item key="Slot" container spacing={0} direction="row">
              <Grid item xs={6}>
                { this.renderCastButton() }
              </Grid>
              <Grid item xs={6}>
                { this.renderLevelOptions() }
              </Grid>
            </Grid>
          );
        }
      } else if (the_ability.concentration) {
        if (this.props.obj.concentrating_on) {
          return_me.push(
            <Grid item key="warning" style={{ 
              lineHeight: "1.1",
              fontSize: "11px",
              fontWeight: "bold",
              borderTop: "1px solid lightgrey"
            }}>
              Already Concentrating On
            </Grid>
          );
        }
        return_me.push(
          <Grid item key="cast" style={{ 
            lineHeight: "1.1",
            fontSize: "11px",
            fontWeight: "bold",
            borderTop: "1px solid lightgrey"
          }}>
            <ButtonBox name="Use" 
              onClick={() => {
                // Set the concentration
                this.props.obj.concentrating_on = this.props.ability;
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
                this.props.onChange();
                this.setState({ });
              }} 
            />
          </Grid>
        );
      }
    } else if (the_ability instanceof SpellAsAbility) {
      console.log(the_ability);
      return_me.push(
        <Grid item key="source" style={{ 
          lineHeight: "1.1",
          fontSize: "10px",
          color: "gray"
        }}>
          { this.props.ability.source_name }
        </Grid>
      );
      return_me.push(
        <Grid item key="name" style={{ 
          lineHeight: "1.1",
          fontSize: "15px",
          fontWeight: "bold"
        }}>
          { this.props.ability.name }
        </Grid>
      );
      if (the_ability.resource_consumed && the_ability.resource_consumed !== "None") {
        if (the_ability.resource_consumed !== "Slot") {
          return_me.push(
            <Grid item key="resource" style={{ 
              lineHeight: "1.1",
              fontSize: "11px",
              fontWeight: "bold",
              borderTop: "1px solid lightgrey"
            }}>
              <span style={{ verticalAlign: "middle" }}>
                { 
                  the_ability.resource_consumed === "Special" ? 
                  "Limited Use " : 
                  <DisplayObjects type="resource" ids={[the_ability.resource_consumed]} />
                }
              </span>
              <span style={{ verticalAlign: "middle" }}>
                { this.renderResourceCheckboxes() }
              </span>
            </Grid>
          );
          if (the_ability.concentration && this.props.obj.concentrating_on) {
            return_me.push(
              <Grid item key="warning" style={{ 
                lineHeight: "1.1",
                fontSize: "11px",
                fontWeight: "bold",
                borderTop: "1px solid lightgrey"
              }}>
                Already Concentrating On
                { this.props.obj.concentrating_on &&
                  <Grid container spacing={0} direction="row">
                    <Grid item xs={9}>
                      <ViewSpell spell={this.props.obj.concentrating_on} show_ritual />
                    </Grid>
                    <Grid item xs={3}>
                      <Clear style={{ cursor: "pointer" }} 
                        onClick={() => {
                          this.props.obj.concentrating_on = null;
                          this.props.onChange();
                        }} 
                      />
                    </Grid>
                  </Grid> 
                }
              </Grid>
            );
          }
          return_me.push(
            <Grid item key="cast" style={{ 
              lineHeight: "1.1",
              fontSize: "11px",
              fontWeight: "bold",
              borderTop: "1px solid lightgrey"
            }}>
              <ButtonBox name="Use"
                disabled={this.props.ability.disabled(this.props.obj)}
                onClick={() => {
                  if (the_ability.concentration) {
                    // Set the concentration
                    this.props.obj.concentrating_on = this.props.ability;
                  }
                  // Increment the resource
                  if (the_ability.resource_consumed === "Special") {
                    this.props.ability.special_resource_used++;
                  } else {
                    const resource_finder = this.props.obj.resources.filter(o => 
                      o.type_id === the_ability.resource_consumed);
                    if (resource_finder.length === 1) {
                      const resource = resource_finder[0];
                      resource.used++;
                    }
                  }
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
                  this.props.onChange();
                  this.setState({ });
                }} 
              />
            </Grid>
          );
        } else {
          // Make this work more like with a spell
          return_me.push(
            <Grid item key="Slot" container spacing={0} direction="row">
              <Grid item xs={6}>
                { this.renderCastButton() }
              </Grid>
              <Grid item xs={6}>
                { this.renderLevelOptions() }
              </Grid>
            </Grid>
          );
        }
      } else if (the_ability.concentration) {
        if (this.props.obj.concentrating_on) {
          return_me.push(
            <Grid item key="warning" style={{ 
              lineHeight: "1.1",
              fontSize: "11px",
              fontWeight: "bold",
              borderTop: "1px solid lightgrey"
            }}>
              Already Concentrating On
            </Grid>
          );
        }
        return_me.push(
          <Grid item key="cast" style={{ 
            lineHeight: "1.1",
            fontSize: "11px",
            fontWeight: "bold",
            borderTop: "1px solid lightgrey"
          }}>
            <ButtonBox name="Use" 
              onClick={() => {
                // Set the concentration
                this.props.obj.concentrating_on = this.props.ability;
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
                this.props.onChange();
                this.setState({ });
              }} 
            />
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
    if (this.props.ability.spell) {
      return_me.push(
        <Grid item key="spell_description">
          { this.props.ability.spell.description }
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

  renderCastButton() {
    const the_ability = this.props.ability.the_ability;
    const level = this.state.level === -1 ? this.props.ability.level : this.state.level;
    const self_condition_ids = this.props.ability.self_condition();
    if (the_ability instanceof SpellAsAbility) {
      if (the_ability.level === 0 || the_ability.at_will) {
        if (the_ability.spell && the_ability.spell.concentration) {
          if (this.props.obj.concentrating_on) {
            return (
              <div>
                You're already concentrating on <ViewSpell spell={this.props.obj.concentrating_on} show_ritual />
                <ButtonBox name={ the_ability.level < level ? "Upcast Anyway" : "Cast Anyway" }
                  onClick={() => {
                    this.props.obj.concentrating_on = this.props.ability;
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
                    this.props.onChange();
                  }} 
                />
              </div>
            );
          } else {
            return (
              <ButtonBox name="At Will"
                onClick={() => {
                  this.props.obj.concentrating_on = this.props.ability;
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
                  this.props.onChange();
                  this.setState({ });
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
      } else if (the_ability.ritual_only) {
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
          if (the_ability.spell && the_ability.spell.concentration) { 
            if (this.props.obj.concentrating_on) {
              return (
                <div>
                  You're already concentrating on <ViewSpell spell={this.props.obj.concentrating_on} show_ritual />
                  <ButtonBox name={ the_ability.level < level ? `Upcast with ${slot.slot_name} Anyway` : `Cast with ${slot.slot_name} Anyway` }
                    disabled={slot.used === slot.total}
                    onClick={() => {
                      slot.used++;
                      this.props.obj.concentrating_on = this.props.ability;
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
                      this.props.onChange();
                    }} 
                  />
                </div>
              );
            } else {
              return (
                <ButtonBox name={ the_ability.level < level ? `Upcast with ${slot.slot_name}` : `Cast with ${slot.slot_name}` }
                  disabled={slot.used === slot.total}
                  onClick={() => {
                    slot.used++;
                    this.props.obj.concentrating_on = this.props.ability;
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
                    this.props.onChange();
                    this.setState({ });
                  }} 
                />
              );
            }
          } else {
            return (
              <ButtonBox name={ the_ability.level < level ? `Upcast with ${slot.slot_name}` : `Cast with ${slot.slot_name}` }
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
                  this.props.onChange();
                  this.setState({ });
                }} 
              />
            );
          }
        } else {
          if (the_ability.spell) {
            if (the_ability.spell.concentration && this.props.obj.concentrating_on) {
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
                            this.props.obj.concentrating_on = this.props.ability;
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
                            this.props.onChange();
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
                          this.props.obj.concentrating_on = this.props.ability;
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
                          this.props.onChange();
                        }} 
                      />
                    );
                  })}
                </div>
              );
            }
          } else {
            console.log(the_ability);
          }
        }
      }
    } else if (the_ability instanceof Ability) {
      console.log(the_ability);
      if (this.props.ability.level === 0 || this.props.ability.at_will) {
        if (the_ability.concentration) {
          if (this.props.obj.concentrating_on) {
            return (
              <div>
                You're already concentrating on <ViewSpell spell={this.props.obj.concentrating_on} show_ritual />
                <ButtonBox name={ "Use Anyway" }
                  onClick={() => {
                    this.props.obj.concentrating_on = this.props.ability;
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
                    this.props.onChange();
                  }} 
                />
              </div>
            );
          } else {
            return (
              <ButtonBox name="At Will"
                onClick={() => {
                  this.props.obj.concentrating_on = this.props.ability;
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
                  this.props.onChange();
                  this.setState({ });
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
      } else if (this.props.ability.ritual_only) {
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
          if (the_ability.concentration) { 
            if (this.props.obj.concentrating_on) {
              return (
                <div>
                  You're already concentrating on <ViewSpell spell={this.props.obj.concentrating_on} show_ritual />
                  <ButtonBox name={ `Use Anyway` }
                    disabled={slot.used === slot.total}
                    onClick={() => {
                      slot.used++;
                      this.props.obj.concentrating_on = this.props.ability;
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
                      this.props.onChange();
                    }} 
                  />
                </div>
              );
            } else {
              return (
                <ButtonBox name={ `Use with ${slot.slot_name}` }
                  disabled={slot.used === slot.total}
                  onClick={() => {
                    slot.used++;
                    this.props.obj.concentrating_on = this.props.ability;
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
                    this.props.onChange();
                    this.setState({ });
                  }} 
                />
              );
            }
          } else {
            return (
              <ButtonBox name={ `Use with ${slot.slot_name}` }
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
                  this.props.onChange();
                  this.setState({ });
                }} 
              />
            );
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
                          this.props.obj.concentrating_on = this.props.ability;
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
                          this.props.onChange();
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
                        this.props.obj.concentrating_on = this.props.ability;
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
                        this.props.onChange();
                      }} 
                    />
                  );
                })}
              </div>
            );
          }
        }
      }
    }
    return null;
  }

  renderLevelOptions() {
    const the_ability = this.props.ability.the_ability;
    const level = this.state.level === -1 ? this.props.ability.level : this.state.level;
    if (the_ability && level > 0) { // and not at will and not ritual only
      const slots = Array.from(new Set(this.props.obj.slots.filter(o => o.level >= level).map(o => o.level)));
      if (slots.length > 1) {
        return (
          <Grid container spacing={0} direction="row">
            <Grid item xs={4}>
              Level
            </Grid>
            <Grid item xs={8} container spacing={0} direction="row">
              <Grid item xs={4}>
                <ButtonBox
                  name=" - "
                  disabled={ level === Math.min(...slots) }
                  onClick={() => {
                    this.setState({ level: Math.max(...slots.filter(o => o < level)) });
                  }} 
                />
              </Grid>
              <Grid item xs={4}>
                {/* { this.get_level_string() } */}
              </Grid>
              <Grid item xs={4}>
                <ButtonBox
                  name=" + "
                  disabled={ level === Math.max(...slots) }
                  onClick={() => {
                    this.setState({ level: Math.min(...slots.filter(o => o > level)) });
                  }} 
                />
              </Grid>
            </Grid>
          </Grid>
        );
      }
    }
    return null;
  }

  renderAttacks() {
    const ability = this.props.ability;
    const level = this.state.level === -1 ? this.props.ability.level : this.state.level;
    return (
      <Grid item container spacing={0} direction="row">
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
            { !["Control","Utility","Summon","Transform"].includes(ability.effect_string) ?
              <ButtonBox
                fontSize={9}
                name={ ability.get_potence_string(level, this.props.obj) }
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

  renderResourceCheckboxes() {
    const return_me: any[] = [];
    const the_ability = this.props.ability.the_ability;
    if (the_ability instanceof Ability && the_ability.resource_consumed) {
      const obj = this.props.obj;
      if (the_ability.resource_consumed === "Special") {
        for (let i = 0; i < +this.props.ability.special_resource_amount; ++i) {
          return_me.push(
            <CheckBox key={i} name="" 
              value={this.props.ability.special_resource_used > i} 
              onChange={() => {
                if (this.props.ability.special_resource_used > i) {
                  this.props.ability.special_resource_used--;
                } else {
                  this.props.ability.special_resource_used++;
                }
                this.props.onChange();
                this.setState({ });
              }}
            />
          );
        }
      } else {
        const resource_finder = obj.resources.filter(o => 
          o.type_id === the_ability.resource_consumed);
        if (resource_finder.length === 1) {
          const resource = resource_finder[0];
          for (let i = 0; i < resource.total; ++i) {
            return_me.push(
              <CheckBox key={i} name="" 
                value={resource.used > i} 
                onChange={() => {
                  if (resource.used > i) {
                    resource.used--;
                  } else {
                    resource.used++;
                  }
                  this.props.onChange();
                  this.setState({ });
                }}
              />
            );
          }
        }
      }
    }
    return return_me;
  }
}

export default connector(CharacterAbilityDetails);
