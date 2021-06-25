import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
  Grid, 
} from "@material-ui/core";

import { 
  Character,
  FeatureBase
} from "../../../models";

import CheckBox from "../../input/CheckBox";

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
  features: FeatureBase[];
  onChange: (true_id: string, value: boolean) => void;
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

  // Optional Features are shown here.
  // Optional Features aren't added to the character unless
  // selected.  
  // I need a place on the character for keeping track of selected options.
  // I'm thinking do it as a list of ids.
  // If the id is present in the list then it will be checked here.
  // On check switch add or remove it from the character feature bases 
  // where it goes.
  // If it replaces then it needs to take care of that on switch as well.
  render() {
    return (
      <Grid item xs={12} container spacing={1} direction="column">
        { this.props.features.filter(o => o.optional).sort((a, b) => { 
          return +a.level < +b.level ? -1 : 1;
        }).map((fb, i) => {
          return (
            <Grid item key={i}>
              <div 
                style={{
                  padding: "4px"
                }} 
              >
                <Grid container spacing={1} direction="column">
                  <Grid item>
                    <CheckBox
                      name={ fb.name }
                      value={this.props.character.optional_feature_base_ids.includes(fb.true_id)} 
                      onChange={(value: boolean) => {
                        this.props.onChange(fb.true_id, value);
                      }}
                    />
                  </Grid>
                  <Grid item>
                    { fb.description }
                  </Grid>
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
