import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  Grid, 
} from "@material-ui/core";

import { 
  Character,
  CharacterAbility
} from "../../../models";

import ButtonBox from "../../input/ButtonBox";

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
  ability: CharacterAbility;
  onChange: () => void;
  onClose: () => void;
}

export interface State {
  search_string: string;
  view: string;
  level: number;
  popoverAnchorEl: HTMLDivElement | null;
  popoverAction: CharacterAbility | null;
  popoverActionLevel: number;
  popoverMode: string;
  reloading: boolean; 
}

class CharacterAbilityDetails extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      reloading: false,
      search_string: "",
      view: "",
      level: -1,
      popoverAnchorEl: null,
      popoverAction: null,
      popoverActionLevel: -1,
      popoverMode: ""
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
    const level = this.state.level === -1 ? this.props.ability.level : this.state.level;
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
    if (the_ability) {
      if (the_ability.resource_consumed !== "Slot") {
        // Make this work more like with a spell
        return_me.push(
          <Grid item key="Cast" container spacing={0} direction="row">
            <Grid item xs={6}>
              <CharacterCastButton
                obj={this.props.ability}
                character={this.props.obj}
                level={level}
                onChange={() => {
                  this.props.onChange();
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <CharacterResourceBoxes 
                resource={this.props.ability}
                character={this.props.obj}
                onChange={() => {
                  this.props.onChange();
                }}
              />
              {/* { this.renderResourceCheckboxes() } */}
            </Grid>
          </Grid>
        );
      } else {
        // Make this work more like with a spell
        return_me.push(
          <Grid item key="Cast" container spacing={0} direction="row">
            <Grid item xs={6}>
              <CharacterCastButton
                obj={this.props.ability}
                character={this.props.obj}
                level={level}
                onChange={() => {
                  this.props.onChange();
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

  renderLevelOptions() {
    const the_ability = this.props.ability.the_ability;
    const level = this.state.level === -1 ? this.props.ability.level : this.state.level;
    if (the_ability && level > 0) { // and not at will and not ritual only
      const slot_levels = Array.from(new Set(this.props.obj.slots.filter(o => o.level >= this.props.ability.level).map(o => o.level)));
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
                      this.props.onChange();
                    }}
                  />
                  {/* { this.renderSlotsForLevel() } */}
                </Grid>
              );
            })}
          </Grid>
        );
      }
    }
    return null;
  }

  // renderSlotsForLevel() {
  //   const level = this.state.level === -1 ? this.props.ability.level : this.state.level;
  //   const slots = this.props.obj.slots.filter(o => o.level === level);
  //   const return_me: any[] = [];
  //   slots.forEach(slot => {
  //     let used = 0;
  //     for (let i = 0; i < slot.total; ++i) {
  //       let isUsed = false;
  //       if (used < slot.used) {
  //         isUsed = true;
  //         used++;
  //       }
  //       return_me.push(
  //         <CheckBox key={i}
  //           name=""
  //           value={isUsed}
  //           onChange={(changed: boolean) => {
  //             if (changed) {
  //               slot.used++;
  //             } else {
  //               slot.used--;
  //             }
  //             this.setState({ }, () => {
  //               this.api.updateObject(this.props.obj).then((res: any) => {
  //                 if ((changed && slot.used === slot.total) || (!changed && slot.used === slot.total - 1)) {
  //                   // Reload to make the cast buttons enabled/disabled appropriately
  //                   this.setState({ reloading: true }, () => {
  //                     this.setState({ reloading: false });
  //                   });
  //                 }
  //               });
  //             });
  //           }}
  //         />
  //       );
  //     }
  //     return_me.push(<span key="slot_name">{ slot.slot_name }</span>);
  //   });
  //   return return_me;
  // }

  renderAttacks() {
    const ability = this.props.ability;
    const level = this.state.level === -1 ? this.props.ability.level : this.state.level;
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

  // renderResourceCheckboxes() {
  //   const return_me: any[] = [];
  //   const the_ability = this.props.ability.the_ability;
  //   if (the_ability instanceof Ability && the_ability.resource_consumed) {
  //     const obj = this.props.obj;
  //     if (the_ability.resource_consumed === "Special") {
  //       for (let i = 0; i < +this.props.ability.special_resource_amount; ++i) {
  //         return_me.push(
  //           <CheckBox key={i} name="" 
  //             value={this.props.ability.special_resource_used > i} 
  //             onChange={() => {
  //               if (this.props.ability.special_resource_used > i) {
  //                 this.props.ability.special_resource_used--;
  //               } else {
  //                 this.props.ability.special_resource_used++;
  //               }
  //               this.props.onChange();
  //               this.setState({ });
  //             }}
  //           />
  //         );
  //       }
  //     } else {
  //       const resource_finder = obj.resources.filter(o => 
  //         o.type_id === the_ability.resource_consumed);
  //       if (resource_finder.length === 1) {
  //         const resource = resource_finder[0];
  //         for (let i = 0; i < resource.total; ++i) {
  //           return_me.push(
  //             <CheckBox key={i} name="" 
  //               value={resource.used > i} 
  //               onChange={() => {
  //                 if (resource.used > i) {
  //                   resource.used--;
  //                 } else {
  //                   resource.used++;
  //                 }
  //                 this.props.onChange();
  //                 this.setState({ });
  //               }}
  //             />
  //           );
  //         }
  //       }
  //     }
  //   }
  //   return return_me;
  // }
}

export default connector(CharacterAbilityDetails);
