import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

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
  MinionAbility,
  SpellAsAbility,
  ItemAffectingAbility,
  ResourceFeature,
  Advantage,
  DamageMultiplier,
  ASIBaseFeature,
  FeatureTemplate,
  TemplateBase,
  BonusSpells,
  SpellBook,
  LanguageFeature,
  SenseFeature,
  SpellcastingFeature,
  UpgradableNumber,
  IStringHash,
  Reroll,
  SpecialSpellFeature
} from "../../../models";
import { 
  FEATURE_TYPES,
  DAMAGE_TYPES,
  ABILITY_SCORES
} from "../../../models/Constants";

import StringBox from "../../input/StringBox";
import SelectStringBox from "../../input/SelectStringBox";
import UpgradableNumberBox from "../../input/UpgradableNumberBox";

import ProficiencyFeatureInput from "./ProficiencyFeature";
import ASIBaseFeatureInput from "./ASIBaseFeature";
import ResourceFeatureInput from "./ResourceFeature";
import ModifierInput from "./Modifier";
import RerollInput from "./Reroll";
import LanguageFeatureInput from "./LanguageFeature";
import SpellModifierInput from "./SpellModifier";
import AdvantageInput from "./Advantage";
import AbilityInput from "./Ability";
import CreatureAbilityInput from "./CreatureAbility";
import MinionAbilityInput from "./MinionAbility";
import BonusSpellsInput from "./BonusSpells";
import SpellAsAbilityInput from "./SpellAsAbility";
import ItemAffectingAbilityInput from "./ItemAffectingAbility";
import TemplateBox from "../TemplateBox";
import SpellBookInput from "./SpellBook";
import SelectSpecialFeatureTypeBox from "../select/SelectSpecialFeatureTypeBox";
import SelectSpecialFeatureBox from "../select/SelectSpecialFeatureBox";
import SelectFightingStyleBox from "../select/SelectFightingStyleBox";
import SelectSpellListBox from "../select/SelectSpellListBox";
import SelectGameClassBox from "../select/SelectGameClassBox";
import DamageMultiplierInput from "./DamageMultiplier";
import SpellcastingFeatureInput from "./SpellcastingFeature";
import SenseFeatureInput from "./SenseFeature";
import SpecialSpellFeatureInput from "./SpecialSpellFeature";

import API from "../../../utilities/smart_api";
import { APIClass } from "../../../utilities/smart_api_class";


interface AppState {
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
});

