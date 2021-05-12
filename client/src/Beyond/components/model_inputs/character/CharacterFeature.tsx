import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
  Grid, 
} from "@material-ui/core";

import { 
  Character,
  CharacterFeat,
  CharacterFeature,
  CharacterASIBaseFeature,
  CharacterLanguageFeature,
  CharacterSense,
  Proficiency,
  Subclass,
  IStringHash
} from "../../../models";

import CharacterASIBaseFeatureInput from "./CharacterASIBaseFeature";
import CharacterLanguageFeatureInput from "./CharacterLanguageFeature";
import CharacterEldritchInvocationBox from "./CharacterEldritchInvocationBox";
import CharacterFightingStyleBox from "./CharacterFightingStyleBox";
import CharacterSpecialFeatureBox from "./CharacterSpecialFeatureBox";
import CharacterPactBoonBox from "./CharacterPactBoonBox";
import CharacterFeatBox from "./CharacterFeatBox";
import CharacterSpecialSpellBox from "./CharacterSpecialSpellBox";
import SelectToolBox from "../select/SelectToolBox";
import SelectSkillBox from "../select/SelectSkillBox";
import SelectSubclassBox from "../select/SelectSubclassBox";
import SelectSpellBox from "../select/SelectSpellBox";
import DisplayObjects from "../display/DisplayObjects";

import API from "../../../utilities/smart_api";
import { APIClass } from "../../../utilities/smart_api_class";


interface AppState {
  width: number;
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
  width: state.app.width
})

const mapDispatch = {
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  obj: CharacterFeature;
  character: Character;
  onChange: (changed: CharacterFeature) => void;
}

export interface State {
  subclasses: Subclass[] | null;
  loading: boolean;
}

