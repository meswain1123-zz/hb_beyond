import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
// import {
//   // Clear, 
//   RadioButtonUnchecked,
//   RadioButtonChecked,
// } from "@material-ui/icons";
import {
  Grid, 
  // Drawer,
  // Popover,
  // Snackbar 
} from "@material-ui/core";

import { 
  Attack,
  Character,
  // Creature,
  // CharacterAbility,
  // CharacterItem,
  CharacterSpell,
  // CharacterSlot,
  Skill,
  // SpellAsAbility,
  // SpellSlotType,
  INumHash,
  // SpellAsAbility
} from "../../../models";

// import StringBox from "../../input/StringBox";
// import CheckBox from "../../input/CheckBox";
// import ToggleButtonBox from "../../input/ToggleButtonBox";
// import ButtonBox from "../../input/ButtonBox";

// import CharacterManageSpells from "./CharacterManageSpells";
import DisplayObjects from "../display/DisplayObjects";
// import CharacterSpellDetails from './CharacterSpellDetails';
// import CheckBox from '../../input/CheckBox';
// import CharacterAction from "./CharacterAction";

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
  loading: boolean;
  reloading: boolean;
  drawer: string;
  search_string: string;
  view: string;
  edit_view: string;
  selected_spell: CharacterSpell | null;
  selected_level: number | null;
  skills: Skill[] | null;
  levels: INumHash;
  concentration: boolean;
  ritual: boolean;
  popoverAnchorEl: HTMLDivElement | null;
  popoverAction: CharacterSpell | Attack | null;
  popoverActionLevel: number;
  popoverMode: string;
}

