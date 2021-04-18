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
  PactBoon,
  CharacterPactBoon,
  // CharacterClass
} from "../../../models";
// import { 
//   // DAMAGE_TYPES, 
//   // DURATIONS,
//   // COMPONENTS,
//   // CASTING_TIMES,
//   // RESOURCES,
//   ABILITY_SCORES 
// } from "../../../models/Constants";

// import StringBox from "../../input/StringBox";
// import SelectBox from "../input/SelectBox";
// import SelectStringBox from "../../input/SelectStringBox";
import SelectPactBoonBox from "../select/SelectPactBoonBox";

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
  // name: string;
  character: Character;
  obj: CharacterFeature;
  onChange: (changed: CharacterFeature) => void;
  color: string; 
}

export interface State { 
  pact_boons: PactBoon[] | null;
  pact_boon: PactBoon | null;
  loading: boolean;
}

class CharacterPactBoonBox extends Component<Props, State> {
  public static defaultProps = {
    color: ""
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      pact_boons: null,
      pact_boon: null,
      loading: false
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects("pact_boon").then((res: any) => {
        if (res && !res.error) {
          const pact_boons: PactBoon[] = res;
          const objFinder = pact_boons.filter(o => o._id === this.props.obj.feature_options[0]);
          let pact_boon: PactBoon | null = null;
          if (objFinder.length === 1) {
            pact_boon = objFinder[0];
          }
          this.setState({ pact_boons, pact_boon, loading: false });
        }
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.pact_boons === null) {
      this.load();
      return <span>Loading</span>;
    } else {
      const char_pb = this.props.obj.feature_options[0] as CharacterPactBoon;
      const pact_boons: PactBoon[] = this.state.pact_boons;
      return (
        <Grid container spacing={1} direction="column">
          <Grid item>
            <SelectPactBoonBox
              name={this.props.obj.feature.name}
              value={char_pb.pact_boon_id}
              color={char_pb.pact_boon_id === "" ? "blue" : ""}
              pact_boons={pact_boons}
              onChange={(id: string) => {
                if (this.state.pact_boons) {
                  const objFinder = this.state.pact_boons.filter(o => o._id === id);
                  let pact_boon: PactBoon | null = null;
                  if (objFinder.length === 1) {
                    pact_boon = objFinder[0];
                  }
                  char_pb.copyPactBoon(pact_boon);
                  this.props.character.pact_boon_id = pact_boon ? pact_boon._id : "";
                  this.props.onChange(this.props.obj);
                  this.setState({ pact_boon });
                }
              }}
            />
          </Grid>
          { this.state.pact_boon &&
            <Grid item container spacing={1} direction="column">
              <Grid item>
                { this.state.pact_boon.name }
              </Grid>
              <Grid item>
                { this.state.pact_boon.description }
              </Grid>
              <Grid item>
                {/* <CharacterFeatureBasesInput 
                  character={this.props.character}
                  features={this.props.obj.features}
                  onChange={() => {
                    if (this.state.armor_types) {
                      this.props.character.recalcAll(this.state.armor_types);
                    }
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

export default connector(CharacterPactBoonBox);
