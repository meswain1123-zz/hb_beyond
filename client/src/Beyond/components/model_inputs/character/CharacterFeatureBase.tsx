import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
  Grid, 
} from "@material-ui/core";

import { 
  Character,
  CharacterFeature,
  CharacterFeatureBase,
  Subclass,
  Sense,
} from "../../../models";

import CharacterFeatureInput from "./CharacterFeature";

import API from "../../../utilities/smart_api";
import { APIClass } from "../../../utilities/smart_api_class";


interface AppState {
  width: number;
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
  width: state.app.width
})

const mapDispatch = {
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  obj: CharacterFeatureBase;
  character: Character;
  onChange: (changed: CharacterFeatureBase) => void;
}

export interface State {
  subclasses: Subclass[] | null;
  senses: Sense[] | null;
  loading: boolean;
}

class CharacterFeatureBaseInput extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      subclasses: null,
      senses: null,
      loading: false
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
    this.load();
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getSetOfObjects(["subclass","sense"]).then((res: any) => {
        this.setState({ 
          subclasses: res.subclass,
          senses: res.sense,
          loading: false 
        });
      });
    });
  }

  render() {
    if (this.state.loading || this.state.subclasses === null) {
      return <span>Loading</span>;
    } else {
      return (
        <Grid item container spacing={1} direction="column">
          { this.props.obj.feature_base && this.props.obj.feature_base.description !== "" &&
            <Grid item>
              { this.props.obj.feature_base.description }
            </Grid>
          }
          { this.props.obj.features.map((feature, key) => {
            return (
              <Grid item key={key} container spacing={1} direction="column">
                { feature.feature.description !== "" &&
                  <Grid item>
                    { feature.feature.description }
                  </Grid>
                }
                <CharacterFeatureInput 
                  obj={feature}
                  character={this.props.character}
                  onChange={(changed: CharacterFeature) => {
                    this.props.onChange(this.props.obj);
                  }}
                />
                {/* { this.render_feature_details(feature) } */}
              </Grid>
            );
          })}
        </Grid>
      );
    }
  }
}

export default connector(CharacterFeatureBaseInput);
