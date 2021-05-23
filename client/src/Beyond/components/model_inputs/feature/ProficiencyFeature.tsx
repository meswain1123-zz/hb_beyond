import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
  Grid, 
} from "@material-ui/core";

import { 
  Proficiency, 
} from "../../../models";
import { 
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
import CheckBox from '../../input/CheckBox';


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
  proficiency: Proficiency;
  onChange: (proficiency: Proficiency) => void; 
}

export interface State { 
  obj: Proficiency;
  loading: boolean;
}

class ProficiencyFeatureInput extends Component<Props, State> {
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
    // if (this.state.loading || 
    //   this.props.proficiency.proficiency_type !== this.state.obj.proficiency_type || 
    //   this.props.proficiency.the_proficiencies !== this.state.obj.the_proficiencies) {
    //   this.setState({ loading: false, obj: this.props.proficiency });
    //   return (
    //     <Grid item>Loading</Grid>
    //   );
    // } else {
      return (
        <Grid container spacing={1} direction="column">
          <Grid item>
            { this.props.proficiency.proficiency_type === "Saving Throw Proficiencies" ?
              <SelectStringBox 
                name="Saving Throw Proficiencies" 
                options={ABILITY_SCORES} 
                multiple
                values={this.props.proficiency.the_proficiencies} 
                onChange={(ids: string[]) => {
                  const obj = this.props.proficiency;
                  obj.the_proficiencies = [...ids];
                  this.props.onChange(obj);
                  this.setState({ obj });
                }} 
              />
            : this.props.proficiency.proficiency_type === "Skill Proficiencies" ?
              <SelectSkillBox 
                name="Skill Proficiencies"  
                multiple
                values={this.props.proficiency.the_proficiencies} 
                onChange={(ids: string[]) => {
                  const obj = this.props.proficiency;
                  obj.the_proficiencies = [...ids];
                  this.props.onChange(obj);
                  this.setState({ obj });
                }} 
              />
            : this.props.proficiency.proficiency_type === "Skill Proficiency Choices" ?
              <SelectSkillBox 
                name="Skill Proficiency Options" 
                multiple
                values={this.props.proficiency.the_proficiencies} 
                onChange={(ids: string[]) => {
                  const obj = this.props.proficiency;
                  obj.the_proficiencies = [...ids];
                  this.props.onChange(obj);
                  this.setState({ obj });
                }} 
              />
            : this.props.proficiency.proficiency_type === "Armor Proficiencies" ?
              <SelectArmorTypeBox 
                name="Armor Type Proficiencies"  
                multiple
                values={this.props.proficiency.the_proficiencies} 
                onChange={(ids: string[]) => {
                  const obj = this.props.proficiency;
                  obj.the_proficiencies = [...ids];
                  this.props.onChange(obj);
                  this.setState({ obj });
                }} 
              />
            : this.props.proficiency.proficiency_type === "Weapon Proficiencies" ?
              <SelectWeaponKeywordBox 
                name="Weapon Keyword Proficiencies"  
                multiple
                values={this.props.proficiency.the_proficiencies} 
                onChange={(ids: string[]) => {
                  const obj = this.props.proficiency;
                  obj.the_proficiencies = [...ids];
                  this.props.onChange(obj);
                  this.setState({ obj });
                }} 
              />
            : this.props.proficiency.proficiency_type === "Special Weapon Proficiencies" ?
              <SelectBaseItemBox 
                name="Special Weapon Proficiencies"  
                multiple
                values={this.props.proficiency.the_proficiencies} 
                onChange={(ids: string[]) => {
                  const obj = this.props.proficiency;
                  obj.the_proficiencies = [...ids];
                  this.props.onChange(obj);
                  this.setState({ obj });
                }} 
              />
            : this.props.proficiency.proficiency_type === "Special Feature Choices" ?
              <SelectSpecialFeatureBox 
                name="Special Feature Options" 
                multiple
                values={this.props.proficiency.the_proficiencies} 
                onChange={(ids: string[]) => {
                  const obj = this.props.proficiency;
                  obj.the_proficiencies = [...ids];
                  this.props.onChange(obj);
                  this.setState({ obj });
                }} 
              />
            : this.props.proficiency.proficiency_type === "Tool Proficiency" ?
              <SelectToolTypeBox 
                name="Tool Type" 
                value={this.props.proficiency.the_proficiencies[0]} 
                onChange={(type: string) => {
                  const obj = this.props.proficiency;
                  obj.the_proficiencies[0] = type;
                  this.props.onChange(obj);
                  this.setState({ obj });
                }} 
              />
            : this.props.proficiency.proficiency_type === "Tool Proficiencies" ?
              <SelectToolBox 
                name="Tool Proficiencies"  
                multiple
                values={this.props.proficiency.the_proficiencies} 
                onChange={(ids: string[]) => {
                  const obj = this.props.proficiency;
                  obj.the_proficiencies = [...ids];
                  this.props.onChange(obj);
                  this.setState({ obj });
                }} 
              />
            : this.props.proficiency.proficiency_type === "Tool Proficiency Choices" &&
              <SelectToolBox 
                name="Tool Proficiency Options" 
                allow_types
                multiple
                values={this.props.proficiency.the_proficiencies} 
                onChange={(ids: string[]) => {
                  const obj = this.props.proficiency;
                  obj.the_proficiencies = [...ids];
                  this.props.onChange(obj);
                  this.setState({ obj });
                }} 
              />
            }
          </Grid>
            { this.props.proficiency.proficiency_type === "Tool Proficiency" && this.props.proficiency.the_proficiencies[0] !== "" && 
              <Grid item>
                <SelectToolBox 
                  name="Specific Tool" 
                  type={this.props.proficiency.the_proficiencies[0]}
                  value={this.props.proficiency.the_proficiencies[1]} 
                  onChange={(id: string) => {
                    const obj = this.props.proficiency;
                    obj.the_proficiencies[1] = id;
                    this.props.onChange(obj);
                    this.setState({ obj });
                  }} 
                />
              </Grid>
            }
            { (["Skill Proficiency Choices","Tool Proficiency Choices","Special Feature Choices"].includes(this.props.proficiency.proficiency_type)) && 
              <Grid item>
                <StringBox 
                  name="Choice Count"
                  value={`${this.props.proficiency.choice_count}`} 
                  type="number"
                  onBlur={(value: number) => {
                    const obj = this.props.proficiency;
                    obj.choice_count = value;
                    this.props.onChange(obj);
                    this.setState({ obj });
                  }} 
                />
              </Grid>
            }
            { this.props.proficiency.proficiency_type.includes("Skill") && 
              <Grid item>
                <CheckBox 
                  name="Double" 
                  value={this.props.proficiency.double} 
                  onChange={(e: boolean) => {
                    const obj = this.props.proficiency;
                    obj.double = e;
                    this.setState({ obj });
                  }} 
                />
              </Grid>
            }
        </Grid>
      );
    // }
  }
}

export default connector(ProficiencyFeatureInput);
