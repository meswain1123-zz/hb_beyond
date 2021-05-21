import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
  Grid, 
} from "@material-ui/core";

import { 
  Character,
  CharacterFeat,
  Feat
} from "../../../models";
import API from "../../../utilities/smart_api";
import { APIClass } from "../../../utilities/smart_api_class";

import SelectFeatBox from "../select/SelectFeatBox";
import CharacterFeatureBasesInput from './CharacterFeatureBases';


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
  character: Character;
  obj: CharacterFeat;
  onChange: (changed: CharacterFeat) => void;
  color: string; 
}

export interface State { 
  feats: Feat[] | null;
  feat: Feat | null;
  loading: boolean;
}

class CharacterFeatBox extends Component<Props, State> {
  public static defaultProps = {
    color: ""
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      feats: null,
      feat: null,
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
      this.api.getObjects("feat").then((res: any) => {
        if (res && !res.error) {
          const feats: Feat[] = res;
          const objFinder = feats.filter(o => o._id === this.props.obj.feat_id);
          let feat: Feat | null = null;
          if (objFinder.length === 1) {
            feat = objFinder[0];
          }
          this.setState({ feats, feat, loading: false });
        }
      });
    });
  }

  render() {
    if (this.state.loading || this.state.feats === null) {
      return <span>Loading</span>;
    } else {
      // Need to make CharacterFeat take options,
      // and populate them with 'defaults' when 
      // Feat is selected.
      return (
        <Grid container spacing={1} direction="column">
          <Grid item>
            <SelectFeatBox
              name={`Feat`}
              value={this.props.obj.feat_id as string}
              color={this.props.obj.feat_id === "" ? "blue" : ""}
              ignore_us={this.props.character.feat_ids.filter(id => id !== this.props.obj.feat_id)}
              onChange={(id: string) => {
                if (this.state.feats) {
                  const objFinder = this.state.feats.filter(o => o._id === id);
                  let feat: Feat | null = null;
                  if (objFinder.length === 1) {
                    feat = objFinder[0];
                    this.props.obj.copyFeat(feat);
                    this.props.onChange(this.props.obj);
                  }
                  this.setState({ feat });
                }
              }}
            />
          </Grid>
          { this.state.feat &&
            <Grid item container spacing={1} direction="column">
              <Grid item>
                { this.state.feat.name }
              </Grid>
              <Grid item>
                { this.state.feat.description }
              </Grid>
              <Grid item>
                <CharacterFeatureBasesInput 
                  character={this.props.character}
                  features={this.props.obj.features}
                  onChange={() => {
                    this.props.onChange(this.props.obj);
                  }}
                />
              </Grid>
            </Grid>
          }
        </Grid>
      );
    }
  }
}

export default connector(CharacterFeatBox);
