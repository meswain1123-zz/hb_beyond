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
  SpecialFeature,
  CharacterSpecialFeature,
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
import SelectSpecialFeatureBox from "../select/SelectSpecialFeatureBox";

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
  type: string;
  character: Character;
  obj: CharacterFeature;
  onChange: (changed: CharacterFeature) => void;
  color: string; 
  options: string[];
}

export interface State { 
  special_features: SpecialFeature[] | null;
  special_feature: SpecialFeature | null;
  loading: boolean;
}

class CharacterSpecialFeatureBox extends Component<Props, State> {
  public static defaultProps = {
    color: "",
    options: []
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      special_features: null,
      special_feature: null,
      loading: false
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects("special_feature").then((res: any) => {
        if (res && !res.error) {
          const special_features: SpecialFeature[] = res;
          const objFinder = special_features.filter(o => o._id === this.props.obj.feature_options[0]);
          let special_feature: SpecialFeature | null = null;
          if (objFinder.length === 1) {
            special_feature = objFinder[0];
          }
          this.setState({ special_features, special_feature, loading: false });
        }
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.special_features === null) {
      this.load();
      return <span>Loading</span>;
    } else {
      const char_sf = this.props.obj.feature_options[0] as CharacterSpecialFeature;
      if (this.props.options.length > 0) {
        const options = this.state.special_features.filter(o => this.props.options.includes(o._id));
        return (
          <Grid container spacing={1} direction="column">
            <Grid item>
              <SelectSpecialFeatureBox
                name={this.props.obj.feature.name}
                value={char_sf.special_feature_id}
                color={char_sf.special_feature_id === "" ? "blue" : ""}
                type={this.props.type}
                options={options}
                onChange={(id: string) => {
                  if (this.state.special_features) {
                    const objFinder = this.state.special_features.filter(o => o._id === id);
                    let special_feature: SpecialFeature | null = null;
                    if (objFinder.length === 1) {
                      special_feature = objFinder[0];
                    }
                    char_sf.copySpecialFeature(special_feature);
                    this.props.onChange(this.props.obj);
                    this.setState({ special_feature });
                  }
                }}
              />
            </Grid>
            { this.state.special_feature &&
              <Grid item container spacing={1} direction="column">
                <Grid item>
                  { this.state.special_feature.name }
                </Grid>
                <Grid item>
                  { this.state.special_feature.description }
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
      } else {
        return (
          <Grid container spacing={1} direction="column">
            <Grid item>
              <SelectSpecialFeatureBox
                name={this.props.obj.feature.name}
                value={char_sf.special_feature_id}
                color={char_sf.special_feature_id === "" ? "blue" : ""}
                type={this.props.type}
                onChange={(id: string) => {
                  if (this.state.special_features) {
                    const objFinder = this.state.special_features.filter(o => o._id === id);
                    let special_feature: SpecialFeature | null = null;
                    if (objFinder.length === 1) {
                      special_feature = objFinder[0];
                    }
                    char_sf.copySpecialFeature(special_feature);
                    this.props.onChange(this.props.obj);
                    this.setState({ special_feature });
                  }
                }}
              />
            </Grid>
            { this.state.special_feature &&
              <Grid item container spacing={1} direction="column">
                <Grid item>
                  { this.state.special_feature.name }
                </Grid>
                <Grid item>
                  { this.state.special_feature.description }
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
}

export default connector(CharacterSpecialFeatureBox);
