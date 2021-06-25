import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
  Grid, Button, Link, Tooltip
} from "@material-ui/core";

import { 
  ModelBase,
  Race, 
  Subrace,
  Character,
  CharacterRace,
  CharacterFeatureBase
} from "../../../models";

import StringBox from "../../input/StringBox";
import CharacterFeatureBasesInput from "./CharacterFeatureBases";
import CharacterFeatureBaseOptionsInput from "./CharacterFeatureBaseOptions";

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
  onChange: (changed: CharacterRace) => void;
}

export interface State {
  races: Race[] | null;
  subraces: Subrace[] | null;
  search_string: string;
  page_num: number;
  start_letter: string;
  show_subraces: string;
  change_race: boolean;
  loading: boolean;
  expanded_is_subrace: boolean;
  expanded_feature_base_id: number;
  custom_origins: boolean;
}

class CharacterRaceInput extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      races: null,
      subraces: null,
      search_string: "",
      page_num: 0,
      start_letter: "",
      show_subraces: "",
      change_race: false,
      loading: false,
      expanded_is_subrace: false,
      expanded_feature_base_id: -1,
      custom_origins: false
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
      this.api.getSetOfObjects(["race","subrace"]).then((res: any) => {
        const races: Race[] = res.race.filter((o: ModelBase) => o.source_id === "Basic Rules" || this.props.character.source_books.includes(o.source_id));
        const subraces: Subrace[] = res.subrace.filter((o: ModelBase) => o.source_id === "Basic Rules" || this.props.character.source_books.includes(o.source_id));
        races.forEach((race: Race) => {
          race.subraces = [];
        });
        subraces.forEach((subrace: Subrace) => {
          const objFinder = races.filter(o => o._id === subrace.race_id);
          if (objFinder.length === 1) {
            const race = objFinder[0];
            if (race.subraces.filter(o => o._id === subrace._id).length === 0) {
              race.subraces.push(subrace);
            }
          }
        });
        const character = this.props.character;

        if (character.race.race_id && !character.race.race) {
          const char_race = character.race;
          const race_finder = races.filter(o => o._id === char_race.race_id);
          if (race_finder.length === 1) {
            const race = race_finder[0];
            if (char_race.subrace && char_race.subrace.subrace_id) {
              const char_subrace = char_race.subrace;
              const subrace_finder = race.subraces.filter(o => o._id === char_subrace.subrace_id);
              if (subrace_finder.length === 1) {
                const subrace = subrace_finder[0];
                char_race.connectRace(race, subrace);
              }
            } else {
              char_race.connectRace(race);
            }
          }
        }
        this.setState({ 
          races, 
          subraces,
          loading: false 
        });
      });
    });
  }

  render() {
    let character_race = this.props.character.race;
    if (this.state.loading || this.state.races === null) {
      return <span>Loading</span>;
    } else if (!character_race || character_race.race_id === "" || this.state.change_race) {
      const page_size = 7;
      const filtered: any[] = this.state.races ? this.state.races.filter(o => 
        (this.state.start_letter === "" || 
          o.name.toUpperCase().startsWith(this.state.start_letter) || 
          o.subraces.filter(s => s.name.toUpperCase().startsWith(this.state.start_letter)).length > 0) && 
        (this.state.search_string === "" || 
          o.name.toLowerCase().includes(this.state.search_string.toLowerCase()) || 
          o.description.toLowerCase().includes(this.state.search_string.toLowerCase()) ||
          o.subraces.filter(s => 
            s.name.toLowerCase().includes(this.state.search_string.toLowerCase()) || 
            s.description.toLowerCase().includes(this.state.search_string.toLowerCase())
          ).length > 0)
        ).sort((a,b) => {return a.name.localeCompare(b.name)}) : [];
      const page_count = Math.ceil(filtered.length / page_size);
      const filtered_and_paged: any[] = filtered.slice(page_size * this.state.page_num, page_size * (this.state.page_num + 1));
      return (
        <Grid container spacing={1} direction="column">
          { character_race && character_race.race && this.state.change_race && 
            <Grid item>
              { character_race.race.name } 
              { character_race.subrace && character_race.subrace.subrace && <span>{ character_race.subrace.subrace.name }</span> }
              <Button 
                fullWidth variant="contained" color="primary" 
                onClick={ () => {
                  this.setState({ change_race: false });
                }}>
                  Keep Race
              </Button>
            </Grid>
          }
          <Grid item container spacing={1} direction="row">
            <Grid item xs={3}>
              <span className={"MuiTypography-root MuiListItemText-primary header"}>
                Races
              </span>
            </Grid>
            <Grid item xs={9}>
              <StringBox
                name="Search"
                value={`${this.state.search_string}`}
                onBlur={(search_string: string) => {
                  this.setState({ search_string });
                }}
              />
            </Grid>
          </Grid>
          <Grid item>
            <Grid container spacing={1} direction="column">
              { filtered_and_paged.map((o, key) => {
                return this.renderRace(o,key);
              }) }
              <Grid item>
                { this.renderPageLinks(page_count) }
              </Grid>
              <Grid item>
                { this.renderLetterLinks() }
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      );
    } else if (character_race.race) {
      const race = character_race.race;
      const subrace = character_race.subrace;
      return (
        <Grid container spacing={1} direction="row">
          <Grid item xs={6} className={"MuiTypography-root MuiListItemText-primary header"}>
            { character_race.race && <span>{ character_race.race.name }</span> } { character_race.subrace && character_race.subrace.subrace && <span>{ character_race.subrace.subrace.name }</span> }
          </Grid>
          <Grid item xs={6}>
            <Button 
              fullWidth variant="contained" color="primary" 
              onClick={ () => {
                this.setState({ change_race: true });
              }}>
                Change Race
            </Button>
          </Grid>
          { this.props.character.custom_origins && 
            <Grid item xs={12} container spacing={0} direction="row">
              <Grid item xs={6} 
                style={{ cursor: "pointer" }} 
                onClick={() => {
                  this.setState({ custom_origins: false });
                }}>
                Racial Features
              </Grid>
              <Grid item xs={6} 
                style={{ cursor: "pointer" }} 
                onClick={() => {
                  this.setState({ custom_origins: true });
                }}>
                Origin Manager
              </Grid>
            </Grid>
          }
          { this.state.custom_origins ? 
            <Grid item xs={12} container spacing={1} direction="column">
              <Grid item>
                Origin Options
              </Grid>
              <CharacterFeatureBaseOptionsInput 
                character={this.props.character}
                features={ subrace && subrace.subrace ? [...race.features, ...subrace.subrace.features] : race.features }
                onChange={(true_id: string, value: boolean) => {
                  const character = this.props.character;
                  let feature_finder = race.features.filter(o => o.true_id === true_id);
                  let use_subrace = false;
                  if (feature_finder.length === 0 && subrace && subrace.subrace) {
                    feature_finder = subrace.subrace.features.filter(o => o.true_id === true_id);
                    use_subrace = true;
                  }
                  if (feature_finder.length === 1) {
                    const feature = feature_finder[0];
                    if (value) {
                      if (!this.props.character.optional_feature_base_ids.includes(feature.true_id)) {
                        character.optional_feature_base_ids.push(feature.true_id);
                        const character_feature = new CharacterFeatureBase();
                        character_feature.copyFeatureBase(feature);
                        if (use_subrace && character_race.subrace) {
                          character_race.subrace.features.push(character_feature);
                          if (feature.replaces_feature_base_id !== "") {
                            character_race.subrace.features = character_race.subrace.features.filter(o => o.true_id !== feature.replaces_feature_base_id);
                          }
                        } else {
                          character_race.features.push(character_feature);
                          if (feature.replaces_feature_base_id !== "") {
                            character_race.features = character_race.features.filter(o => o.true_id !== feature.replaces_feature_base_id);
                          }
                        }
                      }
                    } else {
                      if (this.props.character.optional_feature_base_ids.includes(feature.true_id)) {
                        character.optional_feature_base_ids = character.optional_feature_base_ids.filter(o => o !== feature.true_id);
                        character_race.features = character_race.features.filter(o => o.true_id !== feature.true_id);
                        if (feature.replaces_feature_base_id !== "") {
                          let feature_finder2 = race.features.filter(o => o.true_id === feature.replaces_feature_base_id);
                          if (feature_finder2.length === 1) {
                            const feature2 = feature_finder2[0];
                            const character_feature = new CharacterFeatureBase();
                            character_feature.copyFeatureBase(feature2);
                            character_race.features.push(character_feature);
                          } else if (subrace && subrace.subrace) {
                            feature_finder2 = subrace.subrace.features.filter(o => o.true_id === feature.replaces_feature_base_id);
                            if (feature_finder2.length === 1 && character_race.subrace) {
                              const feature2 = feature_finder2[0];
                              const character_feature = new CharacterFeatureBase();
                              character_feature.copyFeatureBase(feature2);
                              character_race.subrace.features.push(character_feature);
                            }
                          }
                        }
                      }
                    }
                  }
                  this.props.onChange(character_race);
                }}
              />
            </Grid>
            :
            <CharacterFeatureBasesInput 
              character={this.props.character}
              features={character_race.features}
              onChange={() => {
                this.props.onChange(character_race);
              }}
            />
          }
          { !this.state.custom_origins && character_race.subrace && 
            <CharacterFeatureBasesInput 
              character={this.props.character}
              features={character_race.subrace.features}
              onChange={() => {
                this.props.onChange(character_race);
              }}
            />
          }
        </Grid>
      );
    } else return null;
  }

  renderRace(race: Race, key: number) {
    return (
      <Grid key={key} item container spacing={1} direction="row">
        <Grid item xs={3}>
          <Tooltip title={`Select ${race.name}`}>
            <Button 
              fullWidth variant="contained" color="primary" 
              onClick={ () => {
                if (race.subraces.length === 0) {
                  const changed = new CharacterRace();
                  changed.copyRace(race);
                  this.props.onChange(changed);
                  this.setState({ change_race: false });
                } else {
                  if (this.state.show_subraces === race._id) {
                    this.setState({ show_subraces: "" });
                  } else {
                    this.setState({ show_subraces: race._id });
                  }
                }
              }}>
              {race.name}
            </Button>
          </Tooltip>
        </Grid>
        <Grid item xs={9}>
          { this.renderDescription(race) }
        </Grid>
        { this.state.show_subraces === race._id &&
          <Grid item xs={12} container spacing={1} direction="column">
            { race.subraces.map((o, key2) => {
              return this.renderSubrace(race, o, key2);
            })} 
          </Grid>
        }
      </Grid>
    );
  }

  renderSubrace(race: Race, subrace: Subrace, key: number) {
    return (
      <Grid key={key} item container spacing={1} direction="row">
        <Grid item xs={1}></Grid>
        <Grid item xs={2}>
          <Tooltip title={`Select ${subrace.name}`}>
            <Button 
              fullWidth variant="contained" color="primary" 
              onClick={ () => {
                const changed = new CharacterRace();
                changed.copyRace(race, subrace);
                this.props.onChange(changed);
                this.setState({ change_race: false });
              }}>
                {subrace.name}
            </Button>
          </Tooltip>
        </Grid>
        <Grid item xs={9}>
          <Tooltip title={subrace.description}>
            <div style={this.descriptionStyle()}>
              { subrace.description }
            </div>
          </Tooltip>
        </Grid>
      </Grid>
    );
  }

  renderDescription(race: Race) {
    if (race.subraces.length === 0) {
      return (
        <Tooltip title={race.description}>
          <div style={this.descriptionStyle()}>
            { race.description }
          </div>
        </Tooltip>
      );
    } else {
      return (
        <div onClick={() => {
          if (this.state.show_subraces === race._id) {
            this.setState({ show_subraces: "" });
          } else {
            this.setState({ show_subraces: race._id });
          }
        }}>
          { race.subraces.map((o, key) => {
            return (
              <span key={key}>{ o.name }{ key < (race.subraces.length - 1) && ", " }</span>
            );
          })} 
        </div>
      );
    }
  }

  renderPageLinks(page_count: number) {
    const return_us: any[] = [];
    const start = Math.max(0, this.state.page_num - 3);
    const end = Math.min(page_count, this.state.page_num + 4);
    let key = 0;
    if (start > 0) {
      return_us.push(
        <Link key={key} href="#" onClick={(event: React.SyntheticEvent) => {
          event.preventDefault();
          this.setState({ page_num: 0 });
          }}>
          1
        </Link>
      );
      key++;
      return_us.push(<span key={key}>&nbsp;</span>);
      key++;
    }
    if (start > 1) {
      return_us.push(<span key={key}>...</span>);
      key++;
    }
    for (let i = start; i < end; i++) {
      if (this.state.page_num === i) {
        return_us.push(<span key={key}>{ i + 1}</span>);
      } else {
        return_us.push(
          <Link key={key} href="#" onClick={(event: React.SyntheticEvent) => {
            event.preventDefault();
            this.setState({ page_num: i });
            }}>
            { i + 1 }
          </Link>
        );
      }
      key++;
      return_us.push(<span key={key}>&nbsp;</span>);
      key++;
    }
    if (end < page_count - 1) {
      return_us.push(<span key={key}>...</span>);
      key++;
    }
    if (end < page_count) {
      return_us.push(
        <Link key={key} href="#" onClick={(event: React.SyntheticEvent) => {
          event.preventDefault();
          this.setState({ page_num: page_count - 1 });
          }}>
          { page_count }
        </Link>
      );
      key++;
      return_us.push(<span key={key}>&nbsp;</span>);
      key++;
    }
    return return_us;
  }

  renderLetterLinks() {
    const return_us: any[] = [];
    const alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
    let key = 0;
    alphabet.forEach(a => {
      return_us.push(
        <Link key={key} href="#" onClick={(event: React.SyntheticEvent) => {
          event.preventDefault();
          this.setState({ start_letter: a });
          }}>
          {a}
        </Link>
      );
      key++;
      return_us.push(<span key={key}>&nbsp;</span>);
      key++;
    });
    return_us.push(
      <Link key={key} href="#" onClick={(event: React.SyntheticEvent) => {
        event.preventDefault();
        this.setState({ start_letter: "" });
        }}>
        Clear
      </Link>
    );
    key++;
    return_us.push(<span key={key}>&nbsp;</span>);

    return return_us;
  }
}

export default connector(CharacterRaceInput);
