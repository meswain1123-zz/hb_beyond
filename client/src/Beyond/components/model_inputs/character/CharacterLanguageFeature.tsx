import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { 
  Character,
  CharacterFeature,
  CharacterLanguageFeature,
  Language,
  LanguageFeature
} from "../../../models";
import SelectLanguageBox from "../select/SelectLanguageBox";

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
  onChange: (changed: CharacterLanguageFeature) => void;
  color: string; 
}

export interface State { 
  languages: Language[] | null;
  language: Language | null;
  loading: boolean;
}

class CharacterLanguageFeatureInput extends Component<Props, State> {
  public static defaultProps = {
    color: ""
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      languages: null,
      language: null,
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
      this.api.getObjects("language").then((res: any) => {
        if (res && !res.error) {
          const languages: Language[] = res;
          const language_feature = this.props.obj.feature.the_feature as LanguageFeature;
          if (!language_feature.language_id || language_feature.language_id === "") {
            this.setState({ languages, loading: false });
          } else {
            const objFinder = languages.filter(o => o._id === language_feature.language_id);
            if (objFinder.length === 1) {
              this.setState({ languages, language: objFinder[0], loading: false });
            }
          }
        }
      });
    });
  }

  render() {
    if (this.state.loading || this.state.languages === null) {
      return <span>Loading</span>;
    } else {
      const language_feature = this.props.obj.feature.the_feature as LanguageFeature;
      if (language_feature.language_id && this.state.language) {
        return (<span>{ this.state.language.name }</span>);
      } else {
        const character_language_feature = this.props.obj.feature_options[0] as CharacterLanguageFeature;
        return (
          <SelectLanguageBox 
            name={this.props.obj.feature.name}
            type={language_feature.type}
            value={character_language_feature.language_id} 
            color={this.props.color}
            ignore_us={this.props.character.languages_known.filter(id => id !== character_language_feature.language_id)}
            onChange={(value: string) => {
              character_language_feature.language_id = value;
              this.props.onChange(character_language_feature);
            }} 
          />
        );
      }
    }
  }
}

export default connector(CharacterLanguageFeatureInput);
