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
  SpellModifier
} from "../../../models";
// import { 
//   DAMAGE_TYPES, 
//   // DURATIONS,
//   // COMPONENTS,
//   // CASTING_TIMES,
//   // RESOURCES,
//   ABILITY_SCORES 
// } from "../../../models/Constants";

import StringBox from "../../input/StringBox";
// import SelectBox from "../input/SelectBox";
import SelectStringBox from "../../input/SelectStringBox";
import SelectSpellBox from '../select/SelectSpellBox';

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
  obj: SpellModifier;
  onChange: (changed: SpellModifier) => void; 
}

export interface State { 
  // obj: ResourceFeature;
  // resources: Resource[] | null;
  // loading: boolean;
  // type: Resource | null;
}

class SpellModifierInput extends Component<Props, State> {
  // public static defaultProps = {
  //   choice_name: null
  // };
  constructor(props: Props) {
    super(props);
    this.state = {
      // obj: new ResourceFeature(),
      // resources: null,
      // loading: false,
      // type: null
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
