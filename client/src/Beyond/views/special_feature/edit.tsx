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
  SpecialFeature, 
  // Feature, 
  FeatureBase
} from "../../models";

import StringBox from "../../components/input/StringBox";

import FeatureBasesInput from "../../components/model_inputs/feature/FeatureBases";
import FeatureBaseInput from "../../components/model_inputs/feature/FeatureBase";
// import FeatureListInput from "../../components/model_inputs/feature/FeatureList";
// import FeatureInput from "../../components/model_inputs/feature/FeatureMain";

import API from "../../utilities/smart_api";
import { APIClass } from "../../utilities/smart_api_class";


interface AppState {
  special_feature_type: string;
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
  special_feature_type: state.app.special_feature_type,
  height: state.app.height,
  width: state.app.width
})

const mapDispatch = {
  setSpecialFeatureType: (type: string) => ({ type: 'SET', dataType: 'special_feature_type', payload: type })
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & RouteComponentProps<MatchParams> & { }

export interface State { 
  redirectTo: string | null;
  obj: SpecialFeature;
  processing: boolean;
  child_names_valid: boolean;
  expanded_feature_base: FeatureBase | null;
  special_features: SpecialFeature[] | null;
  loading: boolean;
}

class SpecialFeatureEdit extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirectTo: null,
      obj: new SpecialFeature(),
      processing: false,
      child_names_valid: true,
      expanded_feature_base: null,
      special_features: null,
      loading: false
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  submit() {
    this.setState({ processing: true }, () => {
      this.api.upsertObject(this.state.obj).then((res: any) => {
        this.setState({ processing: false, redirectTo: "/beyond/special_feature" });
      });
    });
  }

  // Loads the editing Special Feature into state
  load_object(id: string) {
    const objectFinder = this.state.special_features ? this.state.special_features.filter(o => o._id === id) : [];
    if (objectFinder.length === 1) {
      this.setState({ obj: objectFinder[0].clone() });
    }
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects("special_feature").then((res: any) => {
        const obj = this.state.obj;
        if (obj._id === "" && this.props.special_feature_type !== "Any") {
          obj.type = this.props.special_feature_type;
        }
        this.setState({ 
          obj,
          special_features: res, 
          loading: false 
        });
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.special_features === null) {
      this.load();
      return <span>Loading</span>;
    } else if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else if (this.state.expanded_feature_base) {
      return (
        <FeatureBaseInput
          parent_name={this.state.obj.name}
          feature_base={this.state.expanded_feature_base} 
          feature_bases={this.state.obj.features}
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
              <Tooltip title={`Back to Special Features`}>
                <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                  onClick={ () => {
                    this.setState({ redirectTo:`/beyond/special_feature` });
                  }}>
                  <ArrowBack/>
                </Fab>
              </Tooltip> 
            </Grid>
            <Grid item>
              <span className={"MuiTypography-root MuiListItemText-primary header"}>
                { this.state.obj._id === "" ? "Create Special Feature" : `Edit ${this.state.obj.name}` }
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
                    value={this.state.obj.type} 
                    name="Type"
                    onBlur={(value: string) => {
                      const obj = this.state.obj;
                      obj.type = value;
                      this.setState({ obj });
                    }}
                  />
                </Grid>
                <Grid item>
                  <FeatureBasesInput 
                    feature_bases={this.state.obj.features} 
                    parent_id={this.state.obj._id} 
                    parent_type="Special Feature"
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
                      feature_base.parent_type = "Special Feature";
                      feature_base.parent_id = obj._id;
                      feature_base.id = obj.features.length;
                      obj.features.push(feature_base);
                      this.setState({
                        obj,
                        expanded_feature_base: feature_base
                      });
                    }}
                  />
                  {/* <FeatureListInput 
                    label="Feature"
                    features={this.state.obj.features} 
                    parent_id={this.state.obj._id} 
                    parent_type="SpecialFeature"
                    onChange={(changed: Feature[]) => {
                      const obj = this.state.obj;
                      obj.features = [];
                      this.setState({ obj }, () => {
                        obj.features = changed;
                        this.setState({ obj });
                      });
                    }}
                    onExpand={(expanded_feature: Feature) => {
                      this.setState({ expanded_feature });
                    }}
                    onAdd={() => {
                      const obj = this.state.obj;
                      const feature = new Feature();
                      feature.parent_type = "SpecialFeature";
                      feature.parent_id = obj._id;
                      feature.id = obj.features.length;
                      obj.features.push(feature);
                      this.setState({
                        obj,
                        expanded_feature: feature
                      });
                    }}
                  /> */}
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                disabled={ this.state.processing || !this.state.child_names_valid || this.state.obj.name === "" }
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
                  this.setState({ redirectTo:`/beyond/special_feature` });
                }}>
                Cancel
              </Button>
              { (this.state.obj.name === "" || !this.state.child_names_valid) && 
                <span style={{ color: "red", marginLeft: "4px" }}>
                  The Special Feature, all Feature Bases, Features, Feature Choices, and Options must have names.
                </span>
              }
            </Grid>
          </Grid>
        ); 
      }
    }
  }
}

export default connector(SpecialFeatureEdit);
