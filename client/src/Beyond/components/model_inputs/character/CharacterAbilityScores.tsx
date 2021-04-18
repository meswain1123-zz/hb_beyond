import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
// import {
//   Clear, 
// } from "@material-ui/icons";
import {
  Grid, 
  Drawer,
  Popover,
  // Snackbar 
} from "@material-ui/core";

import { 
  // Attack,
  Character,
  // Creature,
  RollPlus
} from "../../../models";

import StringBox from "../../input/StringBox";
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
  obj: Character;
  onChange: () => void;
}

export interface State {
  drawer: string;
  popoverAnchorEl: HTMLDivElement | null;
  popoverAbility: string;
}

class CharacterAbilityScores extends Component<Props, State> {
  // public static defaultProps = {
  //   value: null,
  // };
  constructor(props: Props) {
    super(props);
    this.state = {
      drawer: "",
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
                  this.setState({ drawer: ability });
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
                  this.setState({ drawer: ability });
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
      <Drawer key="drawer" anchor="right" 
        open={ this.state.drawer !== "" } 
        onClose={() => {
          this.setState({ drawer: "" });
        }}>
        { this.renderDetails() }
      </Drawer>,
      <Popover key="rolls"
        // id={id}
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
    // if (this.props.obj.saving_throw_proficiencies.includes(this.state.popoverSave)) {
    //   roll_plus.flat = this.props.obj.proficiency_modifier;
    // }
    rolls.push(roll_plus);
    if (this.props.obj instanceof Character) {
      this.props.obj.check_bonuses.forEach(bonus => {
        if (bonus.types.includes(this.state.popoverAbility)) {
          rolls.push(bonus.rolls);
        }
      });
    }
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

  renderDetails() {
    if (this.state.drawer === "") {
      return null;
    } else {
      const current_score = this.props.obj.current_ability_scores.getAbilityScore(this.state.drawer);
      const current_modifier = this.props.obj.current_ability_scores.getModifier(this.state.drawer);
      const base_score = this.props.obj.base_ability_scores.getAbilityScore(this.state.drawer);
      let racial_bonus = 0;
      let asi = 0;
      const extra_bonus = this.props.obj.bonus_ability_score_modifiers.getAbilityScore(this.state.drawer);
      const override = this.props.obj.override_ability_scores.getAbilityScore(this.state.drawer);
      if (current_score && base_score && 
        current_score !== base_score) {
        const abbrev = this.data_util.ability_score_abbreviation(this.state.drawer);
        const relevant_feature_bases = this.props.obj.ability_score_features.filter(o => 
          o.asi_features.filter(o2 => o2.selected_option === abbrev).length > 0);
        relevant_feature_bases.forEach(fb => {
          if (["Race","Subrace"].includes(fb.source_type)) {
            fb.asi_features.filter(o => o.selected_option === abbrev).forEach(a => {
              racial_bonus += a.amount;
            });
          } else {
            fb.asi_features.filter(o => o.selected_option === abbrev).forEach(a => {
              asi += a.amount;
            });
          }
        });
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
              // border: "1px solid blue",
              minHeight: "800px",
              width: "316px",
              overflowX: "hidden"
            }}>
            <Grid item style={{ width: "316px" }}>
              <span style={{ fontSize: "15px", fontWeight: "bold" }}>
                { this.state.drawer }&nbsp;
                { current_score }
              </span>&nbsp;
              <span style={{ fontSize: "12px" }}>
                ({ current_modifier })
              </span>
            </Grid>
            <Grid item container spacing={0} direction="row" 
              style={{ 
                border: "1px solid lightgray"
              }}>
              <Grid item xs={9}>Total Score</Grid>
              <Grid item xs={3} 
                style={{ 
                  borderLeft: "2px solid gray", 
                  background: "lightgray",
                  display: "flex",
                  justifyContent: "center"
                }}>
                { current_score }
              </Grid>
              <Grid item xs={9}>Modifier</Grid>
              <Grid item xs={3} 
                style={{ 
                  borderLeft: "2px solid gray", 
                  background: "lightgray",
                  display: "flex",
                  justifyContent: "center"
                }}>
                { current_modifier }
              </Grid>
              <Grid item xs={9}>Base Score</Grid>
              <Grid item xs={3} 
                style={{ 
                  borderLeft: "2px solid gray", 
                  background: "lightgray",
                  display: "flex",
                  justifyContent: "center"
                }}>
                { base_score }
              </Grid>
              <Grid item xs={9}>Racial Bonus</Grid>
              <Grid item xs={3} 
                style={{ 
                  borderLeft: "2px solid gray", 
                  background: "lightgray",
                  display: "flex",
                  justifyContent: "center"
                }}>
                { racial_bonus }
              </Grid>
              <Grid item xs={9}>Ability Improvements</Grid>
              <Grid item xs={3} 
                style={{ 
                  borderLeft: "2px solid gray", 
                  background: "lightgray",
                  display: "flex",
                  justifyContent: "center"
                }}>
                { asi }
              </Grid>
              <Grid item xs={9}>Other Modifier</Grid>
              <Grid item xs={3} 
                style={{ 
                  borderLeft: "2px solid gray", 
                  background: "lightgray"
                }}>
                <StringBox 
                  name=""
                  value={ extra_bonus === 0 ? "" : `${extra_bonus}` }
                  type="number"
                  onBlur={(changed: string) => {
                    const obj = this.props.obj;
                    if (changed === "") {
                      changed = "0";
                    }
                    obj.bonus_ability_score_modifiers.setAbilityScore(this.state.drawer, +changed);
                    this.api.updateObject(obj).then((res: any) => {
                      this.props.onChange();
                      this.setState({ });
                    });
                  }}
                />
              </Grid>
              <Grid item xs={9}>Override Score</Grid>
              <Grid item xs={3} 
                style={{ 
                  borderLeft: "2px solid gray", 
                  background: "lightgray"
                }}>
                <StringBox 
                  name=""
                  value={ override === -1 ? "" : `${override}` }
                  type="number"
                  onBlur={(changed: string) => {
                    const obj = this.props.obj;
                    if (changed === "") {
                      changed = "-1";
                    }
                    obj.override_ability_scores.setAbilityScore(this.state.drawer, +changed);
                    this.api.updateObject(obj).then((res: any) => {
                      this.props.onChange();
                      this.setState({ });
                    });
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </div>
      );
    }
  }
}

export default connector(CharacterAbilityScores);
