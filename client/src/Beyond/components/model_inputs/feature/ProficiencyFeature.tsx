import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
// import { RouteComponentProps } from 'react-router';
import {
  Grid, 
  // Fab, Tooltip, Button
} from "@material-ui/core";
// import {
//   DeleteForever
// } from "@material-ui/icons";

import { 
  // Feature, 
  // Modifier, 
  Proficiency, 
  // Ability,
  // ResourceFeature,
  // Advantage,
  // DamageMultiplier,
  // Language,
  // Skill,
  // ArmorType,
  // WeaponKeyword,
  // ModelBase,
} from "../../../models";
import { 
  // DAMAGE_TYPES, 
  // DURATIONS,
  // COMPONENTS,
  // CASTING_TIMES,
  // RESOURCES,
  ABILITY_SCORES 
} from "../../../models/Constants";

import StringBox from "../../input/StringBox";
import SelectStringBox from "../../input/SelectStringBox";
import SelectSkillBox from "../select/SelectSkillBox";
import SelectToolTypeBox from "../select/SelectToolTypeBox";
import SelectToolBox from "../select/SelectToolBox";
import SelectArmorTypeBox from "../select/SelectArmorTypeBox";
import SelectWeaponKeywordBox from "../select/SelectWeaponKeywordBox";
import SelectSpecialFeatureBox from "../select/SelectSpecialFeatureBox";
import SelectBaseItemBox from "../select/SelectBaseItemBox";
// import SelectLanguageBox from "../select/SelectLanguageBox";
import CheckBox from '../../input/CheckBox';


interface AppState {
  // skills: Skill[]; 
  // armor_types: ArmorType[];
  // weapon_keywords: WeaponKeyword[];
  // languages: Language[];
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
  // skills: state.app.skills,
  // armor_types: state.app.armor_types,
  // weapon_keywords: state.app.weapon_keywords,
  // languages: state.app.languages
})

const mapDispatch = {
  // setAbilities: (objects: Ability[]) => ({ type: 'SET', dataType: 'abilities', payload: objects })
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  proficiency: Proficiency;
  // onNameChange: (name: string) => void; 
  // onDescriptionChange: (description: string) => void; 
  onChange: (proficiency: Proficiency) => void; 
}

export interface State { 
  obj: Proficiency;
  loading: boolean;
}

class ProficiencyFeatureInput extends Component<Props, State> {
  // public static defaultProps = {
  //   choice_name: null
  // };
  constructor(props: Props) {
    super(props);
    this.state = {
      obj: new Proficiency(),
      loading: true
    };
  }

  componentDidMount() {
  }

