import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
  Grid, 
} from "@material-ui/core";

import { 
  Spell,
  SpellModifier
} from "../../../models";

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
  modifier: SpellModifier;
}

export interface State { 
  loading: boolean;
  spells: Spell[] | null;
}

class DisplaySpellModifier extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
      spells: null
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getSetOfObjects(["spell"]).then((res: any) => {
        if (res) {
          this.setState({ 
            spells: res.spell,
            loading: false 
          });
        }
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.spells === null) {
      this.load();
      return <span>Loading</span>;
    } else {
      const modifier = this.props.modifier;
      const spell_finder = this.state.spells.filter(o => o._id === modifier.spell_id);
      let spell: Spell | null = null;
      if (spell_finder.length === 1) {
        spell = spell_finder[0];
      }
      if (spell) {
        return (
          <Grid container spacing={0} direction="column">
            <Grid item>
              <b>{ spell.name }:</b>&nbsp;{ modifier.modifies } is set to { modifier.formula }
            </Grid>
          </Grid>
        );
      }
      return null;
    }
  }
}

export default connector(DisplaySpellModifier);
