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
  EldritchInvocation, Feature
} from "../../models";

import ModelBaseInput from "../../components/model_inputs/ModelBaseInput";

import FeatureListInput from "../../components/model_inputs/feature/FeatureList";
import FeatureInput from "../../components/model_inputs/feature/FeatureMain";
import SelectStringBox from "../../components/input/SelectStringBox";
import SelectPactBoonBox from "../../components/model_inputs/select/SelectPactBoonBox";

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
  obj: EldritchInvocation;
  processing: boolean;
  child_names_valid: boolean;
  expanded_feature: Feature | null;
  eldritch_invocations: EldritchInvocation[] | null;
  loading: boolean;
}

class EldritchInvocationEdit extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirectTo: null,
      obj: new EldritchInvocation(),
      processing: false,
      child_names_valid: true,
      expanded_feature: null,
      eldritch_invocations: null,
      loading: false
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
    this.load();
  }

  submit() {
    this.setState({ processing: true }, () => {
      this.api.upsertObject("eldritch_invocation", this.state.obj).then((res: any) => {
        this.setState({ processing: false, redirectTo: "/beyond/eldritch_invocation" });
      });
    });
  }

  // Loads the editing EldritchInvocation into state
  load_object(id: string) {
    const objFinder = this.state.eldritch_invocations ? this.state.eldritch_invocations.filter(a => a._id === id) : [];
    if (objFinder.length === 1) {
      this.setState({ obj: objFinder[0].clone(), loading: false });
    }
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects("eldritch_invocation").then((res: any) => {
        if (res && !res.error) {
          let { id } = this.props.match.params;
          if (id !== undefined && this.state.obj._id !== id) {
            this.setState({ eldritch_invocations: res }, () => {
              this.load_object(id);
            });
          } else {
            this.setState({ eldritch_invocations: res, loading: false });
          }
        }
      });
    });
  }

  render() {
    if (this.state.loading || this.state.eldritch_invocations === null) {
      return <span>Loading</span>;
    } else if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else if (this.state.expanded_feature) {
      return (
        <FeatureInput
          label="Feature"
          parent_name={this.state.obj.name}
          base_name={null}
          feature={this.state.expanded_feature} 
          onChange={(changed: Feature) => {
            const obj = this.state.obj;
            const objFinder = obj.features.filter(o => o.id === changed.id);
            if (objFinder.length === 1) {
              const feature = objFinder[0];
              feature.copy(changed);
              this.setState({ obj });
            }
          }}
          onDelete={() => {
            if (this.state.expanded_feature) {
              const id = this.state.expanded_feature.id;
              const obj = this.state.obj;
              const features = obj.features.filter(o => o.id !== id);
              features.filter(o => o.id > id).forEach(o => {
                o.id--;
              });
              obj.features = features;
              this.setState({ expanded_feature: null, obj });
            }
          }}
          onDone={() => {
            let child_names_valid = true;
            for (let i = 0; i < this.state.obj.features.length; i++) {
              const fb = this.state.obj.features[i];
              if (fb.name === "") {
                child_names_valid = false;
                break;
              }
            }
            this.setState({ expanded_feature: null, child_names_valid });
          }}
        />
      );
    } else { 
      const formHeight = this.props.height - (this.props.width > 600 ? 220 : 220);
      return (
        <Grid container spacing={1} direction="column">
          <Grid item>
            <Tooltip title={`Back to Eldritch Invocations`}>
              <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                onClick={ () => {
                  this.setState({ redirectTo:`/beyond/eldritch_invocation` });
                }}>
                <ArrowBack/>
              </Fab>
            </Tooltip> 
          </Grid>
          <Grid item>
            <span className={"MuiTypography-root MuiListItemText-primary header"}>
              { this.state.obj._id === "" ? "Create Eldritch Invocation" : `Edit ${this.state.obj.name}` }
            </span>
          </Grid>
          <Grid item 
            style={{ 
              height: `${formHeight}px`, 
              overflowY: "scroll", 
              overflowX: "hidden" 
            }}>
            <Grid container spacing={1} direction="column">
              <ModelBaseInput 
                obj={this.state.obj}
                onChange={() => {
                  const obj = this.state.obj;
                  this.setState({ obj });
                }}
              />
              <Grid item>
                <SelectStringBox 
                  name="Minimum Warlock Level"
                  options={["0","5","7","9","12","15","18"]}
                  value={`${this.state.obj.level}`}
                  onChange={(value: string) => {
                    const obj = this.state.obj;
                    obj.level = +value;
                    this.setState({ obj });
                  }}
                /> 
              </Grid>
              <Grid item>
                <SelectPactBoonBox 
                  name="Pact Requirement"
                  allow_none
                  value={this.state.obj.pact}
                  onChange={(value: string) => {
                    const obj = this.state.obj;
                    obj.pact = value;
                    this.setState({ obj });
                  }}
                /> 
              </Grid>
              <Grid item>
                <FeatureListInput 
                  label="Feature"
                  features={this.state.obj.features} 
                  parent_id={this.state.obj._id} 
                  parent_type="EldritchInvocation"
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
                    feature.parent_type = "EldritchInvocation";
                    feature.parent_id = obj._id;
                    feature.id = obj.features.length;
                    obj.features.push(feature);
                    this.setState({
                      obj,
                      expanded_feature: feature
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
                this.setState({ redirectTo:`/beyond/eldritch_invocation` });
              }}>
              Cancel
            </Button>
            { (this.state.obj.name === "" || !this.state.child_names_valid) && 
              <span style={{ color: "red", marginLeft: "4px" }}>
                The Eldritch Invocation, all Feature Bases, Features, Feature Choices, and Options must have names.
              </span>
            }
          </Grid>
        </Grid>
      ); 
    }
  }
}

export default connector(EldritchInvocationEdit);
