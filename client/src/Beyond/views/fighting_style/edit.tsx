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
  FightingStyle, Feature
} from "../../models";
import StringBox from "../../components/input/StringBox";
import FeatureListInput from "../../components/model_inputs/feature/FeatureList";
import FeatureInput from "../../components/model_inputs/feature/FeatureMain";

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
  obj: FightingStyle;
  processing: boolean;
  child_names_valid: boolean;
  expanded_feature: Feature | null;
  fighting_styles: FightingStyle[] | null;
  loading: boolean;
}

class FightingStyleEdit extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirectTo: null,
      obj: new FightingStyle(),
      processing: false,
      child_names_valid: true,
      expanded_feature: null,
      fighting_styles: null,
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
      this.api.upsertObject("fighting_style", this.state.obj).then((res: any) => {
        this.setState({ processing: false, redirectTo: "/beyond/fighting_style" });
      });
    });
  }

  // Loads the editing obj into state
  load_object(id: string) {
    const objFinder = this.state.fighting_styles ? this.state.fighting_styles.filter(a => a._id === id) : [];
    if (objFinder.length === 1) {
      this.setState({ obj: objFinder[0].clone(), loading: false });
    }
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects("fighting_style").then((res: any) => {
        if (res && !res.error) {
          let { id } = this.props.match.params;
          if (id !== undefined && this.state.obj._id !== id) {
            this.setState({ fighting_styles: res }, () => {
              this.load_object(id);
            });
          } else {
            this.setState({ fighting_styles: res, loading: false });
          }
        }
      });
    });
  }

  render() {
    if (this.state.loading || this.state.fighting_styles === null) {
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
      const formHeight = this.props.height - (this.props.width > 600 ? 198 : 198);
      return (
        <Grid container spacing={1} direction="column">
          <Grid item>
            <Tooltip title={`Back to Fighting Styles`}>
              <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                onClick={ () => {
                  this.setState({ redirectTo:`/beyond/fighting_style` });
                }}>
                <ArrowBack/>
              </Fab>
            </Tooltip> 
          </Grid>
          <Grid item>
            <span className={"MuiTypography-root MuiListItemText-primary header"}>
              { this.state.obj._id === "" ? "Create Fighting Style" : `Edit ${this.state.obj.name}` }
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
                <FeatureListInput 
                  label="Feature"
                  features={this.state.obj.features} 
                  parent_id={this.state.obj._id} 
                  parent_type="FightingStyle"
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
                    feature.parent_type = "FightingStyle";
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
                this.setState({ redirectTo:`/beyond/fighting_style` });
              }}>
              Cancel
            </Button>
            { (this.state.obj.name === "" || !this.state.child_names_valid) && 
              <span style={{ color: "red", marginLeft: "4px" }}>
                The Fighting Style, all Feature Bases, Features, Feature Choices, and Options must have names.
              </span>
            }
          </Grid>
        </Grid>
      ); 
    }
  }
}

export default connector(FightingStyleEdit);