class CharacterSenses extends Component<Props, State> {
  // public static defaultProps = {
  //   value: null,
  // };
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
      reloading: false,
      drawer: "",
      search_string: "",
      view: "All",
      edit_view: "",
      selected_spell: null,
      selected_level: null,
      skills: null,
      levels: {},
      concentration: false,
      ritual: false,
      popoverAnchorEl: null,
      popoverAction: null,
      popoverActionLevel: -1,
      popoverMode: ""
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getSetOfObjects(["skill"]).then((res: any) => {
        this.setState({ 
          skills: res.skill,
          loading: false 
        });
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.skills === null) {
      this.load();
      return <span>Loading</span>;
    } else {
      let passive_perception = 10;
      let passive_investigation = 10;
      let passive_insight = 10;
      if (this.state.skills) {
        let skill_finder = this.state.skills.filter(o => o.name === "Perception");
        if (skill_finder.length === 1) {
          const skill = skill_finder[0];
          let proficiency_multiplier = 0;
          let modifier = this.props.obj.current_ability_scores.getModifier(skill.use_ability_score);
          const override = this.props.obj instanceof Character ? this.props.obj.skill_overrides[skill._id] : null;
          const prof_override = this.props.obj instanceof Character ? this.props.obj.proficiency_overrides[skill._id] : null;
          const jack = false; // this.props.obj.jack_of_all_trades;
          const proficiency = this.props.obj.skill_proficiencies[skill._id];
            
          if (prof_override !== null && prof_override !== undefined) {
            proficiency_multiplier = prof_override;
          } else if (proficiency) {
            proficiency_multiplier = proficiency;
          } else if (jack) {
            proficiency_multiplier = 0.5;
          }
          if (override !== null && override !== undefined) {
            modifier = override;
          } else if (modifier) {
            const extra_bonus = this.props.obj.extra_skill_bonuses[skill._id];
            if (extra_bonus) {
              modifier += extra_bonus;
            }
            modifier += Math.floor(this.props.obj.proficiency_modifier * proficiency_multiplier);
          }
          if (modifier) {
            passive_perception += modifier;
          }
        }
        skill_finder = this.state.skills.filter(o => o.name === "Investigation");
        if (skill_finder.length === 1) {
          const skill = skill_finder[0];
          
          let proficiency_multiplier = 0;
          let modifier = this.props.obj.current_ability_scores.getModifier(skill.use_ability_score);
          const override = this.props.obj instanceof Character ? this.props.obj.skill_overrides[skill._id] : null;
          const prof_override = this.props.obj instanceof Character ? this.props.obj.proficiency_overrides[skill._id] : null;
          const jack = false; // this.props.obj.jack_of_all_trades;
          const proficiency = this.props.obj.skill_proficiencies[skill._id];
            
          if (prof_override !== null && prof_override !== undefined) {
            proficiency_multiplier = prof_override;
          } else if (proficiency) {
            proficiency_multiplier = proficiency;
          } else if (jack) {
            proficiency_multiplier = 0.5;
          }
          if (override !== null && override !== undefined) {
            modifier = override;
          } else if (modifier) {
            const extra_bonus = this.props.obj.extra_skill_bonuses[skill._id];
            if (extra_bonus) {
              modifier += extra_bonus;
            }
            modifier += Math.floor(this.props.obj.proficiency_modifier * proficiency_multiplier);
          }
          if (modifier) {
            passive_investigation += modifier;
          }
        }
        skill_finder = this.state.skills.filter(o => o.name === "Insight");
        if (skill_finder.length === 1) {
          const skill = skill_finder[0];
          
          let proficiency_multiplier = 0;
          let modifier = this.props.obj.current_ability_scores.getModifier(skill.use_ability_score);
          const override = this.props.obj instanceof Character ? this.props.obj.skill_overrides[skill._id] : null;
          const prof_override = this.props.obj instanceof Character ? this.props.obj.proficiency_overrides[skill._id] : null;
          const jack = false; // this.props.obj.jack_of_all_trades;
          const proficiency = this.props.obj.skill_proficiencies[skill._id];
            
          if (prof_override !== null && prof_override !== undefined) {
            proficiency_multiplier = prof_override;
          } else if (proficiency) {
            proficiency_multiplier = proficiency;
          } else if (jack) {
            proficiency_multiplier = 0.5;
          }
          if (override !== null && override !== undefined) {
            modifier = override;
          } else if (modifier) {
            const extra_bonus = this.props.obj.extra_skill_bonuses[skill._id];
            if (extra_bonus) {
              modifier += extra_bonus;
            }
            modifier += Math.floor(this.props.obj.proficiency_modifier * proficiency_multiplier);
          }
          if (modifier) {
            passive_insight += modifier;
          }
        }
      }
      return (
        <Grid item key="Senses" container spacing={1} direction="column" 
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
              Senses
            </div>
          </Grid>
          <Grid item 
            style={{
              display: "flex",
              justifyContent: "center",
              fontSize: "11px"
            }}>
            <div style={{ width: "245px" }}>
              <Grid container spacing={1} direction="column">
                <Grid item>
                  <div style={{
                      border: "1px solid blue",
                      borderRadius: "5px", 
                      padding: "4px"
                    }}>
                    <Grid container spacing={0} direction="row" 
                      style={{ 
                        margin: "4px",
                        height: "25px" 
                      }}>
                      <Grid item xs={1}>
                        <div style={{ 
                          float: "left",
                          lineHeight: "0.5"
                        }}>
                          {/* { proficient ? <RadioButtonChecked /> : <RadioButtonUnchecked /> } */}
                        </div>
                      </Grid>
                      <Grid item xs={1}>
                        <div style={{ 
                          float: "left", 
                          lineHeight: "1.6" 
                        }}>
                          {/* { (proficient && expert) ? "x2" : "" } */}
                        </div>
                      </Grid>
                      <Grid item xs={9} >
                        <div style={{ float: "left", lineHeight: "1.6" }}>
                          Passive Perception <span style={{ color: "gray", fontSize: "11px" }}>WIS</span>
                        </div>
                      </Grid>
                      <Grid item xs={1}>
                        <div style={{ float: "left", lineHeight: "1.6" }}>
                          { passive_perception }
                        </div>
                      </Grid>
                    </Grid>
                  </div> 
                </Grid>
                <Grid item>
                  <div style={{
                      border: "1px solid blue",
                      borderRadius: "5px", 
                      padding: "4px"
                    }}>
                    <Grid container spacing={0} direction="row" 
                      style={{ 
                        margin: "4px",
                        height: "25px" 
                      }}>
                      <Grid item xs={1}>
                        <div style={{ 
                          float: "left",
                          lineHeight: "0.5"
                        }}>
                          {/* { proficient ? <RadioButtonChecked /> : <RadioButtonUnchecked /> } */}
                        </div>
                      </Grid>
                      <Grid item xs={1}>
                        <div style={{ 
                          float: "left", 
                          lineHeight: "1.6" 
                        }}>
                          {/* { (proficient && expert) ? "x2" : "" } */}
                        </div>
                      </Grid>
                      <Grid item xs={9} >
                        <div style={{ float: "left", lineHeight: "1.6" }}>
                          Passive Investigation <span style={{ color: "gray", fontSize: "11px" }}>INT</span>
                        </div>
                      </Grid>
                      <Grid item xs={1}>
                        <div style={{ float: "left", lineHeight: "1.6" }}>
                          { passive_investigation }
                        </div>
                      </Grid>
                    </Grid>
                  </div> 
                </Grid>
                <Grid item>
                  <div style={{
                      border: "1px solid blue",
                      borderRadius: "5px", 
                      padding: "4px"
                    }}>
                    <Grid container spacing={0} direction="row" 
                      style={{ 
                        margin: "4px",
                        height: "25px" 
                      }}>
                      <Grid item xs={1}>
                        <div style={{ 
                          float: "left",
                          lineHeight: "0.5"
                        }}>
                          {/* { proficient ? <RadioButtonChecked /> : <RadioButtonUnchecked /> } */}
                        </div>
                      </Grid>
                      <Grid item xs={1}>
                        <div style={{ 
                          float: "left", 
                          lineHeight: "1.6" 
                        }}>
                          {/* { (proficient && expert) ? "x2" : "" } */}
                        </div>
                      </Grid>
                      <Grid item xs={9} >
                        <div style={{ float: "left", lineHeight: "1.6" }}>
                          Passive Insight <span style={{ color: "gray", fontSize: "11px" }}>WIS</span>
                        </div>
                      </Grid>
                      <Grid item xs={1}>
                        <div style={{ float: "left", lineHeight: "1.6" }}>
                          { passive_insight }
                        </div>
                      </Grid>
                    </Grid>
                  </div> 
                </Grid>
                { this.props.obj.senses.map((sense, key) => {
                  return (
                    <Grid item key={key}>
                      <b><DisplayObjects type="sense" ids={[sense.sense_id]} />:</b>&nbsp;Out to { sense.range } feet
                    </Grid>
                  );
                })}
              </Grid>
            </div>
          </Grid>
        </Grid>
      );
    }
  }
}

export default connector(CharacterSenses);
