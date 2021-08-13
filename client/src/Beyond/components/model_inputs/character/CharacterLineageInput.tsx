import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
  Grid, Button, Link, Tooltip
} from "@material-ui/core";
import {
  Close
} from "@material-ui/icons";

import { 
  Race, 
  Subrace,
  Character,
  CharacterLineage,
  // CharacterFeature,
  CharacterFeatureBase,
  Lineage,
  // FeatureBase,
  // Feature,
} from "../../../models";

import StringBox from "../../input/StringBox";
// import SelectStringBox from "../../input/SelectStringBox"; 
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
  onChange: (changed: Character) => void;
}

export interface State {
  lineagees: Lineage[] | null;
  races: Race[] | null;
  subraces: Subrace[] | null;
  search_string: string;
  page_num: number;
  start_letter: string;
  new_lineage: boolean;
  loading: boolean;
  expanded_lineage_id: string;
  expanded_feature_base_id: string;
  optional: boolean | null;
}

class CharacterLineageInput extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      lineagees: null,
      races: null,
      subraces: null,
      search_string: "",
      page_num: 0,
      start_letter: "",
      new_lineage: false,
      loading: false,
      expanded_lineage_id: "",
      expanded_feature_base_id: "",
      optional: false
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
      this.api.getSetOfObjects(["lineage"]).then((res: any) => {
        const character = this.props.character;
        const lineagees: Lineage[] = res.lineage;
        character.lineages.forEach(char_lineage => {
          if (!char_lineage.lineage) {
            const objFinder = lineagees.filter(o => o._id === char_lineage.lineage_id);
            if (objFinder.length === 1) {
              char_lineage.connectLineage(objFinder[0]);
            }
          }
        });
        this.props.onChange(character);
        this.setState({ 
          expanded_lineage_id: (character.lineages.length === 1 ? character.lineages[0].lineage_id : ""),
          lineagees, 
          loading: false 
        });
      });
    });
  }

  render() {
    if (this.state.loading || this.state.lineagees === null) {
      return <span>Loading</span>;
    } else if (this.props.character.lineages.length === 0 || this.state.new_lineage) {
      const page_size = 7;
      const filtered: any[] = this.state.lineagees ? this.state.lineagees.filter(o => 
        (this.state.start_letter === "" || 
          o.name.toUpperCase().startsWith(this.state.start_letter)) && 
        (this.state.search_string === "" || 
          o.name.toLowerCase().includes(this.state.search_string.toLowerCase()) || 
          o.description.toLowerCase().includes(this.state.search_string.toLowerCase()))
        ).sort((a,b) => {return a.name.localeCompare(b.name)}) : [];
      const page_count = Math.ceil(filtered.length / page_size);
      const filtered_and_paged: any[] = filtered.slice(page_size * this.state.page_num, page_size * (this.state.page_num + 1));
      return (
        <Grid container spacing={1} direction="column">
          <Grid item container spacing={1} direction="row">
            <Grid item xs={3}>
              <span className={"MuiTypography-root MuiListItemText-primary header"}>
                Lineages
              </span>
            </Grid>
            <Grid item xs={ this.state.new_lineage ? 6 : 9 }>
              <StringBox
                name="Search"
                value={`${this.state.search_string}`}
                onBlur={(search_string: string) => {
                  this.setState({ search_string });
                }}
              />
            </Grid>
            { this.state.new_lineage && 
              <Grid item xs={3}>
                <Button variant="contained" color="primary"
                  onClick={() => {
                    this.setState({ new_lineage: false });
                  }}>
                  Cancel Add
                </Button>
              </Grid>
            }
          </Grid>
          <Grid item>
            <Grid container spacing={1} direction="column">
              { filtered_and_paged.map((o, key) => {
                return this.renderLineage(o,key);
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
    } else {
      return (
        <Grid container spacing={1} direction="column">
          <Grid item className={"MuiTypography-root MuiListItemText-primary header"}>
            Character Level { this.props.character.character_level }
          </Grid>
          { this.renderCharLineages() }
          <Grid item>
            <Link href="#" 
              onClick={(event: React.SyntheticEvent) => {
                event.preventDefault();
                this.setState({ new_lineage: true });
              }}>
              + Add Another Lineage
            </Link>
          </Grid>
        </Grid>
      );
    }
  }

  renderCharLineages() {
    return (
      <Grid item container spacing={1} direction="column">
        { this.props.character.lineages.map((char_lineage, key) => {
          if (char_lineage.lineage) {
            return (
              <Grid item key={key} container spacing={1} direction="row">
                <Grid item xs={9}>
                  <span className={"MuiTypography-root MuiListItemText-primary header"}>
                    { char_lineage.lineage.name }
                  </span>
                </Grid>
                <Grid item xs={3}>
                    <Close style={{ cursor: "pointer" }}
                      onClick={() => {
                        const character = this.props.character;
                        character.lineages = character.lineages.filter(o => o.lineage_id !== char_lineage.lineage_id);
                        character.spells = character.spells.filter(o => o.source_type !== "Lineage" || o.source_id !== char_lineage.lineage_id);
                        this.props.onChange(character);
                        this.setState({ new_lineage: false });
                      }} 
                    />
                </Grid>
                <Grid item xs={12}>
                  <Link href="#" 
                    onClick={(event: React.SyntheticEvent) => {
                      event.preventDefault();
                      this.setState({ expanded_lineage_id: (this.state.expanded_lineage_id === char_lineage.lineage_id ? "" : char_lineage.lineage_id) });
                    }}>
                    { this.state.expanded_lineage_id === char_lineage.lineage_id ? "Hide" : "Show" } Features
                  </Link>
                </Grid>
                { this.props.character.optional_features ? 
                  <Grid item xs={12} container spacing={0} direction="row">
                    <Grid item xs={6}>
                      <Link href="#" 
                        onClick={(event: React.SyntheticEvent) => {
                          event.preventDefault();
                          this.setState({ 
                            expanded_lineage_id: char_lineage.lineage_id,
                            optional: (this.state.optional === false ? null : false)
                          });
                        }}>
                        Features
                      </Link>
                    </Grid>
                    <Grid item xs={6}>
                      <Link href="#" 
                        onClick={(event: React.SyntheticEvent) => {
                          event.preventDefault();
                          this.setState({ 
                            expanded_lineage_id: char_lineage.lineage_id,
                            optional: (this.state.optional === true ? null : true)
                          });
                        }}>
                        Optional Features
                      </Link>
                    </Grid>
                  </Grid>
                :
                  <Grid item xs={12}>
                    <Link href="#" 
                      onClick={(event: React.SyntheticEvent) => {
                        event.preventDefault();
                        this.setState({ 
                          expanded_lineage_id: char_lineage.lineage_id,
                          optional: (this.state.optional === false ? null : false)
                        });
                      }}>
                      Features
                    </Link>
                  </Grid>
                }
                { this.renderCharLineageFeatures(char_lineage) }
              </Grid>
            );
          } else {
            return (<span key={key}></span>);
          }
        })}
      </Grid>
    )
  }

  renderCharLineageFeatures(char_lineage: CharacterLineage) {
    if (char_lineage.lineage && this.state.expanded_lineage_id === char_lineage.lineage_id && this.state.optional !== null) {
      if (this.state.optional) {
        return (
          <Grid item xs={12} container spacing={1} direction="column">
            <Grid item>
              Optional Features
            </Grid>
            <CharacterFeatureBaseOptionsInput 
              character={this.props.character}
              features={ char_lineage.lineage.features }
              onChange={(true_id: string, value: boolean) => {
                const character = this.props.character;
                if (char_lineage.lineage) {
                  let feature_finder = char_lineage.lineage.features.filter(o => o.true_id === true_id);
                  if (feature_finder.length === 1) {
                    const feature = feature_finder[0];
                    if (value) {
                      if (!this.props.character.optional_feature_base_ids.includes(feature.true_id)) {
                        character.optional_feature_base_ids.push(feature.true_id);
                        const character_feature = new CharacterFeatureBase();
                        character_feature.copyFeatureBase(feature);
                        char_lineage.features.push(character_feature);
                        if (feature.replaces_feature_base_id !== "") {
                          char_lineage.features = char_lineage.features.filter(o => o.true_id !== feature.replaces_feature_base_id);
                        }
                      }
                    } else {
                      if (this.props.character.optional_feature_base_ids.includes(feature.true_id)) {
                        character.optional_feature_base_ids = character.optional_feature_base_ids.filter(o => o !== feature.true_id);
                        char_lineage.features = char_lineage.features.filter(o => o.true_id !== feature.true_id);
                        if (feature.replaces_feature_base_id !== "") {
                          let feature_finder2 = char_lineage.lineage.features.filter(o => o.true_id === feature.replaces_feature_base_id);
                          if (feature_finder2.length === 1) {
                            const feature2 = feature_finder2[0];
                            const character_feature = new CharacterFeatureBase();
                            character_feature.copyFeatureBase(feature2);
                            char_lineage.features.push(character_feature);
                          }
                        }
                      }
                    }
                  }
                  this.props.onChange(character);
                }
              }}
            />
          </Grid>
        );
      } else {
        const features = char_lineage.features.filter(o => o.feature_base && o.feature_base.level <= this.props.character.character_level);
        return (
          <CharacterFeatureBasesInput 
            character={this.props.character}
            features={features.sort((a, b) => (a.feature_base && b.feature_base && a.feature_base.level > b.feature_base.level) ? 1 : -1)}
            onChange={() => {
              this.props.onChange(this.props.character);
            }}
          />
        );
      }
    }
    return null;
  }

  renderLineage(lineage: Lineage, key: number) {
    let disabled = false;
    let reasons = "";
    if (this.state.new_lineage) {
      // Check if they already have the lineage
      const character = this.props.character;
      if (character.lineages.filter(o => o.lineage_id === lineage._id).length === 1) {
        disabled = true;
      } else {
        // TODO: When I make race specific lineages, disable them here when necessary
        // if (reason2 !== "") {
        //   reason2 += ` from ${lineage.name}\n`;
        //   reasons += reason2;
        // }
      }
    }
    return (
      <Grid key={key} item container spacing={1} direction="row">
        <Grid item xs={3}>
          { disabled ? 
            <Button 
              fullWidth variant="contained" color="primary" 
              disabled={disabled}
              onClick={ () => {
                const character = this.props.character;
                const char_lineage = new CharacterLineage();
                char_lineage.copyLineage(lineage);
                character.lineages.push(char_lineage);
                
                this.props.onChange(character);
                this.setState({ new_lineage: false, expanded_lineage_id: lineage._id });
              }}>
              {lineage.name}
              <div 
                style={{
                  fontSize: "8px",
                  color: "red"
                }}> 
                { disabled ? reasons : "" }
              </div>
            </Button>
            : 
            <Tooltip title={`Select ${lineage.name}`}>
              <Button 
                fullWidth variant="contained" color="primary" 
                onClick={ () => {
                  const character = this.props.character;
                  const char_lineage = new CharacterLineage();
                  char_lineage.copyLineage(lineage);
                  character.lineages.push(char_lineage);
                  
                  this.props.onChange(character);
                  this.setState({ new_lineage: false, expanded_lineage_id: lineage._id });
                }}>
                {lineage.name}
                <div 
                  style={{
                    fontSize: "8px",
                    color: "red"
                  }}> 
                  { disabled ? reasons : "" }
                </div>
              </Button>
            </Tooltip>
          }
        </Grid>
        <Grid item xs={9}>
          { this.renderDescription(lineage) }
        </Grid>
      </Grid>
    );
  }

  renderDescription(lineage: Lineage) {
    return (
      <Tooltip title={lineage.description}>
        <div style={this.descriptionStyle()}>
          { lineage.description }
        </div>
      </Tooltip>
    );
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

export default connector(CharacterLineageInput);
