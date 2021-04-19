import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Redirect } from "react-router-dom";
import {
  ArrowBack
} from "@material-ui/icons";
import {
  Grid, 
  Button, 
  Tooltip, Fab,
} from "@material-ui/core";
import { 
  Race, 
  FeatureBase
} from "../../models";

import FeatureBasesInput from "../../components/model_inputs/feature/FeatureBases";
import FeatureBaseInput from "../../components/model_inputs/feature/FeatureBase";

import StringBox from "../../components/input/StringBox";
import SelectStringBox from "../../components/input/SelectStringBox";

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
  obj: Race;
  processing: boolean;
  races: Race[] | null;
  loading: boolean;
  expanded_feature_base: FeatureBase | null;
  child_names_valid: boolean;
}

class RaceEdit extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirectTo: null,
      obj: new Race(),
      processing: false,
      races: null,
      loading: false,
      expanded_feature_base: null,
      child_names_valid: true
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  submit() {
    this.setState({ processing: true }, () => {
      this.api.upsertObject(this.state.obj).then((res: any) => {
        this.setState({ processing: false, redirectTo: "/beyond/race" });
      });
    });
  }

  // Loads the editing Race into state
  load_object(id: string) {
    const objFinder = this.state.races ? this.state.races.filter(a => a._id === id) : [];
    if (objFinder.length === 1) {
      this.setState({ obj: objFinder[0].clone() });
    }
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects("race").then((res: any) => {
        if (res && !res.error) {
          this.setState({ races: res, loading: false });
        }
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.races === null) {
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
              <Tooltip title={`Back to Races`}>
                <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                  onClick={ () => {
                    this.setState({ redirectTo:`/beyond/race` });
                  }}>
                  <ArrowBack/>
                </Fab>
              </Tooltip> 
            </Grid>
            <Grid item>
              <span className={"MuiTypography-root MuiListItemText-primary header"}>
                { this.state.obj._id === "" ? "Create Race" : `Edit ${this.state.obj.name}` }
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
                <Grid item>
                  <StringBox 
                    value={this.state.obj.age} 
                    name="Age"
                    onBlur={(value: string) => {
                      const obj = this.state.obj;
                      obj.age = value;
                      this.setState({ obj });
                    }}
                  />
                </Grid>
                <Grid item>
                  <StringBox 
                    value={this.state.obj.alignment} 
                    name="Alignment"
                    onBlur={(value: string) => {
                      const obj = this.state.obj;
                      obj.alignment = value;
                      this.setState({ obj });
                    }}
                  />
                </Grid>
                <Grid item>
                  <StringBox 
                    value={this.state.obj.size_description} 
                    name="Size Description"
                    onBlur={(value: string) => {
                      const obj = this.state.obj;
                      obj.size_description = value;
                      this.setState({ obj });
                    }}
                  />
                </Grid>
                <Grid item>
                  <SelectStringBox 
                    options={["Tiny","Small","Medium","Large","Very Large","Huge"]}
                    value={this.state.obj.size} 
                    name="Size"
                    onChange={(value: string) => {
                      const obj = this.state.obj;
                      obj.description = value;
                      this.setState({ obj });
                    }}
                  />
                </Grid>
                <Grid item>
                  <StringBox 
                    value={`${this.state.obj.speed}`} 
                    name="Speed (in feet per round)"
                    type="number"
                    onBlur={(value: number) => {
                      const obj = this.state.obj;
                      obj.speed = value;
                      this.setState({ obj });
                    }}
                  />
                </Grid>
                <Grid item>
                  <FeatureBasesInput 
                    feature_bases={this.state.obj.features} 
                    parent_id={this.state.obj._id} 
                    parent_type="Race"
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
                      feature_base.parent_type = "Race";
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
                disabled={this.state.processing}
                style={{ marginLeft: "4px" }}
                onClick={ () => { 
                  this.setState({ redirectTo:`/beyond/race` });
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

export default connector(RaceEdit);
