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
  Character,
  // Creature,
  // CharacterFeatureBase,
  CharacterFeature,
  EldritchInvocation,
  CharacterEldritchInvocation,
  CharacterClass
} from "../../../models";
// import { 
//   // DAMAGE_TYPES, 
//   // DURATIONS,
//   // COMPONENTS,
//   // CASTING_TIMES,
//   // RESOURCES,
//   ABILITY_SCORES 
// } from "../../../models/Constants";
import API from "../../../utilities/smart_api";
import { APIClass } from "../../../utilities/smart_api_class";

// import StringBox from "../../input/StringBox";
// import SelectBox from "../input/SelectBox";
// import SelectStringBox from "../../input/SelectStringBox";
import SelectEldritchInvocationBox from "../select/SelectEldritchInvocationBox";


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
  // name: string;
  character: Character;
  obj: CharacterFeature;
  onChange: (changed: CharacterFeature) => void;
  color: string; 
}

export interface State { 
  eldritch_invocations: EldritchInvocation[] | null;
  eldritch_invocation: EldritchInvocation | null;
  loading: boolean;
}

class CharacterEldritchInvocationBox extends Component<Props, State> {
  public static defaultProps = {
    color: ""
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      eldritch_invocations: null,
      eldritch_invocation: null,
      loading: false
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects("eldritch_invocation").then((res: any) => {
        if (res && !res.error) {
          const eldritch_invocations: EldritchInvocation[] = res;
          const objFinder = eldritch_invocations.filter(o => o._id === this.props.obj.feature_options[0]);
          let eldritch_invocation: EldritchInvocation | null = null;
          if (objFinder.length === 1) {
            eldritch_invocation = objFinder[0];
          }
          this.setState({ eldritch_invocations, eldritch_invocation, loading: false });
        }
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.eldritch_invocations === null) {
      this.load();
      return <span>Loading</span>;
    } else {
      const char_ei = this.props.obj.feature_options[0] as CharacterEldritchInvocation;
      let filtered: EldritchInvocation[] = [];
      if (this.props.character instanceof Character) {
        const classFinder = this.props.character.classes.filter(o => o.game_class && o.game_class.name === "Warlock");
        let warlock_char_class: CharacterClass | null = null;
        if (classFinder.length === 1) {
          warlock_char_class = classFinder[0];
        }
        filtered = 
          this.state.eldritch_invocations.filter(o => 
            (o._id === char_ei.eldritch_invocation_id || !this.props.character.eldritch_invocation_ids.includes(o._id)) && 
            (o.level === 0 || (warlock_char_class && warlock_char_class.level >= o.level)) &&
            (o.pact === "None" || o.pact === this.props.character.pact_boon_id));
      } else {
        filtered = 
          this.state.eldritch_invocations.filter(o => 
            (o._id === char_ei.eldritch_invocation_id || !this.props.character.eldritch_invocation_ids.includes(o._id)) && 
            (o.level === 0 || this.props.character.character_level) &&
            (o.pact === "None" || o.pact === this.props.character.pact_boon_id));
      }
      return (
        <Grid container spacing={1} direction="column">
          <Grid item>
            <SelectEldritchInvocationBox
              name={this.props.obj.feature.name}
              value={char_ei.eldritch_invocation_id}
              color={char_ei.eldritch_invocation_id === "" ? "blue" : ""}
              allow_all={false}
              eldritch_invocations={filtered}
              onChange={(id: string) => {
                if (this.state.eldritch_invocations) {
                  const objFinder = this.state.eldritch_invocations.filter(o => o._id === id);
                  let eldritch_invocation: EldritchInvocation | null = null;
                  if (objFinder.length === 1) {
                    eldritch_invocation = objFinder[0];
                  }
                  char_ei.copyEldritchInvocation(eldritch_invocation);
                  this.props.onChange(this.props.obj);
                  this.setState({ eldritch_invocation });
                }
              }}
            />
          </Grid>
          { this.state.eldritch_invocation &&
            <Grid item container spacing={1} direction="column">
              <Grid item>
                { this.state.eldritch_invocation.name }
              </Grid>
              <Grid item>
                { this.state.eldritch_invocation.description }
              </Grid>
              <Grid item>
                {/* <CharacterFeatureBasesInput 
                  character={this.props.character}
                  features={this.props.obj.features}
                  onChange={() => {
                    this.props.character.recalcAll();
                    this.props.onChange(this.props.obj);
                  }}
                /> */}
              </Grid>
            </Grid>
          }
        </Grid>
      );
    }
  }
}

export default connector(CharacterEldritchInvocationBox);
