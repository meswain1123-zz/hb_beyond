import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
  Grid, 
} from "@material-ui/core";

import { 
  SpellModifier
} from "../../../models";

import StringBox from "../../input/StringBox";
import SelectStringBox from "../../input/SelectStringBox";
import SelectSpellBox from '../select/SelectSpellBox';

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
  obj: SpellModifier;
  onChange: (changed: SpellModifier) => void; 
}

export interface State { 
}

class SpellModifierInput extends Component<Props, State> {
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
          <SelectSpellBox 
            name="Spell" 
            value={this.props.obj.spell_id} 
            onChange={(id: string) => {
              const obj = this.props.obj;
              obj.spell_id = id;
              this.props.onChange(obj);
            }} 
          />
        </Grid>
        <Grid item>
          <SelectStringBox 
            name="Modifies" 
            options={[
              "Spell DC",
              "Attack",
              "Damage",
              "Range",
              "Casting Time",
              "Bonus Effect",
              "Include Modifier"
            ]}
            value={this.props.obj.modifies} 
            onChange={(value: string) => {
              const obj = this.props.obj;
              obj.modifies = value;
              this.props.onChange(obj);
            }} 
          />
        </Grid>
        <Grid item>
          <StringBox 
            name="Formula" 
            value={this.props.obj.formula} 
            onBlur={(value: string) => {
              const obj = this.props.obj;
              obj.formula = value;
              this.props.onChange(obj);
            }} 
          />
        </Grid>
      </Grid>
    );
  }
}

export default connector(SpellModifierInput);
