import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  Grid, 
  Link,
} from "@material-ui/core";
import {  
  AbilityScores,
  SummonStatBlock, 
  SummonStatBlockTemplate,
  TemplateBase,
  DamageMultiplier,
  CharacterSense,
  Feature,
  Skill,
  Tool,
  Condition,
  Sense,
  UpgradableNumber
} from "../../../models";
import {
  DAMAGE_TYPES
} from "../../../models/Constants";

import StringBox from "../../input/StringBox";
import ToggleButtonBox from "../../input/ToggleButtonBox";
import SelectStringBox from "../../input/SelectStringBox";
import UpgradableNumberBox from "../../input/UpgradableNumberBox";

import CreatureAbilityScoresInput from "../creature/CreatureAbilityScoresInput";
import FeatureListInput from "./FeatureList";
import FeatureInput from "./FeatureMain";

import TemplateBox from "../TemplateBox";

import API from "../../../utilities/smart_api";
import { APIClass } from "../../../utilities/smart_api_class";


interface AppState {
}

interface RootState {
  app: AppState
}


const mapState = (state: RootState) => ({
})

const mapDispatch = {
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & { 
  obj: SummonStatBlock;
  onChange: Function;
  slot_level: number;
};

export interface State { 
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
  reloading: boolean;
}

class SummonStatBlockInput extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      processing: false,
      expanded_feature: null,
      child_names_valid: true,
      skills: null,
      tools: null,
      conditions: null,
      senses: null,
      mode: "main",
      edit_attribute: "",
      loading: false,
      reloading: false
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
    this.load();
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getSetOfObjects(["skill","tool","condition","sense"]).then((res: any) => {
        this.setState({ 
          skills: res.skill,
          tools: res.tool,
          conditions: res.condition,
          senses: res.sense,
          loading: false 
        });
      });
    });
  }

  render() {
    if (this.state.loading || this.state.skills === null) {
      return <span>Loading</span>;
    } else { 
      return (
        <Grid container spacing={1} direction="column">
          <Grid item>
            <TemplateBox
              obj={this.props.obj}
              type="SummonStatBlock"
              useTemplate={(template: TemplateBase) => {
                const the_template: SummonStatBlockTemplate = template as SummonStatBlockTemplate;
                const obj = this.props.obj;
                obj.copyTemplate(the_template);
                this.props.onChange(obj);
                this.setState({ reloading: true }, () => {
                  this.setState({ reloading: false });
                });
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
              overflowY: "scroll", 
              overflowX: "hidden" 
            }}>
              { !this.state.reloading && this.render_tab() }
          </Grid>
        </Grid>
      ); 
    }
  }

  render_tab() {
    if (this.state.mode === "ability_scores") {
      return (
        <CreatureAbilityScoresInput
          obj={this.props.obj}
          onChange={(changed: AbilityScores) => {
            const obj = this.props.obj;
            obj.ability_scores = changed;
            this.props.onChange();
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
            slot_level={this.props.slot_level}
            parent_name={this.props.obj.name}
            base_name={null}
            feature={this.state.expanded_feature} 
            onChange={(changed: Feature) => {
              const obj = this.props.obj;
              const objFinder = obj.actions.filter(o => o.id === changed.id);
              if (objFinder.length === 1) {
                const feature = objFinder[0];
                feature.copy(changed);
                this.props.onChange();
              }
            }}
            onDelete={() => {
              if (this.state.expanded_feature) {
                const id = this.state.expanded_feature.id;
                const obj = this.props.obj;
                const features = obj.actions.filter(o => o.id !== id);
                features.filter(o => o.id > id).forEach(o => {
                  o.id--;
                });
                obj.actions = features;
                this.props.onChange();
                this.setState({ expanded_feature: null });
              }
            }}
            onDone={() => {
              let child_names_valid = true;
              for (let i = 0; i < this.props.obj.actions.length; i++) {
                const fb = this.props.obj.actions[i];
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
            features={this.props.obj.actions} 
            parent_id={this.props.obj.true_id} 
            parent_type="SummonStatBlock"
            onChange={(changed: Feature[]) => {
              const obj = this.props.obj;
              obj.actions = changed;
              this.props.onChange();
              this.setState({ reloading: true }, () => {
                this.setState({ reloading: false });
              });
            }}
            onExpand={(expanded_feature: Feature) => {
              this.setState({ expanded_feature });
            }}
            onAdd={() => {
              const obj = this.props.obj;
              const feature = new Feature();
              feature.parent_type = "SummonStatBlock";
              feature.parent_id = obj.true_id;
              feature.id = obj.actions.length;
              obj.actions.push(feature);this.props.onChange();
              this.setState({ expanded_feature: feature });
            }}
          />
        );
      }
    } else if (this.state.mode === "legendary_actions") {
      if (this.state.expanded_feature) {
        return (
          <FeatureInput
            label="Legendary Action"
            slot_level={this.props.slot_level}
            parent_name={this.props.obj.name}
            base_name={null}
            feature={this.state.expanded_feature} 
            onChange={(changed: Feature) => {
              const obj = this.props.obj;
              const objFinder = obj.legendary_actions.filter(o => o.id === changed.id);
              if (objFinder.length === 1) {
                const feature = objFinder[0];
                feature.copy(changed);
                this.props.onChange();
              }
            }}
            onDelete={() => {
              if (this.state.expanded_feature) {
                const id = this.state.expanded_feature.id;
                const obj = this.props.obj;
                const features = obj.legendary_actions.filter(o => o.id !== id);
                features.filter(o => o.id > id).forEach(o => {
                  o.id--;
                });
                obj.legendary_actions = features;
                this.props.onChange();
                this.setState({ expanded_feature: null });
              }
            }}
            onDone={() => {
              let child_names_valid = true;
              for (let i = 0; i < this.props.obj.legendary_actions.length; i++) {
                const fb = this.props.obj.legendary_actions[i];
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
            features={this.props.obj.legendary_actions} 
            parent_id={this.props.obj.true_id} 
            parent_type="SummonStatBlock"
            onChange={(changed: Feature[]) => {
              const obj = this.props.obj;
              obj.legendary_actions = changed;
              this.props.onChange();
              this.setState({ reloading: true }, () => {
                this.setState({ reloading: false });
              });
            }}
            onExpand={(expanded_feature: Feature) => {
              this.setState({ expanded_feature });
            }}
            onAdd={() => {
              const obj = this.props.obj;
              const feature = new Feature();
              feature.parent_type = "SummonStatBlock";
              feature.parent_id = obj.true_id;
              feature.id = obj.legendary_actions.length;
              obj.legendary_actions.push(feature);
              this.props.onChange();
              this.setState({
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
            slot_level={this.props.slot_level}
            parent_name={this.props.obj.name}
            base_name={null}
            feature={this.state.expanded_feature} 
            onChange={(changed: Feature) => {
              const obj = this.props.obj;
              const objFinder = obj.special_abilities.filter(o => o.id === changed.id);
              if (objFinder.length === 1) {
                const feature = objFinder[0];
                feature.copy(changed);
                this.props.onChange();
              }
            }}
            onDelete={() => {
              if (this.state.expanded_feature) {
                const id = this.state.expanded_feature.id;
                const obj = this.props.obj;
                const features = obj.special_abilities.filter(o => o.id !== id);
                features.filter(o => o.id > id).forEach(o => {
                  o.id--;
                });
                obj.special_abilities = features;
                this.props.onChange();
                this.setState({ expanded_feature: null });
              }
            }}
            onDone={() => {
              let child_names_valid = true;
              for (let i = 0; i < this.props.obj.special_abilities.length; i++) {
                const fb = this.props.obj.special_abilities[i];
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
            features={this.props.obj.special_abilities} 
            parent_id={this.props.obj.true_id} 
            parent_type="SummonStatBlock"
            onChange={(changed: Feature[]) => {
              const obj = this.props.obj;
              obj.special_abilities = changed;
              this.props.onChange();
              this.setState({ reloading: true }, () => {
                this.setState({ reloading: false });
              });
            }}
            onExpand={(expanded_feature: Feature) => {
              this.setState({ expanded_feature });
            }}
            onAdd={() => {
              const obj = this.props.obj;
              const feature = new Feature();
              feature.parent_type = "SummonStatBlock";
              feature.parent_id = obj.true_id;
              feature.id = obj.special_abilities.length;
              obj.special_abilities.push(feature);
              this.props.onChange();
              this.setState({
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
              value={this.props.obj.name} 
              message={this.props.obj.name.length > 0 ? "" : "Name Invalid"} 
              name="Name"
              onBlur={(value: string) => {
                const obj = this.props.obj;
                obj.name = value;
                this.props.onChange();
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <StringBox 
              value={this.props.obj.creature_type} 
              name="Type"
              onBlur={(value: string) => {
                const obj = this.props.obj;
                obj.creature_type = value;
                this.props.onChange();
              }}
            />
          </Grid>
          <Grid item xs={4} container spacing={1} direction="row">
            <Grid item xs={6}>
              <UpgradableNumberBox
                name="Hit Dice Count"
                slot_level={this.props.slot_level}
                value={this.props.obj.hit_dice_count} 
                onChange={(value: UpgradableNumber) => {
                  const obj = this.props.obj;
                  obj.hit_dice_count = value;
                  this.props.onChange();
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <UpgradableNumberBox
                name="Hit Dice Size"
                slot_level={this.props.slot_level}
                value={this.props.obj.hit_dice_size} 
                onChange={(value: UpgradableNumber) => {
                  const obj = this.props.obj;
                  obj.hit_dice_size = value;
                  this.props.onChange();
                }}
              />
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <StringBox 
              value={this.props.obj.description} 
              name="Description"
              multiline
              onBlur={(value: string) => {
                const obj = this.props.obj;
                obj.description = value;
                this.props.onChange();
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <StringBox 
              value={this.props.obj.subtype} 
              name="Subtype"
              onBlur={(value: string) => {
                const obj = this.props.obj;
                obj.subtype = value;
                this.props.onChange();
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <UpgradableNumberBox
              name="Max Hit Points"
              slot_level={this.props.slot_level}
              value={this.props.obj.max_hit_points} 
              onChange={(value: UpgradableNumber) => {
                const obj = this.props.obj;
                obj.max_hit_points = value;
                this.props.onChange();
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <UpgradableNumberBox
              name="Challenge Rating"
              slot_level={this.props.slot_level}
              value={this.props.obj.challenge_rating} 
              onChange={(value: UpgradableNumber) => {
                const obj = this.props.obj;
                obj.challenge_rating = value;
                this.props.onChange();
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <UpgradableNumberBox
              name="Initiative Modifier"
              slot_level={this.props.slot_level}
              value={this.props.obj.initiative_modifier} 
              onChange={(value: UpgradableNumber) => {
                const obj = this.props.obj;
                obj.initiative_modifier = value;
                this.props.onChange();
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <UpgradableNumberBox
              name="Armor Class"
              slot_level={this.props.slot_level}
              value={this.props.obj.armor_class} 
              onChange={(value: UpgradableNumber) => {
                const obj = this.props.obj;
                obj.armor_class = value;
                this.props.onChange();
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <SelectStringBox 
              options={["Tiny","Small","Medium","Large","Huge","Gargantuan"]}
              value={this.props.obj.size} 
              name="Size"
              onChange={(value: string) => {
                const obj = this.props.obj;
                obj.size = value;
                this.props.onChange();
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
              value={this.props.obj.alignment} 
              name="Alignment"
              onChange={(value: string) => {
                const obj = this.props.obj;
                obj.alignment = value;
                this.props.onChange();
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
              value={ this.props.obj.saving_throws["STR"] ? `${this.props.obj.saving_throws["STR"]}` : "" }
              type="number"
              onBlur={(value: string) => {
                const obj = this.props.obj;
                if (value === "") {
                  delete obj.saving_throws["STR"];
                } else {
                  obj.saving_throws["STR"] = +value;
                }
                this.props.onChange();
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <StringBox 
              name="DEX"
              value={ this.props.obj.saving_throws["DEX"] ? `${this.props.obj.saving_throws["DEX"]}` : "" }
              type="number"
              onBlur={(value: string) => {
                const obj = this.props.obj;
                if (value === "") {
                  delete obj.saving_throws["DEX"];
                } else {
                  obj.saving_throws["DEX"] = +value;
                }
                this.props.onChange();
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <StringBox 
              name="CON"
              value={ this.props.obj.saving_throws["CON"] ? `${this.props.obj.saving_throws["CON"]}` : "" }
              type="number"
              onBlur={(value: string) => {
                const obj = this.props.obj;
                if (value === "") {
                  delete obj.saving_throws["CON"];
                } else {
                  obj.saving_throws["CON"] = +value;
                }
                this.props.onChange();
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <StringBox 
              name="INT"
              value={ this.props.obj.saving_throws["INT"] ? `${this.props.obj.saving_throws["INT"]}` : "" }
              type="number"
              onBlur={(value: string) => {
                const obj = this.props.obj;
                if (value === "") {
                  delete obj.saving_throws["INT"];
                } else {
                  obj.saving_throws["INT"] = +value;
                }
                this.props.onChange();
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <StringBox 
              name="WIS"
              value={ this.props.obj.saving_throws["WIS"] ? `${this.props.obj.saving_throws["WIS"]}` : "" }
              type="number"
              onBlur={(value: string) => {
                const obj = this.props.obj;
                if (value === "") {
                  delete obj.saving_throws["WIS"];
                } else {
                  obj.saving_throws["WIS"] = +value;
                }
                this.props.onChange();
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <StringBox 
              name="CHA"
              value={ this.props.obj.saving_throws["CHA"] ? `${this.props.obj.saving_throws["CHA"]}` : "" }
              type="number"
              onBlur={(value: string) => {
                const obj = this.props.obj;
                if (value === "") {
                  delete obj.saving_throws["CHA"];
                } else {
                  obj.saving_throws["CHA"] = +value;
                }
                this.props.onChange();
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
              value={this.props.obj.languages}
              onBlur={(value: string) => {
                const obj = this.props.obj;
                obj.languages = value;
                this.props.onChange();
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
            <b>Speed</b> { this.props.obj.speed_string }
          </Grid>
          <Grid item onClick={() => {
            this.setState({ edit_attribute: "senses" });
          }}>
            <b>Senses</b> { this.props.obj.senses_string }
          </Grid>
          <Grid item onClick={() => {
            this.setState({ edit_attribute: "immunities" });
          }}>
            <b>Damage Immunities</b> { this.props.obj.immunities_string }
          </Grid>
          <Grid item onClick={() => {
            this.setState({ edit_attribute: "resistances" });
          }}>
            <b>Damage Resistances</b> { this.props.obj.resistances_string }
          </Grid>
          <Grid item onClick={() => {
            this.setState({ edit_attribute: "vulnerabilities" });
          }}>
            <b>Damage Vulnerabilities</b> { this.props.obj.vulnerabilities_string }
          </Grid>
          <Grid item onClick={() => {
            this.setState({ edit_attribute: "condition_immunities" });
          }}>
            <b>Condition Immunities</b> { this.props.obj.condition_immunities_string }
          </Grid>
          <Grid item onClick={() => {
            this.setState({ edit_attribute: "tools" });
          }}>
            <b>Tools</b> { this.props.obj.tools_string }
          </Grid>
          <Grid item onClick={() => {
            this.setState({ edit_attribute: "skills" });
          }}>
            <b>Skills</b> { this.props.obj.skills_string }
          </Grid>
          <Grid item onClick={() => {
            this.setState({ edit_attribute: "saving_throws" });
          }}>
            <b>Saving Throws</b> { this.props.obj.saving_throws_string }
          </Grid>
          <Grid item onClick={() => {
            this.setState({ edit_attribute: "languages" });
          }}>
            <b>Languages</b> { this.props.obj.languages }
          </Grid>
        </Grid>
      );
    }
  }

  renderSpeeds() {
    const return_me: any[] = [];
    return_me.push(this.renderSpeed(this.props.obj.speed.walk, "walk", "Walk (in feet)"));
    return_me.push(this.renderSpeed(this.props.obj.speed.swim, "swim", "Swim (in feet)"));
    return_me.push(this.renderSpeed(this.props.obj.speed.climb, "climb", "Climb (in feet)"));
    return_me.push(this.renderSpeed(this.props.obj.speed.fly, "fly", "Fly (in feet)"));
    return_me.push(this.renderSpeed(this.props.obj.speed.burrow, "burrow", "Burrow (in feet)"));
    return_me.push(  
      <Grid item key="hover" xs={4}>
        <ToggleButtonBox
          name="Hover"
          value={ this.props.obj.speed.hover === 1 }
          onToggle={() => {
            const obj = this.props.obj;
            if (this.props.obj.speed.hover === 1) {
              obj.speed.hover = 0;
            } else {
              obj.speed.hover = 1;
            }
            this.props.onChange();
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
            const obj = this.props.obj;
            if (value === "") {
              obj.speed[name] = 0;
            } else {
              obj.speed[name] = +value;
            }
            this.props.onChange();
          }}
        />
      </Grid>
    );
  }

  renderSenses() {
    const return_me: any[] = [];
    let sense_finder = this.props.obj.senses.filter(o => o.name === "Darkvision");
    let darkvision: CharacterSense | null = null;
    if (sense_finder.length === 1) {
      darkvision = sense_finder[0];
    }
    return_me.push(this.renderSense(darkvision, "Darkvision"));
    sense_finder = this.props.obj.senses.filter(o => o.name === "Blind Sight");
    let blind_sight: CharacterSense | null = null;
    if (sense_finder.length === 1) {
      blind_sight = sense_finder[0];
    }
    return_me.push(this.renderSense(blind_sight, "Blind Sight"));
    sense_finder = this.props.obj.senses.filter(o => o.name === "True Sight");
    let true_sight: CharacterSense | null = null;
    if (sense_finder.length === 1) {
      true_sight = sense_finder[0];
    }
    return_me.push(this.renderSense(true_sight, "True Sight"));
    sense_finder = this.props.obj.senses.filter(o => o.name === "Tremor Sense");
    let tremor_sense: CharacterSense | null = null;
    if (sense_finder.length === 1) {
      tremor_sense = sense_finder[0];
    }
    return_me.push(this.renderSense(tremor_sense, "Tremor Sense"));
    sense_finder = this.props.obj.senses.filter(o => o.name === "Devil's Sight");
    let devils_sight: CharacterSense | null = null;
    if (sense_finder.length === 1) {
      devils_sight = sense_finder[0];
    }
    return_me.push(this.renderSense(devils_sight, "Devil's Sight"));
    return_me.push(this.renderPassive(this.props.obj.passives.passive_perception, "passive_perception", "Passive Perception"));
    return_me.push(this.renderPassive(this.props.obj.passives.passive_insight, "passive_insight", "Passive Insight"));
    return_me.push(this.renderPassive(this.props.obj.passives.passive_investigation, "passive_investigation", "Passive Investigation"));
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
            const obj = this.props.obj;
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
            this.props.onChange();
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
            const obj = this.props.obj;
            if (value === "") {
              delete obj.passives[name];
            } else {
              obj.passives[name] = +value;
            }
            this.props.onChange();
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
          value={ this.props.obj.skill_proficiencies[skill.name] ? `${this.props.obj.skill_proficiencies[skill.name]}` : "" }
          type="number"
          onBlur={(value: string) => {
            const obj = this.props.obj;
            if (value === "") {
              delete obj.skill_proficiencies[skill.name];
            } else {
              obj.skill_proficiencies[skill.name] = +value;
            }
            this.props.onChange();
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
          value={ this.props.obj.tool_proficiencies[tool.name] ? `${this.props.obj.tool_proficiencies[tool.name]}` : "" }
          type="number"
          onBlur={(value: string) => {
            const obj = this.props.obj;
            if (value === "") {
              delete obj.tool_proficiencies[tool.name];
            } else {
              obj.tool_proficiencies[tool.name] = +value;
            }
            this.props.onChange();
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
          value={ this.props.obj.condition_immunities.includes(condition.name) }
          onToggle={() => {
            const obj = this.props.obj;
            if (this.props.obj.condition_immunities.includes(condition.name)) {
              obj.condition_immunities = this.props.obj.condition_immunities.filter(o => o !== condition.name);
            } else {
              obj.condition_immunities.push(condition.name);
            }
            this.props.onChange();
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
          value={ this.props.obj.damage_multipliers.filter(o => o.multiplier === multiplier && o.damage_types.includes(damage_type)).length > 0 }
          onToggle={() => {
            const obj = this.props.obj;
            if (obj.damage_multipliers.filter(o => o.multiplier === multiplier && o.damage_types.includes(damage_type)).length > 0) {
              obj.damage_multipliers = obj.damage_multipliers.filter(o => o.multiplier !== multiplier || !o.damage_types.includes(damage_type));
            } else {
              const damage_multiplier = new DamageMultiplier();
              damage_multiplier.multiplier = multiplier;
              damage_multiplier.damage_types.push(damage_type);
              obj.damage_multipliers.push(damage_multiplier);
            }
            this.props.onChange();
          }}
        />
      </Grid>
    );
  }
}

export default connector(SummonStatBlockInput);