const mapDispatch = {
  
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  label: string;
  parent_name: string;
  base_name: string | null;
  choice_name: string | null;
  feature: Feature;
  slot_level: number;
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
    choice_name: null,
    slot_level: -1
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
    this.load();
  }

  load() {
    this.setState({ feature: this.props.feature, loading: true }, () => { this.setState({ loading: false }); });
  }

  render() {
    if (this.props.feature.parent_type !== this.state.feature.parent_type || 
      this.props.feature.id !== this.state.feature.id || 
      this.state.loading) {
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
                  this.setState({ feature, loading: true }, () => {
                    this.setState({ loading: false });
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
              value={this.state.feature.true_description} 
              name="Description"
              multiline
              onBlur={(value: string) => {
                const feature = this.state.feature;
                feature.true_description = value;
                this.setState({ feature });
              }}
            />
          </Grid>
          <Grid item>
            <SelectStringBox 
              options={FEATURE_TYPES.sort((a,b) => { return a.localeCompare(b); })}
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
                  case "Fighting Style":
                    the_feature = [];
                  break;
                  case "Reroll":
                    the_feature = new Reroll();
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
                    // the_feature.the_proficiencies.push("");
                  break;
                  case "Tool Proficiencies":
                    the_feature = new Proficiency();
                    the_feature.proficiency_type = feature.feature_type;
                  break;
                  case "Tool Proficiency Choices":
                    the_feature = new Proficiency();
                    the_feature.proficiency_type = feature.feature_type;
                  break;
                  case "Expertise":
                    the_feature = 1;
                  break;
                  case "Jack of All Trades":
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
                  case "Unarmed Strike Size":
                    the_feature = 4;
                  break;
                  case "Unarmed Strike Count":
                    the_feature = 1;
                  break;
                  case "Unarmed Strike Bonus Action":
                    the_feature = true;
                  break;
                  case "Unarmed Strike Damage Type":
                    the_feature = "Bludgeoning";
                  break;
                  case "Unarmed Strike Score":
                    the_feature = "STR";
                  break;
                  case "Extra Attacks":
                    the_feature = 1;
                  break;
                  case "Minion Extra Attacks":
                    the_feature = new UpgradableNumber();
                  break;
                  case "Minion Ability":
                    the_feature = new MinionAbility();
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
                  case "Cantrips from List":
                    the_feature = {
                      list_id: "Any",
                      count: "0",
                      spellcasting_ability: ""
                    };
                  break;
                  case "Spells from List":
                    the_feature = {
                      list_id: "Any",
                      count: "0",
                      count_as_class_id: "",
                      max_level: "0"
                    };
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
                  case "Spell Mastery":
                    the_feature = 1;
                  break;
                  case "Special Spell":
                    the_feature = new SpecialSpellFeature();
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
            feature_details = 
              <span>The player will be able to choose a Pact Boon</span>;
          }
        break;
        case "Jack of All Trades":
          if (typeof this.state.feature.the_feature === "string") {
            feature_details = 
              <span>The player will have half proficiency on all of their non-proficient ability checks.</span>;
          }
        break;
        case "Eldritch Invocation":
          if (typeof this.state.feature.the_feature === "string") {
            feature_details = 
              <span>The player will be able to choose an Eldritch Invocation</span>;
          }
        break;
        case "Fighting Style":
          if (typeof this.state.feature.the_feature === "object") {
            const choices: string[] = this.state.feature.the_feature as string[];
            feature_details = 
              <SelectFightingStyleBox
                name="Fighting Style Options"
                values={choices}
                multiple
                onChange={(changed: string[]) => {
                  const feature = this.state.feature;
                  feature.the_feature = changed;
                  this.setState({ feature });
                }}
              />;
          }
        break;
        case "Reroll":
          if (this.state.feature.the_feature instanceof Reroll) {
            const reroll: Reroll = this.state.feature.the_feature;
            feature_details = 
              <RerollInput
                obj={reroll}
                onChange={(changed: Reroll) => {
                  const feature = this.state.feature;
                  feature.the_feature = changed;
                  this.setState({ feature });
                }}
              />;
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
        case "Tool Proficiencies":
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
        case "Tool Proficiency Choices":
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
        case "Minion Ability":
          if (this.state.feature.the_feature instanceof MinionAbility) {
            const ability: MinionAbility = this.state.feature.the_feature;
            feature_details =
              <MinionAbilityInput 
                obj={ability}
                slot_level={this.props.slot_level}
                onChange={(changed: MinionAbility) => {
                  const feature = this.state.feature;
                  feature.the_feature = changed;
                  this.setState({ feature });
                }}
              />;
          }
        break;
        case "Unarmed Strike Size":
          if (typeof this.state.feature.the_feature === "number") {
            const size: number = this.state.feature.the_feature;
            feature_details =
              <StringBox 
                name="Unarmed Strike Size"
                value={`${size}`}
                type="number"
                onBlur={(changed: string) => {
                  const feature = this.state.feature;
                  feature.the_feature = +changed;
                  this.setState({ feature });
                }}
              />;
          }
        break;
        case "Unarmed Strike Count":
          if (typeof this.state.feature.the_feature === "number") {
            const count: number = this.state.feature.the_feature;
            feature_details =
              <StringBox 
                name="Unarmed Strike Count"
                value={`${count}`}
                type="number"
                onBlur={(changed: string) => {
                  const feature = this.state.feature;
                  feature.the_feature = +changed;
                  this.setState({ feature });
                }}
              />;
          }
        break;
        case "Unarmed Strike Bonus Action":
          feature_details =
            <span>They can do an Unarmed Strike as a Bonus Action</span>;
        break;
        case "Unarmed Strike Damage Type":
          if (typeof this.state.feature.the_feature === "string") {
            const type: string = this.state.feature.the_feature;
            feature_details =
              <SelectStringBox 
                options={DAMAGE_TYPES}
                name="Unarmed Strike Damage Type"
                value={type}
                onChange={(changed: string) => {
                  const feature = this.state.feature;
                  feature.the_feature = changed;
                  this.setState({ feature });
                }}
              />;
          }
        break;
        case "Unarmed Strike Score":
          if (typeof this.state.feature.the_feature === "string") {
            const type: string = this.state.feature.the_feature;
            feature_details =
              <SelectStringBox 
                options={ABILITY_SCORES}
                name="Unarmed Strike Score"
                value={type}
                onChange={(changed: string) => {
                  const feature = this.state.feature;
                  feature.the_feature = changed;
                  this.setState({ feature });
                }}
              />;
          }
        break;
        case "Extra Attacks":
          if (typeof this.state.feature.the_feature === "number") {
            const attacks: number = this.state.feature.the_feature;
            feature_details =
              <StringBox 
                name="Extra Attacks"
                value={`${attacks}`}
                type="number"
                onBlur={(changed: string) => {
                  const feature = this.state.feature;
                  feature.the_feature = +changed;
                  this.setState({ feature });
                }}
              />;
          }
        break;
        case "Minion Extra Attacks":
          if (this.state.feature.the_feature instanceof UpgradableNumber) {
            const attacks: UpgradableNumber = this.state.feature.the_feature;
            feature_details =
              <UpgradableNumberBox 
                name="Minion Extra Attacks"
                slot_level={this.props.slot_level}
                value={attacks} 
                onChange={(changed: UpgradableNumber) => {
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
        break;
        case "Cantrips":
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
        break;
        case "Cantrips from List":
          const cantrips_hash: IStringHash = this.state.feature.the_feature as IStringHash;
          feature_details = 
            <Grid container spacing={1} direction="row">
              <Grid item xs={4}>
                <SelectSpellListBox
                  name="Spell List"
                  allow_any
                  value={cantrips_hash.list_id} 
                  onChange={(value: string) => {
                    const feature = this.state.feature;
                    cantrips_hash.list_id = value;
                    feature.the_feature = cantrips_hash;
                    this.setState({ feature });
                  }} 
                />
              </Grid>
              <Grid item xs={4}>
                <StringBox
                  name="Count"
                  value={cantrips_hash.count} 
                  type="number"
                  onBlur={(value: string) => {
                    const feature = this.state.feature;
                    cantrips_hash.count = value;
                    feature.the_feature = cantrips_hash;
                    this.setState({ feature });
                  }} 
                />
              </Grid>
              <Grid item xs={4}>
                <SelectStringBox
                  name="Spellcasting Ability"
                  options={ABILITY_SCORES}
                  value={cantrips_hash.spellcasting_ability} 
                  onChange={(value: string) => {
                    const feature = this.state.feature;
                    cantrips_hash.spellcasting_ability = value;
                    feature.the_feature = cantrips_hash;
                    this.setState({ feature });
                  }} 
                />
              </Grid>
            </Grid>;
        break;
        case "Spells from List":
          const spells_hash: IStringHash = this.state.feature.the_feature as IStringHash;
          feature_details = 
            <Grid container spacing={1} direction="row">
              <Grid item xs={3}>
                <SelectSpellListBox
                  name="Spell List"
                  allow_any
                  value={spells_hash.list_id} 
                  onChange={(value: string) => {
                    const feature = this.state.feature;
                    spells_hash.list_id = value;
                    feature.the_feature = spells_hash;
                    this.setState({ feature });
                  }} 
                />
              </Grid>
              <Grid item xs={3}>
                <StringBox
                  name="Count"
                  value={spells_hash.count} 
                  type="number"
                  onBlur={(value: string) => {
                    const feature = this.state.feature;
                    spells_hash.count = value;
                    feature.the_feature = spells_hash;
                    this.setState({ feature });
                  }} 
                />
              </Grid>
              <Grid item xs={3}>
                <StringBox
                  name="Max Level"
                  value={spells_hash.max_level} 
                  type="number"
                  onBlur={(value: string) => {
                    const feature = this.state.feature;
                    spells_hash.max_level = value;
                    feature.the_feature = spells_hash;
                    this.setState({ feature });
                  }} 
                />
              </Grid>
              <Grid item xs={3}>
                <SelectGameClassBox
                  name="From Class"
                  value={spells_hash.count_as_class_id} 
                  onChange={(value: string) => {
                    const feature = this.state.feature;
                    spells_hash.count_as_class_id = value;
                    feature.the_feature = spells_hash;
                    this.setState({ feature });
                  }} 
                />
              </Grid>
            </Grid>;
        break;
        case "Ritual Casting":
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
          }
        break;
        case "Spell Mastery":
          if (typeof this.state.feature.the_feature === "number") {
            const level: number = this.state.feature.the_feature;
            feature_details = 
              <StringBox 
                name="Spell Mastery Level" 
                value={`${level}`} 
                type="number"
                onBlur={(value: string) => {
                  const feature = this.state.feature;
                  feature.the_feature = +value;
                  this.setState({ feature });
                }} 
              />;
          }
        break;
        case "Special Spell":
          if (this.state.feature.the_feature instanceof SpecialSpellFeature) {
            const ssf: SpecialSpellFeature = this.state.feature.the_feature;
            feature_details = 
              <SpecialSpellFeatureInput
                feature={ssf}
                onChange={(changed: SpecialSpellFeature) => {
                  const feature = this.state.feature;
                  feature.the_feature = changed;
                  this.setState({ feature });
                }}
              />;
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
