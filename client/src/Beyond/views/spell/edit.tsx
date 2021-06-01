import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Redirect } from "react-router-dom";
import {
  ArrowBack, Add
} from "@material-ui/icons";
import {
  Grid, 
  Button, 
  Tooltip, Fab,
} from "@material-ui/core";

import { 
  Spell, 
  TemplateBase,
  SpellTemplate,
  AbilityEffect,
} from "../../models";
import { 
  ABILITY_SCORES, 
  DURATIONS,
  COMPONENTS,
  CASTING_TIMES,
  SCHOOLS
} from "../../models/Constants";

import StringBox from "../../components/input/StringBox";
import SelectStringBox from "../../components/input/SelectStringBox";
import CheckBox from "../../components/input/CheckBox";
import ToggleButtonBox from "../../components/input/ToggleButtonBox";

import TemplateBox from "../../components/model_inputs/TemplateBox";
import AbilityEffectInput from "../../components/model_inputs/feature/AbilityEffect";

import ModelBaseDetails from "../../components/model_inputs/ModelBaseDetails";

import API from "../../utilities/smart_api";
import { APIClass } from "../../utilities/smart_api_class";


interface AppState {
  height: number;
  width: number;
}

interface RootState {
  app: AppState
}

interface MatchParams {
  id: string;
}

const mapState = (state: RootState) => ({
  height: state.app.height,
  width: state.app.width
})