class CharacterFeatureInput extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      subclasses: null,
      loading: false
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getSetOfObjects(["subclass"]).then((res: any) => {
        this.setState({ 
          subclasses: res.subclass,
          loading: false 
        });
      });
    });
  }

  render() {
    const feature = this.props.obj;
    // switch based on feature type
    let details = 
      <Grid item>
        { feature.feature.name }
      </Grid>;
    switch(feature.feature.feature_type) {
      case "Subclass":
        if (this.state.loading) {
          details = <Grid item>Loading</Grid>;
        } else if (this.state.subclasses === null) {
          this.load();
          details = <Grid item>Loading</Grid>;
        } else {
          details = 
            <Grid item>
              <SelectSubclassBox
                name={feature.name}
                game_class_id={feature.feature_options[0]}
                value={feature.feature_options[1]}
                color={feature.feature_options[1] === "" ? "blue" : ""}
                onChange={(id: string) => {
                  if (this.props.character instanceof Character) {
                    const class_finder = this.props.character.classes.filter(o => o.game_class_id === feature.feature_options[0]);
                    if (class_finder.length === 1) {
                      const char_class = class_finder[0];
                      if (this.state.subclasses) {
                        const subclass_finder = this.state.subclasses.filter(o => o._id === id);
                        if (subclass_finder.length === 1) {
                          char_class.copySubclass(subclass_finder[0], char_class.level);
                        }
                      }
                    }
                    this.props.onChange(this.props.obj);
                  }
                }}
              />
            </Grid>;
        }
      break;
      case "Language":
        if (feature.feature_options[0] instanceof CharacterLanguageFeature) {
          details = 
            <Grid item>
              <CharacterLanguageFeatureInput
                character={this.props.character}
                obj={feature}
                color={feature.feature_options[0].language_id === "" ? "blue" : ""}
                onChange={(changed: CharacterLanguageFeature) => {
                  feature.feature_options[0] = changed;
                  this.props.onChange(this.props.obj);
                }}
              />
            </Grid>;
        }
      break;
      case "Special Feature":
        details = 
          <Grid item>
            <CharacterSpecialFeatureBox
              character={this.props.character}
              type={feature.feature.the_feature as string}
              obj={feature}
              onChange={() => {
                this.props.onChange(this.props.obj);
              }}
            />
          </Grid>;
      break;
      case "Special Feature Choices":
        let spec_prof = feature.feature.the_feature as Proficiency;
        let spec_choices: string[] = spec_prof.the_proficiencies;
        details = 
          <Grid item>
            <CharacterSpecialFeatureBox
              character={this.props.character}
              type={feature.feature.the_feature as string}
              obj={feature}
              options={spec_choices}
              onChange={() => {
                this.props.onChange(this.props.obj);
              }}
            />
          </Grid>;
      break;
      case "Sense":
        let sense = feature.feature_options[0] as CharacterSense;
        details = 
          <Grid item>
            { sense.name }: { sense.range }
          </Grid>;
      break;
      case "Pact Boon":
        details = 
          <Grid item>
            <CharacterPactBoonBox
              character={this.props.character}
              obj={feature}
              onChange={() => {
                this.props.onChange(this.props.obj);
              }}
            />
          </Grid>;
      break;
      case "Eldritch Invocation":
        details = 
          <Grid item>
            <CharacterEldritchInvocationBox
              character={this.props.character}
              obj={feature}
              onChange={() => {
                this.props.onChange(this.props.obj);
              }}
            />
          </Grid>;
      break;
      case "Fighting Style":
        details = 
          <Grid item>
            <CharacterFightingStyleBox
              character={this.props.character}
              obj={feature}
              onChange={() => {
                this.props.onChange(this.props.obj);
              }}
            />
          </Grid>;
      break;
      case "Cantrips from List":
        const cfl = feature.feature.the_feature as IStringHash;
        const cantrip_ids = feature.feature_options as string[];
        details = 
          <Grid item container spacing={1} direction="column">
            <Grid item>
              You learn { cfl.count } cantrips of your choice from { cfl.list_id === "Any" ? <span>any</span> : <span>the <DisplayObjects type="spell_list" ids={[cfl.list_id]} /></span> } spell list. 
              { cfl.spellcasting_ability } is your spellcasting ability for them. 
              Whenever you gain a level in this class, you can replace one of these cantrips with another cantrip from { cfl.list_id === "Any" ? <span>any</span> : <span>the <DisplayObjects type="spell_list" ids={[cfl.list_id]} /></span> } spell list. 
            </Grid>
            { cantrip_ids.map((cantrip_id, key) => {
              return (
                <Grid item key={key}>
                  <SelectSpellBox 
                    name={`Cantrip ${key + 1}`} 
                    value={cantrip_id} 
                    level={0}
                    spell_list_id={cfl.list_id}
                    onChange={(id: string) => {
                      const obj = this.props.obj;
                      cantrip_ids[key] = id;
                      feature.feature_options = cantrip_ids;
                      this.props.onChange(obj);
                    }} 
                  />
                </Grid>
              );
            })}
          </Grid>;
      break;
      case "Spells from List":
        const sfl = feature.feature.the_feature as IStringHash;
        const spell_ids = feature.feature_options as string[];
        details = 
          <Grid item container spacing={1} direction="column">
            <Grid item>
              You learn { sfl.count } spells of your choice from { sfl.list_id === "Any" ? <span>any</span> : <span>the <DisplayObjects type="spell_list" ids={[sfl.list_id]} /></span> } spell list. 
              A spell you choose must be of a level you can cast, 
              as shown on the <DisplayObjects type="game_class" ids={[sfl.count_as_class_id]} /> table, or a cantrip. 
              The chosen spells count as <DisplayObjects type="game_class" ids={[sfl.count_as_class_id]} /> spells for you 
              but don’t count against the number of <DisplayObjects type="game_class" ids={[sfl.count_as_class_id]} /> spells you know.
            </Grid>
            { spell_ids.map((spell_id, key) => {
              return (
                <Grid item key={key}>
                  <SelectSpellBox 
                    name={`Spell ${key + 1}`} 
                    value={spell_id} 
                    max_level={+sfl.max_level}
                    spell_list_id={sfl.list_id}
                    onChange={(id: string) => {
                      const obj = this.props.obj;
                      spell_ids[key] = id;
                      feature.feature_options = spell_ids;
                      this.props.onChange(obj);
                    }} 
                  />
                </Grid>
              );
            })}
          </Grid>;
      break;
      case "Skill Proficiency Choices":
        let this_prof = feature.feature.the_feature as Proficiency;
        let feature_skills: string[] = this_prof.the_proficiencies;
        details = 
          <Grid item>
            { feature.feature_options.map((opt, key) => {
              return (
                <SelectSkillBox
                  key={key}
                  name={`Skill ${opt.id + 1}`}
                  value={opt.skill_id as string}
                  color={opt.skill_id === "" ? "blue" : ""}
                  options={feature_skills}
                  ignore_us={Object.keys(this.props.character.skill_proficiencies).filter(id => id !== opt.skill_id)}
                  onChange={(changed: string) => {
                    feature.feature_options[opt.id].skill_id = changed;
                    this.props.onChange(this.props.obj);
                  }}
                />
              );
            })}
          </Grid>;
      break;
      case "Tool Proficiency":
        let tool_prof = feature.feature.the_feature as Proficiency;
        if (tool_prof.the_proficiencies[1] === "") {
          const opt: any = feature.feature_options[0];
          details = 
            <Grid item>
              <SelectToolBox
                name={opt.type}
                value={opt.tool_id}
                color={opt.tool_id === "" ? "blue" : ""}
                type={opt.type}
                ignore_us={Object.keys(this.props.character.tool_proficiencies).filter(id => id !== opt.tool_id)}
                onChange={(changed: string) => {
                  opt.tool_id = changed;
                  this.props.onChange(this.props.obj);
                }}
              />
            </Grid>;
        } else {
          details = 
            <Grid item>
              { feature.feature.name } { feature.feature.description }
            </Grid>;
        }
      break;
      case "Tool Proficiency Choices":
        let this_tool_prof = feature.feature.the_feature as Proficiency;
        let feature_tools: string[] = this_tool_prof.the_proficiencies;
        details = 
          <Grid item>
            { feature.feature_options.map((opt, key) => {
              return (
                <SelectToolBox
                  key={key}
                  name={`Tool ${opt.id + 1}`}
                  value={opt.tool_id as string}
                  color={opt.tool_id === "" ? "blue" : ""}
                  options={feature_tools}
                  ignore_us={Object.keys(this.props.character.tool_proficiencies).filter(id => id !== opt.tool_id)}
                  onChange={(changed: string) => {
                    feature.feature_options[opt.id].tool_id = changed;
                    this.props.onChange(this.props.obj);
                  }}
                />
              );
            })}
          </Grid>;
      break;
      case "Expertise":
        details = 
          <Grid item>
            { feature.feature_options.map((opt, key) => {
              const proficiencies: string[] = [];
              proficiencies.push(opt.skill_id);
              Object.keys(this.props.character.skill_proficiencies).forEach(key => {
                if (this.props.character.skill_proficiencies[key] === 1 && 
                  feature.feature_options.filter(o => o.skill_id === key).length === 0) {
                  proficiencies.push(key);
                }
              });
              return (
                <SelectSkillBox
                  key={key}
                  name={`Expertise ${opt.id + 1}`}
                  value={opt.skill_id as string}
                  color={opt.skill_id === "" ? "blue" : ""}
                  options={proficiencies}
                  onChange={(changed: string) => {
                    feature.feature_options[opt.id].skill_id = changed;
                    this.props.onChange(this.props.obj);
                  }}
                />
              );
            })}
          </Grid>;
      break;
      case "Mystic Arcanum":
        details = 
          <Grid item>
            { feature.feature_options.map((opt, key) => {
              return (
                <span key={key}>Mystic Arcanum {opt.level}</span>
              );
            })}
          </Grid>;
      break;
      case "Spell Mastery":
        details = 
          <Grid item>
            { feature.feature_options.map((opt, key) => {
              return (
                <span key={key}>Spell Mastery {opt.level}</span>
              );
            })}
          </Grid>;
      break;
      case "Special Spell":
        details = 
          <Grid item>
            <CharacterSpecialSpellBox
              character={this.props.character}
              obj={feature}
              class_id={feature.source_id}
              onChange={() => {
                this.props.onChange(this.props.obj);
              }}
            />
          </Grid>;
      break;
      case "Feat":
        details = 
          <Grid item>
            <CharacterFeatBox
              obj={feature.feature_options[0] as CharacterFeat}
              character={this.props.character}
              onChange={(changed: CharacterFeat) => {
                feature.feature_options[0] = changed;
                this.props.onChange(this.props.obj);
              }}
            />
          </Grid>;
      break;
      case "Ability Score Improvement":
        details = 
          <Grid item>
            <CharacterASIBaseFeatureInput
              character={this.props.character}
              obj={feature}
              onChange={(changed: CharacterASIBaseFeature) => {
                feature.feature_options[0] = changed;
                this.props.onChange(this.props.obj);
              }}
            />
          </Grid>;
      break;
      default:
        details = 
          <Grid item>
            <b>{ feature.feature.name }</b> { feature.feature.description }
          </Grid>;
      break;
    }
    return details;
  }
}

export default connector(CharacterFeatureInput);
