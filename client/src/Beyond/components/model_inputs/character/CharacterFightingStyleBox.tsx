import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
  Grid, 
} from "@material-ui/core";

import { 
  Character,
  CharacterFeature,
  FightingStyle,
  CharacterFightingStyle
} from "../../../models";

import SelectFightingStyleBox from "../select/SelectFightingStyleBox";

import CharacterFeatureInput from "./CharacterFeature";

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
  character: Character;
  obj: CharacterFeature;
  onChange: (changed: CharacterFeature) => void;
  color: string; 
}

export interface State { 
  fighting_styles: FightingStyle[] | null;
  fighting_style: FightingStyle | null;
  loading: boolean;
}

class CharacterFightingStyleBox extends Component<Props, State> {
  public static defaultProps = {
    color: ""
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      fighting_styles: null,
      fighting_style: null,
      loading: false
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects("fighting_style").then((res: any) => {
        if (res && !res.error) {
          const fighting_styles: FightingStyle[] = res;
          const objFinder = fighting_styles.filter(o => o._id === this.props.obj.feature_options[0]);
          let fighting_style: FightingStyle | null = null;
          if (objFinder.length === 1) {
            fighting_style = objFinder[0];
          }
          this.setState({ fighting_styles, fighting_style, loading: false });
        }
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.fighting_styles === null) {
      this.load();
      return <span>Loading</span>;
    } else {
      const char_ei = this.props.obj.feature_options[0] as CharacterFightingStyle;
      const fighting_style_ids = this.props.obj.feature.the_feature as string[];
      const filtered = this.state.fighting_styles.filter(o => 
        (fighting_style_ids.includes(o._id)) &&
        (o._id === char_ei.fighting_style_id || !this.props.character.fighting_style_ids.includes(o._id)));
      return (
        <Grid container spacing={1} direction="column">
          <Grid item>
            <SelectFightingStyleBox
              name={this.props.obj.feature.name}
              value={char_ei.fighting_style_id}
              color={char_ei.fighting_style_id === "" ? "blue" : ""}
              allow_all={false}
              fighting_styles={filtered}
              onChange={(id: string) => {
                if (this.state.fighting_styles) {
                  const objFinder = this.state.fighting_styles.filter(o => o._id === id);
                  let fighting_style: FightingStyle | null = null;
                  if (objFinder.length === 1) {
                    fighting_style = objFinder[0];
                  }
                  char_ei.copyFightingStyle(fighting_style);
                  this.props.onChange(this.props.obj);
                  this.setState({ fighting_style });
                }
              }}
            />
          </Grid>
          { this.state.fighting_style &&
            <Grid item container spacing={1} direction="column">
              <Grid item>
                { this.state.fighting_style.name }
              </Grid>
              <Grid item>
                { this.state.fighting_style.description }
              </Grid>
            </Grid>
          }
          { char_ei.features.map((feature, key) => {
            return (
              <Grid item key={key}>
                <CharacterFeatureInput 
                  obj={feature}
                  character={this.props.character}
                  onChange={(changed: CharacterFeature) => {
                    this.props.onChange(this.props.obj);
                  }}
                />
              </Grid>
            );
          })}
        </Grid>
      );
    }
  }
}

export default connector(CharacterFightingStyleBox);