const mapDispatch = {
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & RouteComponentProps<MatchParams> & { }

export interface State { 
  redirectTo: string | null;
  obj: Spell;
  processing: boolean;
  loading: boolean;
  show_effect: string;
  reloading: boolean;
}

class SpellEdit extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirectTo: null,
      obj: new Spell(),
      processing: false,
      loading: false,
      show_effect: "",
      reloading: false
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
    let { id } = this.props.match.params;
    if (id !== undefined && this.state.obj._id !== id) {
      this.load_object(id);
    }
  }

  submit() {
    this.setState({ processing: true }, () => {
      const obj = this.state.obj;
      this.api.upsertObject("spell", obj).then((res: any) => {
        this.setState({ processing: false, redirectTo: "/beyond/spell" });
      });
    });
  }

  // Loads the editing Creature into state
  load_object(id: string) {
    this.setState({ loading: true }, () => {
      this.api.getFullObject("spell", id).then((res: any) => {
        if (res) {
          const obj = res;
          this.setState({ obj, loading: false });
        }
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else { 
      const formHeight = this.props.height - (this.props.width > 600 ? 198 : 198);
      return (
        <Grid container spacing={1} direction="column">
          <Grid item container spacing={1} direction="row">
            <Grid item xs={3}>
              <Tooltip title={`Back to Spells`}>
                <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                  onClick={ () => {
                    this.setState({ redirectTo:`/beyond/spell` });
                  }}>
                  <ArrowBack/>
                </Fab>
              </Tooltip>
            </Grid>
            <Grid item xs={9}>
              <TemplateBox
                obj={this.state.obj}
                type="Spell"
                useTemplate={(template: TemplateBase) => {
                  const spell_template: SpellTemplate = template as SpellTemplate;
                  const obj = this.state.obj;
                  obj.copyTemplate(spell_template);
                  this.setState({ obj });
                }}
              />
            </Grid>
          </Grid>
          <Grid item>
            <span className={"MuiTypography-root MuiListItemText-primary header"}>
              { this.state.obj._id === "" ? "Create Spell" : `Edit ${this.state.obj.name}` }
            </span>
          </Grid>
          <Grid item 
            style={{ 
              height: `${formHeight}px`, 
              overflowY: "scroll", 
              overflowX: "hidden" 
            }}>
            <Grid container spacing={1} direction="column">
              <Grid item>
                <StringBox 
                  value={this.state.obj.name} 
                  message={this.state.obj.name.length > 0 ? "" : "Name Invalid"}
                  name="Name"
                  onBlur={(value: string) => {
                    const obj = this.state.obj;
                    obj.name = value;
                    this.setState({ obj });
                  }}
                />
              </Grid>
              <Grid item container spacing={1} direction="row">
                <Grid item xs={3}>
                  <SelectStringBox 
                    options={["0","1","2","3","4","5","6","7","8","9"]}
                    value={`${this.state.obj.level}`} 
                    name="Spell Level"
                    onChange={(value: string) => {
                      const obj = this.state.obj;
                      obj.level = +value;
                      this.setState({ obj });
                    }}
                  />
                </Grid>
                <Grid item xs={3} container spacing={1} direction="row">
                  <Grid item xs={9}>
                    <SelectStringBox 
                      name="Casting Time"
                      options={CASTING_TIMES}
                      value={this.state.obj.casting_time}
                      onChange={(value: string) => {
                        const obj = this.state.obj;
                        obj.casting_time = value;
                        this.setState({ obj });
                      }}
                    /> 
                  </Grid>
                  <Grid item xs={3}>
                    <CheckBox 
                      name="R" 
                      value={this.state.obj.ritual} 
                      onChange={(e: boolean) => {
                        const obj = this.state.obj;
                        obj.ritual = e;
                        this.setState({ obj });
                      }} 
                    />
                  </Grid>
                </Grid>
                <Grid item xs={3} container spacing={1} direction="row">
                  <Grid item xs={6}>
                    <StringBox 
                      value={this.state.obj.range} 
                      name="Range"
                      onBlur={(value: string) => {
                        const obj = this.state.obj;
                        obj.range = value;
                        this.setState({ obj });
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <StringBox 
                      value={this.state.obj.range_2} 
                      name="Area"
                      onBlur={(value: string) => {
                        const obj = this.state.obj;
                        obj.range_2 = value;
                        this.setState({ obj });
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={3}>
                  <SelectStringBox 
                    name="Components"
                    options={COMPONENTS}
                    values={this.state.obj.components}
                    multiple
                    onChange={(values: string[]) => {
                      const obj = this.state.obj;
                      obj.components = values;
                      this.setState({ obj });
                    }}
                  /> 
                </Grid>
              </Grid>
              <Grid item container spacing={1} direction="row">
                <Grid item xs={4} container spacing={1} direction="row">
                  <Grid item xs={ this.state.obj.duration === "Instantaneous" ? 12 : 9}>
                    <SelectStringBox 
                      name="Duration"
                      options={DURATIONS}
                      value={ !DURATIONS.includes(this.state.obj.duration) ? "Special" : this.state.obj.duration }
                      onChange={(value: string) => {
                        const obj = this.state.obj;
                        obj.duration = value;
                        this.setState({ obj });
                      }}
                    /> 
                  </Grid>
                  { this.state.obj.duration !== "Instantaneous" && 
                    <Grid item xs={3}>
                      <CheckBox 
                        name="C" 
                        value={this.state.obj.concentration} 
                        onChange={(e: boolean) => {
                          const obj = this.state.obj;
                          obj.concentration = e;
                          this.setState({ obj });
                        }} 
                      />
                    </Grid>
                  } 
                  { (this.state.obj.duration === "Special" || !DURATIONS.includes(this.state.obj.duration)) && 
                    <Grid item xs={12}>
                      <StringBox 
                        name="Duration"
                        value={this.state.obj.duration === "Special" ? "" : this.state.obj.duration}
                        onBlur={(value: string) => {
                          const obj = this.state.obj;
                          obj.duration = value;
                          this.setState({ obj });
                        }}
                      /> 
                    </Grid>
                  } 
                </Grid>
                <Grid item xs={4}>
                  <SelectStringBox 
                    options={SCHOOLS}
                    value={this.state.obj.school} 
                    name="School"
                    onChange={(value: string) => {
                      const obj = this.state.obj;
                      obj.school = value;
                      this.setState({ obj });
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <SelectStringBox 
                    name="Saving Throw"
                    options={ABILITY_SCORES}
                    value={this.state.obj.saving_throw_ability_score}
                    onChange={(value: string) => {
                      const obj = this.state.obj;
                      obj.saving_throw_ability_score = value;
                      this.setState({ obj });
                    }}
                  /> 
                </Grid>
              </Grid>
              { this.state.obj.components.includes("M") &&
                <Grid item>
                  <StringBox 
                    name="Material Component"
                    value={this.state.obj.material_component}
                    onBlur={(value: string) => {
                      const obj = this.state.obj;
                      obj.material_component = value;
                      this.setState({ obj });
                    }}
                  /> 
                </Grid>
              }
              <Grid item container spacing={1} direction="column">
                <Grid item>
                  <span className={"MuiTypography-root MuiListItemText-primary header"}>
                    Effects
                  </span>
                  <Tooltip title={`Add Effect`}>
                    <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                      onClick={ () => {
                        const obj = this.state.obj;
                        const effect = new AbilityEffect();
                        obj.effects.push(effect);
                        this.setState({ obj, show_effect: effect.true_id });
                      }}>
                      <Add/>
                    </Fab>
                  </Tooltip>
                </Grid>
                { !this.state.reloading && this.state.obj.effects.map((effect, key) => {
                  let name = effect.type;
                  if (!["None","Self Condition"].includes(effect.type) && effect.attack_type !== "None") {
                    name += ` ${effect.attack_type}`
                  }
    
                  return (
                    <Grid item key={key} container spacing={1} direction="column">
                      <Grid item>
                        <ToggleButtonBox
                          name={ name }
                          value={ this.state.show_effect === effect.true_id }
                          onToggle={ () => { 
                            this.setState({ show_effect: (this.state.show_effect === effect.true_id ? "" : effect.true_id) });
                          }}
                        />
                      </Grid>
                      { this.state.show_effect === effect.true_id && 
                        <Grid item>
                          <AbilityEffectInput 
                            obj={effect}
                            onChange={() => {
                              const obj = this.state.obj;
                              this.setState({ obj });
                            }}
                            onDelete={() => {
                              const obj = this.state.obj;
                              obj.effects = obj.effects.filter(o => o.true_id !== effect.true_id);
                              this.setState({ obj, reloading: true }, () => { this.setState({ reloading: false }); });
                            }}
                          />
                        </Grid>        
                      }
                    </Grid>
                  );
                })}
              </Grid>
              <ModelBaseDetails key="description"
                obj={this.state.obj}
                onChange={() => {
                  const obj = this.state.obj;
                  this.setState({ obj });
                }}
              />
            </Grid>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              disabled={this.state.processing}
              onClick={ () => { 
                this.submit();
              }}>
              Submit
            </Button>
            <Button
              variant="contained"
              disabled={this.state.processing}
              style={{ marginLeft: "4px" }}
              onClick={ () => { 
                this.setState({ redirectTo:`/beyond/spell` });
              }}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      ); 
    }
  }
}

export default connector(SpellEdit);
