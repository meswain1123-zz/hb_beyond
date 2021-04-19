import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
  Grid, 
} from "@material-ui/core";

import { 
  AbilityScores,
  Race, 
  Subrace,
  Character,
  INumHash,
  IStringHash
} from "../../../models";

import SelectStringBox from "../../input/SelectStringBox"; 

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
  obj: Character;
  onChange: (changed: AbilityScores) => void;
}

export interface State {
  races: Race[] | null;
  subraces: Subrace[] | null;
  loading: boolean;
  mode: string;
  points: number;
  display_calcs: string;
}

const points_for_num_map: INumHash = {
  8: 0,
  9: 1,
  10: 2,
  11: 3,
  12: 4,
  13: 5,
  14: 7,
  15: 9
};

class CharacterAbilityScoresInput extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      races: null,
      subraces: null,
      loading: false,
      mode: "Point Buy",
      points: 0,
      display_calcs: ""
    };
    this.api = API.getInstance();
    this.data_util = DataUtilities.getInstance();
  }

  api: APIClass;
  data_util: DataUtilitiesClass;

  componentDidMount() {
  }

  descriptionStyle = () => {
    const descWidth = Math.floor(this.props.width * 0.7);
  
    const properties: React.CSSProperties = {
      width: `${descWidth}px`,
      whiteSpace: "nowrap", 
      overflow: "hidden", 
      textOverflow: "ellipsis"
    } as React.CSSProperties;

    return properties;
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getSetOfObjects(["race","subrace"]).then((res: any) => {
        // This is a convenient place to calculate the current points
        
        this.setState({ 
          races: res.race, 
          subraces: res.subrace,
          points: this.calcPoints(),
          loading: false 
        });
      });
    });
  }

  calcPoints() {
    let points = 27;
    points -= points_for_num_map[this.props.obj.base_ability_scores.strength];
    points -= points_for_num_map[this.props.obj.base_ability_scores.dexterity];
    points -= points_for_num_map[this.props.obj.base_ability_scores.constitution];
    points -= points_for_num_map[this.props.obj.base_ability_scores.intelligence];
    points -= points_for_num_map[this.props.obj.base_ability_scores.wisdom];
    points -= points_for_num_map[this.props.obj.base_ability_scores.charisma];
    return points;
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.races === null) {
      this.load();
      return <span>Loading</span>;
    } else {
      return (
        <Grid container spacing={1} direction="column">
          <Grid item className={"MuiTypography-root MuiListItemText-primary header"}>
            Ability Scores
          </Grid>
          <Grid item>
            <SelectStringBox 
              name="Choose a Generation Method"
              options={["Point Buy"]}
              value={this.state.mode} 
              onChange={(value: string) => {
                this.setState({ mode: value });
              }}
            />
          </Grid>
          { this.state.mode === "Point Buy" &&
            <Grid item container spacing={1} direction="column">
              <Grid item>
                Points Remaining: { this.state.points } / 27
              </Grid>
              <Grid item>
                { this.renderOption() }
              </Grid>
            </Grid>
          }
          <Grid item container spacing={1} direction="row">
            <Grid item xs={12}>
              Current Ability Scores
            </Grid>
            <Grid item xs={4} onClick={() => {
              this.setState({ display_calcs: (this.state.display_calcs === "Strength" ? "" : "Strength") })
            }}>
              Strength: { this.props.obj.current_ability_scores.strength } ({ this.displayModifier(this.props.obj.current_ability_scores.STR) })
            </Grid>
            <Grid item xs={4} onClick={() => {
              this.setState({ display_calcs: (this.state.display_calcs === "Dexterity" ? "" : "Dexterity") })
            }}>
              Dexterity: { this.props.obj.current_ability_scores.dexterity } ({ this.displayModifier(this.props.obj.current_ability_scores.DEX) })
            </Grid>
            <Grid item xs={4} onClick={() => {
              this.setState({ display_calcs: (this.state.display_calcs === "Constitution" ? "" : "Constitution") })
            }}>
              Constitution: { this.props.obj.current_ability_scores.constitution } ({ this.displayModifier(this.props.obj.current_ability_scores.CON) })
            </Grid>
            <Grid item xs={4} onClick={() => {
              this.setState({ display_calcs: (this.state.display_calcs === "Intelligence" ? "" : "Intelligence") })
            }}>
              Intelligence: { this.props.obj.current_ability_scores.intelligence } ({ this.displayModifier(this.props.obj.current_ability_scores.INT) })
            </Grid>
            <Grid item xs={4} onClick={() => {
              this.setState({ display_calcs: (this.state.display_calcs === "Wisdom" ? "" : "Wisdom") })
            }}>
              Wisdom: { this.props.obj.current_ability_scores.wisdom } ({ this.displayModifier(this.props.obj.current_ability_scores.WIS) })
            </Grid>
            <Grid item xs={4} onClick={() => {
              this.setState({ display_calcs: (this.state.display_calcs === "Charisma" ? "" : "Charisma") })
            }}>
              Charisma: { this.props.obj.current_ability_scores.charisma } ({ this.displayModifier(this.props.obj.current_ability_scores.CHA) })
            </Grid>
          </Grid>
          { this.state.display_calcs !== "" && 
            <Grid item container spacing={1} direction="row">
              <Grid item>
                { this.state.display_calcs } Calculations
              </Grid>
            </Grid>
          }
        </Grid>
      );
    }
  }

  displayModifier(modifier: number) {
    return this.data_util.add_plus_maybe(modifier);
  }

  renderOption() {
    if (this.state.mode === "Point Buy") {
      return (
        <Grid item xs={12} container spacing={1} direction="row">
          <Grid item xs={4}>
            { this.renderPointBuySelect("Strength") }
          </Grid>
          <Grid item xs={4}>
            { this.renderPointBuySelect("Dexterity") }
          </Grid>
          <Grid item xs={4}>
            { this.renderPointBuySelect("Constitution") }
          </Grid>
          <Grid item xs={4}>
            { this.renderPointBuySelect("Intelligence") }
          </Grid>
          <Grid item xs={4}>
            { this.renderPointBuySelect("Wisdom") }
          </Grid>
          <Grid item xs={4}>
            { this.renderPointBuySelect("Charisma") }
          </Grid>
        </Grid>
      );
    } else {
      return (<Grid item xs={12}>Not Implemented</Grid>)
    }
  }

  renderPointBuySelect(ability: string) {
    let AS_point_map: IStringHash = {};
    let options: string[] = [];

    let ability_score: number = 0;
    switch(ability) {
      case "Strength":
        ability_score = this.props.obj.base_ability_scores.strength;
      break;
      case "Dexterity":
        ability_score = this.props.obj.base_ability_scores.dexterity;
      break;
      case "Constitution":
        ability_score = this.props.obj.base_ability_scores.constitution;
      break;
      case "Intelligence":
        ability_score = this.props.obj.base_ability_scores.intelligence;
      break;
      case "Wisdom":
        ability_score = this.props.obj.base_ability_scores.wisdom;
      break;
      case "Charisma":
        ability_score = this.props.obj.base_ability_scores.charisma;
      break;
    }
    for (let i = 8; i < 16; i++) {
      if (i < ability_score) {
        options.push(`${i}`);
        AS_point_map[`${i}`] = `${i} (+${points_for_num_map[ability_score] - points_for_num_map[i]} Points)`;
      } else if (i > ability_score) {
        const diff = points_for_num_map[i] - points_for_num_map[ability_score];
        if (diff <= this.state.points) {
          options.push(`${i}`);
          AS_point_map[`${i}`] = `${i} (-${diff} Points)`;
        }
      } else {
        options.push(`${i}`);
        AS_point_map[`${i}`] = `${i}`;
      }
    }

    return (
      <SelectStringBox
        name={ability}
        options={options}
        display_map={AS_point_map}
        value={`${ability_score}`}
        onChange={(value: number) => {
          const ability_scores = this.props.obj.base_ability_scores;
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
          this.setState({ 
            points: this.calcPoints()
          });
        }}
      />
    );
  }
}

export default connector(CharacterAbilityScoresInput);
