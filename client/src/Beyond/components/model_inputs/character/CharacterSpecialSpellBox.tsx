import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
  Grid, 
} from "@material-ui/core";

import { 
  Character,
  CharacterFeature,
  SpecialSpellFeature,
  Spell,
  GameClass
} from "../../../models";

import API from "../../../utilities/smart_api";
import { APIClass } from "../../../utilities/smart_api_class";

import SelectSpellBox from "../select/SelectSpellBox";


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
  class_id: string;
}

export interface State { 
  spells: Spell[] | null;
  spell: Spell | null;
  game_classes: GameClass[] | null;
  loading: boolean;
}

class CharacterSpecialSpellBox extends Component<Props, State> {
  public static defaultProps = {
    color: ""
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      spells: null,
      spell: null,
      game_classes: null,
      loading: false
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getSetOfObjects(["spell","game_class"]).then((res: any) => {
        if (res && !res.error) {
          const spells: Spell[] = res.spell;
          const objFinder = spells.filter(o => o._id === this.props.obj.feature_options[0]);
          let spell: Spell | null = null;
          if (objFinder.length === 1) {
            spell = objFinder[0];
          }
          this.setState({ 
            game_classes: res.game_class,
            spells, 
            spell, 
            loading: false 
          });
        }
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.spells === null || this.state.game_classes === null) {
      this.load();
      return <span>Loading</span>;
    } else {
      const id = this.props.obj.feature_options[0] as string;
      const feature = this.props.obj.feature;
      if (feature.the_feature) {
        const ssf = feature.the_feature as SpecialSpellFeature;
        let spell_list = ssf.spell_list;
        if (spell_list === "Class") {
          const obj_finder = this.state.game_classes.filter(o => o._id === this.props.class_id);
          if (obj_finder.length === 1) {
            spell_list = obj_finder[0].name;
          }
        }
        return (
          <Grid container spacing={1} direction="column">
            <Grid item>
              <SelectSpellBox
                name={this.props.obj.name}
                value={id}
                color={id === "" ? "blue" : ""}
                spell_list_name={spell_list}
                level={ssf.level}
                onChange={(id: string) => {
                  if (this.state.spells) {
                    this.props.obj.feature_options = [id];
                    this.props.onChange(this.props.obj);
                    const objFinder = this.state.spells.filter(o => o._id === id);
                    if (objFinder.length === 1) {
                      const spell = objFinder[0];
                      this.setState({ spell });
                    }
                  }
                }}
              />
            </Grid>
            { this.state.spell &&
              <Grid item container spacing={1} direction="column">
                <Grid item>
                  { this.state.spell.name }
                </Grid>
                <Grid item>
                  { this.state.spell.description }
                </Grid>
              </Grid>
            }
          </Grid>
        );
      }
      return null;
    }
  }
}

export default connector(CharacterSpecialSpellBox);
