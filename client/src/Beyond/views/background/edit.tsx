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
  Button, 
  Tooltip, Fab,
  Link
} from "@material-ui/core";
// import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
// import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import {  
  Background, 
  FeatureBase,
  StartEquipmentChoice
} from "../../models";

import FeatureBasesInput from "../../components/model_inputs/feature/FeatureBases";
import FeatureBaseInput from "../../components/model_inputs/feature/FeatureBase";
import StartEquipmentChoices from "../../components/model_inputs/equipment/StartEquipmentChoices";

import StringBox from "../../components/input/StringBox";
// import SelectBox from "../../components/input/SelectBox";
// import SelectStringBox from "../../components/input/SelectStringBox";
// import CheckBox from "../../components/input/CheckBox";
// import { 
//   ABILITY_SCORES, 
//   DAMAGE_TYPES, 
//   DURATIONS,
//   COMPONENTS,
//   CASTING_TIMES,
//   RESOURCES
// } from "../../models/Constants";
import API from "../../utilities/smart_api";
import { APIClass } from "../../utilities/smart_api_class";


interface AppState {
  // backgrounds: Background[] | null;
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
  // backgrounds: state.app.backgrounds,
  // skillsMB: state.app.skills as ModelBase[],
  // skills: state.app.skills,
  height: state.app.height,
  width: state.app.width
})

