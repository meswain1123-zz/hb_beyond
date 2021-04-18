import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Redirect } from "react-router-dom";
import {
  // Add, Edit,
  ArrowBack
} from "@material-ui/icons";
import {
  Grid, 
  // List, ListItem, 
  Button, 
  Tooltip, Fab,
  // FormControl, InputLabel,
  // OutlinedInput, FormHelperText
} from "@material-ui/core";
// import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
// import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { 
  Spell, 
  TemplateBase,
  SpellTemplate,
  AbilityEffect
} from "../../models";
import StringBox from "../../components/input/StringBox";
// import SelectBox from "../../components/input/SelectBox";
import SelectStringBox from "../../components/input/SelectStringBox";
import CheckBox from "../../components/input/CheckBox";
import TemplateBox from "../../components/model_inputs/TemplateBox";
import AbilityEffectInput from "../../components/model_inputs/feature/AbilityEffect";
import { 
  ABILITY_SCORES, 
  // DAMAGE_TYPES, 
  DURATIONS,
  COMPONENTS,
  CASTING_TIMES,
  // RESOURCES,
  SCHOOLS
} from "../../models/Constants";
import API from "../../utilities/smart_api";
import { APIClass } from "../../utilities/smart_api_class";


interface AppState {
  // spells: Spell[] | null;
  // skills: Skill[] | null;
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
  // spells: state.app.spells,
  // skillsMB: state.app.skills as ModelBase[],
  // skills: state.app.skills,
  height: state.app.height,
  width: state.app.width
})

const mapDispatch = {
  // setSpells: (objects: Spell[]) => ({ type: 'SET', dataType: 'spells', payload: objects }),
  // addSpell: (object: Spell) => ({ type: 'ADD', dataType: 'spells', payload: object })
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & RouteComponentProps<MatchParams> & { }

export interface State { 
  redirectTo: string | null;
  obj: Spell;
  processing: boolean;
  spells: Spell[] | null;
  loading: boolean;
  show_effect: number;
}

class SpellEdit extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirectTo: null,
      obj: new Spell(),
      processing: false,
      spells: null,
      loading: false,
      show_effect: 0
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  submit() {
    this.setState({ processing: true }, () => {
      this.api.upsertObject(this.state.obj).then((res: any) => {
        this.setState({ processing: false, redirectTo: "/beyond/spell" });
      });
    });
  }

  // Loads the editing Spell into state
  load_object(id: string) {
    const spellFinder = this.state.spells ? this.state.spells.filter(a => a._id === id) : [];
    if (spellFinder.length === 1) {
      this.setState({ obj: spellFinder[0].clone() });
    }
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects("spell").then((res: any) => {
        if (res && !res.error) {
          this.setState({ spells: res, loading: false });
        }
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.spells === null) {
      this.load();
      return <span>Loading</span>;
    } else if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else { 
      let { id } = this.props.match.params;
      if (id !== undefined && this.state.obj._id !== id) {
        this.load_object(id);
        return (<span>Loading...</span>);
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
                    // this.props.onChange(feature);
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
                  <Grid item xs={3} container spacing={1} direction="row">
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
                  <Grid item xs={3}>
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
                  <Grid item xs={3}>
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
                  <Grid item xs={3} container spacing={1} direction="row">
                    <Grid item xs={6}>
                      <Button
                        variant="contained"
                        color={ this.state.show_effect === 1 ? "primary" : "default" }
                        onClick={ () => { 
                          this.setState({ show_effect: (this.state.show_effect === 1 ? 0 : 1) });
                        }}>
                        { this.state.obj.effect.type } { ["None","Self Condition"].includes(this.state.obj.effect_2.type) || this.state.obj.effect.attack_type === "None" ? "" : this.state.obj.effect.attack_type }
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        variant="contained"
                        color={ this.state.show_effect === 2 ? "primary" : "default" }
                        onClick={ () => { 
                          this.setState({ show_effect: (this.state.show_effect === 2 ? 0 : 2) });
                        }}>
                        { this.state.obj.effect_2.type } { ["None","Self Condition"].includes(this.state.obj.effect_2.type) || this.state.obj.effect_2.attack_type === "None" ? "" : this.state.obj.effect_2.attack_type }
                      </Button>
                    </Grid>
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
                { this.state.show_effect === 1 &&
                  <Grid item>
                    <AbilityEffectInput 
                      obj={this.state.obj.effect}
                      name="Effect 1"
                      slot_level={this.state.obj.level}
                      onChange={(changed: AbilityEffect) => {
                        const obj = this.state.obj;
                        obj.effect = changed;
                        this.setState({ obj });
                      }}
                    />
                  </Grid>
                }
                { this.state.show_effect === 2 &&
                  <Grid item>
                    <AbilityEffectInput 
                      obj={this.state.obj.effect_2}
                      name="Effect 2"
                      slot_level={this.state.obj.level}
                      onChange={(changed: AbilityEffect) => {
                        const obj = this.state.obj;
                        obj.effect_2 = changed;
                        this.setState({ obj });
                      }}
                    />
                  </Grid>
                }
                <Grid item>
                  <StringBox 
                    value={this.state.obj.description} 
                    name="Description"
                    multiline
                    onBlur={(value: string) => {
                      const obj = this.state.obj;
                      obj.description = value;
                      this.setState({ obj });
                    }}
                  />
                </Grid>
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
                // color="primary"
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
}

export default connector(SpellEdit);
