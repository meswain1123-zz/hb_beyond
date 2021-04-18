import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
// import { RouteComponentProps } from 'react-router';
import {
  Grid, Fab, Tooltip, Button
} from "@material-ui/core";
import {
  DeleteForever
} from "@material-ui/icons";

import { 
  Feature, 
  Modifier, 
  SpellModifier,
  Proficiency, 
  Ability,
  CreatureAbility,
  SpellAsAbility,
  ItemAffectingAbility,
  ResourceFeature,
  Advantage,
  DamageMultiplier,
  // Skill,
  // ArmorType,
  // WeaponKeyword,
  ASIBaseFeature,
  // ModelBase,
  FeatureTemplate,
  TemplateBase,
  BonusSpells,
  SpellBook,
  // SpecialFeature,
  LanguageFeature,
  SenseFeature,
  SpellcastingFeature
} from "../../../models";
import { 
  FEATURE_TYPES,
  // ABILITY_SCORES 
} from "../../../models/Constants";

import StringBox from "../../input/StringBox";
// import SelectBox from "../input/SelectBox";
import SelectStringBox from "../../input/SelectStringBox";
// import CheckBox from "../../input/CheckBox";
import ProficiencyFeatureInput from "./ProficiencyFeature";
import ASIBaseFeatureInput from "./ASIBaseFeature";
import ResourceFeatureInput from "./ResourceFeature";
import ModifierInput from "./Modifier";
import LanguageFeatureInput from "./LanguageFeature";
import SpellModifierInput from "./SpellModifier";
import AdvantageInput from "./Advantage";
import AbilityInput from "./Ability";
import CreatureAbilityInput from "./CreatureAbility";
import BonusSpellsInput from "./BonusSpells";
import SpellAsAbilityInput from "./SpellAsAbility";
import ItemAffectingAbilityInput from "./ItemAffectingAbility";
import TemplateBox from "../TemplateBox";
import SpellBookInput from "./SpellBook";
// import SelectSpellListBox from "../select/SelectSpellListBox";
import SelectSpecialFeatureTypeBox from "../select/SelectSpecialFeatureTypeBox";
import SelectSpecialFeatureBox from "../select/SelectSpecialFeatureBox";
import DamageMultiplierInput from "./DamageMultiplier";
import SpellcastingFeatureInput from "./SpellcastingFeature";
import SenseFeatureInput from "./SenseFeature";

import API from "../../../utilities/smart_api";
import { APIClass } from "../../../utilities/smart_api_class";


interface AppState {
  // abilities: Ability[] | null;
  // skills: Skill[] | null; 
  // // Proficiencies are basically subsets of 
  // // [...skills,...armor_types,...weapon_keywords,...tool_types]
  // // I need to figure out how I want to handle these
  // armor_types: ArmorType[] | null;
  // weapon_keywords: WeaponKeyword[] | null;
  // width: number;
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
  // abilities: state.app.abilities,
  // skills: state.app.skills,
  // armor_types: state.app.armor_types,
  // weapon_keywords: state.app.weapon_keywords,
  // width: state.app.width
})

const mapDispatch = {
  // setAbilities: (objects: Ability[]) => ({ type: 'SET', dataType: 'abilities', payload: objects })
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  label: string;
  parent_name: string;
  base_name: string | null;
  choice_name: string | null;
  feature: Feature;
  // onNameChange: (name: string) => void; 
  // onDescriptionChange: (description: string) => void; 
  onChange: (feature: Feature) => void; 
  onDelete: () => void; 
  onDone: (target: string) => void;
}

export interface State { 
  feature: Feature;
  loading: boolean;
  reloading: boolean;
}

