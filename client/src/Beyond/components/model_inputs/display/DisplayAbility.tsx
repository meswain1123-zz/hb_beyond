import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
  Grid, 
} from "@material-ui/core";

import { 
  Character,
  // Creature,
  // CharacterResource,
  // ResourceFeature,
  Resource,
  Ability,
  SpellAsAbility,
  ItemAffectingAbility
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
  obj: Character;
  ability: Ability | SpellAsAbility | ItemAffectingAbility;
  onChange: () => void;
}

export interface State { 
  loading: boolean;
  resources: Resource[] | null;
}

class DisplayAbility extends Component<Props, State> {
  // public static defaultProps = {
  //   choice_name: null
  // };
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
      resources: null
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getSetOfObjects(["resource"]).then((res: any) => {
        if (res) {
          this.setState({ 
            resources: res.resource,
            loading: false 
          });
        }
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.resources === null) {
      this.load();
      return <span>Loading</span>;
    } else {
      const ability = this.props.ability;
      let details: any = null;
      if (ability.resource_consumed) {
        // Eventually I'll add buttons for using it which will 
        // consume the resource
        // const char_resource_finder = this.props.obj.resources.filter(o => o.type_id === ability.resource_consumed);
        // console.log(char_resource_finder);
        // if (char_resource_finder.length === 1) {
        //   return (
        //     <Grid container spacing={0} direction="column">
        //       <Grid item>
        //         <b>{ r.name }:</b>&nbsp;{ this.renderSlots(char_resource_finder[0]) }
        //       </Grid>
        //     </Grid>
        //   );
        // }
      } else if (!(ability instanceof ItemAffectingAbility) && ability.concentration) {
        // Eventually I'll make a button for casting it which will set it as the concentration
      }
      if (ability instanceof Ability) {
        return (
          <Grid container spacing={0} direction="column">
            { ability.description === "" ?
              <Grid item>
                { ability.name }
              </Grid>
            :
              <Grid item>
                <b>{ ability.name }:</b>&nbsp;{ ability.description }
              </Grid>
            }
            <Grid item>
              { details }
            </Grid>
          </Grid>
        );
      } else if (ability instanceof SpellAsAbility) {
        const spell = ability.spell;
        if (spell) {
          let description = "";
          if (spell.level === 0) {
            description = `You know the ${spell.name} cantrip. ${ability.spellcasting_ability} is your spellcasting ability for it`;
          } else {
            // description = `You know the level ${spell.name} cantrip. ${ability.spellcasting_ability} is your spellcasting ability for it`;
            // for non-cantrips, it may be a special resource only, or a resource and then slot thing, or it could be ritual only
            console.log(ability);
          }
          return (
            <Grid container spacing={0} direction="column">
              <Grid item>
                { description }
              </Grid>
            </Grid>
          );
        }
      } else if (ability instanceof ItemAffectingAbility) {
        return (
          <Grid container spacing={0} direction="column">
            { ability.description === "" ?
              <Grid item>
                { ability.name }
              </Grid>
            :
              <Grid item>
                <b>{ ability.name }:</b>&nbsp;{ ability.description }
              </Grid>
            }
            <Grid item>
              { details }
            </Grid>
          </Grid>
        );
      }
      return <span>Coming Soon</span>
    }
  }
}

export default connector(DisplayAbility);
