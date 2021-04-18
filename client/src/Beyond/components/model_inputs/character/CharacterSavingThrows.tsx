import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  RadioButtonUnchecked,
  RadioButtonChecked,
} from "@material-ui/icons";
import {
  Grid, 
  Drawer,
  Popover,
} from "@material-ui/core";

import { 
  Character,
  RollPlus
} from "../../../models";

import ButtonBox from "../../input/ButtonBox";
import Roller from "../Roller";

import API from "../../../utilities/smart_api";
import { APIClass } from "../../../utilities/smart_api_class";


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
  onChange: () => void;
}

export interface State {
  drawer: string;
  popoverAnchorEl: HTMLDivElement | null;
  popoverSave: string;
}

class CharacterSavingThrows extends Component<Props, State> {
  // public static defaultProps = {
  //   value: null,
  // };
  constructor(props: Props) {
    super(props);
    this.state = {
      drawer: "",
      popoverAnchorEl: null,
      popoverSave: ""
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  render() {
    return (
      <Grid item key="SavingThrows" container spacing={1} direction="column" 
        style={{
          border: "1px solid blue",
          borderRadius: "5px"
        }}>
        <Grid item 
          style={{
            display: "flex",
            justifyContent: "center"
          }}>
          <div>
            Saving Throws
          </div>
        </Grid>
        <Grid item 
          style={{
            display: "flex",
            justifyContent: "center",
            fontSize: "11px"
          }}>
          <div style={{ width: "245px" }}>
            <Grid container spacing={1} direction="row">
              <Grid item xs={6} container spacing={0} direction="column">
                { this.renderSavingThrow("STR") }
                { this.renderSavingThrow("DEX") }
                { this.renderSavingThrow("CON") }
              </Grid>
              <Grid item xs={6} container spacing={0} direction="column">
                { this.renderSavingThrow("INT") }
                { this.renderSavingThrow("WIS") }
                { this.renderSavingThrow("CHA") }
              </Grid>
            </Grid>
          </div>
        </Grid>
        <Grid item
          style={{
            display: "flex",
            justifyContent: "center",
            fontSize: "11px"
          }}>
          <div>
            { this.renderSavingThrowAdvantages() }
          </div>
        </Grid>
        { this.renderExtras() }
      </Grid>
    );
  }

  renderSavingThrowAdvantages() {
    const advantages = this.props.obj.advantages.filter(o => o.type === "Saving Throw");
    if (advantages.length > 0) {
      return (
        <Grid container spacing={0} direction="column">
          { advantages.map((adv, key) => {
            return (
              <Grid item key={key}>
                Adv on { adv.type_detail }&nbsp;Saving Throws&nbsp;{ adv.formula }
              </Grid>
            );
          })}
        </Grid>
      );
    }
    return "You have no saving throw modifiers (or do you?)";
  }

  renderSavingThrow(ability: string) {
    let modifier = this.props.obj.current_ability_scores.getModifier(ability);
    const proficient = this.props.obj.saving_throw_proficiencies.includes(ability);
    if (proficient && modifier) {
      modifier += this.props.obj.proficiency_modifier;
    }
    if (modifier !== null) {
      return (
        <Grid item>
          <div style={{
              border: "1px solid blue",
              borderRadius: "5px", 
              padding: "4px"
            }}>
            <Grid container spacing={0} direction="row" style={{ margin: "4px" }}>
              <Grid item xs={3}>
                <div style={{ 
                  float: "left", 
                  lineHeight: "0.5" 
                }}>
                  { proficient ? <RadioButtonChecked /> : <RadioButtonUnchecked />}
                </div>
              </Grid>
              <Grid item xs={2}>
                <div style={{ 
                  float: "left", 
                  lineHeight: "2.3" 
                }}>
                  {/* { ability === "DEX" ? "x2" : "" } */}
                </div>
              </Grid>
              <Grid item xs={4} >
                <div style={{ float: "left", lineHeight: "2.2" }}>
                  { ability }
                </div>
              </Grid>
              <Grid item xs={3}>
                <ButtonBox 
                  name={`${modifier}`}
                  onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                    this.setState({ popoverSave: ability })
                    this.setPopoverAnchorEl(event.currentTarget);
                  }} 
                />
              </Grid>
            </Grid>
          </div> 
        </Grid>
      );
    }
    return null;
  }

  renderExtras() {
    return [
      <Drawer key="drawer" anchor="right" 
        open={ this.state.drawer === "details" } 
        onClose={() => {
          this.setState({ drawer: "" });
        }}>
        Saving Throw Details
      </Drawer>,
      <Popover key="rolls"
        // id={id}
        open={ this.state.popoverAnchorEl !== null && this.state.popoverSave !== "" }
        anchorEl={this.state.popoverAnchorEl}
        onClose={() => {
          this.setState({ popoverAnchorEl: null, popoverSave: "" });
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

  renderRoll() {
    const rolls: RollPlus[] = [];
    const roll_plus = new RollPlus();
    roll_plus.ability_score = this.state.popoverSave;
    if (this.props.obj.saving_throw_proficiencies.includes(this.state.popoverSave)) {
      roll_plus.flat = this.props.obj.proficiency_modifier;
    }
    rolls.push(roll_plus);
    this.props.obj.saving_throw_bonuses.forEach(bonus => {
      if (bonus.types.includes(this.state.popoverSave)) {
        rolls.push(bonus.rolls);
      }
    });
    return (
      <Roller 
        name={this.state.popoverSave}
        char={this.props.obj}
        rolls={rolls} 
        type="Saving Throw" 
      />
    );
  }

  setPopoverAnchorEl(el: HTMLDivElement | null) {
    this.setState({ popoverAnchorEl: el });
  }
}

export default connector(CharacterSavingThrows);
