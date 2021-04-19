import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
  Grid, 
} from "@material-ui/core";

import { 
  Character,
  CharacterFeat,
  CharacterFeature,
  CharacterFeatureBase,
  CharacterFeatureChoice,
  CharacterASIBaseFeature,
  CharacterLanguageFeature,
  CharacterSense,
  Proficiency,
  Subclass,
  Sense
} from "../../../models";

import CharacterASIBaseFeatureInput from "./CharacterASIBaseFeature";
import CharacterLanguageFeatureInput from "./CharacterLanguageFeature";
import CharacterEldritchInvocationBox from "./CharacterEldritchInvocationBox";
import CharacterSpecialFeatureBox from "./CharacterSpecialFeatureBox";
import CharacterPactBoonBox from "./CharacterPactBoonBox";
import CharacterFeatBox from "./CharacterFeatBox";
import SelectToolBox from "../select/SelectToolBox";
import SelectSkillBox from "../select/SelectSkillBox";
import SelectSubclassBox from "../select/SelectSubclassBox";

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
  obj: CharacterFeatureBase;
  character: Character;
  onChange: (changed: CharacterFeatureBase) => void;
}

export interface State {
  subclasses: Subclass[] | null;
  senses: Sense[] | null;
  loading: boolean;
}

class CharacterFeatureBaseInput extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      subclasses: null,
      senses: null,
      loading: false
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getSetOfObjects(["subclass","sense"]).then((res: any) => {
        this.setState({ 
          subclasses: res.subclass,
          senses: res.sense,
          loading: false 
        });
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.subclasses === null) {
      this.load();
      return <span>Loading</span>;
    } else {
      return (
        <Grid item container spacing={1} direction="column">
          { this.props.obj.feature_base && this.props.obj.feature_base.description !== "" &&
            <Grid item>
              { this.props.obj.feature_base.description }
            </Grid>
          }
          { this.props.obj.features.map((feature, key) => {
            return (
              <Grid item key={key} container spacing={1} direction="column">
                { feature.feature.description !== "" &&
                  <Grid item>
                    { feature.feature.description }
                  </Grid>
                }
                { this.render_feature_details(feature) }
              </Grid>
            );
          })}
          { this.props.obj.feature_choices.map((feature_choice, key) => {
            return (
              <Grid item key={key}>
                { feature_choice.feature_choice?.description !== "" &&
                  <Grid item>
                    { feature_choice.feature_choice?.description }
                  </Grid>
                }
                { this.render_feature_choice(feature_choice) }
              </Grid>
            );
          })}
        </Grid>
      );
    }
  }

  render_feature_details(feature: CharacterFeature) {
    // switch based on feature type
    let details = 
      <Grid item>
        { feature.feature.name }
      </Grid>;
    switch(feature.feature.feature_type) {
      case "Subclass":
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
      case "Modifier":
        details = 
          <Grid item>
            { feature.feature.name }
          </Grid>;
      break;
      case "Spell Modifier":
        details = 
          <Grid item>
            { feature.feature.name }
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
      case "Skill Proficiencies":
      case "Armor Proficiencies":
      case "Weapon Proficiencies":
      case "Special Weapon Proficiencies":
      case "Saving Throw Proficiencies":
        details = 
          <Grid item>
            { feature.feature.name } { feature.feature.description }
          </Grid>;
      break;
      case "Expertise":
        details = 
          <Grid item>
            { feature.feature_options.map((opt, key) => {
              const proficiencies: string[] = [];
              proficiencies.push(opt.skill_id);
              Object.keys(this.props.character.skill_proficiencies).forEach(key => {
                if (this.props.character.skill_proficiencies[key] === 1) {
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
      case "Ability":
        details = 
          <Grid item>
            { feature.feature.name }
          </Grid>;
      break;
      case "Creature Ability":
        details = 
          <Grid item>
            { feature.feature.name }
          </Grid>;
      break;
      case "Minion Ability":
        details = 
          <Grid item>
            { feature.feature.name }
          </Grid>;
      break;
      case "Spell as Ability":
        details = 
          <Grid item>
            { feature.feature.name }
          </Grid>;
      break;
      case "Item Affecting Ability":
        details = 
          <Grid item>
            { feature.feature.name }
          </Grid>;
      break;
      case "Advantage":
        details = 
          <Grid item>
            { feature.feature.name }
          </Grid>;
      break;
      case "Damage Multiplier":
        details = 
          <Grid item>
            { feature.feature.name }
          </Grid>;
      break;
      case "Spellcasting":
        details = 
          <Grid item>
            { feature.feature.name }
          </Grid>;
      break;
      case "Spellcasting Focus":
        details = 
          <Grid item>
            { feature.feature.name }
          </Grid>;
      break;
      case "Bonus Spells":
        details = 
          <Grid item>
            { feature.feature.name }
          </Grid>;
      break;
      case "Spell Book":
        details = 
          <Grid item>
            { feature.feature.name }
          </Grid>;
      break;
      case "Spells":
        details = 
          <Grid item>
            { feature.feature.name }
          </Grid>;
      break;
      case "Cantrips":
        details = 
          <Grid item>
            { feature.feature.name }
          </Grid>;
      break;
      case "Ritual Casting":
        details = 
          <Grid item>
            { feature.feature.name }
          </Grid>;
      break;
      case "Resource":
        details = 
          <Grid item>
            { feature.feature.name }
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
    }
    return details;
  }

  render_feature_choice(feature: CharacterFeatureChoice) {
    // switch based on feature type
    let details = 
      <Grid item>
        { feature.choice_count }
      </Grid>;
    return details;
  }
}

export default connector(CharacterFeatureBaseInput);
