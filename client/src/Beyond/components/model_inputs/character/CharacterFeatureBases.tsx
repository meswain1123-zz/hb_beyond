import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
  Grid, 
} from "@material-ui/core";

import { 
  Character,
  CharacterFeatureBase,
} from "../../../models";
 
import CharacterFeatureBaseInput from "./CharacterFeatureBase";

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
  character: Character;
  features: CharacterFeatureBase[];
  onChange: () => void;
}

export interface State {
  expanded_feature_base_id: string;
}

class CharacterFeatureBasesInput extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      expanded_feature_base_id: ""
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
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

  render() {
    return (
      <Grid item xs={12} container spacing={1} direction="column">
        { this.props.features.sort((a, b) => { 
          if (a.feature_base && b.feature_base) {
            return +a.feature_base.level < +b.feature_base.level ? -1 : 1;
          } else {
            return 1;
          }
        }).map((fb, i) => {
          return (
            <Grid item key={i}>
              <div 
                style={{
                  border: (fb.needs_attention ? "1px solid #1C9AEF" : "1px solid #777777"),
                  padding: "4px"
                }} 
              >
                <Grid container spacing={1} direction="column">
                  <Grid item onClick={() => {
                    this.setState({ expanded_feature_base_id: (this.state.expanded_feature_base_id === fb.true_id ? "" : fb.true_id) });
                  }}>
                    { fb.feature_base?.name }
                  </Grid>
                  { this.state.expanded_feature_base_id === fb.true_id &&
                    <CharacterFeatureBaseInput
                      character={this.props.character}
                      obj={fb}
                      onChange={(changed: CharacterFeatureBase) => {
                        fb.calcAttention();
                        this.props.onChange();
                      }} 
                    />
                  }
                </Grid>
              </div>
            </Grid>
          );
        })}
      </Grid>
    );
  }
}

export default connector(CharacterFeatureBasesInput);