  render() {
    if (this.state.loading || 
      this.props.proficiency.proficiency_type !== this.state.obj.proficiency_type || 
      this.props.proficiency.the_proficiencies !== this.state.obj.the_proficiencies) {
      this.setState({ loading: false, obj: this.props.proficiency });
      return (
        <Grid item>Loading</Grid>
      );
    } else {
      return (
        <Grid container spacing={1} direction="column">
          <Grid item>
            { this.state.obj.proficiency_type === "Saving Throw Proficiencies" ?
              <SelectStringBox 
                name="Saving Throw Proficiencies" 
                options={ABILITY_SCORES} 
                multiple
                values={this.state.obj.the_proficiencies} 
                onChange={(ids: string[]) => {
                  const obj = this.state.obj;
                  obj.the_proficiencies = [...ids];
                  this.props.onChange(obj);
                  this.setState({ obj });
                }} 
              />
            : this.state.obj.proficiency_type === "Skill Proficiencies" ?
              <SelectSkillBox 
                name="Skill Proficiencies"  
                multiple
                values={this.state.obj.the_proficiencies} 
                onChange={(ids: string[]) => {
                  const obj = this.state.obj;
                  obj.the_proficiencies = [...ids];
                  this.props.onChange(obj);
                  this.setState({ obj });
                }} 
              />
            : this.state.obj.proficiency_type === "Skill Proficiency Choices" ?
              <SelectSkillBox 
                name="Skill Proficiency Options" 
                multiple
                values={this.state.obj.the_proficiencies} 
                onChange={(ids: string[]) => {
                  const obj = this.state.obj;
                  obj.the_proficiencies = [...ids];
                  this.props.onChange(obj);
                  this.setState({ obj });
                }} 
              />
            : this.state.obj.proficiency_type === "Armor Proficiencies" ?
              <SelectArmorTypeBox 
                name="Armor Type Proficiencies"  
                multiple
                values={this.state.obj.the_proficiencies} 
                onChange={(ids: string[]) => {
                  const obj = this.state.obj;
                  obj.the_proficiencies = [...ids];
                  this.props.onChange(obj);
                  this.setState({ obj });
                }} 
              />
            : this.state.obj.proficiency_type === "Weapon Proficiencies" ?
              <SelectWeaponKeywordBox 
                name="Weapon Keyword Proficiencies"  
                multiple
                values={this.state.obj.the_proficiencies} 
                onChange={(ids: string[]) => {
                  const obj = this.state.obj;
                  obj.the_proficiencies = [...ids];
                  this.props.onChange(obj);
                  this.setState({ obj });
                }} 
              />
            : this.state.obj.proficiency_type === "Special Weapon Proficiencies" ?
              <SelectBaseItemBox 
                name="Special Weapon Proficiencies"  
                multiple
                values={this.state.obj.the_proficiencies} 
                onChange={(ids: string[]) => {
                  const obj = this.state.obj;
                  obj.the_proficiencies = [...ids];
                  this.props.onChange(obj);
                  this.setState({ obj });
                }} 
              />
            : this.state.obj.proficiency_type === "Special Feature Choices" ?
              <SelectSpecialFeatureBox 
                name="Special Feature Options" 
                multiple
                values={this.state.obj.the_proficiencies} 
                onChange={(ids: string[]) => {
                  const obj = this.state.obj;
                  obj.the_proficiencies = [...ids];
                  this.props.onChange(obj);
                  this.setState({ obj });
                }} 
              />
            : this.state.obj.proficiency_type === "Tool Proficiency" &&
              <SelectToolTypeBox 
                name="Tool Type" 
                value={this.state.obj.the_proficiencies[0]} 
                onChange={(type: string) => {
                  const obj = this.state.obj;
                  obj.the_proficiencies[0] = type;
                  this.props.onChange(obj);
                  this.setState({ obj });
                }} 
              />
            }
          </Grid>
            { this.state.obj.proficiency_type === "Tool Proficiency" && this.state.obj.the_proficiencies[0] !== "" && 
              <Grid item>
                <SelectToolBox 
                  name="Specific Tool" 
                  type={this.state.obj.the_proficiencies[0]}
                  value={this.state.obj.the_proficiencies[1]} 
                  onChange={(id: string) => {
                    const obj = this.state.obj;
                    obj.the_proficiencies[1] = id;
                    this.props.onChange(obj);
                    this.setState({ obj });
                  }} 
                />
              </Grid>
            }
            { (this.state.obj.proficiency_type === "Skill Proficiency Choices" || this.state.obj.proficiency_type === "Special Feature Choices") && 
              <Grid item>
                <StringBox 
                  name="Choice Count"
                  value={`${this.state.obj.choice_count}`} 
                  type="number"
                  onBlur={(value: number) => {
                    const obj = this.state.obj;
                    obj.choice_count = value;
                    this.props.onChange(obj);
                    this.setState({ obj });
                  }} 
                />
              </Grid>
            }
            { this.state.obj.proficiency_type.includes("Skill") && 
              <Grid item>
                <CheckBox 
                  name="Double" 
                  value={this.state.obj.double} 
                  onChange={(e: boolean) => {
                    const obj = this.state.obj;
                    obj.double = e;
                    this.setState({ obj });
                  }} 
                />
              </Grid>
            }
        </Grid>
      );
    }
  }
}

export default connector(ProficiencyFeatureInput);
