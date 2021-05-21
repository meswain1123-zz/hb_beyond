import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
  Grid, 
} from "@material-ui/core";

import { 
  Reroll
} from "../../../models";
import { 
  DAMAGE_TYPES
} from "../../../models/Constants";

import StringBox from "../../input/StringBox";
import SelectStringBox from "../../input/SelectStringBox";

import SelectArmorTypeBox from "../select/SelectArmorTypeBox";
import SelectWeaponKeywordBox from "../select/SelectWeaponKeywordBox";

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
  obj: Reroll;
  onChange: (changed: Reroll) => void; 
}

export interface State { 
}

class RerollInput extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  render() {
    return (
      <Grid container spacing={1} direction="column">
        <Grid item>
          <SelectStringBox 
            name="Allowed Damage Types" 
            options={["ALL",...DAMAGE_TYPES]}
            values={this.props.obj.allowed_damage_types} 
            multiple
            onChange={(values: string[]) => {
              const obj = this.props.obj;
              obj.allowed_damage_types = values;
              this.props.onChange(obj);
            }} 
          />
        </Grid>
        <Grid item>
          <SelectArmorTypeBox 
            name="Allowed Armor Types" 
            values={this.props.obj.allowed_armor_types} 
            multiple
            allow_all
            onChange={(values: string[]) => {
              const obj = this.props.obj;
              obj.allowed_armor_types = values;
              this.props.onChange(obj);
            }} 
          />
        </Grid>
        <Grid item>
          <SelectArmorTypeBox 
            name="Required Armor Types" 
            values={this.props.obj.required_armor_types} 
            multiple
            allow_none
            allow_any
            onChange={(values: string[]) => {
              const obj = this.props.obj;
              obj.required_armor_types = values;
              this.props.onChange(obj);
            }} 
          />
        </Grid>
        <Grid item>
          <SelectWeaponKeywordBox 
            name="Excluded Weapon Keywords" 
            values={this.props.obj.excluded_weapon_keywords} 
            multiple
            allow_none
            allow_any
            allow_all
            onChange={(values: string[]) => {
              const obj = this.props.obj;
              obj.excluded_weapon_keywords = values;
              this.props.onChange(obj);
            }} 
          />
        </Grid>
        <Grid item>
          <SelectWeaponKeywordBox 
            name="Required Weapon Keywords" 
            values={this.props.obj.required_weapon_keywords} 
            multiple
            allow_none
            allow_any
            onChange={(values: string[]) => {
              const obj = this.props.obj;
              obj.required_weapon_keywords = values;
              this.props.onChange(obj);
            }} 
          />
        </Grid>
        <Grid item>
          <StringBox 
            name="Threshold" 
            value={`${this.props.obj.threshold}`} 
            type="number"
            onBlur={(value: string) => {
              const obj = this.props.obj;
              obj.threshold = +value;
              this.props.onChange(obj);
            }} 
          />
        </Grid>
      </Grid>
    );
  }
}

export default connector(RerollInput);
