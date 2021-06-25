import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Redirect } from "react-router-dom";
import {
  ArrowBack,
  Add,
  DeleteForever
} from "@material-ui/icons";
import {
  Grid, 
  Button, 
  Tooltip, Fab,
  Link,
} from "@material-ui/core";
import {  
  AbilityScores,
  AbilityEffect,
  Creature, 
  CreatureTemplate,
  CreatureAbility,
  TemplateBase,
  DamageMultiplier,
  CharacterSense,
  Feature,
  Skill,
  Tool,
  Condition,
  Sense,
  IStringHash,
  HitDice,
  Potence
} from "../../models";
import {
  DAMAGE_TYPES
} from "../../models/Constants";

import StringBox from "../../components/input/StringBox";
import ToggleButtonBox from "../../components/input/ToggleButtonBox";
import SelectStringBox from "../../components/input/SelectStringBox";
import StringToJSONBox from "../../components/input/StringToJSONBox";

import CreatureAbilityScoresInput from "../../components/model_inputs/creature/CreatureAbilityScoresInput";
import FeatureListInput from "../../components/model_inputs/feature/FeatureList";
import FeatureInput from "../../components/model_inputs/feature/FeatureMain";

import TemplateBox from "../../components/model_inputs/TemplateBox";

import ModelBaseDetails from "../../components/model_inputs/ModelBaseDetails";

import API from "../../utilities/smart_api";
import { APIClass } from "../../utilities/smart_api_class";

import DataUtilities from "../../utilities/data_utilities";
import { DataUtilitiesClass } from "../../utilities/data_utilities_class";


interface AppState {
  source_book: string;
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
  reloading: boolean;
  expanded_dm: DamageMultiplier | null;
}

