import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  Clear
} from "@material-ui/icons";
import {
  Grid, Popover
} from "@material-ui/core";

import { 
  Ability,
  Character,
  CharacterAbility,
  CharacterSpell,
  CharacterSpecialSpell,
  SpellAsAbility,
  ItemAffectingAbility
} from "../../../models";

import ButtonBox from "../../input/ButtonBox";

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
  character: Character;
  obj: CharacterAbility | CharacterSpecialSpell | CharacterSpell;
  simple: boolean; // When this is true then it just shows a single button, and when clicked does a popover for the rest
  level: number;
  onChange: () => void;
}

export interface State {
  popoverAnchorEl: HTMLDivElement | null;
}

class CharacterCastButton extends Component<Props, State> {
  public static defaultProps = {
    simple: false,
    level: -1
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      popoverAnchorEl: null,
    };
    this.api = API.getInstance();
    this.char_util = CharacterUtilities.getInstance();
  }

  api: APIClass;
  char_util: CharacterUtilitiesClass;

  componentDidMount() {
  }

  render() {
    const obj = this.props.obj;
    const level = this.props.level === -1 ? this.props.obj.level : this.props.level;
    if (obj instanceof CharacterAbility) {
      const the_ability = obj.the_ability;
      const self_condition_ids = obj.self_condition();
          
      if (the_ability && !(the_ability instanceof ItemAffectingAbility)) {
        if (the_ability.resource_consumed === "Slot") {
          // Get the slots for the level
          const slots = this.props.character.slots.filter(o => o.level === level);
          
          if (slots.length === 1) {
            const slot = slots[0];
            if (the_ability.concentration && this.props.character.concentrating_on) {
              if (this.props.simple) {
                return (
                  <div>
                    <ButtonBox name={obj.use_string(this.props.character)}
                      disabled={obj.disabled(this.props.character, level)}
                      onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                        this.setState({ popoverAnchorEl: event.currentTarget });
                      }} 
                    />
                    { this.renderExtras() }
                  </div>
                );
              } else {
                return (
                  <div>
                    You're already concentrating on
                    { this.props.character.concentrating_on &&
                      <Grid container spacing={0} direction="row">
                        <Grid item xs={9}>
                          <ViewSpell spell={this.props.character.concentrating_on} show_ritual />
                        </Grid>
                        <Grid item xs={3}>
                          <Clear style={{ cursor: "pointer" }} 
                            onClick={() => {
                              this.props.character.concentrating_on = null;
                              this.props.onChange();
                            }} 
                          />
                        </Grid>
                      </Grid> 
                    }
                    <ButtonBox name="Use Anyway"
                      disabled={obj.disabled(this.props.character, level)}
                      onClick={() => {
                        this.triggerAbilityEffect(slot.slot_name);
                      }} 
                    />
                  </div>
                );
              }
            } else {
              return (
                <ButtonBox name={obj.use_string(this.props.character)}
                  disabled={obj.disabled(this.props.character, level)}
                  onClick={() => {
                    this.triggerAbilityEffect("Slots");
                  }} 
                />
              );
            }
          } else {
            if (this.props.simple) {
              return (
                <div>
                  <ButtonBox name={obj.use_string(this.props.character)}
                    disabled={obj.disabled(this.props.character, level)}
                    onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                      this.setState({ popoverAnchorEl: event.currentTarget });
                    }} 
                  />
                  { this.renderExtras() }
                </div>
              );
            } else if (the_ability.concentration && this.props.character.concentrating_on) {
              return (
                <div>
                  You're already concentrating on
                  { this.props.character.concentrating_on &&
                    <Grid container spacing={0} direction="row">
                      <Grid item xs={9}>
                        <ViewSpell spell={this.props.character.concentrating_on} show_ritual />
                      </Grid>
                      <Grid item xs={3}>
                        <Clear style={{ cursor: "pointer" }} 
                          onClick={() => {
                            this.props.character.concentrating_on = null;
                            this.props.onChange();
                          }} 
                        />
                      </Grid>
                    </Grid> 
                  }
                  <div>
                    { slots.map((slot, key) => {
                      return (
                        <ButtonBox key={key} name={slot.slot_name}
                          disabled={obj.disabled(this.props.character, level)}
                          onClick={() => {
                            this.triggerAbilityEffect(slot.slot_name);
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
                        disabled={obj.disabled(this.props.character, level)}
                        onClick={() => {
                          this.triggerAbilityEffect(slot.slot_name);
                        }} 
                      />
                    );
                  })}
                </div>
              );
            }
          }
        } else if (the_ability.resource_consumed === "Special") {
          if (the_ability.concentration && this.props.character.concentrating_on) {
            if (this.props.simple) {
              return (
                <div>
                  <ButtonBox name={obj.use_string(this.props.character)}
                    disabled={obj.disabled(this.props.character, level)}
                    onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                      this.setState({ popoverAnchorEl: event.currentTarget });
                    }} 
                  />
                  { this.renderExtras() }
                </div>
              );
            } else {
              return (
                <div>
                  You're already concentrating on
                  { this.props.character.concentrating_on &&
                    <Grid container spacing={0} direction="row">
                      <Grid item xs={9}>
                        <ViewSpell spell={this.props.character.concentrating_on} show_ritual />
                      </Grid>
                      <Grid item xs={3}>
                        <Clear style={{ cursor: "pointer" }} 
                          onClick={() => {
                            this.props.character.concentrating_on = null;
                            this.props.onChange();
                          }} 
                        />
                      </Grid>
                    </Grid> 
                  }
                  <ButtonBox name="Use Anyway"
                    disabled={obj.disabled(this.props.character, level)}
                    onClick={() => {
                      this.triggerAbilityEffect("Slots");
                    }} 
                  />
                </div>
              );
            }
          } else {
            return (
              <ButtonBox name={obj.use_string(this.props.character)}
                disabled={obj.disabled(this.props.character, level)}
                onClick={() => {
                  obj.special_resource_used += +the_ability.amount_consumed;
                  if (the_ability.concentration) {
                    this.props.character.concentrating_on = obj;
                  }
                  this.triggerAbilityEffect("Slots");
                }} 
              />
            );
          }
        } else if (the_ability.resource_consumed === "None") {
          if (the_ability.concentration && this.props.character.concentrating_on) {
            if (this.props.simple) {
              return (
                <div>
                  <ButtonBox name={obj.use_string(this.props.character)}
                    disabled={obj.disabled(this.props.character, level)}
                    onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                      this.setState({ popoverAnchorEl: event.currentTarget });
                    }} 
                  />
                  { this.renderExtras() }
                </div>
              );
            } else {
              return (
                <div>
                  You're already concentrating on
                  { this.props.character.concentrating_on &&
                    <Grid container spacing={0} direction="row">
                      <Grid item xs={9}>
                        <ViewSpell spell={this.props.character.concentrating_on} show_ritual />
                      </Grid>
                      <Grid item xs={3}>
                        <Clear style={{ cursor: "pointer" }} 
                          onClick={() => {
                            this.props.character.concentrating_on = null;
                            this.props.onChange();
                          }} 
                        />
                      </Grid>
                    </Grid> 
                  }
                  <ButtonBox name="Use Anyway"
                    disabled={obj.disabled(this.props.character, level)}
                    onClick={() => {
                      this.props.character.concentrating_on = obj;
                      if (self_condition_ids.length > 0) {
                        // Apply the conditions
                        const character = this.props.character;
                        self_condition_ids.forEach(cond_id => {
                          character.conditions.push(cond_id);
                        });
                        if (character instanceof Character) {
                          this.char_util.recalcAll(character);
                        }
                      }
                    }} 
                  />
                </div>
              );
            }
          } else {
            return (
              <ButtonBox name={obj.use_string(this.props.character)}
                disabled={obj.disabled(this.props.character, level)}
                onClick={() => {
                  if (the_ability.concentration) {
                    this.props.character.concentrating_on = obj;
                  }
                  if (self_condition_ids.length > 0) {
                    // Apply the conditions
                    const character = this.props.character;
                    self_condition_ids.forEach(cond_id => {
                      character.conditions.push(cond_id);
                    });
                    if (character instanceof Character) {
                      this.char_util.recalcAll(character);
                    }
                  }
                }} 
              />
            );
          }
        } else {
          // Get the resources
          const resources = this.props.character.resources.filter(o => the_ability.resource_consumed);
          
          if (resources.length === 1) {
            const resource = resources[0];
            if (the_ability.concentration && this.props.character.concentrating_on) {
              if (this.props.simple) {
                return (
                  <div>
                    <ButtonBox name={obj.use_string(this.props.character)}
                      disabled={obj.disabled(this.props.character, level)}
                      onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                        this.setState({ popoverAnchorEl: event.currentTarget });
                      }} 
                    />
                    { this.renderExtras() }
                  </div>
                );
              } else {
                return (
                  <div>
                    You're already concentrating on
                    { this.props.character.concentrating_on &&
                      <Grid container spacing={0} direction="row">
                        <Grid item xs={9}>
                          <ViewSpell spell={this.props.character.concentrating_on} show_ritual />
                        </Grid>
                        <Grid item xs={3}>
                          <Clear style={{ cursor: "pointer" }} 
                            onClick={() => {
                              this.props.character.concentrating_on = null;
                              this.props.onChange();
                            }} 
                          />
                        </Grid>
                      </Grid> 
                    }
                    <ButtonBox name="Use Anyway"
                      disabled={obj.disabled(this.props.character, level)}
                      onClick={() => {
                        this.triggerAbilityEffect("Slots");
                      }} 
                    />
                  </div>
                );
              }
            } else {
              return (
                <ButtonBox name={obj.use_string(this.props.character)}
                  disabled={obj.disabled(this.props.character, level)}
                  onClick={() => {
                    resource.used += +the_ability.amount_consumed;
                    if (the_ability.concentration) {
                      this.props.character.concentrating_on = obj;
                    }
                    this.triggerAbilityEffect("Slots");
                  }} 
                />
              );
            }
          }
        }
      }
    } else {
      const spell = obj;
      const self_condition_ids = spell.self_condition();
      if (spell.level === 0 || (spell.at_will && level === spell.level)) {
        if (spell.spell && spell.spell.concentration) {
          if (this.props.character.concentrating_on) {
            return (
              <ButtonBox name="At Will"
                onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                  this.setState({ popoverAnchorEl: event.currentTarget });
                }} 
              />
            );
          } else {
            return (
              <ButtonBox name="At Will"
                onClick={() => {
                  this.props.character.concentrating_on = spell;
                  if (self_condition_ids.length > 0) {
                    // Apply the conditions
                    const character = this.props.character;
                    self_condition_ids.forEach(cond_id => {
                      character.conditions.push(cond_id);
                    });
                    if (character instanceof Character) {
                      this.char_util.recalcAll(character);
                    }
                  }
                  this.updateCharacter();
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
                const character = this.props.character;
                self_condition_ids.forEach(cond_id => {
                  character.conditions.push(cond_id);
                });
                if (character instanceof Character) {
                  this.char_util.recalcAll(character);
                }
              }}
            />
          );
        }
      } else if (spell.ritual_only) {
        return (
          <ButtonBox 
            disabled={self_condition_ids.length === 0} 
            name="Ritual" 
            onClick={() => {
              // Apply the conditions
              const character = this.props.character;
              self_condition_ids.forEach(cond_id => {
                character.conditions.push(cond_id);
              });
              if (character instanceof Character) {
                this.char_util.recalcAll(character);
              }
            }}
          />
        );
      } else if (spell instanceof CharacterSpecialSpell) {
        if (spell.special_spell_feature) {
          const ssf = spell.special_spell_feature;
          // if (ssf.at_will) // Unnecessary because it would be caught above
          let used = 0;
          let max = 0;
          if (level === spell.level && ssf.slot_override.includes("Special")) {
            used = spell.special_resource_used;
            max = spell.special_resource_max;
          }

          if (used < max || ssf.slot_override === "Only Special Resource" || ssf.slot_override === "And Special Resource") {
            if (ssf.slot_override === "And Special Resource") {
              const slots = this.props.character.slots.filter(o => o.level === level);
              if (slots.length === 1) {
                const slot = slots[0];
                if (spell.spell && spell.spell.concentration) { 
                  if (this.props.character.concentrating_on) {
                    return (
                      <ButtonBox name="Use"
                        disabled={slot.used === slot.total}
                        onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                          this.setState({ popoverAnchorEl: event.currentTarget });
                        }} 
                      />
                    );
                  } else {
                    return (
                      <ButtonBox name="Use"
                        disabled={slot.used === slot.total}
                        onClick={() => {
                          slot.used++;
                          this.props.character.concentrating_on = spell;
                          if (self_condition_ids.length > 0) {
                            // Apply the conditions
                            const character = this.props.character;
                            self_condition_ids.forEach(cond_id => {
                              character.conditions.push(cond_id);
                            });
                            if (character instanceof Character) {
                              this.char_util.recalcAll(character);
                            }
                          }
                          this.updateCharacter();
                        }} 
                      />
                    );
                  }
                } else {
                  return (
                    <ButtonBox name="Use"
                      disabled={slot.used === slot.total}
                      onClick={() => {
                        slot.used++;
                        if (self_condition_ids.length > 0) {
                          // Apply the conditions
                          const character = this.props.character;
                          self_condition_ids.forEach(cond_id => {
                            character.conditions.push(cond_id);
                          });
                          if (character instanceof Character) {
                            this.char_util.recalcAll(character);
                          }
                        }
                        this.updateCharacter();
                      }} 
                    />
                  );
                }
              } else {
                return (
                  <ButtonBox name="Use"
                    disabled={slots.filter(o => o.used < o.total).length === 0}
                    onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                      this.setState({ popoverAnchorEl: event.currentTarget });
                    }} 
                  />
                );
              }
            } else {
              if (spell.concentration && this.props.character.concentrating_on) {
                if (this.props.simple) {
                  return (
                    <div>
                      <ButtonBox name={obj.use_string(this.props.character)}
                        disabled={obj.disabled(this.props.character, level)}
                        onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                          this.setState({ popoverAnchorEl: event.currentTarget });
                        }} 
                      />
                      { this.renderExtras() }
                    </div>
                  );
                } else {
                  return (
                    <div>
                      You're already concentrating on
                      { this.props.character.concentrating_on &&
                        <Grid container spacing={0} direction="row">
                          <Grid item xs={9}>
                            <ViewSpell spell={this.props.character.concentrating_on} show_ritual />
                          </Grid>
                          <Grid item xs={3}>
                            <Clear style={{ cursor: "pointer" }} 
                              onClick={() => {
                                this.props.character.concentrating_on = null;
                                this.props.onChange();
                              }} 
                            />
                          </Grid>
                        </Grid> 
                      }
                      <ButtonBox name="Use Anyway"
                        disabled={spell.disabled(this.props.character, level)}
                        onClick={() => {
                          this.triggerAbilityEffect("Slots");
                        }} 
                      />
                    </div>
                  );
                }
              } else {
                return (
                  <ButtonBox name={spell.use_string(this.props.character)}
                    disabled={spell.disabled(this.props.character, level)}
                    onClick={() => {
                      this.triggerAbilityEffect("Slots");
                    }} 
                  />
                );
              }
            }
          } else {
            const slots = this.props.character.slots.filter(o => o.level === level);
            if (slots.length === 1) {
              const slot = slots[0];
              if (spell.spell && spell.spell.concentration) { 
                if (this.props.character.concentrating_on) {
                  return (
                    <ButtonBox name={ spell.level < level ? "Upcast" : "Cast" }
                      disabled={slot.used === slot.total}
                      onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                        this.setState({ popoverAnchorEl: event.currentTarget });
                      }} 
                    />
                  );
                } else {
                  return (
                    <ButtonBox name={ spell.level < level ? "Upcast" : "Cast" }
                      disabled={slot.used === slot.total}
                      onClick={() => {
                        slot.used++;
                        this.props.character.concentrating_on = spell;
                        if (self_condition_ids.length > 0) {
                          // Apply the conditions
                          const character = this.props.character;
                          self_condition_ids.forEach(cond_id => {
                            character.conditions.push(cond_id);
                          });
                          if (character instanceof Character) {
                            this.char_util.recalcAll(character);
                          }
                        }
                        this.updateCharacter();
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
                        const character = this.props.character;
                        self_condition_ids.forEach(cond_id => {
                          character.conditions.push(cond_id);
                        });
                        if (character instanceof Character) {
                          this.char_util.recalcAll(character);
                        }
                      }
                      this.updateCharacter();
                    }} 
                  />
                );
              }
            } else {
              return (
                <ButtonBox name={ spell.level < level ? "Upcast" : "Cast" }
                  disabled={slots.filter(o => o.used < o.total).length === 0}
                  onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                    this.setState({ popoverAnchorEl: event.currentTarget });
                  }} 
                />
              );
            }
          }
        }
      } else {
        // Get the slots for the level
        const slots = this.props.character.slots.filter(o => o.level === level);
        if (slots.length === 1) {
          const slot = slots[0];
          if (spell.spell && spell.spell.concentration) { 
            if (this.props.character.concentrating_on) {
              return (
                <ButtonBox name={ spell.level < level ? "Upcast" : "Cast" }
                  disabled={slot.used === slot.total}
                  onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                    this.setState({ popoverAnchorEl: event.currentTarget });
                  }} 
                />
              );
            } else {
              return (
                <ButtonBox name={ spell.level < level ? "Upcast" : "Cast" }
                  disabled={slot.used === slot.total}
                  onClick={() => {
                    slot.used++;
                    this.props.character.concentrating_on = spell;
                    if (self_condition_ids.length > 0) {
                      // Apply the conditions
                      const character = this.props.character;
                      self_condition_ids.forEach(cond_id => {
                        character.conditions.push(cond_id);
                      });
                      if (character instanceof Character) {
                        this.char_util.recalcAll(character);
                      }
                    }
                    this.updateCharacter();
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
                    const character = this.props.character;
                    self_condition_ids.forEach(cond_id => {
                      character.conditions.push(cond_id);
                    });
                    if (character instanceof Character) {
                      this.char_util.recalcAll(character);
                    }
                  }
                  this.updateCharacter();
                }} 
              />
            );
          }
        } else {
          return (
            <ButtonBox name={ spell.level < level ? "Upcast" : "Cast" }
              disabled={slots.filter(o => o.used < o.total).length === 0}
              onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                this.setState({ popoverAnchorEl: event.currentTarget });
              }} 
            />
          );
        }
      }
    }
    return null;
  }

  renderCastOptions() {
    const obj = this.props.obj;
    const level = this.props.level === -1 ? this.props.obj.level : this.props.level;
    const self_condition_ids = obj.self_condition();
    if (obj instanceof CharacterSpecialSpell) {
      if (obj.spell) {
        if ((obj.level === 0 || obj.at_will) && obj.spell.concentration && this.props.character.concentrating_on) {
          return (
            <div>
              You're already concentrating on 
              { (this.props.character.concentrating_on instanceof CharacterSpell || this.props.character.concentrating_on instanceof CharacterAbility) &&
                <ViewSpell spell={this.props.character.concentrating_on} show_ritual />
              }
              <ButtonBox name={ obj.level < level ? "Upcast Anyway" : "Cast Anyway" }
                onClick={() => {
                  this.props.character.concentrating_on = obj;
                  if (self_condition_ids.length > 0) {
                    // Apply the conditions
                    const character = this.props.character;
                    self_condition_ids.forEach(cond_id => {
                      character.conditions.push(cond_id);
                    });
                    if (character instanceof Character) {
                      this.char_util.recalcAll(character);
                    }
                  }
                  this.updateCharacter();
                }} 
              />
            </div>
          );
        } else if (obj.ritual_only) {
          return null;
        } else {
          // Get the slots for the level
          const slots = this.props.character.slots.filter(o => o.level === level);
          if (slots.length === 1) {
            const slot = slots[0];
            if (obj.spell.concentration && this.props.character.concentrating_on) {
              return (
                <div>
                  You're already concentrating on <ViewSpell spell={this.props.character.concentrating_on} show_ritual />
                  <ButtonBox name={ obj.level < level ? "Upcast Anyway" : "Cast Anyway" }
                    disabled={slot.used === slot.total}
                    onClick={() => {
                      slot.used++;
                      this.props.character.concentrating_on = obj;
                      if (self_condition_ids.length > 0) {
                        // Apply the conditions
                        const character = this.props.character;
                        self_condition_ids.forEach(cond_id => {
                          character.conditions.push(cond_id);
                        });
                        if (character instanceof Character) {
                          this.char_util.recalcAll(character);
                        }
                      }
                      this.updateCharacter();
                    }} 
                  />
                </div>
              );
            }
          } else {
            if (obj.spell.concentration && this.props.character.concentrating_on) {
              return (
                <div>
                  You're already concentrating on <ViewSpell spell={this.props.character.concentrating_on} show_ritual />
                  <div>
                    { slots.map((slot, key) => {
                      return (
                        <ButtonBox key={key} name={slot.slot_name}
                          disabled={slot.used === slot.total}
                          onClick={() => {
                            slot.used++;
                            this.props.character.concentrating_on = obj;
                            if (self_condition_ids.length > 0) {
                              // Apply the conditions
                              const character = this.props.character;
                              self_condition_ids.forEach(cond_id => {
                                character.conditions.push(cond_id);
                              });
                              if (character instanceof Character) {
                                this.char_util.recalcAll(character);
                              }
                            }
                            this.updateCharacter();
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
                            const character = this.props.character;
                            self_condition_ids.forEach(cond_id => {
                              character.conditions.push(cond_id);
                            });
                            if (character instanceof Character) {
                              this.char_util.recalcAll(character);
                            }
                          }
                          this.updateCharacter();
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
    } else if (obj instanceof CharacterSpell) {
      if (obj.spell) {
        if ((obj.level === 0 || obj.at_will) && obj.spell.concentration && this.props.character.concentrating_on) {
          return (
            <div>
              You're already concentrating on 
              { (this.props.character.concentrating_on instanceof CharacterSpell || this.props.character.concentrating_on instanceof CharacterAbility) &&
                <ViewSpell spell={this.props.character.concentrating_on} show_ritual />
              }
              <ButtonBox name={ obj.level < level ? "Upcast Anyway" : "Cast Anyway" }
                onClick={() => {
                  this.props.character.concentrating_on = obj;
                  if (self_condition_ids.length > 0) {
                    // Apply the conditions
                    const character = this.props.character;
                    self_condition_ids.forEach(cond_id => {
                      character.conditions.push(cond_id);
                    });
                    if (character instanceof Character) {
                      this.char_util.recalcAll(character);
                    }
                  }
                  this.updateCharacter();
                }} 
              />
            </div>
          );
        } else if (obj.ritual_only) {
          return null;
        } else {
          // Get the slots for the level
          const slots = this.props.character.slots.filter(o => o.level === level);
          if (slots.length === 1) {
            const slot = slots[0];
            if (obj.spell.concentration && this.props.character.concentrating_on) {
              return (
                <div>
                  You're already concentrating on <ViewSpell spell={this.props.character.concentrating_on} show_ritual />
                  <ButtonBox name={ obj.level < level ? "Upcast Anyway" : "Cast Anyway" }
                    disabled={slot.used === slot.total}
                    onClick={() => {
                      slot.used++;
                      this.props.character.concentrating_on = obj;
                      if (self_condition_ids.length > 0) {
                        // Apply the conditions
                        const character = this.props.character;
                        self_condition_ids.forEach(cond_id => {
                          character.conditions.push(cond_id);
                        });
                        if (character instanceof Character) {
                          this.char_util.recalcAll(character);
                        }
                      }
                      this.updateCharacter();
                    }} 
                  />
                </div>
              );
            }
          } else {
            if (obj.spell.concentration && this.props.character.concentrating_on) {
              return (
                <div>
                  You're already concentrating on <ViewSpell spell={this.props.character.concentrating_on} show_ritual />
                  <div>
                    { slots.map((slot, key) => {
                      return (
                        <ButtonBox key={key} name={slot.slot_name}
                          disabled={slot.used === slot.total}
                          onClick={() => {
                            slot.used++;
                            this.props.character.concentrating_on = obj;
                            if (self_condition_ids.length > 0) {
                              // Apply the conditions
                              const character = this.props.character;
                              self_condition_ids.forEach(cond_id => {
                                character.conditions.push(cond_id);
                              });
                              if (character instanceof Character) {
                                this.char_util.recalcAll(character);
                              }
                            }
                            this.updateCharacter();
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
                            const character = this.props.character;
                            self_condition_ids.forEach(cond_id => {
                              character.conditions.push(cond_id);
                            });
                            if (character instanceof Character) {
                              this.char_util.recalcAll(character);
                            }
                          }
                          this.updateCharacter();
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
    } else if (obj instanceof CharacterAbility) {
      const the_ability = obj.the_ability;
      
      if (the_ability && !(the_ability instanceof ItemAffectingAbility)) {
        if (the_ability.resource_consumed === "Slot") {
          // Get the slots for the level
          const slots = this.props.character.slots.filter(o => o.level === level);
          
          if (slots.length === 1) {
            const slot = slots[0];
            if (the_ability.concentration && this.props.character.concentrating_on) {
              return (
                <div>
                  You're already concentrating on <ViewSpell spell={this.props.character.concentrating_on} show_ritual />
                  <ButtonBox name="Use Anyway"
                    disabled={slot.used + +the_ability.amount_consumed > slot.total}
                    onClick={() => {
                      this.triggerAbilityEffect(slot.slot_name);
                      // slot.used += +the_ability.amount_consumed;
                      // this.props.character.concentrating_on = obj;
                      // if (self_condition_ids.length > 0) {
                      //   // Apply the conditions
                      //   const character = this.props.character;
                      //   self_condition_ids.forEach(cond_id => {
                      //     character.conditions.push(cond_id);
                      //   });
                      //   if (character instanceof Character) {
                      //     this.char_util.recalcAll(character);
                      //   }
                      // }
                      // this.updateCharacter();
                    }} 
                  />
                </div>
              );
            } else {
              // It will never go here because then it wouldn't have done cast options
              return (<span>I didn't think it could go here</span>);
            }
          } else {
            if (the_ability.concentration && this.props.character.concentrating_on) {
              return (
                <div>
                  You're already concentrating on <ViewSpell spell={this.props.character.concentrating_on} show_ritual />
                  <div>
                    { slots.map((slot, key) => {
                      return (
                        <ButtonBox key={key} name={slot.slot_name}
                          disabled={slot.used + +the_ability.amount_consumed > slot.total}
                          onClick={() => {
                            this.triggerAbilityEffect(slot.slot_name);
                            // slot.used++;
                            // this.props.character.concentrating_on = obj;
                            // if (self_condition_ids.length > 0) {
                            //   // Apply the conditions
                            //   const character = this.props.character;
                            //   self_condition_ids.forEach(cond_id => {
                            //     character.conditions.push(cond_id);
                            //   });
                            //   if (character instanceof Character) {
                            //     this.char_util.recalcAll(character);
                            //   }
                            // }
                            // this.updateCharacter();
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
                        disabled={slot.used + +the_ability.amount_consumed > slot.total}
                        onClick={() => {
                          this.triggerAbilityEffect(slot.slot_name);
                          // slot.used += +the_ability.amount_consumed;
                          // if (self_condition_ids.length > 0) {
                          //   // Apply the conditions
                          //   const character = this.props.character;
                          //   self_condition_ids.forEach(cond_id => {
                          //     character.conditions.push(cond_id);
                          //   });
                          //   if (character instanceof Character) {
                          //     this.char_util.recalcAll(character);
                          //   }
                          // }
                          // this.updateCharacter();
                        }} 
                      />
                    );
                  })}
                </div>
              );
            }
          }
        } else if (the_ability.resource_consumed === "Special") {
          if (the_ability.concentration && this.props.character.concentrating_on) {
            return (
              <div>
                You're already concentrating on <ViewSpell spell={this.props.character.concentrating_on} show_ritual />
                <ButtonBox name="Use Anyway"
                  disabled={obj.special_resource_used + +the_ability.amount_consumed > obj.special_resource_amount}
                  onClick={() => {
                    this.triggerAbilityEffect("Slots");
                    // obj.special_resource_used += +the_ability.amount_consumed;
                    // this.props.character.concentrating_on = obj;
                    // if (self_condition_ids.length > 0) {
                    //   // Apply the conditions
                    //   const character = this.props.character;
                    //   self_condition_ids.forEach(cond_id => {
                    //     character.conditions.push(cond_id);
                    //   });
                    //   if (character instanceof Character) {
                    //     this.char_util.recalcAll(character);
                    //   }
                    // }
                    // this.updateCharacter();
                  }} 
                />
              </div>
            );
          } else {
            // It will never go here because then it wouldn't have done cast options
            return (<span>I didn't think it could go here</span>);
          }
        } else if (the_ability.resource_consumed === "None") {
          if (this.props.character.concentrating_on) {
            return (
              <div>
                You're already concentrating on <ViewSpell spell={this.props.character.concentrating_on} show_ritual />
                <ButtonBox name="Use Anyway"
                  disabled={obj.special_resource_used + +the_ability.amount_consumed > obj.special_resource_amount}
                  onClick={() => {
                    this.triggerAbilityEffect("Slots");
                    // this.props.character.concentrating_on = obj;
                    // if (self_condition_ids.length > 0) {
                    //   // Apply the conditions
                    //   const character = this.props.character;
                    //   self_condition_ids.forEach(cond_id => {
                    //     character.conditions.push(cond_id);
                    //   });
                    //   if (character instanceof Character) {
                    //     this.char_util.recalcAll(character);
                    //   }
                    // }
                  }} 
                />
              </div>
            );
          } else {
            return (<span>I didn't think it could go here</span>);
          }
        } else {
          // Get the resources
          const resources = this.props.character.resources.filter(o => the_ability.resource_consumed);
          
          if (resources.length === 1) {
            const resource = resources[0];
            if (the_ability.concentration && this.props.character.concentrating_on) {
              return (
                <div>
                  You're already concentrating on <ViewSpell spell={this.props.character.concentrating_on} show_ritual />
                  <ButtonBox name="Use Anyway"
                    disabled={resource.used + +the_ability.amount_consumed > resource.total}
                    onClick={() => {
                      this.triggerAbilityEffect("Slots");
                      // resource.used += +the_ability.amount_consumed;
                      // this.props.character.concentrating_on = obj;
                      // if (self_condition_ids.length > 0) {
                      //   // Apply the conditions
                      //   const character = this.props.character;
                      //   self_condition_ids.forEach(cond_id => {
                      //     character.conditions.push(cond_id);
                      //   });
                      //   if (character instanceof Character) {
                      //     this.char_util.recalcAll(character);
                      //   }
                      // }
                      // this.updateCharacter();
                    }} 
                  />
                </div>
              );
            } else {
              // It will never go here because then it wouldn't have done cast options
              return (<span>I didn't think it could go here</span>);
            }
          }
        }
      }
      return null;
    }
  }

  renderExtras() {
    return (
      <Popover
        open={ this.state.popoverAnchorEl !== null }
        anchorEl={this.state.popoverAnchorEl}
        onClose={() => {
          this.setState({ popoverAnchorEl: null });
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
      </Popover>
    );
  }

  triggerAbilityEffect(slot_type: string) {
    const obj = this.props.obj;
    const self_condition_ids = obj.self_condition();
    if (obj instanceof CharacterAbility) {
      const the_ability = obj.the_ability;
      if (the_ability) {
        let go = false;
        const level = this.props.level === -1 ? this.props.obj.level : this.props.level;
        if (the_ability.resource_consumed === "Slot") {
          const slots = this.props.character.slots.filter(o => o.level === level && o.slot_name === slot_type);
              
          if (slots.length === 1) {
            const slot = slots[0];
            if (slot.used + +the_ability.amount_consumed <= slot.total) {
              slot.used += +the_ability.amount_consumed;
              go = true;
            }
          }
        } else if (the_ability.resource_consumed === "Special") {
          if (obj.special_resource_used + +the_ability.amount_consumed <= obj.special_resource_amount) {
            obj.special_resource_used += +the_ability.amount_consumed;
            go = true;
          }
        } else if (the_ability.resource_consumed === "None") {
          go = true;
        } else {
          const resources = this.props.character.resources.filter(o => the_ability.resource_consumed);
          
          if (resources.length === 1) {
            const resource = resources[0];
            if (resource.used + +the_ability.amount_consumed <= resource.total) {
              resource.used += +the_ability.amount_consumed;
              go = true;
            }
          }
        }
        if (go) {
          if (!(the_ability instanceof ItemAffectingAbility) && the_ability.concentration) {
            // Set the concentration
            this.props.character.concentrating_on = obj;
          }
          if (self_condition_ids.length > 0) {
            // Apply the conditions
            const character = this.props.character;
            self_condition_ids.forEach(cond_id => {
              character.conditions.push(cond_id);
            });
            this.char_util.recalcAll(character);
          }
          if (the_ability instanceof Ability && the_ability.effect.type === "Create Resource") {
            this.props.character.create_resource(the_ability.effect, obj.source_id, the_ability.slot_level, level);
          } else if (the_ability instanceof SpellAsAbility && the_ability.spell && the_ability.spell.effect.type === "Create Resource") {
            this.props.character.create_resource(the_ability.spell.effect, obj.source_id, the_ability.slot_level, level);
          }
          this.updateCharacter();
        }
      }
    } else if (obj instanceof CharacterSpecialSpell) {
      const spell = obj;
      const ssf = spell.special_spell_feature;
      const level = this.props.level === -1 ? this.props.obj.level : this.props.level;
      let go = false;
      console.log(spell);
      console.log(ssf);
      if (ssf) {
        if (ssf.slot_override === "Only Special Resource") {
          if (spell.special_resource_used < spell.special_resource_max) {
            spell.special_resource_used += 1;
            go = true;
          }
        } else if (ssf.slot_override === "And Special Resource") {
          const slots = this.props.character.slots.filter(o => o.level === level && o.slot_name === slot_type);
          if (slots.length === 1 && spell.special_resource_used < spell.special_resource_max) {
            const slot = slots[0];
            if (slot.used < slot.total) {
              slot.used++;
              spell.special_resource_used += 1;
              go = true;
            }
          }
        } else if (ssf.slot_override === "Or Special Resource") { 
          if (level === spell.level && spell.special_resource_used < spell.special_resource_max) {
            spell.special_resource_used += 1;
            go = true;
          } else {
            const slots = this.props.character.slots.filter(o => o.level === level && o.slot_name === slot_type);
            if (slots.length === 1) {
              const slot = slots[0];
                
              if (slot.used < slot.total) {
                slot.used++;
                go = true;
              }
            }
          }
        } else if (ssf.slot_override === "Normal") { 
          const slots = this.props.character.slots.filter(o => o.level === level && o.slot_name === slot_type);
          if (slots.length === 1) {
            const slot = slots[0];
              
            if (slot.used < slot.total) {
              slot.used++;
              go = true;
            }
          }
        } else if (ssf.slot_override === "At Will") {
          // At Will for Special Spells only applies for casting at the base level
          // for upcasting they have to use a slot, so check accordingly
          if (level === spell.level) {
            go = true;
          } else {
            const slots = this.props.character.slots.filter(o => o.level === level && o.slot_name === slot_type);
            if (slots.length === 1) {
              const slot = slots[0];
                
              if (slot.used < slot.total) {
                slot.used++;
                go = true;
              }
            }
          }
        }
      }
      if (go) {
        if (spell.concentration) {
          this.props.character.concentrating_on = spell;
        }
        if (self_condition_ids.length > 0) {
          // Apply the conditions
          const character = this.props.character;
          self_condition_ids.forEach(cond_id => {
            character.conditions.push(cond_id);
          });
          if (character instanceof Character) {
            this.char_util.recalcAll(character);
          }
        }
        if (spell.spell && spell.spell.effect.type === "Create Resource") {
          this.props.character.create_resource(spell.spell.effect, obj.source_id, spell.level, level);
        }
        this.updateCharacter();
      }
    } else if (obj instanceof CharacterSpell) {
      const spell = obj;
      const level = this.props.level === -1 ? this.props.obj.level : this.props.level;
      const slots = this.props.character.slots.filter(o => o.level === level && o.slot_name === slot_type);
      if (slots.length === 1) {
        const slot = slots[0];
          
        slot.used++;
      }
      if (spell.concentration) {
        this.props.character.concentrating_on = spell;
      }
      if (self_condition_ids.length > 0) {
        // Apply the conditions
        const character = this.props.character;
        self_condition_ids.forEach(cond_id => {
          character.conditions.push(cond_id);
        });
        if (character instanceof Character) {
          this.char_util.recalcAll(character);
        }
      }
      if (spell.spell && spell.spell.effect.type === "Create Resource") {
        this.props.character.create_resource(spell.spell.effect, obj.source_id, spell.level, level);
      }
      this.updateCharacter();
    }
  }

  updateCharacter() {
    this.api.updateObject(this.props.character).then((res: any) => {
      this.props.onChange();
    });
  }
}

export default connector(CharacterCastButton);
