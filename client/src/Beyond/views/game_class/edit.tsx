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
  GameClass, FeatureBase, StartEquipmentChoice
} from "../../models";
import { 
  ABILITY_SCORES 
} from "../../models/Constants";

import StringBox from "../../components/input/StringBox";
import SelectStringBox from "../../components/input/SelectStringBox";

import FeatureBasesInput from "../../components/model_inputs/feature/FeatureBases";
import FeatureBaseInput from "../../components/model_inputs/feature/FeatureBase";
import StartEquipmentChoices from "../../components/model_inputs/equipment/StartEquipmentChoices";

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
  obj: GameClass;
  processing: boolean;
  child_names_valid: boolean;
  expanded_feature_base: FeatureBase | null;
  game_classes: GameClass[] | null;
  loading: boolean;
  mode: string;
}

class GameClassEdit extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirectTo: null,
      obj: new GameClass(),
      processing: false,
      child_names_valid: true,
      expanded_feature_base: null,
      game_classes: null,
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
      this.api.upsertObject("game_class", this.state.obj).then((res: any) => {
        this.setState({ processing: false, redirectTo: "/beyond/game_class" });
      });
    });
  }

  // Loads the editing obj into state
  load_object(id: string) {
    const objFinder = this.state.game_classes ? this.state.game_classes.filter(a => a._id === id) : [];
    if (objFinder.length === 1) {
      this.setState({ obj: objFinder[0].clone(), loading: false });
    }
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects("game_class").then((res: any) => {
        if (res && !res.error) {
          let { id } = this.props.match.params;
          if (id !== undefined && this.state.obj._id !== id) {
            this.setState({ game_classes: res }, () => {
              this.load_object(id);
            });
          } else {
            this.setState({ game_classes: res, loading: false });
          }
        }
      });
    });
  }

  render() {
    if (this.state.loading || this.state.game_classes === null) {
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
      const formHeight = this.props.height - (this.props.width > 600 ? 198 : 198);
      return (
        <Grid container spacing={1} direction="column">
          <Grid item>
            <Tooltip title={`Back to Classes`}>
              <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                onClick={ () => {
                  this.setState({ redirectTo:`/beyond/game_class` });
                }}>
                <ArrowBack/>
              </Fab>
            </Tooltip> 
          </Grid>
          <Grid item>
            <span className={"MuiTypography-root MuiListItemText-primary header"}>
              { this.state.obj._id === "" ? "Create Class" : `Edit ${this.state.obj.name}` }
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
                <Grid item xs={3}>
                  <Link href="#" 
                    style={{
                      borderBottom: `${this.state.mode === "attributes" ? "2px solid blue" : "none"}`
                    }}
                    onClick={(event: React.SyntheticEvent) => {
                      event.preventDefault();
                      this.setState({ mode: "attributes" });
                    }}>
                    Attributes
                  </Link>
                </Grid>
                <Grid item xs={3}>
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
                <Grid item xs={3}>
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
                this.setState({ redirectTo:`/beyond/game_class` });
              }}>
              Cancel
            </Button>
            { (this.state.obj.name === "" || !this.state.child_names_valid) && 
              <span style={{ color: "red", marginLeft: "4px" }}>
                The Class, all Feature Bases, Features, Feature Choices, and Options must have names.
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
    } else if (this.state.mode === "attributes") {
      return (
        <Grid item container spacing={1} direction="column">
          <Grid item>
            <SelectStringBox 
              options={[...ABILITY_SCORES, "STR or DEX"]}
              value={this.state.obj.primary_ability} 
              name="Primary Ability"
              onChange={(value: string) => {
                const obj = this.state.obj;
                obj.primary_ability = value;
                this.setState({ obj });
              }}
            />
          </Grid>
          <Grid item>
            <SelectStringBox 
              options={[...ABILITY_SCORES,"None"]}
              value={this.state.obj.secondary_ability} 
              name="Secondary Ability"
              onChange={(value: string) => {
                const obj = this.state.obj;
                obj.secondary_ability = value;
                this.setState({ obj });
              }}
            />
          </Grid>
          <Grid item>
            <SelectStringBox 
              options={["d6","d8","d10","d12"]}
              value={`d${this.state.obj.hit_die}`} 
              name="Hit Die"
              onChange={(value: string) => {
                const obj = this.state.obj;
                let hit_die: number = +(value.substring(1));
                obj.hit_die = hit_die;
                this.setState({ obj });
              }}
            />
          </Grid>
          <Grid item>
            <SelectStringBox 
              options={["1","2","3"]}
              value={`${this.state.obj.subclass_level}`} 
              name="Subclass Level"
              onChange={(value: string) => {
                const obj = this.state.obj;
                let subclass_level: number = +value;
                obj.subclass_level = subclass_level;
                this.setState({ obj });
              }}
            />
          </Grid>
          <Grid item>
            <StringBox 
              value={this.state.obj.subclasses_called} 
              name="Subclasses Called"
              onBlur={(value: string) => {
                const obj = this.state.obj;
                obj.subclasses_called = value;
                this.setState({ obj });
              }}
            />
          </Grid>
          <Grid item>
            <StringBox 
              value={this.state.obj.subclass_description} 
              name="Subclass Description"
              multiline
              onBlur={(value: string) => {
                const obj = this.state.obj;
                obj.subclass_description = value;
                this.setState({ obj });
              }}
            />
          </Grid>
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

export default connector(GameClassEdit);
