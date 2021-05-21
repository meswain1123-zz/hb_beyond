import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
  Grid, 
} from "@material-ui/core";

import { 
  Background,
  Language,
  Character,
  CharacterBackground,
} from "../../../models";

import SelectBackgroundBox from "../select/SelectBackgroundBox";
import CharacterFeatureBasesInput from "./CharacterFeatureBases";

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
  obj: Character;
  onChange: (changed: CharacterBackground) => void;
}

export interface State {
  backgrounds: Background[] | null;
  languages: Language[] | null;
  loading: boolean;
  expanded_feature_base_id: number;
}

class CharacterBackgroundInput extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      backgrounds: null,
      languages: null,
      loading: false,
      expanded_feature_base_id: -1
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
    this.load();
  }

  descriptionStyle = () => {
    const descWidth = Math.floor(this.props.width * 0.7);
  
    const properties: React.CSSProperties = {
      width: `${descWidth}px`,
      whiteSpace: "nowrap", 
      overflow: "hidden", 
      textOverflow: "ellipsis"
    } as React.CSSProperties;

    return properties;
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getSetOfObjects(["background","language"]).then((res: any) => {
        const backgrounds: Background[] = res.background;
        if (this.props.obj.background.background_id !== "" && !this.props.obj.background.background) {
          const obj_finder = backgrounds.filter(o => o._id === this.props.obj.background.background_id);
          if (obj_finder.length === 1) {
            this.props.obj.background.connectBackground(obj_finder[0]);
          }
        }
        this.setState({ 
          backgrounds, 
          languages: res.language,
          loading: false 
        });
      });
    });
  }

  render() {
    let obj_background = this.props.obj.background;
    if (this.state.loading || this.state.backgrounds === null) {
      return <span>Loading</span>;
    } else {
      return (
        <Grid container spacing={1} direction="row">
          <Grid item xs={12}>
            <SelectBackgroundBox
              name="Choose a Background"
              value={obj_background.background_id}
              onChange={(id: string) => {
                if (this.state.backgrounds) {
                  const objFinder = this.state.backgrounds.filter(o => o._id === id);
                  if (objFinder.length === 1) {
                    obj_background.copyBackground(objFinder[0]);
                    this.props.onChange(obj_background);
                  }
                }
              }}
            />
          </Grid>
          <Grid item xs={12}>
            { obj_background.background && <span>{ obj_background.background.description }</span> }
          </Grid>
          <CharacterFeatureBasesInput 
            character={this.props.obj}
            features={obj_background.features}
            onChange={() => {
              this.props.onChange(obj_background);
            }}
          />
        </Grid>
      );
    }
  }
}

export default connector(CharacterBackgroundInput);
