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
  Link,
} from "@material-ui/core";
import {  
  AbilityScores,
  Creature, 
  CreatureTemplate,
  TemplateBase,
  DamageMultiplier,
  CharacterSense,
  Feature,
  Skill,
  Tool,
  Condition,
  Sense,
} from "../../models";
import {
  DAMAGE_TYPES
} from "../../models/Constants";

import StringBox from "../../components/input/StringBox";
import ToggleButtonBox from "../../components/input/ToggleButtonBox";
import SelectStringBox from "../../components/input/SelectStringBox";

import CreatureAbilityScoresInput from "../../components/model_inputs/creature/CreatureAbilityScoresInput";
import FeatureListInput from "../../components/model_inputs/feature/FeatureList";
import FeatureInput from "../../components/model_inputs/feature/FeatureMain";

import TemplateBox from "../../components/model_inputs/TemplateBox";

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
  obj: Creature;
  processing: boolean;
  expanded_feature: Feature | null;
  child_names_valid: boolean;
  skills: Skill[] | null;
  tools: Tool[] | null;
  conditions: Condition[] | null;
  senses: Sense[] | null;
  mode: string;
  edit_attribute: string;
  loading: boolean;
}

class CreatureEdit extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirectTo: null,
      obj: new Creature(),
      processing: false,
      expanded_feature: null,
      child_names_valid: true,
      skills: null,
      tools: null,
      conditions: null,
      senses: null,
      mode: "main",
      edit_attribute: "",
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
      const obj = this.state.obj;
      this.api.upsertObject("creature", obj).then((res: any) => {
        this.setState({ processing: false, redirectTo: "/beyond/creature" });
      });
    });
  }

  // Loads the editing Creature into state
  load_object(id: string) {
    this.api.getFullObject("creature", id).then((res: any) => {
      if (res) {
        const obj = res;
        this.setState({ obj, loading: false });
      }
    });
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getSetOfObjects(["skill","tool","condition","sense"]).then((res: any) => {
        let { id } = this.props.match.params;
        if (id !== undefined && this.state.obj._id !== id) {
          this.setState({ 
            skills: res.skill,
            tools: res.tool,
            conditions: res.condition,
            senses: res.sense
          }, () => {
            this.load_object(id);
          });
        } else {
          this.setState({ 
            skills: res.skill,
            tools: res.tool,
            conditions: res.condition,
            senses: res.sense,
            loading: false 
          });
        }
      });
    });
  }

  render() {
    if (this.state.loading || this.state.skills === null) {
      return <span>Loading</span>;
    } else if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else { 
      const formHeight = this.props.height - (this.props.width > 600 ? 228 : 228);
      return (
        <Grid container spacing={1} direction="column">
          <Grid item container spacing={1} direction="row">
            <Grid item xs={3}>
              <Tooltip title={`Back to Creatures`}>
                <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                  onClick={ () => {
                    this.setState({ redirectTo:`/beyond/creature` });
                  }}>
                  <ArrowBack/>
                </Fab>
              </Tooltip> 
            </Grid>
          </Grid>
          <Grid item>
            <span className={"MuiTypography-root MuiListItemText-primary header"}>
              { this.state.obj._id === "" ? "Create Creature" : `Edit ${this.state.obj.name}` }
            </span>
          </Grid>
          <Grid item>
            <TemplateBox
              obj={this.state.obj}
              type="Creature"
              useTemplate={(template: TemplateBase) => {
                const the_template: CreatureTemplate = template as CreatureTemplate;
                const obj = this.state.obj;
                obj.copyTemplate(the_template);
                this.setState({ obj });
              }}
            />
          </Grid>
          <Grid item container spacing={1} direction="row">
            <Grid item xs={2}>
              <Link href="#" 
                style={{
                  borderBottom: `${this.state.mode === "main" ? "2px solid blue" : "none"}`
                }}
                onClick={(event: React.SyntheticEvent) => {
                  event.preventDefault();
                  this.setState({ mode: "main" });
                }}>
                Home
              </Link>
            </Grid>
            <Grid item xs={2}>
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
            <Grid item xs={2}>
              <Link href="#" 
                style={{
                  borderBottom: `${this.state.mode === "ability_scores" ? "2px solid blue" : "none"}`
                }}
                onClick={(event: React.SyntheticEvent) => {
                  event.preventDefault();
                  this.setState({ mode: "ability_scores" });
                }}>
                Ability Scores
              </Link>
            </Grid>
            <Grid item xs={2}>
              <Link href="#" 
                style={{
                  borderBottom: `${this.state.mode === "actions" ? "2px solid blue" : "none"}`
                }}
                onClick={(event: React.SyntheticEvent) => {
                  event.preventDefault();
                  this.setState({ mode: "actions" });
                }}>
                Actions
              </Link>
            </Grid>
            <Grid item xs={2}>
              <Link href="#" 
                style={{
                  borderBottom: `${this.state.mode === "legendary_actions" ? "2px solid blue" : "none"}`
                }}
                onClick={(event: React.SyntheticEvent) => {
                  event.preventDefault();
                  this.setState({ mode: "legendary_actions" });
                }}>
                Legendary Actions
              </Link>
            </Grid>
            <Grid item xs={2}>
              <Link href="#" 
                style={{
                  borderBottom: `${this.state.mode === "special_abilities" ? "2px solid blue" : "none"}`
                }}
                onClick={(event: React.SyntheticEvent) => {
                  event.preventDefault();
                  this.setState({ mode: "special_abilities" });
                }}>
                Special Abilities
              </Link>
            </Grid>
          </Grid>
          <Grid item 
            style={{ 
              height: `${formHeight}px`, 
              overflowY: "scroll", 
              overflowX: "hidden" 
            }}>
              { this.render_tab() }
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
                this.setState({ redirectTo:`/beyond/creature` });
              }}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      ); 
    }
  }

  render_tab() {
    if (this.state.mode === "ability_scores") {
      return (
        <CreatureAbilityScoresInput
          obj={this.state.obj}
          onChange={(changed: AbilityScores) => {
            const obj = this.state.obj;
            obj.ability_scores = changed;
            this.setState({ obj });
          }}
        />
      );
    } else if (this.state.mode === "attributes") {
      return this.render_attributes();
    } else if (this.state.mode === "actions") {
      if (this.state.expanded_feature) {
        return (
          <FeatureInput
            label="Action"
            parent_name={this.state.obj.name}
            base_name={null}
            feature={this.state.expanded_feature} 
            onChange={(changed: Feature) => {
              const obj = this.state.obj;
              const objFinder = obj.actions.filter(o => o.id === changed.id);
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
                const features = obj.actions.filter(o => o.id !== id);
                features.filter(o => o.id > id).forEach(o => {
                  o.id--;
                });
                obj.actions = features;
                this.setState({ expanded_feature: null, obj });
              }
            }}
            onDone={() => {
              let child_names_valid = true;
              for (let i = 0; i < this.state.obj.actions.length; i++) {
                const fb = this.state.obj.actions[i];
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
        return (
          <FeatureListInput 
            label="Action"
            features={this.state.obj.actions} 
            parent_id={this.state.obj._id} 
            parent_type="Creature"
            onChange={(changed: Feature[]) => {
              const obj = this.state.obj;
              obj.actions = [];
              this.setState({ obj }, () => {
                obj.actions = changed;
                this.setState({ obj });
              });
            }}
            onExpand={(expanded_feature: Feature) => {
              this.setState({ expanded_feature });
            }}
            onAdd={() => {
              const obj = this.state.obj;
              const feature = new Feature();
              feature.parent_type = "Creature";
              feature.parent_id = obj._id;
              feature.id = obj.actions.length;
              obj.actions.push(feature);
              this.setState({
                obj,
                expanded_feature: feature
              });
            }}
          />
        );
      }
    } else if (this.state.mode === "legendary_actions") {
      if (this.state.expanded_feature) {
        return (
          <FeatureInput
            label="Legendary Action"
            parent_name={this.state.obj.name}
            base_name={null}
            feature={this.state.expanded_feature} 
            onChange={(changed: Feature) => {
              const obj = this.state.obj;
              const objFinder = obj.legendary_actions.filter(o => o.id === changed.id);
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
                const features = obj.legendary_actions.filter(o => o.id !== id);
                features.filter(o => o.id > id).forEach(o => {
                  o.id--;
                });
                obj.legendary_actions = features;
                this.setState({ expanded_feature: null, obj });
              }
            }}
            onDone={() => {
              let child_names_valid = true;
              for (let i = 0; i < this.state.obj.legendary_actions.length; i++) {
                const fb = this.state.obj.legendary_actions[i];
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
        return (
          <FeatureListInput 
            label="Legendary Action"
            features={this.state.obj.legendary_actions} 
            parent_id={this.state.obj._id} 
            parent_type="Creature"
            onChange={(changed: Feature[]) => {
              const obj = this.state.obj;
              obj.legendary_actions = [];
              this.setState({ obj }, () => {
                obj.legendary_actions = changed;
                this.setState({ obj });
              });
            }}
            onExpand={(expanded_feature: Feature) => {
              this.setState({ expanded_feature });
            }}
            onAdd={() => {
              const obj = this.state.obj;
              const feature = new Feature();
              feature.parent_type = "Creature";
              feature.parent_id = obj._id;
              feature.id = obj.legendary_actions.length;
              obj.legendary_actions.push(feature);
              this.setState({
                obj,
                expanded_feature: feature
              });
            }}
          />
        );
      }
    } else if (this.state.mode === "special_abilities") {
      if (this.state.expanded_feature) {
        return (
          <FeatureInput
            label="Special Ability"
            parent_name={this.state.obj.name}
            base_name={null}
            feature={this.state.expanded_feature} 
            onChange={(changed: Feature) => {
              const obj = this.state.obj;
              const objFinder = obj.special_abilities.filter(o => o.id === changed.id);
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
                const features = obj.special_abilities.filter(o => o.id !== id);
                features.filter(o => o.id > id).forEach(o => {
                  o.id--;
                });
                obj.special_abilities = features;
                this.setState({ expanded_feature: null, obj });
              }
            }}
            onDone={() => {
              let child_names_valid = true;
              for (let i = 0; i < this.state.obj.special_abilities.length; i++) {
                const fb = this.state.obj.special_abilities[i];
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
        return (
          <FeatureListInput 
            label="Special Ability"
            plural="Special Abilities"
            features={this.state.obj.special_abilities} 
            parent_id={this.state.obj._id} 
            parent_type="Creature"
            onChange={(changed: Feature[]) => {
              const obj = this.state.obj;
              obj.special_abilities = [];
              this.setState({ obj }, () => {
                obj.special_abilities = changed;
                this.setState({ obj });
              });
            }}
            onExpand={(expanded_feature: Feature) => {
              this.setState({ expanded_feature });
            }}
            onAdd={() => {
              const obj = this.state.obj;
              const feature = new Feature();
              feature.parent_type = "Creature";
              feature.parent_id = obj._id;
              feature.id = obj.special_abilities.length;
              obj.special_abilities.push(feature);
              this.setState({
                obj,
                expanded_feature: feature
              });
            }}
          />
        );
      }
    } else {
      return (
        <Grid container spacing={1} direction="row">
          <Grid item xs={4}>
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
          <Grid item xs={4}>
            <StringBox 
              value={this.state.obj.creature_type} 
              name="Type"
              onBlur={(value: string) => {
                const obj = this.state.obj;
                obj.creature_type = value;
                this.setState({ obj });
              }}
            />
          </Grid>
          <Grid item xs={4} container spacing={1} direction="row">
            <Grid item xs={6}>
              <StringBox
                name="Hit Dice Count"
                type="number"
                value={`${this.state.obj.hit_dice.count}`} 
                onBlur={(value: string) => {
                  const obj = this.state.obj;
                  obj.hit_dice.count = +value;
                  this.setState({ obj });
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <SelectStringBox 
                options={["d6","d8","d10","d12"]}
                value={`d${this.state.obj.hit_dice.size}`} 
                name="Hit Dice Size"
                onChange={(value: string) => {
                  const obj = this.state.obj;
                  obj.hit_dice.size = +value;
                  this.setState({ obj });
                }}
              />
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <ModelBaseDetails key="description"
              obj={this.state.obj}
              no_grid
              onChange={() => {
                const obj = this.state.obj;
                this.setState({ obj });
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <StringBox 
              value={this.state.obj.subtype} 
              name="Subtype"
              onBlur={(value: string) => {
                const obj = this.state.obj;
                obj.subtype = value;
                this.setState({ obj });
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <StringBox 
              value={`${this.state.obj.max_hit_points}`} 
              name="Max Hit Points"
              type="number"
              onBlur={(value: string) => {
                const obj = this.state.obj;
                obj.max_hit_points = +value;
                this.setState({ obj });
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <StringBox 
              value={`${this.state.obj.challenge_rating}`} 
              name="Challenge Rating"
              type="number"
              onBlur={(value: string) => {
                const obj = this.state.obj;
                obj.challenge_rating = +value;
                this.setState({ obj });
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <StringBox 
              value={`${this.state.obj.initiative_modifier}`} 
              name="Initiative Modifier"
              type="number"
              onBlur={(value: string) => {
                const obj = this.state.obj;
                obj.initiative_modifier = +value;
                this.setState({ obj });
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <StringBox 
              value={`${this.state.obj.armor_class}`} 
              name="Armor Class"
              type="number"
              onBlur={(value: string) => {
                const obj = this.state.obj;
                obj.armor_class = +value;
                this.setState({ obj });
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <StringBox 
              value={`${this.state.obj.xp}`} 
              name="Exp. Points"
              type="number"
              onBlur={(value: string) => {
                const obj = this.state.obj;
                obj.xp = +value;
                this.setState({ obj });
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <SelectStringBox 
              options={["Tiny","Small","Medium","Large","Huge","Gargantuan"]}
              value={this.state.obj.size} 
              name="Size"
              onChange={(value: string) => {
                const obj = this.state.obj;
                obj.size = value;
                this.setState({ obj });
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <SelectStringBox 
              options={[
                "Lawful Good",
                "Lawful Neutral",
                "Lawful Evil",
                "Neutral Good",
                "Neutral",
                "Neutral Evil",
                "Chaotic Good",
                "Chaotic Neutral",
                "Chaotic Evil",
                "Any Alignment",
                "Any Chaotic Alignment",
                "Any Evil Alignment",
                "Any Non-good Alignment",
                "Any Non-lawful Alignment",
                "Unaligned",
                "Neutral Good (50%) Or Neutral Evil (50%)"
              ]}
              value={this.state.obj.alignment} 
              name="Alignment"
              onChange={(value: string) => {
                const obj = this.state.obj;
                obj.alignment = value;
                this.setState({ obj });
              }}
            />
          </Grid>
        </Grid>
      ); 
    }
  }

  render_attributes() {
    if (this.state.edit_attribute === "speed") {
      return (
        <Grid container spacing={1} direction="row">
          <Grid item xs={2} style={{ cursor: "pointer", fontWeight: "bold" }} 
            onClick={() => {
              this.setState({ edit_attribute: "" });
            }}>
            Back
          </Grid>
          <Grid item xs={10}>
            Speed
          </Grid>
          { this.renderSpeeds() }
        </Grid>
      );
    } else if (this.state.edit_attribute === "senses") {
      return (
        <Grid container spacing={1} direction="row">
          <Grid item xs={2} style={{ cursor: "pointer", fontWeight: "bold" }} 
            onClick={() => {
              this.setState({ edit_attribute: "" });
            }}>
            Back
          </Grid>
          <Grid item xs={10}>
            Senses
          </Grid>
          { this.renderSenses() }
        </Grid>
      );
    } else if (this.state.edit_attribute === "condition_immunities") {
      return (
        <Grid container spacing={1} direction="row">
          <Grid item xs={2} style={{ cursor: "pointer", fontWeight: "bold" }} 
            onClick={() => {
              this.setState({ edit_attribute: "" });
            }}>
            Back
          </Grid>
          <Grid item xs={10}>
            Condition Immunities
          </Grid>
          { this.state.conditions && this.state.conditions.map((condition, key) => {
            return this.renderCondition(condition, key);
          })}
        </Grid>
      );
    } else if (this.state.edit_attribute === "immunities") {
      return (
        <Grid container spacing={1} direction="row">
          <Grid item xs={2} style={{ cursor: "pointer", fontWeight: "bold" }} 
            onClick={() => {
              this.setState({ edit_attribute: "" });
            }}>
            Back
          </Grid>
          <Grid item xs={10}>
            Damage Immunities
          </Grid>
          { DAMAGE_TYPES.map((damage_type, key) => {
            return this.renderDamageType(damage_type, key, 0);
          })}
        </Grid>
      );
    } else if (this.state.edit_attribute === "resistances") {
      return (
        <Grid container spacing={1} direction="row">
          <Grid item xs={2} style={{ cursor: "pointer", fontWeight: "bold" }} 
            onClick={() => {
              this.setState({ edit_attribute: "" });
            }}>
            Back
          </Grid>
          <Grid item xs={10}>
            Damage Resistances
          </Grid>
          { DAMAGE_TYPES.map((damage_type, key) => {
            return this.renderDamageType(damage_type, key, 0.5);
          })}
        </Grid>
      );
    } else if (this.state.edit_attribute === "vulnerabilities") {
      return (
        <Grid container spacing={1} direction="row">
          <Grid item xs={2} style={{ cursor: "pointer", fontWeight: "bold" }} 
            onClick={() => {
              this.setState({ edit_attribute: "" });
            }}>
            Back
          </Grid>
          <Grid item xs={10}>
            Damage Vulnerabilities
          </Grid>
          { DAMAGE_TYPES.map((damage_type, key) => {
            return this.renderDamageType(damage_type, key, 2);
          })}
        </Grid>
      );
    } else if (this.state.edit_attribute === "tools") {
      return (
        <Grid container spacing={1} direction="row">
          <Grid item xs={2} style={{ cursor: "pointer", fontWeight: "bold" }} 
            onClick={() => {
              this.setState({ edit_attribute: "" });
            }}>
            Back
          </Grid>
          <Grid item xs={10}>
            Tools
          </Grid>
          { this.state.tools && this.state.tools.map((tool, key) => {
            return this.renderTool(tool, key);
          })}
        </Grid>
      );
    } else if (this.state.edit_attribute === "skills") {
      return (
        <Grid container spacing={1} direction="row">
          <Grid item xs={2} style={{ cursor: "pointer", fontWeight: "bold" }} 
            onClick={() => {
              this.setState({ edit_attribute: "" });
            }}>
            Back
          </Grid>
          <Grid item xs={10}>
            Skills
          </Grid>
          { this.state.skills && this.state.skills.map((skill, key) => {
            return this.renderSkill(skill, key);
          })}
        </Grid>
      );
    } else if (this.state.edit_attribute === "saving_throws") {
      return (
        <Grid container spacing={1} direction="row">
          <Grid item xs={2} style={{ cursor: "pointer", fontWeight: "bold" }} 
            onClick={() => {
              this.setState({ edit_attribute: "" });
            }}>
            Back
          </Grid>
          <Grid item xs={10}>
            Saving Throws
          </Grid>
          <Grid item xs={4}>
            <StringBox 
              name="STR"
              value={ this.state.obj.saving_throws["STR"] ? `${this.state.obj.saving_throws["STR"]}` : "" }
              type="number"
              onBlur={(value: string) => {
                const obj = this.state.obj;
                if (value === "") {
                  delete obj.saving_throws["STR"];
                } else {
                  obj.saving_throws["STR"] = +value;
                }
                this.setState({ obj });
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <StringBox 
              name="DEX"
              value={ this.state.obj.saving_throws["DEX"] ? `${this.state.obj.saving_throws["DEX"]}` : "" }
              type="number"
              onBlur={(value: string) => {
                const obj = this.state.obj;
                if (value === "") {
                  delete obj.saving_throws["DEX"];
                } else {
                  obj.saving_throws["DEX"] = +value;
                }
                this.setState({ obj });
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <StringBox 
              name="CON"
              value={ this.state.obj.saving_throws["CON"] ? `${this.state.obj.saving_throws["CON"]}` : "" }
              type="number"
              onBlur={(value: string) => {
                const obj = this.state.obj;
                if (value === "") {
                  delete obj.saving_throws["CON"];
                } else {
                  obj.saving_throws["CON"] = +value;
                }
                this.setState({ obj });
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <StringBox 
              name="INT"
              value={ this.state.obj.saving_throws["INT"] ? `${this.state.obj.saving_throws["INT"]}` : "" }
              type="number"
              onBlur={(value: string) => {
                const obj = this.state.obj;
                if (value === "") {
                  delete obj.saving_throws["INT"];
                } else {
                  obj.saving_throws["INT"] = +value;
                }
                this.setState({ obj });
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <StringBox 
              name="WIS"
              value={ this.state.obj.saving_throws["WIS"] ? `${this.state.obj.saving_throws["WIS"]}` : "" }
              type="number"
              onBlur={(value: string) => {
                const obj = this.state.obj;
                if (value === "") {
                  delete obj.saving_throws["WIS"];
                } else {
                  obj.saving_throws["WIS"] = +value;
                }
                this.setState({ obj });
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <StringBox 
              name="CHA"
              value={ this.state.obj.saving_throws["CHA"] ? `${this.state.obj.saving_throws["CHA"]}` : "" }
              type="number"
              onBlur={(value: string) => {
                const obj = this.state.obj;
                if (value === "") {
                  delete obj.saving_throws["CHA"];
                } else {
                  obj.saving_throws["CHA"] = +value;
                }
                this.setState({ obj });
              }}
            />
          </Grid>
        </Grid>
      );
    } else if (this.state.edit_attribute === "languages") {
      return (
        <Grid container spacing={1} direction="row">
          <Grid item xs={2} style={{ cursor: "pointer", fontWeight: "bold" }} 
            onClick={() => {
              this.setState({ edit_attribute: "" });
            }}>
            Back
          </Grid>
          <Grid item xs={10}>
            Languages
          </Grid>
          <Grid item xs={12}>
            <StringBox
              name="Languages"
              value={this.state.obj.languages}
              onBlur={(value: string) => {
                const obj = this.state.obj;
                obj.languages = value;
                this.setState({ obj });
              }}
            />
          </Grid>
        </Grid>
      );
    } else {
      return (
        <Grid container spacing={1} direction="column" style={{ cursor: "pointer" }}>
          <Grid item onClick={() => {
            this.setState({ edit_attribute: "speed" });
          }}>
            <b>Speed</b> { this.state.obj.speed_string }
          </Grid>
          <Grid item onClick={() => {
            this.setState({ edit_attribute: "senses" });
          }}>
            <b>Senses</b> { this.state.obj.senses_string }
          </Grid>
          <Grid item onClick={() => {
            this.setState({ edit_attribute: "immunities" });
          }}>
            <b>Damage Immunities</b> { this.state.obj.immunities_string }
          </Grid>
          <Grid item onClick={() => {
            this.setState({ edit_attribute: "resistances" });
          }}>
            <b>Damage Resistances</b> { this.state.obj.resistances_string }
          </Grid>
          <Grid item onClick={() => {
            this.setState({ edit_attribute: "vulnerabilities" });
          }}>
            <b>Damage Vulnerabilities</b> { this.state.obj.vulnerabilities_string }
          </Grid>
          <Grid item onClick={() => {
            this.setState({ edit_attribute: "condition_immunities" });
          }}>
            <b>Condition Immunities</b> { this.state.obj.condition_immunities_string }
          </Grid>
          <Grid item onClick={() => {
            this.setState({ edit_attribute: "tools" });
          }}>
            <b>Tools</b> { this.state.obj.tools_string }
          </Grid>
          <Grid item onClick={() => {
            this.setState({ edit_attribute: "skills" });
          }}>
            <b>Skills</b> { this.state.obj.skills_string }
          </Grid>
          <Grid item onClick={() => {
            this.setState({ edit_attribute: "saving_throws" });
          }}>
            <b>Saving Throws</b> { this.state.obj.saving_throws_string }
          </Grid>
          <Grid item onClick={() => {
            this.setState({ edit_attribute: "languages" });
          }}>
            <b>Languages</b> { this.state.obj.languages }
          </Grid>
        </Grid>
      );
    }
  }

  renderSpeeds() {
    const return_me: any[] = [];
    return_me.push(this.renderSpeed(this.state.obj.speed.walk, "walk", "Walk (in feet)"));
    return_me.push(this.renderSpeed(this.state.obj.speed.swim, "swim", "Swim (in feet)"));
    return_me.push(this.renderSpeed(this.state.obj.speed.climb, "climb", "Climb (in feet)"));
    return_me.push(this.renderSpeed(this.state.obj.speed.fly, "fly", "Fly (in feet)"));
    return_me.push(this.renderSpeed(this.state.obj.speed.burrow, "burrow", "Burrow (in feet)"));
    return_me.push(  
      <Grid item key="hover" xs={4}>
        <ToggleButtonBox
          name="Hover"
          value={ this.state.obj.speed.hover === 1 }
          onToggle={() => {
            const obj = this.state.obj;
            if (this.state.obj.speed.hover === 1) {
              obj.speed.hover = 0;
            } else {
              obj.speed.hover = 1;
            }
            this.setState({ obj });
          }}
        />
      </Grid>
    );
    return return_me;
  }

  renderSpeed(speed: number, name: string, display: string) {
    return (
      <Grid item key={name} xs={4}>
        <StringBox
          name={ display }
          value={ speed > 0 ? `${speed}` : "" }
          type="number"
          onBlur={(value: string) => {
            const obj = this.state.obj;
            if (value === "") {
              obj.speed[name] = 0;
            } else {
              obj.speed[name] = +value;
            }
            this.setState({ obj });
          }}
        />
      </Grid>
    );
  }

  renderSenses() {
    const return_me: any[] = [];
    let sense_finder = this.state.obj.senses.filter(o => o.name === "Darkvision");
    let darkvision: CharacterSense | null = null;
    if (sense_finder.length === 1) {
      darkvision = sense_finder[0];
    }
    return_me.push(this.renderSense(darkvision, "Darkvision"));
    sense_finder = this.state.obj.senses.filter(o => o.name === "Blind Sight");
    let blind_sight: CharacterSense | null = null;
    if (sense_finder.length === 1) {
      blind_sight = sense_finder[0];
    }
    return_me.push(this.renderSense(blind_sight, "Blind Sight"));
    sense_finder = this.state.obj.senses.filter(o => o.name === "True Sight");
    let true_sight: CharacterSense | null = null;
    if (sense_finder.length === 1) {
      true_sight = sense_finder[0];
    }
    return_me.push(this.renderSense(true_sight, "True Sight"));
    sense_finder = this.state.obj.senses.filter(o => o.name === "Tremor Sense");
    let tremor_sense: CharacterSense | null = null;
    if (sense_finder.length === 1) {
      tremor_sense = sense_finder[0];
    }
    return_me.push(this.renderSense(tremor_sense, "Tremor Sense"));
    sense_finder = this.state.obj.senses.filter(o => o.name === "Devil's Sight");
    let devils_sight: CharacterSense | null = null;
    if (sense_finder.length === 1) {
      devils_sight = sense_finder[0];
    }
    return_me.push(this.renderSense(devils_sight, "Devil's Sight"));
    return_me.push(this.renderPassive(this.state.obj.passives.passive_perception, "passive_perception", "Passive Perception"));
    return_me.push(this.renderPassive(this.state.obj.passives.passive_insight, "passive_insight", "Passive Insight"));
    return_me.push(this.renderPassive(this.state.obj.passives.passive_investigation, "passive_investigation", "Passive Investigation"));
    return return_me;
  }

  renderSense(sense: CharacterSense | null, name: string) {
    return (
      <Grid item key={name} xs={4}>
        <StringBox
          name={ `${name} (in feet)` }
          value={ sense ? `${sense.range}` : "" }
          type="number"
          onBlur={(value: string) => {
            const obj = this.state.obj;
            if (value === "") {
              obj.senses = obj.senses.filter(o => o.name !== name);
            } else {
              const obj_finder = obj.senses.filter(o => o.name === name);
              if (obj_finder.length === 1) {
                const old_sense = obj_finder[0];
                old_sense.range = +value;
              } else {
                const new_sense = new CharacterSense();
                new_sense.name = name;
                new_sense.range = +value;
                obj.senses.push(new_sense);
              }
            }
            this.setState({ obj });
          }}
        />
      </Grid>
    );
  }

  renderPassive(passive: number | null, name: string, display: string) {
    return (
      <Grid item key={name} xs={4}>
        <StringBox
          name={ display }
          value={ passive ? `${passive}` : "" }
          type="number"
          onBlur={(value: string) => {
            const obj = this.state.obj;
            if (value === "") {
              delete obj.passives[name];
            } else {
              obj.passives[name] = +value;
            }
            this.setState({ obj });
          }}
        />
      </Grid>
    );
  }
  
  renderSkill(skill: Skill, key: number) {
    return (
      <Grid item xs={4} key={key} container spacing={0} direction="row">
        <StringBox
          name={ skill.name }
          value={ this.state.obj.skill_proficiencies[skill.name] ? `${this.state.obj.skill_proficiencies[skill.name]}` : "" }
          type="number"
          onBlur={(value: string) => {
            const obj = this.state.obj;
            if (value === "") {
              delete obj.skill_proficiencies[skill.name];
            } else {
              obj.skill_proficiencies[skill.name] = +value;
            }
            this.setState({ obj });
          }}
        />
      </Grid>
    );
  }
  
  renderTool(tool: Tool, key: number) {
    return (
      <Grid item xs={4} key={key} container spacing={0} direction="row">
        <StringBox
          name={ tool.name }
          value={ this.state.obj.tool_proficiencies[tool.name] ? `${this.state.obj.tool_proficiencies[tool.name]}` : "" }
          type="number"
          onBlur={(value: string) => {
            const obj = this.state.obj;
            if (value === "") {
              delete obj.tool_proficiencies[tool.name];
            } else {
              obj.tool_proficiencies[tool.name] = +value;
            }
            this.setState({ obj });
          }}
        />
      </Grid>
    );
  }
  
  renderCondition(condition: Condition, key: number) {
    return (
      <Grid item xs={4} key={key} container spacing={0} direction="row">
        <ToggleButtonBox
          name={ condition.name }
          value={ this.state.obj.condition_immunities.includes(condition.name) }
          onToggle={() => {
            const obj = this.state.obj;
            if (this.state.obj.condition_immunities.includes(condition.name)) {
              obj.condition_immunities = this.state.obj.condition_immunities.filter(o => o !== condition.name);
            } else {
              obj.condition_immunities.push(condition.name);
            }
            this.setState({ obj });
          }}
        />
      </Grid>
    );
  }
  
  renderDamageType(damage_type: string, key: number, multiplier: number) {
    return (
      <Grid item xs={4} key={key} container spacing={0} direction="row">
        <ToggleButtonBox
          name={ damage_type }
          value={ this.state.obj.damage_multipliers.filter(o => o.multiplier === multiplier && o.damage_types.includes(damage_type)).length > 0 }
          onToggle={() => {
            const obj = this.state.obj;
            if (obj.damage_multipliers.filter(o => o.multiplier === multiplier && o.damage_types.includes(damage_type)).length > 0) {
              obj.damage_multipliers = obj.damage_multipliers.filter(o => o.multiplier !== multiplier || !o.damage_types.includes(damage_type));
            } else {
              const damage_multiplier = new DamageMultiplier();
              damage_multiplier.multiplier = multiplier;
              damage_multiplier.damage_types.push(damage_type);
              obj.damage_multipliers.push(damage_multiplier);
            }
            this.setState({ obj });
          }}
        />
      </Grid>
    );
  }
}

export default connector(CreatureEdit);
