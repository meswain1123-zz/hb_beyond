import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  Grid, 
  Popover,
} from "@material-ui/core";

import { 
  CreatureInstance,
  RollPlus
} from "../../../models";

import ButtonBox from "../../input/ButtonBox";

import Roller from "../Roller";

import API from "../../../utilities/smart_api";
import { APIClass } from "../../../utilities/smart_api_class";
import DataUtilities from "../../../utilities/data_utilities";
import { DataUtilitiesClass } from "../../../utilities/data_utilities_class";



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
  obj: CreatureInstance;
  onChange: () => void;
}

export interface State {
  popoverAnchorEl: HTMLDivElement | null;
  popoverAbility: string;
}

class CreatureInstanceAbilityScores extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      popoverAnchorEl: null,
      popoverAbility: ""
    };
    this.api = API.getInstance();
    this.data_util = DataUtilities.getInstance();
  }

  api: APIClass;
  data_util: DataUtilitiesClass;

  componentDidMount() {
  }

  render() {
    return (
      <Grid item key="AbilityChecks" container spacing={1} direction="row" 
        style={{
          border: "1px solid blue",
          borderRadius: "5px"
        }}>
        { this.renderAbility("Strength") }
        { this.renderAbility("Dexterity") }
        { this.renderAbility("Constitution") }
        { this.renderAbility("Intelligence") }
        { this.renderAbility("Wisdom") }
        { this.renderAbility("Charisma") }
        { this.renderExtras() }
      </Grid>
    );
  }

  renderAbility(ability: string) {
    const modifier = this.props.obj.current_ability_scores.getModifier(ability);
    const score = this.props.obj.current_ability_scores.getAbilityScore(ability);
    if (modifier !== null && score !== null) {
      return (
        <Grid item xs={4} style={{
          display: "flex",
          justifyContent: "center"
        }}>
          <div style={{
              width: "95px"
            }}>
            <Grid container spacing={0} direction="column"
              style={{
                border: "1px solid blue",
                borderRadius: "5px"
              }}>
              <Grid item>
                <div style={{
                  fontSize: "11px",
                  fontWeight: "bold",
                  textAlign: "center",
                  cursor: "pointer"
                }} onClick={() => {
                }}>
                  { ability }
                </div>
              </Grid>
              <Grid item>
                <ButtonBox 
                  fontSize={24}
                  fontWeight={"bold"}
                  lineHeight={1.1}
                  name={ this.data_util.add_plus_maybe(modifier) }
                  onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                    this.setState({ popoverAbility: ability })
                    this.setPopoverAnchorEl(event.currentTarget);
                  }} 
                />
              </Grid>
              <Grid item style={{
                  display: "flex",
                  justifyContent: "center"
                }}>
                <div style={{
                  width: "35px",
                  border: "1px solid blue",
                  borderRadius: "5px",
                  fontSize: "11px",
                  fontWeight: "bold",
                  textAlign: "center",
                  cursor: "pointer"
                }} onClick={() => {
                }}>
                  { score }
                </div>
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
      <Popover key="rolls"
        open={ this.state.popoverAnchorEl !== null && this.state.popoverAbility !== "" }
        anchorEl={this.state.popoverAnchorEl}
        onClose={() => {
          this.setState({ popoverAnchorEl: null, popoverAbility: "" });
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
    roll_plus.ability_score = this.state.popoverAbility;
    rolls.push(roll_plus);
    return (
      <Roller 
        name={this.state.popoverAbility}
        char={this.props.obj}
        rolls={rolls} 
        type="Ability Check" 
      />
    );
  }

  setPopoverAnchorEl(el: HTMLDivElement | null) {
    this.setState({ popoverAnchorEl: el });
  }
}

export default connector(CreatureInstanceAbilityScores);
