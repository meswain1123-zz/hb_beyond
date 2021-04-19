import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
  Grid, 
} from "@material-ui/core";

import { 
  AbilityScores,
  Creature,
  SummonStatBlock,
} from "../../../models";

import StringBox from "../../input/StringBox";

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
  obj: Creature | SummonStatBlock;
  onChange: (changed: AbilityScores) => void;
}

export interface State {
}

class CharacterAbilityScoresInput extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
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
      <Grid container spacing={1} direction="column">
        <Grid item className={"MuiTypography-root MuiListItemText-primary header"}>
          Ability Scores
        </Grid>
        <Grid item container spacing={1} direction="row">
          <Grid item xs={4}>
            { this.renderStringBox("Strength") }
          </Grid>
          <Grid item xs={4}>
            { this.renderStringBox("Dexterity") }
          </Grid>
          <Grid item xs={4}>
            { this.renderStringBox("Constitution") }
          </Grid>
          <Grid item xs={4}>
            { this.renderStringBox("Intelligence") }
          </Grid>
          <Grid item xs={4}>
            { this.renderStringBox("Wisdom") }
          </Grid>
          <Grid item xs={4}>
            { this.renderStringBox("Charisma") }
          </Grid>
        </Grid>
      </Grid>
    );
  }

  renderStringBox(ability: string) {
    let ability_score: number = 0;
    switch(ability) {
      case "Strength":
        ability_score = this.props.obj.ability_scores.strength;
      break;
      case "Dexterity":
        ability_score = this.props.obj.ability_scores.dexterity;
      break;
      case "Constitution":
        ability_score = this.props.obj.ability_scores.constitution;
      break;
      case "Intelligence":
        ability_score = this.props.obj.ability_scores.intelligence;
      break;
      case "Wisdom":
        ability_score = this.props.obj.ability_scores.wisdom;
      break;
      case "Charisma":
        ability_score = this.props.obj.ability_scores.charisma;
      break;
    }

    return (
      <StringBox
        name={ability}
        value={`${ability_score}`}
        type="number"
        onBlur={(value: string) => {
          const ability_scores = this.props.obj.ability_scores;
          switch(ability) {
            case "Strength":
              ability_scores.strength = +value;
            break;
            case "Dexterity":
              ability_scores.dexterity = +value;
            break;
            case "Constitution":
              ability_scores.constitution = +value;
            break;
            case "Intelligence":
              ability_scores.intelligence = +value;
            break;
            case "Wisdom":
              ability_scores.wisdom = +value;
            break;
            case "Charisma":
              ability_scores.charisma = +value;
            break;
          }
          this.props.onChange(ability_scores);
          this.setState({ });
        }}
      />
    );
  }
}

export default connector(CharacterAbilityScoresInput);
