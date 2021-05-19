import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  Add, Remove
} from "@material-ui/icons";

import { 
  Ability,
  Character,
  CharacterAbility,
  CharacterResource,
  CharacterSlot,
  CharacterSpecialSpell
} from "../../../models";

import CheckBox from "../../input/CheckBox";

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
  resource: CharacterAbility | CharacterSpecialSpell | CharacterSlot | CharacterResource;
  show_type: boolean;
  onChange: () => void;
}

export interface State {
}

class CharacterResourceBoxes extends Component<Props, State> {
  public static defaultProps = {
    show_type: true
  };
  constructor(props: Props) {
    super(props);
    this.state = {
    };
    this.api = API.getInstance();
    this.char_util = CharacterUtilities.getInstance();
  }

  api: APIClass;
  char_util: CharacterUtilitiesClass;

  componentDidMount() {
  }

  updateCharacter() {
    this.api.updateObject("character", this.props.character).then((res: any) => {
      this.props.onChange();
      this.setState({ });
    });
  }

  render() {
    const return_me: any[] = [];
    if (this.props.resource instanceof CharacterSlot) {
      const slot = this.props.resource;
      let used = 0;
      if (slot.total > 6) {
        return_me.push(
          <Add key="add"
            // disabled={slot.used === 0}
            style={{
              cursor: "pointer"
            }}
            onClick={() => {
              if (slot.used > 0) {
                slot.used--;
                this.updateCharacter();
              }
            }}
          />
        );
        if (slot.created > 0) {
          return_me.push(
            <span key="created"
              style={{
                fontWeight: "bold",
                fontSize: "15px",
                cursor: "pointer"
              }}
              onClick={() => {
                
              }}>
              { slot.total - slot.used }/({ slot.true_total }+{ slot.created })
            </span>
          );
        } else {
          return_me.push(
            <span key="created"
              style={{
                fontWeight: "bold",
                fontSize: "15px",
                cursor: "pointer"
              }}
              onClick={() => {
                
              }}>
              { slot.total - slot.used }/{ slot.true_total }
            </span>
          );
        }
        return_me.push(
          <Remove key="remove"
            // disabled={slot.used === slot.total}
            style={{
              cursor: "pointer"
            }}
            onClick={() => {
              if (slot.used < slot.total) {
                slot.used++;
                this.updateCharacter();
              }
            }}
          />
        );
      } else {
        for (let i = 0; i < slot.total; ++i) {
          let isUsed = false;
          if (used < slot.used) {
            isUsed = true;
            used++;
          }
          return_me.push(
            <CheckBox key={i}
              name=""
              value={isUsed}
              onChange={(changed: boolean) => {
                if (changed) {
                  slot.used++;
                } else {
                  slot.used--;
                }
                this.updateCharacter();
              }}
            />
          );
        }
      }
      if (this.props.show_type) {
        return_me.push(<div key="slot_name" style={{ display: "inline", fontSize: "15px", verticalAlign: "top" }}>{ slot.slot_name }&nbsp;</div>);
      }
    } else if (this.props.resource instanceof CharacterAbility) {
      const ability = this.props.resource;
      const the_ability = ability.the_ability;
      if (the_ability instanceof Ability && the_ability.resource_consumed) {
        const character = this.props.character;
        if (the_ability.resource_consumed === "Special") {
          if (+ability.special_resource_amount > 6) {
            return_me.push(
              <Add key="add"
                // disabled={ability.special_resource_used === 0}
                style={{
                  cursor: "pointer"
                }}
                onClick={() => {
                  if (ability.special_resource_used > 0) {
                    ability.special_resource_used--;
                    this.updateCharacter();
                  }
                }}
              />
            );
            return_me.push(
              <span key="special"
                style={{
                  fontWeight: "bold",
                  fontSize: "15px",
                  cursor: "pointer"
                }}
                onClick={() => {
                  
                }}>
                { ability.special_resource_used }/{ +ability.special_resource_amount }
              </span>
            );
            return_me.push(
              <Remove key="remove"
                // disabled={ability.special_resource_used === ability.special_resource_amount}
                style={{
                  cursor: "pointer"
                }}
                onClick={() => {
                  if (ability.special_resource_used < ability.special_resource_amount) {
                    ability.special_resource_used++;
                    this.updateCharacter();
                  }
                }}
              />
            );
          } else {
            for (let i = 0; i < +ability.special_resource_amount; ++i) {
              return_me.push(
                <CheckBox key={i} name="" 
                  value={ability.special_resource_used > i} 
                  onChange={() => {
                    if (ability.special_resource_used > i) {
                      ability.special_resource_used--;
                    } else {
                      ability.special_resource_used++;
                    }
                    this.updateCharacter();
                  }}
                />
              );
            }
          }
        } else if (the_ability.resource_consumed === "Slot") {
          const level = ability.level;
          const slots = this.props.character.slots.filter(o => o.level === level);
          const return_me: any[] = [];
          slots.forEach(slot => {
            let used = 0;
            if (slot.total > 6) {
              return_me.push(
                <Add key={`add_${slot.slot_name}`}
                  // disabled={slot.used === 0}
                  style={{
                    cursor: "pointer"
                  }}
                  onClick={() => {
                    if (slot.used > 0) {
                      slot.used--;
                      this.updateCharacter();
                    }
                  }}
                />
              );
              if (slot.created > 0) {
                return_me.push(
                  <span key="created"
                    style={{
                      fontWeight: "bold",
                      fontSize: "15px",
                      cursor: "pointer"
                    }}
                    onClick={() => {
                      
                    }}>
                    { slot.total - slot.used }/({ slot.true_total }+{ slot.created })
                  </span>
                );
              } else {
                return_me.push(
                  <span key="created"
                    style={{
                      fontWeight: "bold",
                      fontSize: "15px",
                      cursor: "pointer"
                    }}
                    onClick={() => {
                      
                    }}>
                    { slot.total - slot.used }/{ slot.true_total }
                  </span>
                );
              }
              return_me.push(
                <Remove key={`remove_${slot.slot_name}`}
                  // disabled={slot.used === slot.total}
                  style={{
                    cursor: "pointer"
                  }}
                  onClick={() => {
                    if (slot.used < slot.total) {
                      slot.used++;
                      this.updateCharacter();
                    }
                  }}
                />
              );
            } else {
              for (let i = 0; i < slot.total; ++i) {
                let isUsed = false;
                if (used < slot.used) {
                  isUsed = true;
                  used++;
                }
                return_me.push(
                  <CheckBox key={i}
                    name=""
                    value={isUsed}
                    onChange={(changed: boolean) => {
                      if (changed) {
                        slot.used++;
                      } else {
                        slot.used--;
                      }
                      this.setState({ }, () => {
                        this.api.updateObject("character", this.props.character).then((res: any) => {
                          if ((changed && slot.used === slot.total) || (!changed && slot.used === slot.total - 1)) {
                            // Reload to make the cast buttons enabled/disabled appropriately
                            this.setState({ reloading: true }, () => {
                              this.setState({ reloading: false });
                            });
                          }
                        });
                      });
                    }}
                  />
                );
              }
            }
            if (this.props.show_type) {
              return_me.push(<span key={`slot_name_${slot.slot_name}`}>{ slot.slot_name }</span>);
            }
          });
        } else if (the_ability.resource_consumed !== "None") {
          const resource_finder = character.resources.filter(o => 
            o.type_id === the_ability.resource_consumed);
          if (resource_finder.length === 1) {
            const resource = resource_finder[0];
            if (resource.total > 6) {
              return_me.push(
                <Add key="add"
                  // disabled={resource.used === 0}
                  style={{
                    cursor: "pointer"
                  }}
                  onClick={() => {
                    if (resource.used > 0) {
                      resource.used--;
                      this.updateCharacter();
                    }
                  }}
                />
              );
              if (resource.created > 0) {
                return_me.push(
                  <span key="created"
                    style={{
                      fontWeight: "bold",
                      fontSize: "15px",
                      cursor: "pointer"
                    }}
                    onClick={() => {
                      
                    }}>
                    { resource.total - resource.used }/({ resource.true_total }+{ resource.created })
                  </span>
                );
              } else {
                return_me.push(
                  <span key="created"
                    style={{
                      fontWeight: "bold",
                      fontSize: "15px",
                      cursor: "pointer"
                    }}
                    onClick={() => {
                      
                    }}>
                    { resource.total - resource.used }/{ resource.true_total }
                  </span>
                );
              }
              return_me.push(
                <Remove key="remove"
                  // disabled={resource.used === resource.total}
                  style={{
                    cursor: "pointer"
                  }}
                  onClick={() => {
                    if (resource.used < resource.total) {
                      resource.used++;
                      this.updateCharacter();
                    }
                  }}
                />
              );
            } else {
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
                      this.updateCharacter();
                    }}
                  />
                );
              }
            }
            return_me.push(<span key="resource_name">{ resource.name }</span>);
          }
        }
      }
    } else if (this.props.resource instanceof CharacterSpecialSpell) {
      const spell = this.props.resource;
      if (spell.special_spell_feature && spell.special_spell_feature.slot_override.includes("Special")) {
        if (+spell.special_resource_max > 6) {
          return_me.push(
            <Add key="add"
              // disabled={ability.special_resource_used === 0}
              style={{
                cursor: "pointer"
              }}
              onClick={() => {
                if (spell.special_resource_used > 0) {
                  spell.special_resource_used--;
                  this.updateCharacter();
                }
              }}
            />
          );
          return_me.push(
            <span key="special"
              style={{
                fontWeight: "bold",
                fontSize: "15px",
                cursor: "pointer"
              }}
              onClick={() => {
                
              }}>
              { spell.special_resource_used }/{ +spell.special_resource_max }
            </span>
          );
          return_me.push(
            <Remove key="remove"
              // disabled={ability.special_resource_used === ability.special_resource_amount}
              style={{
                cursor: "pointer"
              }}
              onClick={() => {
                if (spell.special_resource_used < spell.special_resource_max) {
                  spell.special_resource_used++;
                  this.updateCharacter();
                }
              }}
            />
          );
        } else {
          for (let i = 0; i < +spell.special_resource_max; ++i) {
            return_me.push(
              <CheckBox key={i} name="" 
                value={spell.special_resource_used > i} 
                onChange={() => {
                  if (spell.special_resource_used > i) {
                    spell.special_resource_used--;
                  } else {
                    spell.special_resource_used++;
                  }
                  this.updateCharacter();
                }}
              />
            );
          }
        }
      }
    } else if (this.props.resource instanceof CharacterResource) {
      const resource = this.props.resource;
      if (resource.total > 6) {
        return_me.push(
          <Add key="add"
            // disabled={resource.used === 0}
            style={{
              cursor: "pointer"
            }}
            onClick={() => {
              if (resource.used > 0) {
                resource.used--;
                this.updateCharacter();
              }
            }}
          />
        );
        if (resource.created > 0) {
          return_me.push(
            <span key="created"
              style={{
                fontWeight: "bold",
                fontSize: "15px",
                cursor: "pointer"
              }}
              onClick={() => {
                
              }}>
              { resource.total - resource.used }/({ resource.true_total }+{ resource.created })
            </span>
          );
        } else {
          return_me.push(
            <span key="created"
              style={{
                fontWeight: "bold",
                fontSize: "15px",
                cursor: "pointer"
              }}
              onClick={() => {
                
              }}>
              { resource.total - resource.used }/{ resource.true_total }
            </span>
          );
        }
        return_me.push(
          <Remove key="remove"
            // disabled={resource.used === resource.total}
            style={{
              cursor: "pointer"
            }}
            onClick={() => {
              if (resource.used < resource.total) {
                resource.used++;
                this.updateCharacter();
              }
            }}
          />
        );
      } else {
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
                this.updateCharacter();
              }}
            />
          );
        }
      }
    }
    return return_me;
  }
}

export default connector(CharacterResourceBoxes);