class FeatureInput extends Component<Props, State> {
  public static defaultProps = {
    choice_name: null
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      feature: new Feature(),
      loading: false,
      reloading: false
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  load() {
    this.setState({ feature: this.props.feature });
  }

  render() {
    if (this.props.feature.parent_type !== this.state.feature.parent_type || 
      this.props.feature.id !== this.state.feature.id) {
      this.load();
      return <span>Loading</span>;
    } else if (this.state.reloading) {
      return (
        <Grid item>Loading</Grid>
      );
    } else {
      return (
        <Grid item container spacing={1} direction="column">
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              // disabled={this.state.processing}
              onClick={ () => { 
                this.props.onDone("parent");
              }}>
              { this.props.parent_name === "" ? `Nameless ${this.props.feature.parent_type}` : this.props.parent_name }
            </Button>
            { this.props.base_name &&
              <span>
                &gt;
                <Button
                  variant="contained"
                  color="primary"
                  // disabled={this.state.processing}
                  onClick={ () => { 
                    this.props.onDone("base");
                  }}>
                  { this.props.base_name === "" ? `Nameless Feature Base` : this.props.base_name }
                </Button>
              </span>
            }
            { this.props.choice_name && 
              <span>
                &gt;
                <Button
                  variant="contained"
                  color="primary"
                  // disabled={this.state.processing}
                  onClick={ () => { 
                    this.props.onDone("choice");
                  }}>
                  { this.props.choice_name === "" ? `Nameless Feature Choice` : this.props.choice_name }
                </Button>
              </span>
            }
          </Grid>
          <Grid item container spacing={1} direction="row">
            <Grid item xs={2}>
              <Tooltip title={`Delete ${this.props.label}`}>
                <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                  onClick={ () => {
                    this.props.onDelete();
                  }}>
                  <DeleteForever/>
                </Fab>
              </Tooltip>
            </Grid>
            <Grid item xs={10}>
              <TemplateBox
                obj={this.state.feature}
                type="Feature"
                useTemplate={(template: TemplateBase) => {
                  const feature_template: FeatureTemplate = template as FeatureTemplate;
                  const feature = this.state.feature;
                  feature.copyTemplate(feature_template);
                  this.props.onChange(feature);
                  this.setState({ feature, reloading: true }, () => {
                    this.setState({ reloading: false });
                  });
                }}
              />
            </Grid>
          </Grid>
          <Grid item>
            <StringBox 
              value={this.state.feature.name} 
              name="Name"
              onBlur={(value: string) => {
                const feature = this.state.feature;
                feature.name = value;
                this.setState({ feature });
              }}
            />
          </Grid>
          <Grid item>
            <StringBox 
              value={this.state.feature.description} 
              name="Description"
              multiline
              onBlur={(value: string) => {
                const feature = this.state.feature;
                feature.description = value;
                this.setState({ feature });
              }}
            />
          </Grid>
          <Grid item>
            <SelectStringBox 
              options={FEATURE_TYPES}
              value={this.state.feature.feature_type} 
              name="Feature Type"
              onChange={(value: string) => {
                const feature = this.state.feature;
                feature.feature_type = value;
                let the_feature: any = null;
                switch(feature.feature_type) {
                  case "Language":
                    the_feature = new LanguageFeature();
                  break;
                  case "Pact Boon":
                    the_feature = "Pact Boon";
                  break;
                  case "Eldritch Invocation":
                    the_feature = "Eldritch Invocation";
                  break;
                  case "Modifier":
                    the_feature = new Modifier();
                  break;
                  case "Spell Modifier":
                    the_feature = new SpellModifier();
                  break;
                  case "Specific Special Feature":
                    the_feature = new Proficiency();
                    the_feature.proficiency_type = feature.feature_type;
                  break;
                  case "Special Feature":
                    the_feature = "Special Feature";
                  break;
                  case "Special Feature Choices":
                    the_feature = new Proficiency();
                    the_feature.proficiency_type = feature.feature_type;
                  break;
                  case "Sense":
                    the_feature = new SenseFeature();
                  break;
                  case "Skill Proficiencies":
                    the_feature = new Proficiency();
                    the_feature.proficiency_type = feature.feature_type;
                  break;
                  case "Skill Proficiency Choices":
                    the_feature = new Proficiency();
                    the_feature.proficiency_type = feature.feature_type;
                  break;
                  case "Armor Proficiencies":
                    the_feature = new Proficiency();
                    the_feature.proficiency_type = feature.feature_type;
                  break;
                  case "Weapon Proficiencies":
                    the_feature = new Proficiency();
                    the_feature.proficiency_type = feature.feature_type;
                  break;
                  case "Special Weapon Proficiencies":
                    the_feature = new Proficiency();
                    the_feature.proficiency_type = feature.feature_type;
                  break;
                  case "Saving Throw Proficiencies":
                    the_feature = new Proficiency();
                    the_feature.proficiency_type = feature.feature_type;
                  break;
                  case "Tool Proficiency":
                    the_feature = new Proficiency();
                    the_feature.proficiency_type = feature.feature_type;
                    the_feature.the_proficiencies.push("");
                    the_feature.the_proficiencies.push("");
                  break;
                  case "Expertise":
                    the_feature = 1;
                  break;
                  case "Feat":
                    the_feature = "Feat";
                  break;
                  case "Ability":
                    the_feature = new Ability();
                  break;
                  case "Creature Ability":
                    the_feature = new CreatureAbility();
                  break;
                  case "Spell as Ability":
                    the_feature = new SpellAsAbility();
                  break;
                  case "Item Affecting Ability":
                    the_feature = new ItemAffectingAbility();
                  break;
                  case "Advantage":
                    the_feature = new Advantage();
                  break;
                  case "Damage Multiplier":
                    the_feature = new DamageMultiplier();
                  break;
                  case "Spellcasting":
                    the_feature = new SpellcastingFeature();
                  break;
                  case "Bonus Spells":
                    the_feature = new BonusSpells();
                  break;
                  case "Spell Book":
                    the_feature = new SpellBook();
                  break;
                  case "Spells":
                    the_feature = 0;
                  break;
                  case "Cantrips":
                    the_feature = 0;
                  break;
                  case "Ritual Casting":
                    the_feature = "Ritual Casting";
                  break;
                  case "Resource":
                    the_feature = new ResourceFeature();
                  break;
                  case "Ability Score Improvement":
                    the_feature = new ASIBaseFeature();
                  break;
                  case "Mystic Arcanum":
                    the_feature = 1;
                  break;
                }
                feature.the_feature = the_feature;
                this.setState({ feature });
              }}
            />
          </Grid>
          { this.renderDetails() }
        </Grid>
      );
    }
  }

  renderDetails() {
    let feature_details = <span></span>;
    if (this.state.feature.the_feature !== null) {
      switch(this.state.feature.feature_type) {
        case "Language":
          if (this.state.feature.the_feature instanceof LanguageFeature) {
            const language: LanguageFeature = this.state.feature.the_feature;
            feature_details = 
              <LanguageFeatureInput
                obj={language}
                onChange={(changed: LanguageFeature) => {
                  const feature = this.state.feature;
                  feature.the_feature = changed;
                  this.setState({ feature });
                }}
              />;
          }
        break;
        case "Pact Boon":
          if (typeof this.state.feature.the_feature === "string") {
            // const invocation: string = this.state.feature.the_feature;
            feature_details = 
              <span>The player will be able to choose a Pact Boon</span>;
          }
        break;
        case "Eldritch Invocation":
          if (typeof this.state.feature.the_feature === "string") {
            // const invocation: string = this.state.feature.the_feature;
            feature_details = 
              <span>The player will be able to choose an Eldritch Invocation</span>;
          }
        break;
        case "Modifier":
          if (this.state.feature.the_feature instanceof Modifier) {
            const modifier: Modifier = this.state.feature.the_feature;
            feature_details = 
              <ModifierInput
                obj={modifier}
                onChange={(changed: Modifier) => {
                  const feature = this.state.feature;
                  feature.the_feature = changed;
                  this.setState({ feature });
                }}
              />;
          }
        break;
        case "Spell Modifier":
          if (this.state.feature.the_feature instanceof SpellModifier) {
            const modifier: SpellModifier = this.state.feature.the_feature;
            feature_details = 
              <SpellModifierInput
                obj={modifier}
                onChange={(changed: SpellModifier) => {
                  const feature = this.state.feature;
                  feature.the_feature = changed;
                  this.setState({ feature });
                }}
              />;
          }
        break;
        case "Special Feature":
          if (typeof this.state.feature.the_feature === "string") {
            const type: string = this.state.feature.the_feature;
            feature_details = 
              <SelectSpecialFeatureTypeBox 
                name="Special Feature Type" 
                value={type} 
                onChange={(value: string) => {
                  const feature = this.state.feature;
                  feature.the_feature = value;
                  this.setState({ feature });
                }} 
              />;
          }
        break;
        case "Specific Special Feature":
          if (typeof this.state.feature.the_feature === "string") {
            const type: string = this.state.feature.the_feature;
            feature_details = 
              <SelectSpecialFeatureBox 
                name="Special Feature" 
                value={type} 
                onChange={(value: string) => {
                  const feature = this.state.feature;
                  feature.the_feature = value;
                  this.setState({ feature });
                }} 
              />;
          }
        break;
        case "Special Feature Choices":
          if (this.state.feature.the_feature instanceof Proficiency) {
            const proficiency: Proficiency = this.state.feature.the_feature;
            feature_details = 
              <ProficiencyFeatureInput
                proficiency={proficiency}
                onChange={(changed: Proficiency) => {
                  const feature = this.state.feature;
                  feature.the_feature = changed;
                  this.setState({ feature });
                }}
              />;
          }
        break;
        case "Sense":
          if (this.state.feature.the_feature instanceof SenseFeature) {
            const feature: SenseFeature = this.state.feature.the_feature;
            feature_details = 
              <SenseFeatureInput
                obj={feature}
                onChange={(changed: SenseFeature) => {
                  const feature = this.state.feature;
                  feature.the_feature = changed;
                  this.setState({ feature });
                }}
              />;
          }
        break;
        case "Skill Proficiencies":
          if (this.state.feature.the_feature instanceof Proficiency) {
            const proficiency: Proficiency = this.state.feature.the_feature;
            feature_details = 
              <ProficiencyFeatureInput
                proficiency={proficiency}
                onChange={(changed: Proficiency) => {
                  const feature = this.state.feature;
                  feature.the_feature = changed;
                  this.setState({ feature });
                }}
              />;
          }
        break;
        case "Skill Proficiency Choices":
          if (this.state.feature.the_feature instanceof Proficiency) {
            const proficiency: Proficiency = this.state.feature.the_feature;
            feature_details = 
              <ProficiencyFeatureInput
                proficiency={proficiency}
                onChange={(changed: Proficiency) => {
                  const feature = this.state.feature;
                  feature.the_feature = changed;
                  this.setState({ feature });
                }}
              />;
          }
        break;
        case "Tool Proficiency":
          if (this.state.feature.the_feature instanceof Proficiency) {
            const proficiency: Proficiency = this.state.feature.the_feature;
            feature_details = 
              <ProficiencyFeatureInput
                proficiency={proficiency}
                onChange={(changed: Proficiency) => {
                  const feature = this.state.feature;
                  feature.the_feature = changed;
                  this.setState({ feature });
                }}
              />;
          }
        break;
        case "Armor Proficiencies":
          if (this.state.feature.the_feature instanceof Proficiency) {
            const proficiency: Proficiency = this.state.feature.the_feature;
            feature_details = 
              <ProficiencyFeatureInput
                proficiency={proficiency}
                onChange={(changed: Proficiency) => {
                  const feature = this.state.feature;
                  feature.the_feature = changed;
                  this.setState({ feature });
                }}
              />;
          }
        break;
        case "Weapon Proficiencies":
          if (this.state.feature.the_feature instanceof Proficiency) {
            const proficiency: Proficiency = this.state.feature.the_feature;
            feature_details = 
              <ProficiencyFeatureInput
                proficiency={proficiency}
                onChange={(changed: Proficiency) => {
                  const feature = this.state.feature;
                  feature.the_feature = changed;
                  this.setState({ feature });
                }}
              />;
          }
        break;
        case "Special Weapon Proficiencies":
          if (this.state.feature.the_feature instanceof Proficiency) {
            const proficiency: Proficiency = this.state.feature.the_feature;
            feature_details = 
              <ProficiencyFeatureInput
                proficiency={proficiency}
                onChange={(changed: Proficiency) => {
                  const feature = this.state.feature;
                  feature.the_feature = changed;
                  this.setState({ feature });
                }}
              />;
          }
        break;
        case "Saving Throw Proficiencies":
          if (this.state.feature.the_feature instanceof Proficiency) {
            const proficiency: Proficiency = this.state.feature.the_feature;
            feature_details = 
              <ProficiencyFeatureInput
                proficiency={proficiency}
                onChange={(changed: Proficiency) => {
                  const feature = this.state.feature;
                  feature.the_feature = changed;
                  this.setState({ feature });
                }}
              />;
          }
        break;
        case "Expertise":
          if (typeof this.state.feature.the_feature === "number") {
            const expertise: number = this.state.feature.the_feature;
            feature_details = 
              <StringBox 
                name="Expertise" 
                value={`${expertise}`} 
                type="number"
                onBlur={(value: string) => {
                  const feature = this.state.feature;
                  feature.the_feature = +value;
                  this.setState({ feature });
                }} 
              />;
            // <span>Expertise: { expertise ? "True" : "False" }</span>;
          }
        break;
        case "Ability":
          if (this.state.feature.the_feature instanceof Ability) {
            const ability: Ability = this.state.feature.the_feature;
            feature_details = 
              <AbilityInput 
                obj={ability}
                onChange={(changed: Ability) => {
                  const feature = this.state.feature;
                  feature.the_feature = changed;
                  this.setState({ feature });
                }}
              />;
          }
        break;
        case "Creature Ability":
          if (this.state.feature.the_feature instanceof CreatureAbility) {
            const ability: CreatureAbility = this.state.feature.the_feature;
            feature_details =
              <CreatureAbilityInput 
                obj={ability}
                onChange={(changed: CreatureAbility) => {
                  const feature = this.state.feature;
                  feature.the_feature = changed;
                  this.setState({ feature });
                }}
              />;
          }
        break;
        case "Spell as Ability":
          if (this.state.feature.the_feature instanceof SpellAsAbility) {
            const ability: SpellAsAbility = this.state.feature.the_feature;
            feature_details = 
              <SpellAsAbilityInput 
                obj={ability}
                onChange={(changed: SpellAsAbility) => {
                  const feature = this.state.feature;
                  feature.the_feature = changed;
                  this.setState({ feature });
                }}
              />;
          }
        break;
        case "Item Affecting Ability":
          if (this.state.feature.the_feature instanceof ItemAffectingAbility) {
            const ability: ItemAffectingAbility = this.state.feature.the_feature;
            feature_details = 
              <ItemAffectingAbilityInput 
                obj={ability}
                onChange={(changed: ItemAffectingAbility) => {
                  const feature = this.state.feature;
                  feature.the_feature = changed;
                  this.setState({ feature });
                }}
              />;
          }
        break;
        case "Advantage":
          if (this.state.feature.the_feature instanceof Advantage) {
            const advantage: Advantage = this.state.feature.the_feature;
            feature_details =
              <AdvantageInput
                obj={advantage}
                onChange={(changed: Advantage) => {
                  const feature = this.state.feature;
                  feature.the_feature = changed;
                  this.setState({ feature });
                }}
              />;
          }
        break;
        case "Damage Multiplier":
          if (this.state.feature.the_feature instanceof DamageMultiplier) {
            const resistance: DamageMultiplier = this.state.feature.the_feature;
            feature_details = 
              <DamageMultiplierInput
                obj={resistance}
                onChange={(changed: DamageMultiplier) => {
                  const feature = this.state.feature;
                  feature.the_feature = changed;
                  this.setState({ feature });
                }}
              />;
          }
        break;
        case "Spellcasting": 
          if (this.state.feature.the_feature instanceof SpellcastingFeature) {
            const spellcasting = this.state.feature.the_feature as SpellcastingFeature;
            feature_details = 
              <SpellcastingFeatureInput
                obj={spellcasting}
                onChange={(changed: SpellcastingFeature) => {
                  const feature = this.state.feature;
                  feature.the_feature = changed;
                  this.setState({ feature });
                }}
              />;
          }
        break;
        case "Spellcasting Focus":
          if (typeof this.state.feature.the_feature === "string") {
            const focus: string = this.state.feature.the_feature;
            feature_details = 
              <SelectStringBox 
                name="Spellcasting Focus" 
                options={["Arcane Focus","Holy Symbol","Druidic Focus"]}
                value={focus} 
                onChange={(value: string) => {
                  const feature = this.state.feature;
                  feature.the_feature = value;
                  this.setState({ feature });
                }} 
              />;
          }
        break;
        case "Spell Book":
          if (this.state.feature.the_feature instanceof SpellBook) {
            const book: SpellBook = this.state.feature.the_feature;
            feature_details = 
              <SpellBookInput
                obj={book} 
                onChange={(changed: SpellBook) => {
                  const feature = this.state.feature;
                  feature.the_feature = changed;
                  this.setState({ feature });
                }} 
              />;
          }
        break;
        case "Spells":
          // if (typeof this.state.feature.the_feature === "string") {
            const spells_prepared: string = `${this.state.feature.the_feature}`;
            feature_details = 
              <StringBox 
                name="Spells"
                value={spells_prepared} 
                onBlur={(value: string) => {
                  const feature = this.state.feature;
                  feature.the_feature = value;
                  this.setState({ feature });
                }} 
              />;
          // }
        break;
        case "Cantrips":
          // if (typeof this.state.feature.the_feature === "string") {
            const cantrips_known: string = `${this.state.feature.the_feature}`;
            feature_details = 
              <StringBox 
                name="Cantrips"
                value={cantrips_known} 
                onBlur={(value: string) => {
                  const feature = this.state.feature;
                  feature.the_feature = value;
                  this.setState({ feature });
                }} 
              />;
          // }
        break;
        case "Ritual Casting":
          // feature_details = <span>Ritual Casting</span>;
        break;
        case "Bonus Spells":
          if (this.state.feature.the_feature instanceof BonusSpells) {
            const list: BonusSpells = this.state.feature.the_feature;
            feature_details = 
              <BonusSpellsInput
                obj={list} 
                onChange={(changed: BonusSpells) => {
                  const feature = this.state.feature;
                  feature.the_feature = changed;
                  this.setState({ feature });
                }} 
              />;
          }
        break;
        case "Feat":
          feature_details = <span>The player will be able to select a Feat.</span>;
        break;
        case "Resource":
          if (this.state.feature.the_feature instanceof ResourceFeature) {
            const resource_feature: ResourceFeature = this.state.feature.the_feature;
            feature_details = 
              <ResourceFeatureInput
                obj={resource_feature}
                onChange={(changed: ResourceFeature) => {
                  const feature = this.state.feature;
                  feature.the_feature = changed;
                  this.setState({ feature });
                }}
              />;
          }
        break;
        case "Ability Score Improvement":
          if (this.state.feature.the_feature instanceof ASIBaseFeature) {
            const asi: ASIBaseFeature = this.state.feature.the_feature;
            feature_details = 
              <ASIBaseFeatureInput
                asi_base_feature={asi}
                onChange={(changed: ASIBaseFeature) => {
                  const feature = this.state.feature;
                  feature.the_feature = changed;
                  this.setState({ feature });
                }}
              />;
          }
        break;
        case "Mystic Arcanum":
          if (typeof this.state.feature.the_feature === "number") {
            const level: number = this.state.feature.the_feature;
            feature_details = 
              <StringBox 
                name="Mystic Arcanum Level" 
                value={`${level}`} 
                type="number"
                onBlur={(value: string) => {
                  const feature = this.state.feature;
                  feature.the_feature = +value;
                  this.setState({ feature });
                }} 
              />;
            // <span>Expertise: { expertise ? "True" : "False" }</span>;
          }
        break;
      }
    }
    return (
      <Grid item>
        { feature_details }
      </Grid>
    );
  }
}

export default connector(FeatureInput);
