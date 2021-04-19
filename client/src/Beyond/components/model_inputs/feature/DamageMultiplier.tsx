import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
  Grid, 
} from "@material-ui/core";

import { 
  DamageMultiplier
} from "../../../models";
import { 
  DAMAGE_TYPES, 
  MULTIPLIER_MAP 
} from "../../../models/Constants";

import SelectStringBox from "../../input/SelectStringBox";

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
  obj: DamageMultiplier;
  onChange: (changed: DamageMultiplier) => void; 
}

export interface State { 
}

class DamageMultiplierInput extends Component<Props, State> {
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
            name="Damage Types" 
            multiple
            options={DAMAGE_TYPES}
            values={this.props.obj.damage_types} 
            onChange={(values: string[]) => {
              const obj = this.props.obj;
              obj.damage_types = values;
              this.props.onChange(obj);
            }} 
          />
        </Grid>
        <Grid item>
          <SelectStringBox 
            name="Multiplier" 
            option_map={MULTIPLIER_MAP}
            value={this.props.obj.multiplier} 
            onChange={(value: number) => {
              const obj = this.props.obj;
              obj.multiplier = value;
              this.props.onChange(obj);
            }} 
          />
        </Grid>
      </Grid>
    );
  }
}

export default connector(DamageMultiplierInput);
