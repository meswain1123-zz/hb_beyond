import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
// import { RouteComponentProps } from 'react-router';
import {
  Grid, 
  // Button, Link, Tooltip
} from "@material-ui/core";

import { 
  Background,
  Language,
  Character,
  // CharacterBackground,
  // CharacterFeature,
  // CharacterFeatureBase,
  // CharacterFeatureChoice,
  // FeatureBase,
  // Feature,
  // FeatureChoice,
  // CharacterASIBaseFeature,
  // CharacterASIFeature,
  // CharacterLanguageFeature
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
// import SelectStringBox from "../../input/SelectStringBox"; 
// import SelectBackgroundBox from "../select/SelectBackgroundBox";
// import CharacterFeatureBaseInput from "./CharacterFeatureBase";
// import CharacterFeatureBasesInput from "./CharacterFeatureBases";

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
  obj: Character;
  // backgrounds: Background[] | null;
  // onChange: (changed: CharacterBackground) => void;
}

export interface State {
  backgrounds: Background[] | null;
  languages: Language[] | null;
  loading: boolean;
  expanded_feature_base_id: number;
}

class DisplayCharacterBackground extends Component<Props, State> {
  // public static defaultProps = {
  //   value: null,
  // };
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
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.backgrounds === null) {
      this.load();
      return <span>Loading</span>;
    } else {
      if (obj_background.background) {
        return (
          <Grid container spacing={1} direction="row">
            <Grid item xs={12} style={{ fontWeight: "bold", fontSize: "15px" }}>
              { obj_background.background.name }
            </Grid>
            <Grid item xs={12}>
              { obj_background.background && <span>{ obj_background.background.description }</span> }
            </Grid>
          </Grid>
        );
      }
    }
  }
}

export default connector(DisplayCharacterBackground);
