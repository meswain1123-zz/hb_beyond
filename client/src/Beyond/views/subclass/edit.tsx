import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Redirect } from "react-router-dom";
import {
  ArrowBack
} from "@material-ui/icons";
import {
  Grid, 
  Link,
  Button, 
  Tooltip, Fab,
} from "@material-ui/core";
import { 
  Subclass, FeatureBase
} from "../../models";

import StringBox from "../../components/input/StringBox";

import FeatureBasesInput from "../../components/model_inputs/feature/FeatureBases";
import FeatureBaseInput from "../../components/model_inputs/feature/FeatureBase";

import ModelBaseDetails from "../../components/model_inputs/ModelBaseDetails";

import SelectGameClassBox from "../../components/model_inputs/select/SelectGameClassBox";

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
  obj: Subclass;
  processing: boolean;
  child_names_valid: boolean;
  expanded_feature_base: FeatureBase | null;
  subclasses: Subclass[] | null;
  loading: boolean;
  mode: string;
}

class SubclassEdit extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirectTo: null,
      obj: new Subclass(),
      processing: false,
      child_names_valid: true,
      expanded_feature_base: null,
      subclasses: null,
      loading: false,
      mode: "description"
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
    this.load();
  }

  submit() {
    this.setState({ processing: true }, () => {
      this.api.upsertObject("subclass", this.state.obj).then((res: any) => {
        this.setState({ processing: false, redirectTo: "/beyond/subclass" });
      });
    });
  }

  // Loads the editing obj into state
  load_object(id: string) {
    const objFinder = this.state.subclasses ? this.state.subclasses.filter(a => a._id === id) : [];
    if (objFinder.length === 1) {
      this.setState({ obj: objFinder[0].clone(), loading: false });
    }
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects("subclass").then((res: any) => {
        if (res && !res.error) {
          let { id } = this.props.match.params;
          if (id !== undefined && this.state.obj._id !== id) {
            this.setState({ subclasses: res }, () => {
              this.load_object(id);
            });
          } else {
            this.setState({ subclasses: res, loading: false });
          }
        }
      });
    });
  }

  render() {
    if (this.state.loading || this.state.subclasses === null) {
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
      const formHeight = this.props.height - (this.props.width > 600 ? 220 : 220);
      return (
        <Grid container spacing={1} direction="column">
          <Grid item>
            <Tooltip title={`Back to Subclasses`}>
              <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                onClick={ () => {
                  this.setState({ redirectTo:`/beyond/subclass` });
                }}>
                <ArrowBack/>
              </Fab>
            </Tooltip> 
          </Grid>
          <Grid item>
            <span className={"MuiTypography-root MuiListItemText-primary header"}>
              { this.state.obj._id === "" ? "Create Subclass" : `Edit ${this.state.obj.name}` }
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
                <SelectGameClassBox 
                  value={ this.state.obj.game_class_id ? this.state.obj.game_class_id : "" } 
                  name="Class"
                  onChange={(id: string) => {
                    const obj = this.state.obj;
                    obj.game_class_id = id;
                    this.setState({ obj });
                  }}
                />
              </Grid>
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
                <Grid item xs={6}>
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
                <Grid item xs={6}>
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
              </Grid>
              { this.renderTab() }
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
                this.setState({ redirectTo:`/beyond/subclass` });
              }}>
              Cancel
            </Button>
            { (this.state.obj.name === "" || !this.state.child_names_valid) && 
              <span style={{ color: "red", marginLeft: "4px" }}>
                The Subclass, all Feature Bases, Features, Feature Choices, and Options must have names.
              </span>
            }
          </Grid>
        </Grid>
      );
    }
  }

  renderTab() {
    if (this.state.mode === "description") {
      return (
        <ModelBaseDetails key="description"
          obj={this.state.obj}
          onChange={() => {
            const obj = this.state.obj;
            this.setState({ obj });
          }}
        />
      );
    } else if (this.state.mode === "features") {
      return (
        <Grid item>
          <FeatureBasesInput 
            feature_bases={this.state.obj.features} 
            parent_id={this.state.obj._id} 
            parent_type="Subclass"
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
              feature_base.parent_type = "Subclass";
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
    }
    return null;
  }
}

export default connector(SubclassEdit);
