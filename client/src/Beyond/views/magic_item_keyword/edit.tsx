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
  MagicItemKeyword, 
  FeatureBase
} from "../../models";
import StringBox from "../../components/input/StringBox";

import SelectStringBox from "../../components/input/SelectStringBox";
import CheckBox from "../../components/input/CheckBox";
import FeatureBasesInput from "../../components/model_inputs/feature/FeatureBases";
import FeatureBaseInput from "../../components/model_inputs/feature/FeatureBase";
import SelectArmorTypeBox from "../../components/model_inputs/select/SelectArmorTypeBox";
import SelectBaseItemBox from "../../components/model_inputs/select/SelectBaseItemBox";

import { 
  ITEM_TYPES
} from "../../models/Constants";
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
  obj: MagicItemKeyword;
  processing: boolean;
  expanded_feature_base: FeatureBase | null;
  child_names_valid: boolean;
  magic_item_keywords: MagicItemKeyword[] | null;
  loading: boolean;
}

class MagicItemKeywordEdit extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirectTo: null,
      obj: new MagicItemKeyword(),
      processing: false,
      expanded_feature_base: null,
      child_names_valid: true,
      magic_item_keywords: null,
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
        this.setState({ processing: false, redirectTo: "/beyond/magic_item_keyword" });
      });
    });
  }

  // Loads the editing MagicItemKeyword into state
  load_object(id: string) {
    const objFinder = this.state.magic_item_keywords ? this.state.magic_item_keywords.filter(a => a._id === id) : [];
    if (objFinder.length === 1) {
      this.setState({ obj: objFinder[0].clone() });
    }
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects("magic_item_keyword").then((res: any) => {
        if (res && !res.error) {
          this.setState({ magic_item_keywords: res, loading: false });
        }
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.magic_item_keywords === null) {
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
            <Grid item container spacing={1} direction="row">
              <Grid item xs={3}>
                <Tooltip title={`Back to Magic Item Keywords`}>
                  <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                    onClick={ () => {
                      this.setState({ redirectTo:`/beyond/magic_item_keyword` });
                    }}>
                    <ArrowBack/>
                  </Fab>
                </Tooltip> 
              </Grid>
            </Grid>
            <Grid item>
              <span className={"MuiTypography-root MuiListItemText-primary header"}>
                { this.state.obj._id === "" ? "Create Magic Item Keyword" : `Edit ${this.state.obj.name}` }
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
                    value={this.state.obj.name_formula} 
                    name="Name Formula"
                    onBlur={(value: string) => {
                      const obj = this.state.obj;
                      obj.name_formula = value;
                      this.setState({ obj });
                    }}
                  />
                </Grid>
                <Grid item>
                  <CheckBox 
                    value={this.state.obj.uses_specific} 
                    name="Use Specific Base Item"
                    onChange={(value: boolean) => {
                      const obj = this.state.obj;
                      obj.uses_specific = value;
                      this.setState({ obj });
                    }}
                  />
                </Grid>
                { !this.state.obj.uses_specific && 
                  <Grid item>
                    <SelectStringBox 
                      name="Item Type" 
                      options={["None",...ITEM_TYPES]}
                      value={this.state.obj.base_item_type} 
                      onChange={(value: string) => {
                        const obj = this.state.obj;
                        obj.base_item_type = value;
                        this.setState({ obj });
                      }} 
                    />
                  </Grid>
                }
                { !this.state.obj.uses_specific && this.state.obj.base_item_type === "Armor" &&
                  <Grid item>
                    <SelectArmorTypeBox 
                      name="Armor Types" 
                      multiple
                      values={this.state.obj.base_item_details} 
                      onChange={(values: string[]) => {
                        const obj = this.state.obj;
                        obj.base_item_details = values;
                        this.setState({ obj });
                      }} 
                    />
                  </Grid>
                }
                { this.state.obj.uses_specific && 
                  <Grid item>
                    <SelectBaseItemBox 
                      name="Base Item" 
                      value={this.state.obj.base_item_id ? this.state.obj.base_item_id : ""} 
                      onChange={(id: string) => {
                        const obj = this.state.obj;
                        obj.base_item_id = id;
                        this.setState({ obj });
                      }} 
                    />
                  </Grid>
                }
                <Grid item>
                  <StringBox 
                    value={this.state.obj.exclusions} 
                    name="Exclusions"
                    multiline
                    onBlur={(value: string) => {
                      const obj = this.state.obj;
                      obj.exclusions = value;
                      this.setState({ obj });
                    }}
                  />
                </Grid>
                <Grid item>
                  <SelectStringBox 
                    name="Rarity" 
                    options={["Common", "Uncommon", "Rare", "Very-Rare", "Legendary"]}
                    value={this.state.obj.rarity} 
                    onChange={(value: string) => {
                      const obj = this.state.obj;
                      obj.rarity = value;
                      this.setState({ obj });
                    }} 
                  />
                </Grid>
                <Grid item>
                  <CheckBox 
                    name="Requires Attunement" 
                    value={this.state.obj.attunement} 
                    onChange={(value: boolean) => {
                      const obj = this.state.obj;
                      obj.attunement = value;
                      this.setState({ obj });
                    }} 
                  />
                </Grid>
                <Grid item>
                  <FeatureBasesInput 
                    feature_bases={this.state.obj.features} 
                    parent_id={this.state.obj._id} 
                    parent_type="MagicItemKeyword"
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
                      feature_base.parent_type = "MagicItemKeyword";
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
                  this.setState({ redirectTo:`/beyond/magic_item_keyword` });
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

export default connector(MagicItemKeywordEdit);
