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
  CharacterFeat,
  CharacterFeature,
  CharacterASIBaseFeature,
  // CharacterASIFeature,
  ASIBaseFeature,
  // ASIFeature
} from "../../../models";
// import { 
//   // DAMAGE_TYPES, 
//   // DURATIONS,
//   // COMPONENTS,
//   // CASTING_TIMES,
//   // RESOURCES,
//   ABILITY_SCORES 
// } from "../../../models/Constants";
import API from "../../../utilities/smart_api";
import { APIClass } from "../../../utilities/smart_api_class";

// import StringBox from "../../input/StringBox";
// import SelectBox from "../input/SelectBox";
import SelectStringBox from "../../input/SelectStringBox";
import CharacterFeatBox from "./CharacterFeatBox";
// import SelectLanguageBox from "../select/SelectLanguageBox";


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
  onChange: (changed: CharacterASIBaseFeature) => void; 
}

export interface State { 
}

class CharacterASIBaseFeatureInput extends Component<Props, State> {
  // public static defaultProps = {
  //   choice_name: null
  // };
  constructor(props: Props) {
    super(props);
    this.state = {
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  render() {
    const asi_base_feature = this.props.obj.feature.the_feature as ASIBaseFeature;
    const character_asi_base_feature = this.props.obj.feature_options[0] as CharacterASIBaseFeature;
    let feat_option: any = null;
    if (asi_base_feature.feat_option) {
      const feat_value = character_asi_base_feature.use_feat === null ? "Choose an Option" : character_asi_base_feature.use_feat ? "Feat" : "Ability Score Improvement";
      feat_option = 
        <Grid item>
          <SelectStringBox
            name="Use Feat?"
            options={["Choose an Option","Ability Score Improvement","Feat"]}
            value={feat_value}
            color={ feat_value === "Choose an Option" ? "blue" : "" }
            onChange={(value: string) => {
              if (value === "Choose an Option") {
                character_asi_base_feature.use_feat = null;
              } else if (value === "Feat") {
                character_asi_base_feature.use_feat = true;
                character_asi_base_feature.feat = new CharacterFeat();
                for (let i = 0; i < asi_base_feature.asi_features.length; i++) {
                  const character_asi_feature = character_asi_base_feature.asi_features[i];
                  character_asi_feature.selected_option = "";
                }
              } else {
                character_asi_base_feature.use_feat = false;
              }
              this.props.onChange(character_asi_base_feature);
            }}
          />
        </Grid>;
    }
    let selection: any = null;
    if (!asi_base_feature.feat_option || (character_asi_base_feature.use_feat !== null && !character_asi_base_feature.use_feat)) {
      selection = [];
      for (let i = 0; i < asi_base_feature.asi_features.length; i++) {
        const asi_feature = asi_base_feature.asi_features[i];
        const character_asi_feature = character_asi_base_feature.asi_features[i];
        let options = asi_feature.options;
        if (!asi_base_feature.allow_duplicates) {
          for (let j = 0; j < asi_base_feature.asi_features.length; j++) {
            if (i !== j) {
              const other_asi_feature = character_asi_base_feature.asi_features[j];
              options = options.filter(opt => opt !== other_asi_feature.selected_option);
            }
          }
        }
        if (options.length > 1) {
          selection.push(
            <Grid item key={asi_feature.id}>
              <SelectStringBox
                name={`Ability Score Improvement by ${asi_feature.amount}`}
                options={options}
                value={character_asi_feature.selected_option}
                onChange={(value: string) => {
                  character_asi_feature.selected_option = value;
                  this.props.onChange(character_asi_base_feature);
                }}
                color={ character_asi_feature.selected_option === "" ? "blue" : "" }
              />
            </Grid>);
        } else if (options.length === 1) {
          selection.push(
            <Grid item key={asi_feature.id}>
              {`${options[0]} increased ${asi_feature.amount}`}
            </Grid>
          );
        }
      }
    } else if (asi_base_feature.feat_option && character_asi_base_feature.use_feat) {
      selection = 
        <Grid item>
          {/* <SelectFeatBox
            name="Select a Feat"
            value={character_asi_base_feature.feat_id}
            onChange={(id: string) => {
              character_asi_base_feature.feat_id = id;
              this.props.onChange(character_asi_base_feature);
            }}
            color={ character_asi_base_feature.feat_id === "" ? "blue" : "" }
          /> */}
          <CharacterFeatBox
            obj={character_asi_base_feature.feat}
            character={this.props.character}
            onChange={(changed: CharacterFeat) => {
              character_asi_base_feature.feat = changed;
              // this.props.character.recalcFeats();
              this.props.onChange(character_asi_base_feature);
            }}
          />
        </Grid>;
    }
    return (
      <Grid item container spacing={1} direction="column">
        { feat_option }
        { selection }
      </Grid>
    );
  }
}

export default connector(CharacterASIBaseFeatureInput);
