import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
// import { RouteComponentProps } from 'react-router';
import {
  Grid, 
  // Button, Link, Tooltip
} from "@material-ui/core";

import { 
  Character,
  // Creature,
  // CharacterFeature,
  CharacterFeatureBase,
  // CharacterFeatureChoice,
  // // FeatureBase,
  // // Feature,
  // // FeatureChoice,
  // CharacterASIBaseFeature,
  // // CharacterASIFeature,
  // CharacterLanguageFeature,
  // Proficiency
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
// import SelectBox from "../../input/SelectBox";
// import SelectStringBox from "../input/SelectStringBox"; 
import CharacterFeatureBaseInput from "./CharacterFeatureBase";
// import CharacterASIFeatureInput from "./CharacterASIFeature";
// import CharacterLanguageFeatureInput from "./CharacterLanguageFeature";
// import SelectSpecialFeatureBox from "../select/SelectSpecialFeatureBox";
// import SelectSkillBox from "../select/SelectSkillBox";

import API from "../../../utilities/smart_api";
import { APIClass } from "../../../utilities/smart_api_class";


interface AppState {
  // templates: TemplateBase[]
  width: number;
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
  // templates: state.app.templates
  width: state.app.width
})

const mapDispatch = {
  // addTemplate: (obj: TemplateBase) => ({ type: 'ADD', dataType: 'templates', payload: obj })
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  // name: string;
  character: Character;
  features: CharacterFeatureBase[];
  // races: Race[] | null;
  onChange: () => void;
}

export interface State {
  expanded_feature_base_id: string;
}

class CharacterFeatureBasesInput extends Component<Props, State> {
  // public static defaultProps = {
  //   value: null,
  // };
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
        { this.props.features.map((fb, i) => {
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