const mapDispatch = {
  // setBackgrounds: (objects: Background[]) => ({ type: 'SET', dataType: 'backgrounds', payload: objects }),
  // addBackground: (object: Background) => ({ type: 'ADD', dataType: 'backgrounds', payload: object })
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & RouteComponentProps<MatchParams> & { }

export interface State { 
  redirectTo: string | null;
  obj: Background;
  processing: boolean;
  // skills: Skill[] | null;
  backgrounds: Background[] | null;
  loading: boolean;
  expanded_feature_base: FeatureBase | null;
  child_names_valid: boolean;
  mode: string;
}

class BackgroundEdit extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirectTo: null,
      obj: new Background(),
      processing: false,
      // skills: null,
      backgrounds: null,
      loading: false,
      expanded_feature_base: null,
      child_names_valid: true,
      mode: "description"
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  submit() {
    this.setState({ processing: true }, () => {
      this.api.upsertObject(this.state.obj).then((res: any) => {
        this.setState({ processing: false, redirectTo: "/beyond/background" });
      });
    });
  }

  // Loads the editing Background into state
  load_object(id: string) {
    const objFinder = this.state.backgrounds ? this.state.backgrounds.filter(a => a._id === id) : [];
    if (objFinder.length === 1) {
      this.setState({ obj: objFinder[0].clone() });
    }
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects("background").then((res: any) => {
        if (res && !res.error) {
          this.setState({ backgrounds: res, loading: false });
        }
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.backgrounds === null) {
      this.load();
      return <span>Loading</span>;
    } else if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else if (this.state.expanded_feature_base) {
      return (
        <FeatureBaseInput
          parent_name={this.state.obj.name}
          feature_base={this.state.expanded_feature_base} 
          onChange={(changed: FeatureBase) => {
            const obj = this.state.obj;
            const objFinder = obj.features.filter(o => o.id === changed.id);
            if (objFinder.length === 1) {
              const feature_base = objFinder[0];
              feature_base.copy(changed);
              this.setState({ obj });
            }
          }}
          onDelete={() => {
            if (this.state.expanded_feature_base) {
              const id = this.state.expanded_feature_base.id;
              const obj = this.state.obj;
              const feature_bases = obj.features.filter(o => o.id !== id);
              feature_bases.filter(o => o.id > id).forEach(o => {
                o.id--;
              });
              obj.features = feature_bases;
              this.setState({ expanded_feature_base: null, obj });
            }
          }}
          onDone={() => {
            let child_names_valid = true;
            for (let i = 0; i < this.state.obj.features.length; i++) {
              const fb = this.state.obj.features[i];
              if (fb.name === "") {
                child_names_valid = false;
                break;
              } else {
                for (let j = 0; j < fb.features.length; j++) {
                  if (fb.features[j].name === "") {
                    child_names_valid = false;
                    break;
                  }
                }
                if (child_names_valid) {
                  for (let j = 0; j < fb.feature_choices.length; j++) {
                    if (fb.feature_choices[j].name === "") {
                      child_names_valid = false;
                      break;
                    }
                  }
                }
                if (!child_names_valid) {
                  break;
                }
              }
            }
            this.setState({ expanded_feature_base: null, child_names_valid });
          }}
        />
      );
    } else { 
      let { id } = this.props.match.params;
      if (id !== undefined && this.state.obj._id !== id) {
        this.load_object(id);
        return (<span>Loading...</span>);
      } else {
        const formHeight = this.props.height - (this.props.width > 600 ? 198 : 198);
        return (
          <Grid container spacing={1} direction="column">
            <Grid item>
              <Tooltip title={`Back to Backgrounds`}>
                <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                  onClick={ () => {
                    this.setState({ redirectTo:`/beyond/background` });
                  }}>
                  <ArrowBack/>
                </Fab>
              </Tooltip> 
            </Grid>
            <Grid item>
              <span className={"MuiTypography-root MuiListItemText-primary header"}>
                { this.state.obj._id === "" ? "Create Background" : `Edit ${this.state.obj.name}` }
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
                  <Grid item xs={4}>
                    <Link href="#" 
                      style={{
                        borderBottom: `${this.state.mode === "description" ? "2px solid blue" : "none"}`
                      }}
                      onClick={(event: React.SyntheticEvent) => {
                        event.preventDefault();
                        this.setState({ mode: "description" });
                      }}>
                      Description
                    </Link>
                  </Grid>
                  <Grid item xs={4}>
                    <Link href="#" 
                      style={{
                        borderBottom: `${this.state.mode === "features" ? "2px solid blue" : "none"}`
                      }}
                      onClick={(event: React.SyntheticEvent) => {
                        event.preventDefault();
                        this.setState({ mode: "features" });
                      }}>
                      Features
                    </Link>
                  </Grid>
                  <Grid item xs={4}>
                    <Link href="#" 
                      style={{
                        borderBottom: `${this.state.mode === "equipment" ? "2px solid blue" : "none"}`
                      }}
                      onClick={(event: React.SyntheticEvent) => {
                        event.preventDefault();
                        this.setState({ mode: "equipment" });
                      }}>
                      Starting Equipment
                    </Link>
                  </Grid>
                </Grid>
                { this.renderTab() }
                {/* <Grid item>
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

                <Grid item>
                  <FeatureBasesInput 
                    feature_bases={this.state.obj.features} 
                    parent_id={this.state.obj._id} 
                    parent_type="Background"
                    onChange={(changed: FeatureBase[]) => {
                      const obj = this.state.obj;
                      obj.features = [];
                      this.setState({ obj }, () => {
                        obj.features = changed;
                        this.setState({ obj });
                      });
                    }}
                    onExpand={(expanded_feature_base: FeatureBase) => {
                      this.setState({ expanded_feature_base });
                    }}
                    onAdd={() => {
                      const obj = this.state.obj;
                      const feature_base = new FeatureBase();
                      feature_base.parent_type = "Background";
                      feature_base.parent_id = obj._id;
                      feature_base.id = obj.features.length;
                      obj.features.push(feature_base);
                      this.setState({
                        obj,
                        expanded_feature_base: feature_base
                      });
                    }}
                  />
                </Grid> */}
              </Grid>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                disabled={ this.state.processing || this.state.obj.name === "" || !this.state.child_names_valid }
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
                  this.setState({ redirectTo:`/beyond/background` });
                }}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        ); 
      }
    }
  }

  renderTab() {
    if (this.state.mode === "description") {
      return (
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
      );
    } else if (this.state.mode === "features") {
      return (
        <Grid item>
          <FeatureBasesInput 
            feature_bases={this.state.obj.features} 
            parent_id={this.state.obj._id} 
            parent_type="Class"
            onChange={(changed: FeatureBase[]) => {
              const obj = this.state.obj;
              obj.features = [];
              this.setState({ obj }, () => {
                obj.features = changed;
                this.setState({ obj });
              });
            }}
            onExpand={(expanded_feature_base: FeatureBase) => {
              this.setState({ expanded_feature_base });
            }}
            onAdd={() => {
              const obj = this.state.obj;
              const feature_base = new FeatureBase();
              feature_base.parent_type = "Class";
              feature_base.parent_id = obj._id;
              feature_base.id = obj.features.length;
              obj.features.push(feature_base);
              this.setState({
                obj,
                expanded_feature_base: feature_base
              });
            }}
          />
        </Grid>
      );
    } else if (this.state.mode === "equipment") {
      return (
        <Grid item>
          <StartEquipmentChoices
            choices={this.state.obj.start_equipment}
            onChange={(choices: StartEquipmentChoice[]) => {
              const obj = this.state.obj;
              obj.start_equipment = choices;
              this.setState({ obj });
            }}
          />
        </Grid>
      );
    } else {
      return (<span></span>);
    }
  }
}

export default connector(BackgroundEdit);
