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
  FeatureBase
} from "../../models";

import StringBox from "../../components/input/StringBox";

import FeatureBasesInput from "../../components/model_inputs/feature/FeatureBases";
import FeatureBaseInput from "../../components/model_inputs/feature/FeatureBase";

import ModelBaseInput from "../../components/model_inputs/ModelBaseInput";

import API from "../../utilities/smart_api";
import { APIClass } from "../../utilities/smart_api_class";


interface AppState {
  source_book: string;
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
  source_book: state.app.source_book,
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
    const obj = new SpecialFeature();
    obj.type = props.special_feature_type;
    if (this.props.source_book !== "Any") {
      obj.source_id = this.props.source_book;
    }
    this.state = {
      redirectTo: null,
      obj,
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
    this.load();
  }

  submit() {
    this.setState({ processing: true }, () => {
      this.api.upsertObject("special_feature", this.state.obj).then((res: any) => {
        this.setState({ processing: false, redirectTo: "/beyond/special_feature" });
      });
    });
  }

  // Loads the editing obj into state
  load_object(id: string) {
    const objFinder = this.state.special_features ? this.state.special_features.filter(a => a._id === id) : [];
    if (objFinder.length === 1) {
      this.setState({ obj: objFinder[0].clone(), loading: false });
    }
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects("special_feature").then((res: any) => {
        if (res && !res.error) {
          let { id } = this.props.match.params;
          if (id !== undefined && this.state.obj._id !== id) {
            this.setState({ special_features: res }, () => {
              this.load_object(id);
            });
          } else {
            this.setState({ special_features: res, loading: false });
          }
        }
      });
    });
  }

  render() {
    if (this.state.loading || this.state.special_features === null) {
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
              const true_id = this.state.expanded_feature_base.true_id;
              const obj = this.state.obj;
              obj.features = obj.features.filter(o => o.true_id !== true_id);
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
      const formHeight = this.props.height - (this.props.width > 600 ? 220 : 220);
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
              <ModelBaseInput 
                obj={this.state.obj}
                onChange={() => {
                  const obj = this.state.obj;
                  this.setState({ obj });
                }}
              />
              <Grid item>
                <StringBox 
                  value={this.state.obj.type} 
                  name="Type"
                  onBlur={(value: string) => {
                    const obj = this.state.obj;
                    obj.type = value;
                    this.props.setSpecialFeatureType(value);
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

export default connector(SpecialFeatureEdit);
