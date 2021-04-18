import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
// import { RouteComponentProps } from 'react-router';
import {
  Grid, 
  // Link
} from "@material-ui/core";
// import {
//   DeleteForever
// } from "@material-ui/icons";

import { 
  // Spell, 
  // SpellList, 
  SpellBook
} from "../../../models";
import { 
  ABILITY_SCORES
} from "../../../models/Constants";

import StringBox from "../../input/StringBox";
// import SelectBox from "../input/SelectBox";
import SelectStringBox from "../../input/SelectStringBox";
// import CheckBox from "../input/CheckBox";
import SelectSpellListBox from "../select/SelectSpellListBox";

import API from "../../../utilities/smart_api";
import { APIClass } from "../../../utilities/smart_api_class";


interface AppState {
  // resources: Resource[] | null;
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
  // resources: state.app.resources
})

const mapDispatch = {
  // setAbilities: (objects: Ability[]) => ({ type: 'SET', dataType: 'abilities', payload: objects })
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  obj: SpellBook;
  onChange: (changed: SpellBook) => void; 
}

export interface State { 
}

class SpellBookInput extends Component<Props, State> {
  // public static defaultProps = {
  //   choice_name: null
  // };
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
          <StringBox 
            name="Spells at Level 1"
            type="number"
            value={`${this.props.obj.spells_at_level_1}`}
            onBlur={(value: number) => {
              const obj = this.props.obj;
              obj.spells_at_level_1 = value;
              this.props.onChange(obj);
            }}
          /> 
        </Grid>
        <Grid item>
          <StringBox 
            name="Add Spells per Level"
            type="number"
            value={`${this.props.obj.spells_add_per_level}`}
            onBlur={(value: number) => {
              const obj = this.props.obj;
              obj.spells_add_per_level = value;
              this.props.onChange(obj);
            }}
          /> 
        </Grid>
        <Grid item>
          <SelectStringBox 
            name="Learn Extra Spells based on Ability"
            options={ABILITY_SCORES}
            value={this.props.obj.extra_booked_from_ability}
            onChange={(value: string) => {
              const obj = this.props.obj;
              obj.extra_booked_from_ability = value;
              this.props.onChange(obj);
            }}
          /> 
        </Grid>
        <Grid item>
          <SelectStringBox 
            name="Limitations"
            options={["All","No Cantrips","Rituals Only"]}
            value={this.props.obj.limitations}
            onChange={(value: string) => {
              const obj = this.props.obj;
              obj.limitations = value;
              this.props.onChange(obj);
            }}
          /> 
        </Grid>
        <Grid item>
          <SelectSpellListBox
            name="Only Spells from List" 
            value={ this.props.obj.spell_list } 
            onChange={(value: string) => {
              const obj = this.props.obj;
              obj.spell_list = value;
              this.props.onChange(obj);
            }} 
          />
        </Grid>
      </Grid>
    );
  }
}

export default connector(SpellBookInput);
