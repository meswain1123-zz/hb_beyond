import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  RadioButtonUnchecked, // Not Proficient
  RadioButtonChecked, // Proficient
  Tonality, // Half Proficient
} from "@material-ui/icons";
import {
  Grid, 
  Drawer,
  Popover,
} from "@material-ui/core";

import { 
  Character,
  Skill,
  RollPlus
} from "../../../models";
import { 
  PROFICIENCY_MAP
} from "../../../models/Constants";

import ButtonBox from "../../input/ButtonBox";
import StringBox from "../../input/StringBox";
import SelectStringBox from "../../input/SelectStringBox";
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
  loading: boolean;
  drawer: Skill | null;
  skills: Skill[] | null
  popoverAnchorEl: HTMLDivElement | null;
  popoverSkill: Skill | null;
}

class CharacterSkills extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
      drawer: null,
      skills: null,
      popoverAnchorEl: null,
      popoverSkill: null
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
    this.load();
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
    if (this.state.loading || this.state.skills === null) {
      return <span>Loading</span>;
    } else {
      return (
        <Grid item container spacing={1} direction="column" 
          style={{
            border: "1px solid blue",
            borderRadius: "5px"
          }}>
          <Grid item>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                fontSize: "11px"
              }}>
              <div>
                Skills
              </div>
            </div>
          </Grid>
          { this.state.skills && this.state.skills.map((skill, key) => {
            return this.renderSkill(skill, key);
          })}
          { this.renderExtras() }
        </Grid>
      );
    }
  }
  
  renderSkill(skill: Skill, key: number) {
    let proficiency_multiplier = 0;
    let modifier = this.props.obj.current_ability_scores.getModifier(skill.use_ability_score);
    const override = this.props.obj instanceof Character ? this.props.obj.skill_overrides[skill._id] : null;
    const prof_override = this.props.obj instanceof Character ? this.props.obj.proficiency_overrides[skill._id] : null;
    const jack = this.props.obj.jack_of_all_trades;
    const proficiency = this.props.obj.skill_proficiencies[skill._id];
      
    if (prof_override !== null && prof_override !== undefined) {
      proficiency_multiplier = prof_override;
    } else if (proficiency) {
      proficiency_multiplier = proficiency;
    } else if (jack) {
      proficiency_multiplier = 0.5;
    }
    if (override !== undefined && override !== null) {
      modifier = override;
    } else if (modifier !== null) {
      const extra_bonus = this.props.obj.extra_skill_bonuses[skill._id];
      if (extra_bonus) {
        modifier += extra_bonus;
      }
      modifier += Math.floor(this.props.obj.proficiency_modifier * proficiency_multiplier);
    }
    let bonuses_string = "";
    this.props.obj.check_bonuses.filter(o => o.types.includes(skill.use_ability_score)).forEach(bonus => {
      const rolls = bonus.rolls;
      if (rolls && modifier !== null) {
        modifier += rolls.flat;
        if (!["","None","undefined"].includes(rolls.ability_score)) {
          const mod = this.props.obj.current_ability_scores.getModifier(rolls.ability_score);
          if (mod) {
            modifier += mod;
          }
        }
        if (rolls.size === 1) {
          modifier += rolls.count;
        } else if (rolls.size > 1 && rolls.count !== 0) {
          rolls.recalculate_string();
          if (rolls.as_string.length > 0 && rolls.as_string[0] !== "-") {
            bonuses_string += `+${rolls.as_string}`;
          } else {
            bonuses_string += rolls.as_string;
          }
        }
      }
    });
    if (!modifier) {
      modifier = 0;
    }
    if (modifier > 0) {
      bonuses_string = `+${modifier}${bonuses_string}`;
    } else if (modifier < 0) {
      bonuses_string = `${modifier}${bonuses_string}`;
    } else if (bonuses_string === "") {
      bonuses_string = "+0";
    }
    return (
      <Grid item key={key}>
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
                { proficiency_multiplier >= 1 ? <RadioButtonChecked /> : (proficiency_multiplier === 0.5 ? <Tonality /> : <RadioButtonUnchecked />) }
              </div>
            </Grid>
            <Grid item xs={1}>
              <div style={{ 
                float: "left", 
                lineHeight: "1.6" 
              }}>
                { proficiency_multiplier === 2 ? "x2" : "" }
              </div>
            </Grid>
            <Grid item xs={9} 
              onClick={() => {
                this.setState({ drawer: skill });
              }}>
              <div style={{ float: "left", lineHeight: "1.6" }}>
                { skill.name } <span style={{ color: "gray", fontSize: "11px" }}>{ skill.use_ability_score }</span>
              </div>
            </Grid>
            <Grid item xs={1}>
              <ButtonBox 
                name={bonuses_string}
                onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                  this.setState({ popoverSkill: skill })
                  this.setPopoverAnchorEl(event.currentTarget);
                }} 
              />
            </Grid>
          </Grid>
        </div> 
      </Grid>
    );
  }

  renderExtras() {
    return [
      <Drawer key="drawer" anchor="right" 
        open={ this.state.drawer !== null } 
        onClose={() => {
          this.setState({ drawer: null });
        }}>
        { this.renderDetails() }
      </Drawer>,
      <Popover key="rolls"
        open={ this.state.popoverAnchorEl !== null && this.state.popoverSkill !== null }
        anchorEl={this.state.popoverAnchorEl}
        onClose={() => {
          this.setState({ popoverAnchorEl: null, popoverSkill: null });
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
    const skill = this.state.popoverSkill;
    if (skill) {
      let proficiency_multiplier = 0;
      let modifier = 0;
      const override = this.props.obj instanceof Character ? this.props.obj.skill_overrides[skill._id] : null;
      const prof_override = this.props.obj instanceof Character ? this.props.obj.proficiency_overrides[skill._id] : null;
      const jack = this.props.obj.jack_of_all_trades;
      const proficiency = this.props.obj.skill_proficiencies[skill._id];
      
      if (prof_override !== null && prof_override !== undefined) {
        proficiency_multiplier = prof_override;
      } else if (proficiency) {
        proficiency_multiplier = proficiency;
      } else if (jack) {
        proficiency_multiplier = 0.5;
      }
      if (override !== undefined && override !== null) {
        modifier = override;
      } else if (modifier !== null) {
        const extra_bonus = this.props.obj.extra_skill_bonuses[skill._id];
        if (extra_bonus) {
          modifier += extra_bonus;
        }
        modifier += Math.floor(this.props.obj.proficiency_modifier * proficiency_multiplier);
      }
      const roll_plus = new RollPlus();
      roll_plus.ability_score = skill.use_ability_score;
      roll_plus.flat = modifier;
      rolls.push(roll_plus);
      this.props.obj.check_bonuses.forEach(bonus => {
        if (bonus.types.includes(skill.use_ability_score)) {
          rolls.push(bonus.rolls);
        }
      });
      return (
        <Roller 
          name={skill.name}
          char={this.props.obj}
          rolls={rolls} 
          type="Skill Check" 
        />
      );
    }
    return null;
  }

  setPopoverAnchorEl(el: HTMLDivElement | null) {
    this.setState({ popoverAnchorEl: el });
  }

  renderDetails() {
    if (this.state.drawer === null) {
      return null;
    } else {
      const skill = this.state.drawer;
      let proficiency_multiplier = 0;
      const ability_modifier = this.props.obj.current_ability_scores.getModifier(skill.use_ability_score);
      let modifier = ability_modifier;
      let override = this.props.obj instanceof Character ? this.props.obj.skill_overrides[skill._id] : null;
      let prof_override = this.props.obj instanceof Character ? this.props.obj.proficiency_overrides[skill._id] : null;
      const jack = this.props.obj.jack_of_all_trades;
      const proficiency = this.props.obj.skill_proficiencies[skill._id];
      let extra_bonus = this.props.obj.extra_skill_bonuses[skill._id];
      
      if (prof_override !== null && prof_override !== undefined) {
        proficiency_multiplier = prof_override;
      } else if (proficiency) {
        proficiency_multiplier = proficiency;
      } else if (jack) {
        proficiency_multiplier = 0.5;
      }
      const proficiency_mod = Math.floor(this.props.obj.proficiency_modifier * proficiency_multiplier);
      if (override !== undefined) {
        modifier = override;
      } else if (modifier !== null) {
        if (extra_bonus) {
          modifier += extra_bonus;
        }
        modifier += proficiency_mod;
      }
      if (prof_override === undefined) {
        prof_override = -1;
      }
      if (override === undefined) {
        override = -1;
      }
      if (extra_bonus === undefined) {
        extra_bonus = 0;
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
              minHeight: "800px",
              width: "316px",
              overflowX: "hidden"
            }}>
            <Grid item style={{ width: "316px" }}>
              <span style={{ fontSize: "15px", fontWeight: "bold" }}>
                { this.state.drawer.use_ability_score }
              </span>&nbsp;
              <span style={{ fontSize: "15px", fontWeight: "bold" }}>
                { this.state.drawer.name }
              </span>&nbsp;
              <span style={{ fontSize: "12px" }}>
                ({ modifier })
              </span>
            </Grid>
            <Grid item container spacing={0} direction="row" 
              style={{ 
                border: "1px solid lightgray"
              }}>
              <Grid item xs={8}>{ this.state.drawer.use_ability_score } Modifier</Grid>
              <Grid item xs={4} 
                style={{ 
                  borderLeft: "2px solid gray", 
                  background: "lightgray",
                  display: "flex",
                  justifyContent: "center"
                }}>
                { ability_modifier }
              </Grid>
              <Grid item xs={8}>Proficiency Level</Grid>
              <Grid item xs={4} container spacing={0} direction="column"
                style={{ 
                  borderLeft: "2px solid gray", 
                  background: "lightgray"
                }}>
                <Grid item 
                  style={{
                    display: "flex",
                    justifyContent: "center"
                  }}>
                  { proficiency_multiplier === 0 ? <RadioButtonUnchecked /> : (proficiency_multiplier === 0.5 ? <Tonality /> : (proficiency_multiplier === 1 ? <RadioButtonChecked /> : <span><RadioButtonChecked /> x2</span>)) }
                </Grid>
                <Grid item 
                  style={{
                    display: "flex",
                    justifyContent: "center"
                  }}>
                  ({ proficiency_multiplier === 0 ? "Not Proficient" : (proficiency_multiplier === 0.5 ? "Half Proficient" : (proficiency_multiplier === 1 ? "Proficient" : "Expert")) })
                </Grid>
              </Grid>
              { proficiency_multiplier > 0 &&
                <Grid item xs={8}>Proficiency Modification</Grid>
              }
              { proficiency_multiplier > 0 &&
                <Grid item xs={4} 
                  style={{ 
                    borderLeft: "2px solid gray", 
                    background: "lightgray",
                    display: "flex",
                    justifyContent: "center"
                  }}>
                  { proficiency_mod }
                </Grid>
              }
              <Grid item xs={8}>Other Modifier</Grid>
              <Grid item xs={4} 
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
                    if (["","0"].includes(changed)) {
                      delete obj.extra_skill_bonuses[skill._id];
                    } else {
                      obj.extra_skill_bonuses[skill._id] = +changed;
                    }
                    this.api.updateObject("character", obj).then((res: any) => {
                      this.props.onChange();
                      this.setState({ });
                    });
                  }}
                />
              </Grid>
              <Grid item xs={8}>Override Proficiency</Grid>
              <Grid item xs={4} 
                style={{ 
                  borderLeft: "2px solid gray", 
                  background: "lightgray"
                }}>
                <SelectStringBox 
                  name=""
                  value={ `${prof_override}` }
                  option_map={PROFICIENCY_MAP}
                  onChange={(changed: string) => {
                    const obj = this.props.obj;
                    if (obj instanceof Character) {
                      if (+changed === -1) {
                        delete obj.proficiency_overrides[skill._id];
                      } else {
                        obj.proficiency_overrides[skill._id] = +changed;
                      }
                      this.api.updateObject("character", obj).then((res: any) => {
                        this.props.onChange();
                        this.setState({ });
                      });
                    }
                  }}
                />
              </Grid>
              <Grid item xs={8}>Override Score</Grid>
              <Grid item xs={4} 
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
                    if (obj instanceof Character) {
                      if (["","-1"].includes(changed)) {
                        delete obj.skill_overrides[skill._id];
                      } else {
                        obj.skill_overrides[skill._id] = +changed;
                      }
                      this.api.updateObject("character", obj).then((res: any) => {
                        this.props.onChange();
                        this.setState({ });
                      });
                    }
                  }}
                />
              </Grid>
            </Grid>
            <Grid item>
              { skill.description }
            </Grid>
          </Grid>
        </div>
      );
    }
  }
}

export default connector(CharacterSkills);