class CreatureEdit extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const obj = new Creature();
    if (this.props.source_book !== "Any") {
      obj.source_id = this.props.source_book;
    }
    this.state = {
      redirectTo: null,
      obj,
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
      reloading: false,
      expanded_dm: null
    };
    this.api = API.getInstance();
    this.data_util = DataUtilities.getInstance();
  }

  api: APIClass;
  data_util: DataUtilitiesClass;

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
            <Grid item xs={1}>
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
            <Grid item xs={1}>
              <Link href="#" 
                style={{
                  borderBottom: `${this.state.mode === "parse" ? "2px solid blue" : "none"}`
                }}
                onClick={(event: React.SyntheticEvent) => {
                  event.preventDefault();
                  this.setState({ mode: "parse" });
                }}>
                Parse
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
    } else if (this.state.mode === "parse") {
      return (
        <StringToJSONBox 
          onParseAll={(parse_me: string) => {
            this.parse_all(parse_me);
          }}
        />
      );
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
          <Grid item xs={2}>
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
          <Grid item xs={2}>
            <StringBox 
              value={this.state.obj.ac_flavor} 
              name="Flavor"
              onBlur={(value: string) => {
                const obj = this.state.obj;
                obj.ac_flavor = value;
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
          <Grid item xs={12}>
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
          <Grid item xs={12} container spacing={1} direction="column">
            <Grid item>
              <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                onClick={ () => {
                  const obj = this.state.obj;
                  obj.hit_dice.push(new HitDice());
                  this.setState({ obj });
                }}>
                <Add/>
              </Fab>
              <StringBox 
                name="Hit Dice Bonus"
                value={`${this.state.obj.hit_dice_bonus}`}
                type="number"
                onBlur={(value: string) => {
                  const obj = this.state.obj;
                  obj.hit_dice_bonus = +value;
                  this.setState({ obj });
                }}
              />
            </Grid>
            <Grid item>
              { !this.state.reloading && this.state.obj.hit_dice.map((hd, key) => {
                return (
                  <Grid key={key} container spacing={1} direction="row">
                    <Grid item xs={5}>
                      <StringBox
                        name="Hit Dice Count"
                        type="number"
                        value={`${hd.count}`} 
                        onBlur={(value: string) => {
                          const obj = this.state.obj;
                          hd.count = +value;
                          this.setState({ obj });
                        }}
                      />
                    </Grid>
                    <Grid item xs={5}>
                      <SelectStringBox 
                        options={["d4","d6","d8","d10","d12","d20"]}
                        value={`d${hd.size}`} 
                        name="Hit Dice Size"
                        onChange={(value: string) => {
                          const obj = this.state.obj;
                          hd.size = +value;
                          this.setState({ obj });
                        }}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                        onClick={ () => {
                          const obj = this.state.obj;
                          obj.hit_dice = obj.hit_dice.filter(o => o.true_id !== hd.true_id);
                          this.setState({ obj, reloading: true }, () => { this.setState({ reloading: false }); });
                        }}>
                        <DeleteForever/>
                      </Fab>
                    </Grid>
                  </Grid>  
                );
              })}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <ModelBaseDetails key="description"
              obj={this.state.obj}
              no_grid
              onChange={() => {
                const obj = this.state.obj;
                this.setState({ obj });
              }}
            />
          </Grid>
        </Grid>
      ); 
    }
  }

  /**
   * Name is start to size

    Size is recognizable from keywords (tiny, small, medium, large, huge, gargantuan)
    but it will need tweaking for some because they can have options

    Type is after size, and may not have a space between them.  
    It's also recognizable from the list of types.

    Next is alignment, also recognizable

    AC is labeled

    AC flavor (if present) is after AC and in 'parentheses'

    HP is labeled

    Hit Dice is after HP and in 'parentheses'

    Speed is labeled

    Ability Scores is recognizable by capitalized ability score abbreviations
    They may be split up

    Skills (if present) is labeled

    Tools (if present) is labeled

    Saving Throws (if present) is labeled

    Damage Immunities is labeled

    Damage Resistances is labeled

    Damage Vulnerabilities is labeled

    Condition Immunities is labeled

    Senses is labeled

    Languages is labeled

    CR is labeled (Challenge)

    XP is after CR in 'parentheses'

    Special Abilities is after CR and XP and before Actions

    Actions is labeled

    Legendary Actions (if present) is labeled
    There's a standard description between the label
    and the actual Actions

   * 
   * @param parse_me 
   */
  parse_all(parse_me: string) {
    let name = "";
    let size = "";
    let type = "";
    let subtype = "";
    let alignment = "";
    let ac = "";
    // let ac_flavor = "";
    let hp = "";
    // let hit_dice = "";
    let speed = "";
    let ability_scores: string[] = [];
    let skill_proficiencies = ""; 
    let tool_proficiencies = ""; 
    let saving_throws = ""; 
    let damage_immunities = "";
    let damage_resistances = "";
    let damage_vulnerabilities = "";
    let condition_immunities = "";
    let senses = "";
    let languages = "";
    let cr = "";
    // let xp = "";
    let special_abilities = "";
    let actions = "";
    let legendary_actions = "";

    const words = parse_me.split(" ");
    let currently_building = "";
    for (let i = 0; i < words.length; ++i) {
      const word = this.data_util.clean_for_parse(words[i]);
      if (size === "") {
        const found = this.data_util.find_one_in_string(word, ["tiny", "small", "medium", "large", "huge", "gargantuan"]);
        if (found !== "") {
          size = found;
          if (size !== word) {
            type = this.data_util.replaceAll(word, size, "");
          }
          for (let j = 0; j < i; ++j) {
            name += this.data_util.clean_for_parse(words[j]) + " ";
          }
        }
      } else if (type === "") {
        const found = this.data_util.find_one_in_string(word, 
          [
            "aberration",
            "animal",
            "beast",
            "celestial",
            "construct",
            "dragon",
            "elemental",
            "fey",
            "fiend",
            "giant",
            "humanoid",
            "magical", // Beast",
            "monstrosity",
            "monstrous", // Humanoid",
            "ooze",
            "outsider",
            "plant",
            "swarm",
            "undead",
            "vermin",
          ]);
        if (found !== "") {
          type = found;
          if (type !== word) {
            type = this.data_util.replaceAll(word, type, "");
          }
          if (name === "") {
            for (let j = 0; j < i; ++j) {
              name += this.data_util.clean_for_parse(words[j]) + " ";
            }
          }
        }
      } else if (type === "magical" && word === "beast") {
        type = "magical beast";
      } else if (type === "monstrous" && word === "humanoid") {
        type = "monstrous humanoid";
      } else if (type === "swarm" && alignment === "") {
        if (["neutral","lawful","chaotic","unaligned"].includes(word)) {
          alignment = word;
        } else {
          subtype += word + " ";
        }
      } else if (alignment === "") {
        if (["neutral","lawful","chaotic","unaligned"].includes(word)) {
          alignment = word;
        } else {
          subtype += word + " ";
        }
      } else if (["neutral","lawful","chaotic"].includes(alignment)) {
        if (["neutral","good","evil"].includes(word)) {
          alignment += " " + word;
        } else if (alignment === "neutral") {
          alignment = "Neutral";
        } else {
          console.log(word);
        }
      } else if (cr === "") {
        // Everything from AC to CR should be labeled (except ability scores)
        // So let's look for labels and ability scores
        if ((this.data_util.find_one_in_string(word, 
          ["speed", "skills", "tools", "senses", 
          "languages", "challenge", "armor", "hit", 
          "damage", "condition", "saving"], true) !== "" &&
          (word === "damage" || !currently_building.startsWith(word))) || ["STR","DEX","CON","INT","WIS","CHA"].includes(words[i])) {
          if (["speed", "skills", "tools", "senses", 
            "languages", "challenge", "armor", "hit", 
            "damage", "condition", "saving"].includes(word) || ["STR","DEX","CON","INT","WIS","CHA"].includes(words[i])) {
            if (currently_building.startsWith("speed")) {
              speed = currently_building;
            } else if (currently_building.startsWith("skills")) {
              skill_proficiencies = currently_building;
            } else if (currently_building.startsWith("tools")) {
              tool_proficiencies = currently_building;
            } else if (currently_building.startsWith("senses")) {
              senses = currently_building;
            } else if (currently_building.startsWith("languages")) {
              languages = currently_building;
            } else if (currently_building.startsWith("armor class")) {
              ac = currently_building;
            } else if (currently_building.startsWith("hit points")) {
              hp = currently_building;
            } else if (currently_building.toLowerCase().startsWith("damage resistances")) {
              damage_resistances = currently_building;
            } else if (currently_building.toLowerCase().startsWith("damage immunities")) {
              damage_immunities = currently_building;
            } else if (currently_building.toLowerCase().startsWith("damage vulnerabilities")) {
              damage_vulnerabilities = currently_building;
            } else if (currently_building.toLowerCase().startsWith("condition immunities")) {
              condition_immunities = currently_building;
            } else if (currently_building.toLowerCase().startsWith("saving throws")) {
              saving_throws = currently_building;
            } else if (this.data_util.find_one_in_string(currently_building, ["STR","DEX","CON","INT","WIS","CHA"], true)) {
              ability_scores.push(currently_building);
            }
            if (["STR","DEX","CON","INT","WIS","CHA"].includes(words[i])) {
              currently_building = words[i];
            } else {
              currently_building = word;
            }
          } else {
            let found = this.data_util.find_one_in_string(word, 
              ["speed", "skills", "tools", "senses", 
              "languages", "challenge", "armor", "hit", 
              "damage", "condition", "saving"], true);
            let rest = word.replace(found, "");
            found = this.data_util.find_one_in_string(rest, 
              ["speed", "skills", "tools", "senses", 
              "languages", "challenge", "armor", "hit", 
              "damage", "condition", "saving"], true);
            while (rest !== found && rest !== "" && found !== "") {
              rest = word.replace(found, "");
              found = this.data_util.find_one_in_string(rest, 
                ["speed", "skills", "tools", "senses", 
                "languages", "challenge", "armor", "hit", 
                "damage", "condition", "saving"], true);
            }
            currently_building = rest;
          }
        } else {
          if (this.data_util.find_one_in_string(currently_building, ["condition","languages","senses","damage","challenge","hit points"], true) !== "") {
            currently_building += " " + words[i];
          } else {
            currently_building += " " + word;
          }
          if (currently_building.startsWith("challenge") && currently_building.endsWith(")")) {
            // No keyword to mark the beginning of the next one, 
            // so we need to watch for the end of this one.
            cr = currently_building;
            currently_building = "";
          }
        }
      } else {
        if (ability_scores.length < 6) {
          if (["STR","DEX","CON","INT","WIS","CHA"].includes(words[i])) {
            if (this.data_util.find_one_in_string(currently_building, ["STR","DEX","CON","INT","WIS","CHA"], true) !== "") {
              ability_scores.push(currently_building);
            }
            currently_building = words[i];
          } else if (ability_scores.length === 5) {
            currently_building += " " + words[i];
            if (words[i].includes(")")) {
              ability_scores.push(currently_building);
              currently_building = "";
            }
          } else if (this.data_util.find_one_in_string(currently_building, ["STR","DEX","CON","INT","WIS","CHA"], true) !== "") {
            currently_building += " " + words[i];
          }
        } else if ((words[i] === "ACTIONS" && !currently_building.startsWith("LEGENDARY")) || 
          words[i] === "LEGENDARY" ||
          (words[i] === "Actions" && !currently_building.startsWith("Legendary")) || 
          words[i] === "Legendary") {
          if (currently_building.startsWith("ACTIONS") || currently_building.startsWith("Actions")) {
            actions = currently_building;
          } else {
            special_abilities = currently_building;
          }
          currently_building = words[i];
        } else {
          currently_building += " " + words[i];
        }
      }
    }
    if (currently_building.startsWith("ACTIONS") || currently_building.startsWith("Actions")) {
      actions = currently_building;
    } else if (currently_building.startsWith("LEGENDARY ACTIONS") || currently_building.startsWith("Legendary Actions")) {
      legendary_actions = currently_building;
    } else if (currently_building !== "") {
      special_abilities = currently_building;
    }

    const pieces: IStringHash[] = [];
    if (name !== "") {
      pieces.push({
        type: "Name",
        str: name
      });
    }
    if (size !== "") {
      pieces.push({
        type: "Size",
        str: size
      });
    }
    if (type !== "") {
      pieces.push({
        type: "Type",
        str: type
      });
    }
    if (subtype !== "") {
      pieces.push({
        type: "Subtype",
        str: subtype
      });
    }
    if (alignment !== "") {
      pieces.push({
        type: "Alignment",
        str: alignment
      });
    }
    if (ac !== "") {
      pieces.push({
        type: "AC",
        str: ac.replace("armor class", "")
      });
    }
    // if (ac_flavor !== "") {
    //   pieces.push({
    //     type: "AC Flavor",
    //     str: ac_flavor
    //   });
    // }
    if (hp !== "") {
      pieces.push({
        type: "Max HP",
        str: hp.replace("hit points", "")
      });
    }
    // if (hit_dice !== "") {
    //   pieces.push({
    //     type: "Hit Dice",
    //     str: hit_dice
    //   });
    // }
    if (speed !== "") {
      pieces.push({
        type: "Speed",
        str: speed
      });
    }
    ability_scores.forEach(score => {
      pieces.push({
        type: "Ability Scores",
        str: score
      });
    });
    if (skill_proficiencies !== "") {
      pieces.push({
        type: "Skill",
        str: skill_proficiencies.replace("skills", "")
      });
    }
    if (tool_proficiencies !== "") {
      pieces.push({
        type: "Tool",
        str: tool_proficiencies.replace("tools", "")
      });
    }
    if (saving_throws !== "") {
      pieces.push({
        type: "Saving Throws",
        str: saving_throws.replace("saving throws", "")
      });
    }
    if (damage_immunities !== "") {
      pieces.push({
        type: "Damage Immunity",
        str: damage_immunities.toLowerCase().replace("damage immunities", "")
      });
    }
    if (damage_resistances !== "") {
      pieces.push({
        type: "Damage Resistance",
        str: damage_resistances.toLowerCase().replace("damage resistances", "")
      });
    }
    if (damage_vulnerabilities !== "") {
      pieces.push({
        type: "Damage Vulnerability",
        str: damage_vulnerabilities.toLowerCase().replace("damage vulnerabilities", "")
      });
    }
    if (condition_immunities !== "") {
      pieces.push({
        type: "Condition Immunity",
        str: condition_immunities.toLowerCase().replace("condition immunities", "")
      });
    }
    if (senses !== "") {
      pieces.push({
        type: "Sense",
        str: senses.replace("senses", "")
      });
    }
    if (languages !== "") {
      pieces.push({
        type: "Language",
        str: languages.replace("languages", "")
      });
    }
    if (cr !== "") {
      pieces.push({
        type: "CR",
        str: cr.replace("challenge", "")
      });
    }
    // if (xp !== "") {
    //   pieces.push({
    //     type: "Exp Points",
    //     str: xp
    //   });
    // }
    if (special_abilities !== "") {
      pieces.push({
        type: "Special",
        str: special_abilities
      });
    }
    if (actions !== "") {
      pieces.push({
        type: "Action",
        str: actions.replace("ACTIONS", "").replace("Actions", "")
      });
    }
    if (legendary_actions !== "") {
      pieces.push({
        type: "Legendary Action",
        str: legendary_actions.replace("LEGENDARY ACTIONS", "").replace("Legendary Actions", "")
      });
    }
    this.parse_pieces(pieces); 
  }

  parse_pieces(pieces: IStringHash[]) {
    const obj = this.state.obj;
    pieces.forEach(piece => {
      if (piece.type === "Name") {
        obj.name = this.data_util.capitalize_firsts(piece.str, true);
      } else if (piece.type === "Description") {
        obj.description = piece.str.trim();
      } else if (piece.type === "Type") {
        obj.creature_type = this.data_util.capitalize_firsts(piece.str);
      } else if (piece.type === "Subtype") {
        obj.subtype = this.data_util.capitalize_firsts(piece.str);
      } else if (piece.type === "Hit Dice") {
        const bonus_pieces = piece.str.split("+");
        obj.hit_dice_bonus = 0;
        bonus_pieces.forEach(bp => {
          if (bp.includes("d")) {
            const hd_pieces = bp.split("d");
            const hd = new HitDice();
            hd.count = this.data_util.fix_number_string(hd_pieces[0]);
            hd.size = this.data_util.fix_number_string(hd_pieces[1]);
            obj.hit_dice.push(hd);
          } else {
            obj.hit_dice_bonus += this.data_util.fix_number_string(bp);
          }
        });
      } else if (piece.type === "Max HP") {
        const words = piece.str.split(" ");
        let max_hp = "";
        let hit_dice = "";
        for (let i = 0; i < words.length; ++i) {
          const word = this.data_util.clean_for_parse(words[i]);
          if (!["hit","points"].includes(word)) {
            if (max_hp === "") {
              max_hp = word;
            } else {
              hit_dice += word + " ";
            }
          }
        }
        obj.max_hit_points = this.data_util.fix_number_string(max_hp);
        if (hit_dice !== "") {
          const bonus_pieces = hit_dice.split("+");
          obj.hit_dice_bonus = 0;
          bonus_pieces.forEach(bp => {
            if (bp.includes("d")) {
              const hd_pieces = bp.split("d");
              const hd = new HitDice();
              hd.count = this.data_util.fix_number_string(hd_pieces[0]);
              hd.size = this.data_util.fix_number_string(hd_pieces[1]);
              obj.hit_dice.push(hd);
            } else {
              obj.hit_dice_bonus += this.data_util.fix_number_string(bp);
            }
          });
        }
      } else if (piece.type === "Size") {
        obj.size = this.data_util.capitalize_firsts(piece.str);
      } else if (piece.type === "CR") {
        const words = piece.str.split(" ");
        let cr = "";
        let exp = "";
        for (let i = 0; i < words.length; ++i) {
          const word = this.data_util.clean_for_parse(words[i]);
          if (!["challenge","xp"].includes(word)) {
            if (cr === "") {
              cr = word;
            } else {
              exp += word + " ";
            }
          }
        }
        obj.challenge_rating = this.data_util.fix_number_string(cr);
        obj.xp = this.data_util.fix_number_string(exp.replace("xp",""));
      } else if (piece.type === "Exp Points") {
        obj.xp = this.data_util.fix_number_string(piece.str);
      } else if (piece.type === "Init Mod") {
        obj.initiative_modifier = this.data_util.fix_number_string(piece.str);
      } else if (piece.type === "AC") {
        const words = piece.str.split(" ");
        let ac = "";
        let flavor = "";
        for (let i = 0; i < words.length; ++i) {
          const word = this.data_util.clean_for_parse(words[i]);
          if (!["class"].includes(word)) {
            if (ac === "") {
              ac = word;
            } else {
              flavor += word + " ";
            }
          }
        }
        obj.armor_class = this.data_util.fix_number_string(ac);
        obj.ac_flavor = flavor.trim();
      } else if (piece.type === "Alignment") {
        obj.alignment = this.data_util.capitalize_firsts(piece.str);
      } else if (piece.type === "Speed") {
        const speed_pieces = piece.str.split(" ");
        let speed_type = "";
        speed_pieces.forEach(sp => {
          if (["speed","walk","run"].includes(sp.toLowerCase())) {
            speed_type = "walk";
          } else if (sp.toLowerCase() === "swim") {
            speed_type = "swim";
          } else if (sp.toLowerCase() === "climb") {
            speed_type = "climb";
          } else if (sp.toLowerCase() === "fly") {
            speed_type = "fly";
          } else if (sp.toLowerCase() === "burrow") {
            speed_type = "burrow";
          } else if (sp.includes("hover")) {
            obj.speed.hover = 1;
          } else if (speed_type !== "") {
            obj.speed[speed_type] = this.data_util.fix_number_string(sp);
            speed_type = "";
          }
        });
      } else if (piece.type === "Ability Scores") {
        const as_pieces = piece.str.split(" ");
        let as_type = "";
        as_pieces.forEach(asp => {
          if (["STR","DEX","CON","INT","WIS","CHA"].includes(asp.toUpperCase())) {
            as_type = asp.toUpperCase();
          } else if (as_type !== "") {
            obj.ability_scores.setAbilityScore(as_type, this.data_util.fix_number_string(asp));
            as_type = "";
          }
        });
      } else if (piece.type === "Saving Throws") {
        const st_pieces = piece.str.split(" ");
        let st_type = "";
        st_pieces.forEach(stp => {
          if (["STR","DEX","CON","INT","WIS","CHA"].includes(stp.toUpperCase())) {
            st_type = stp.toUpperCase();
          } else if (st_type !== "") {
            obj.saving_throws[st_type] = this.data_util.fix_number_string(stp);
            st_type = "";
          }
        });
      } else if (piece.type === "Skill") {
        const skill_pieces = piece.str.split(" ");
        let skill = "";
        skill_pieces.forEach(sp => {
          if (sp !== "skills") {
            if (skill !== "") {
              if (["acrobatics",
                "animalhandling",
                "arcana",
                "athletics",
                "deception",
                "history",
                "insight",
                "intimidation",
                "investigation",
                "medicine",
                "nature",
                "perception",
                "performance",
                "persuasion",
                "religion",
                "sleightofhand",
                "stealth",
                "survival"].includes(skill)) {
                if (skill === "sleightofhand") {
                  skill = "Sleight of Hand";
                } else if (skill === "animalhandling") {
                  skill = "Animal Handling";
                } else {
                  skill = this.data_util.capitalize_first(skill);
                }
                obj.skill_proficiencies[skill] = this.data_util.fix_number_string(sp);
                skill = "";
              } else {
                skill += sp.toLowerCase();
              }
            } else {
              skill = sp.toLowerCase();
            }
          }
        });
      } else if (piece.type === "Tool") {
        const tool_pieces = this.data_util.capitalize_firsts(piece.str).split(" ");
        tool_pieces.forEach(p => {
          if (p !== "tool") {
            obj.tool_proficiencies[p] = 1;
          }
        });
      } else if (piece.type === "Language") {
        obj.languages = piece.str;
      } else if (piece.type === "Damage Immunity") {
        const more_pieces = this.data_util.capitalize_firsts(piece.str).split(";");
        more_pieces.forEach(mp => {
          const dm = new DamageMultiplier();
          if (mp.includes("From ")) {
            const from_pieces = mp.split("From ");
            dm.details = `From ${from_pieces[1]}`;
            mp = from_pieces[0];
          }
          const mult_pieces = mp.split(",");
          dm.multiplier = 0;
          mult_pieces.forEach(p => {
            if (p.includes("And ")) {
              const p2 = p.split("And ");
              p2.forEach(p3 => {
                if (p3.trim() !== "") {
                  dm.damage_types.push(p3.trim());
                }
              });
            } else {
              if (p.trim() !== "") {
                dm.damage_types.push(p.trim());
              }
            }
          });
          obj.damage_multipliers.push(dm);
        });
      } else if (piece.type === "Damage Resistance") {
        const more_pieces = this.data_util.capitalize_firsts(piece.str).split(";");
        more_pieces.forEach(mp => {
          const dm = new DamageMultiplier();
          if (mp.includes("From ")) {
            const from_pieces = mp.split("From ");
            dm.details = `From ${from_pieces[1]}`;
            mp = from_pieces[0];
          }
          const mult_pieces = mp.split(",");
          dm.multiplier = 0.5;
          mult_pieces.forEach(p => {
            if (p.includes("And ")) {
              const p2 = p.split("And ");
              p2.forEach(p3 => {
                if (p3.trim() !== "") {
                  dm.damage_types.push(p3.trim());
                }
              });
            } else {
              if (p.trim() !== "") {
                dm.damage_types.push(p.trim());
              }
            }
          });
          obj.damage_multipliers.push(dm);
        });
      } else if (piece.type === "Damage Vulnerability") {
        const more_pieces = this.data_util.capitalize_firsts(piece.str).split(";");
        more_pieces.forEach(mp => {
          const dm = new DamageMultiplier();
          if (mp.includes("From ")) {
            const from_pieces = mp.split("From ");
            dm.details = `From ${from_pieces[1]}`;
            mp = from_pieces[0];
          }
          const mult_pieces = mp.split(",");
          dm.multiplier = 2;
          mult_pieces.forEach(p => {
            if (p.includes("And ")) {
              const p2 = p.split("And ");
              p2.forEach(p3 => {
                if (p3.trim() !== "") {
                  dm.damage_types.push(p3.trim());
                }
              });
            } else {
              if (p.trim() !== "") {
                dm.damage_types.push(p.trim());
              }
            }
          });
          obj.damage_multipliers.push(dm);
        });
      } else if (piece.type === "Condition Immunity") {
        const immunity_pieces = this.data_util.capitalize_firsts(piece.str).split(",");
        immunity_pieces.forEach(p => {
          obj.condition_immunities.push(p.trim());
        });
      } else if (piece.type === "Sense") {
        if (this.state.senses) {
          const sense_pieces = this.data_util.capitalize_firsts(piece.str).split(",");
          for (let i = 0; i < sense_pieces.length; ++i) {
            const sp = sense_pieces[i];
            const more_pieces = sp.trim().split(" ");
            if (more_pieces[0] === "Passive") {
              if (more_pieces[1] === "Perception") {
                obj.passives.passive_perception = this.data_util.fix_number_string(more_pieces[2]);
              } else if (more_pieces[1] === "Investigation") {
                obj.passives.passive_investigation = this.data_util.fix_number_string(more_pieces[2]);
              } else if (more_pieces[1] === "Insight") {
                obj.passives.passive_insight = this.data_util.fix_number_string(more_pieces[2]);
              }
            } else {
              const sense_name = more_pieces[0];
              const sense_finder = this.state.senses.filter(o => this.data_util.replaceAll(o.name, " ","").toLowerCase() === this.data_util.replaceAll(sense_name, " ","").toLowerCase());
              if (sense_finder.length === 1) {
                const sf = sense_finder[0];
                const char_sense = new CharacterSense();
                char_sense.name = sf.name;
                char_sense.sense_id = sf._id;
                char_sense.range = this.data_util.fix_number_string(more_pieces[1]);
                obj.senses.push(char_sense);
              }
            }
          }
        }
      } else if (piece.type === "Special") {
        const abilities: Feature[] = [];
        // Needs to identify the beginning for each ability
        // We can identify them by periods and spaces.  
        // If there's a period and the 'sentence' before it 
        // has < 4 words then it's probably the name of the next one.
        const sentences = piece.str.split(".");
        let sentence_num = 0;
        let ability = new Feature();
        while (sentence_num < sentences.length) {
          const sentence = sentences[sentence_num].trim();
          const words = sentence.split(" ");
          if (words.length < 4) {
            // new ability
            if (ability.name !== "") {
              ability.description = ability.description.trim();
              abilities.push(ability);
            }
            ability = new Feature();
            ability.feature_type = "Creature Ability";
            ability.the_feature = new CreatureAbility();
            ability.name = sentence;
            // ability.the_feature.name = sentence;
          } else {
            const creature_ability = ability.the_feature as CreatureAbility;
            ability.description += `${sentence}. `;
            for (let j = 0; j < words.length; ++j) {
              // Look for certain keywords: 
              // ft (for range), 
              // to hit (for attack bonus)
              // DC (for save and dc), 
              // damage (for damage type and amount)
              const word = words[j].toLowerCase();
              if (word === "ft" || word === "feet") {
                if (j > 1) {
                  if (creature_ability.range) {
                    creature_ability.range_2 = `${this.data_util.fix_number_string(words[j - 1])}`;
                  } else {
                    creature_ability.range = `${this.data_util.fix_number_string(words[j - 1])}`;
                  }
                }
              } else if (word === "hit") {
                if (j > 2) {
                  if (words[j - 1].toLowerCase() === "to") {
                    creature_ability.attack_bonus = this.data_util.fix_number_string(words[j - 2]);
                  }
                }
              } else if (word === "dc") {
                if (words.length > (j + 4)) {
                  if (words[j + 3].toLowerCase() === "saving" && ["throw","throws"].includes(words[j + 4].toLowerCase())) {
                    creature_ability.dc = this.data_util.fix_number_string(words[j + 1]);
                    creature_ability.saving_throw_ability_score = this.data_util.ability_score_abbreviation(words[j + 2]);
                  }
                }
              } else if (word === "damage") {
                // if (words.length > (j + 4)) {
                //   if (words[j + 3].toLowerCase() === "saving" && ["throw","throws"].includes(words[j + 4].toLowerCase())) {
                //     creature_ability.dc = this.data_util.fix_number_string(words[j + 1]);
                //     creature_ability.saving_throw_ability_score = this.data_util.ability_score_abbreviation(words[j + 2]);
                //   }
                // }
              }
            }
          }
          sentence_num++;
        }
        obj.special_abilities = this.parse_actions(piece.str);
      } else if (piece.type === "Action") {
        const abilities: Feature[] = [];
        // obj.special_abilities.push()
        // Needs to identify the beginning for each ability
        // We can identify them by periods and spaces.  
        // If there's a period and the 'sentence' before it 
        // has < 4 words then it's probably the name of the next one.
        const sentences = piece.str.split(".");
        let sentence_num = 0;
        let ability = new Feature();
        while (sentence_num < sentences.length) {
          const sentence = sentences[sentence_num];
          const words = sentence.split(" ");
          if (words.length < 4) {
            // new ability
            if (ability.name !== "") {
              ability.description = ability.description.trim();
              abilities.push(ability);
            }
            ability = new Feature();
            ability.feature_type = "Creature Ability";
            ability.the_feature = new CreatureAbility();
            ability.name = sentence;
            // ability.the_feature.name = sentence;
          } else {
            const creature_ability = ability.the_feature as CreatureAbility;
            ability.description += `${sentence}. `;
            for (let j = 0; j < words.length; ++j) {
              // Look for certain keywords: 
              // ft (for range), 
              // to hit (for attack bonus)
              // DC (for save and dc), 
              // damage (for damage type and amount)
              const word = words[j].toLowerCase();
              if (word === "ft" || word === "feet") {
                if (j > 1) {
                  if (creature_ability.range) {
                    creature_ability.range_2 = `${this.data_util.fix_number_string(words[j - 1])}`;
                  } else {
                    creature_ability.range = `${this.data_util.fix_number_string(words[j - 1])}`;
                  }
                }
              } else if (word === "hit") {
                if (j > 2) {
                  if (words[j - 1].toLowerCase() === "to") {
                    creature_ability.attack_bonus = this.data_util.fix_number_string(words[j - 2]);
                  }
                }
              } else if (word === "dc") {
                if (words.length > (j + 4)) {
                  if (words[j + 3].toLowerCase() === "saving" && ["throw","throws"].includes(words[j + 4].toLowerCase())) {
                    creature_ability.dc = this.data_util.fix_number_string(words[j + 1]);
                    creature_ability.saving_throw_ability_score = this.data_util.ability_score_abbreviation(words[j + 2]);
                  }
                }
              } else if (word === "damage") {
                // if (words.length > (j + 4)) {
                //   if (words[j + 3].toLowerCase() === "saving" && ["throw","throws"].includes(words[j + 4].toLowerCase())) {
                //     creature_ability.dc = this.data_util.fix_number_string(words[j + 1]);
                //     creature_ability.saving_throw_ability_score = this.data_util.ability_score_abbreviation(words[j + 2]);
                //   }
                // }
              }
            }
          }
          sentence_num++;
        }
        obj.actions = this.parse_actions(piece.str);
      } else if (piece.type === "Legendary Action") {
        obj.legendary_actions = this.parse_actions(piece.str);
      } else {
        console.log(piece);
      } 
    });
    this.setState({ obj, mode: "home" });
  }

  parse_actions(actions: string) {
    const abilities: Feature[] = [];
    // obj.special_abilities.push()
    // Needs to identify the beginning for each ability
    // We can identify them by periods and spaces.  
    // If there's a period and the 'sentence' before it 
    // has < 4 words then it's probably the name of the next one.
    const sentences = this.data_util.replaceAll(actions, "ft.", "feet").split(".");
    let sentence_num = 0;
    let ability = new Feature();
    while (sentence_num < sentences.length) {
      const sentence = sentences[sentence_num];
      const words = sentence.trim().split(" ");
      if (words.length < 4 || 
        (words[words.length - 1].endsWith(")") && 
          (words[0].startsWith("(") || 
            words[1].startsWith("(") || 
            words[2].startsWith("(") || 
            words[3].startsWith("(")))) {
        // new ability
        if (ability.name !== "") {
          if (ability.description.length > 0) {
            ability.description = ability.description.trim();
            abilities.push(ability);
          }
        }
        ability = new Feature();
        ability.feature_type = "Creature Ability";
        ability.the_feature = new CreatureAbility();
        ability.name = sentence;
      } else {
        const creature_ability = ability.the_feature as CreatureAbility;
        ability.description += `${sentence}. `;
        for (let j = 0; j < words.length; ++j) {
          // Look for certain keywords: 
          // ft (for range), 
          // to hit (for attack bonus)
          // DC (for save and dc), 
          // damage (for damage type and amount)
          const word = this.data_util.clean_for_parse(words[j]);
          if (word === "ft" || word === "feet") {
            if (j > 1) {
              if (creature_ability.range) {
                creature_ability.range_2 = `${this.data_util.fix_number_string(words[j - 1])}`;
              } else {
                creature_ability.range = `${this.data_util.fix_number_string(words[j - 1])}`;
              }
            }
          } else if (word === "hit") {
            if (j > 2) {
              if (words[j - 1].toLowerCase() === "to") {
                creature_ability.attack_bonus = this.data_util.fix_number_string(words[j - 2]);
              }
            }
          } else if (word === "dc") {
            if (words.length > (j + 4)) {
              if (words[j + 3].toLowerCase() === "saving" && ["throw","throws"].includes(words[j + 4].toLowerCase())) {
                creature_ability.dc = this.data_util.fix_number_string(words[j + 1]);
                creature_ability.saving_throw_ability_score = this.data_util.ability_score_abbreviation(words[j + 2]);
                if (creature_ability.effects.length === 0) {
                  const effect = new AbilityEffect();
                  effect.attack_type = "Save";
                  if (effect.type === "None") {
                    effect.type = "Control";
                  }
                  creature_ability.effects.push(effect);
                } else {
                  const effect = creature_ability.effects[0];
                  if (effect.attack_type === "None") {
                    effect.attack_type = "Save";
                  }
                }
              }
            }
          } else if (word === "attack") {
            let melee = "";
            let spell = "";
            let k = j - 1;
            while (k > -1 && (melee === "" || spell === "")) {
              const word2 = this.data_util.clean_for_parse(words[k]);
              if (word2 === "melee" || word2 === "ranged") {
                melee = word2;
              } else if (word2 === "spell") {
                spell = word2;
              }
              k--;
            }
            if (melee !== "") {
              if (creature_ability.effects.length === 0) {
                const effect = new AbilityEffect();
                effect.attack_type = this.data_util.capitalize_first(melee);
                if (spell !== "") {
                  effect.attack_type += " Spell";
                }
                if (effect.type === "None") {
                  effect.type = "Control";
                }
                creature_ability.effects.push(effect);
              } else {
                const effect = creature_ability.effects[0];
                effect.attack_type = this.data_util.capitalize_first(melee);
                if (spell !== "") {
                  effect.attack_type += " Spell";
                }
              }
            }
          } else if (word === "damage") {
            if (j > 4) {
              const dmg_type = this.data_util.capitalize_first(words[j - 1]);
              if (this.data_util.in_list_ignore_case(dmg_type, DAMAGE_TYPES) !== "") {
                const dice_roll = ["+", "-"].includes(words[j - 3]) ? 
                  this.data_util.parse_dice_roll(words[j - 4]) : 
                  this.data_util.parse_dice_roll(words[j - 2]);
                const dmg_bonus = ["+", "-"].includes(words[j - 3]) ? (words[j - 3] === "-" ? -1 : 1) * this.data_util.fix_number_string(words[j - 2]) : 0;
                if (creature_ability.effects.length === 0) {
                  const effect = new AbilityEffect();
                  effect.attack_type = "None";
                  effect.bonus.base = dmg_bonus;
                  effect.type = dmg_type;
                  const potence = new Potence();
                  potence.rolls = dice_roll;
                  effect.potences.push(potence);
                  creature_ability.effects.push(effect);
                } else {
                  let effect = creature_ability.effects[0];
                  if (effect.type === "None" || effect.type === "Control") {
                    effect.bonus.base = dmg_bonus;
                    effect.type = dmg_type;
                    const potence = new Potence();
                    potence.rolls = dice_roll;
                    effect.potences.push(potence);
                  } else {
                    effect = new AbilityEffect();
                    effect.attack_type = "None";
                    effect.bonus.base = dmg_bonus;
                    effect.type = dmg_type;
                    const potence = new Potence();
                    potence.rolls = dice_roll;
                    effect.potences.push(potence);
                    creature_ability.effects.push(effect);
                  }
                }
              }
            }
          }
        }
      }
      sentence_num++;
    }
    if (ability.name !== "" && abilities.filter(o => o.true_id === ability.true_id).length === 0) {
      abilities.push(ability);
    }
    return abilities;
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
          <Grid item xs={12}>
            <Fab size="small" color="primary" style={{marginLeft: "8px"}}
              onClick={ () => {
                const obj = this.state.obj;
                const dm = new DamageMultiplier();
                dm.multiplier = 0;
                obj.damage_multipliers.push(dm);
                this.setState({ obj });
              }}>
              <Add/>
            </Fab>
          </Grid>
          { this.state.obj.damage_multipliers.filter(o => o.multiplier === 0).map((dm, key) => {
            return (
              <Grid item xs={12} key={key} container spacing={1} direction="row">
                <Grid item xs={2}>
                  <ToggleButtonBox 
                    name="Expand"
                    value={ this.state.expanded_dm === null ? false : this.state.expanded_dm.true_id === dm.true_id }
                    onToggle={() => {
                      const expanded_dm = this.state.expanded_dm && this.state.expanded_dm.true_id === dm.true_id ? null : dm;
                      this.setState({ expanded_dm });
                    }}
                  />
                </Grid>
                <Grid item xs={10}>
                  { dm.toString() }
                </Grid>
                { this.state.expanded_dm && this.state.expanded_dm.true_id === dm.true_id && DAMAGE_TYPES.map((damage_type, key) => {
                  return this.renderDamageType(damage_type, key, 2);
                })}
                { this.state.expanded_dm && this.state.expanded_dm.true_id === dm.true_id && 
                  <Grid item xs={12}>
                    <StringBox 
                      name="Details"
                      value={this.state.expanded_dm.details}
                      onBlur={(changed: string) => {
                        const obj = this.state.obj;
                        const dm = this.state.expanded_dm;
                        if (dm) {
                          dm.details = changed;
                        }
                        this.setState({ obj });
                      }}
                    />
                  </Grid>
                }
              </Grid>
            );
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
          <Grid item xs={12}>
            <Fab size="small" color="primary" style={{marginLeft: "8px"}}
              onClick={ () => {
                const obj = this.state.obj;
                const dm = new DamageMultiplier();
                dm.multiplier = 0.5;
                obj.damage_multipliers.push(dm);
                this.setState({ obj });
              }}>
              <Add/>
            </Fab>
          </Grid>
          { this.state.obj.damage_multipliers.filter(o => o.multiplier === 0.5).map((dm, key) => {
            return (
              <Grid item xs={12} key={key} container spacing={1} direction="row">
                <Grid item xs={2}>
                  <ToggleButtonBox 
                    name="Expand"
                    value={ this.state.expanded_dm === null ? false : this.state.expanded_dm.true_id === dm.true_id }
                    onToggle={() => {
                      const expanded_dm = this.state.expanded_dm && this.state.expanded_dm.true_id === dm.true_id ? null : dm;
                      this.setState({ expanded_dm });
                    }}
                  />
                </Grid>
                <Grid item xs={10}>
                  { dm.toString() }
                </Grid>
                { this.state.expanded_dm && this.state.expanded_dm.true_id === dm.true_id && DAMAGE_TYPES.map((damage_type, key) => {
                  return this.renderDamageType(damage_type, key, 2);
                })}
                { this.state.expanded_dm && this.state.expanded_dm.true_id === dm.true_id && 
                  <Grid item xs={12}>
                    <StringBox 
                      name="Details"
                      value={this.state.expanded_dm.details}
                      onBlur={(changed: string) => {
                        const obj = this.state.obj;
                        const dm = this.state.expanded_dm;
                        if (dm) {
                          dm.details = changed;
                        }
                        this.setState({ obj });
                      }}
                    />
                  </Grid>
                }
              </Grid>
            );
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
          <Grid item xs={12}>
            <Fab size="small" color="primary" style={{marginLeft: "8px"}}
              onClick={ () => {
                const obj = this.state.obj;
                const dm = new DamageMultiplier();
                dm.multiplier = 2;
                obj.damage_multipliers.push(dm);
                this.setState({ obj });
              }}>
              <Add/>
            </Fab>
          </Grid>
          { this.state.obj.damage_multipliers.filter(o => o.multiplier === 2).map((dm, key) => {
            return (
              <Grid item xs={12} key={key} container spacing={1} direction="row">
                <Grid item xs={2}>
                  <ToggleButtonBox 
                    name="Expand"
                    value={ this.state.expanded_dm === null ? false : this.state.expanded_dm.true_id === dm.true_id }
                    onToggle={() => {
                      const expanded_dm = this.state.expanded_dm && this.state.expanded_dm.true_id === dm.true_id ? null : dm;
                      this.setState({ expanded_dm });
                    }}
                  />
                </Grid>
                <Grid item xs={10}>
                  { dm.toString() }
                </Grid>
                { this.state.expanded_dm && this.state.expanded_dm.true_id === dm.true_id && DAMAGE_TYPES.map((damage_type, key) => {
                  return this.renderDamageType(damage_type, key, 2);
                })}
                { this.state.expanded_dm && this.state.expanded_dm.true_id === dm.true_id && 
                  <Grid item xs={12}>
                    <StringBox 
                      name="Details"
                      value={this.state.expanded_dm.details}
                      onBlur={(changed: string) => {
                        const obj = this.state.obj;
                        const dm = this.state.expanded_dm;
                        if (dm) {
                          dm.details = changed;
                        }
                        this.setState({ obj });
                      }}
                    />
                  </Grid>
                }
              </Grid>
            );
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
        <ToggleButtonBox
          name={ tool.name }
          value={ this.state.obj.tool_proficiencies[tool.name] !== undefined }
          onToggle={() => {
            const obj = this.state.obj;
            if (this.state.obj.tool_proficiencies[tool.name]) {
              delete obj.tool_proficiencies[tool.name];
            } else {
              obj.tool_proficiencies[tool.name] = 1;
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
    if (this.state.expanded_dm) {
      return (
        <Grid item xs={4} key={key} container spacing={0} direction="row">
          <ToggleButtonBox
            name={ damage_type }
            value={ this.state.expanded_dm.damage_types.includes(damage_type) }
            onToggle={() => {
              const obj = this.state.obj;
              const dm = this.state.expanded_dm;
              if (dm) {
                if (dm.damage_types.includes(damage_type)) {
                  dm.damage_types = dm.damage_types.filter(o => o !== damage_type);
                } else {
                  dm.damage_types.push(damage_type);
                }
                this.setState({ obj });
              }
            }}
          />
        </Grid>
      );
    }
    return null;
  }
}

export default connector(CreatureEdit);
