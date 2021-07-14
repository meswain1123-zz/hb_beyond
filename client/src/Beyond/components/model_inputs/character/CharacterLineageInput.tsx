import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
  Grid, Button, Link, Tooltip
} from "@material-ui/core";

import { 
  // ModelBase,
  Lineage,
  Character,
  CharacterLineage
} from "../../../models";

import StringBox from "../../input/StringBox";
import CharacterFeatureBasesInput from "./CharacterFeatureBases";

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
  onChange: (changed: CharacterLineage) => void;
}

export interface State {
  lineages: Lineage[] | null;
  search_string: string;
  page_num: number;
  start_letter: string;
  change_lineage: boolean;
  loading: boolean;
  expanded_feature_base_id: number;
  custom_origins: boolean;
}

class CharacterLineageInput extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      lineages: null,
      search_string: "",
      page_num: 0,
      start_letter: "",
      change_lineage: false,
      loading: false,
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
      this.api.getSetOfObjects(["lineage"]).then((res: any) => {
        const lineages: Lineage[] = res.lineage;
        const character = this.props.character;

        if (character.lineage.lineage_id && !character.lineage.lineage) {
          const char_lineage = character.lineage;
          const obj_finder = lineages.filter(o => o._id === char_lineage.lineage_id);
          if (obj_finder.length === 1) {
            const lineage = obj_finder[0];
            char_lineage.connectLineage(lineage);
          }
        }
        this.setState({ 
          lineages,
          loading: false 
        });
      });
    });
  }

  render() {
    let character_lineage = this.props.character.lineage;
    if (this.state.loading || this.state.lineages === null) {
      return <span>Loading</span>;
    } else if (!character_lineage || character_lineage.lineage_id === "" || this.state.change_lineage) {
      const page_size = 7;
      const filtered: any[] = this.state.lineages ? this.state.lineages.filter(o => 
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
          { character_lineage && character_lineage.lineage && this.state.change_lineage && 
            <Grid item>
              { character_lineage.lineage.name } 
              <Button 
                fullWidth variant="contained" color="primary" 
                onClick={ () => {
                  this.setState({ change_lineage: false });
                }}>
                  Keep Lineage
              </Button>
            </Grid>
          }
          <Grid item container spacing={1} direction="row">
            <Grid item xs={3}>
              <span className={"MuiTypography-root MuiListItemText-primary header"}>
                Lineages
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
    } else if (character_lineage.lineage) {
      return (
        <Grid container spacing={1} direction="row">
          <Grid item xs={6} className={"MuiTypography-root MuiListItemText-primary header"}>
            { character_lineage.lineage && <span>{ character_lineage.lineage.name }</span> }
          </Grid>
          <Grid item xs={6}>
            <Button 
              fullWidth variant="contained" color="primary" 
              onClick={ () => {
                this.setState({ change_lineage: true });
              }}>
                Change Lineage
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
          <CharacterFeatureBasesInput 
            character={this.props.character}
            features={character_lineage.features}
            onChange={() => {
              this.props.onChange(character_lineage);
            }}
          />
        </Grid>
      );
    } else return null;
  }

  renderLineage(lineage: Lineage, key: number) {
    return (
      <Grid key={key} item container spacing={1} direction="row">
        <Grid item xs={3}>
          <Tooltip title={`Select ${lineage.name}`}>
            <Button 
              fullWidth variant="contained" color="primary" 
              onClick={ () => {
                const changed = new CharacterLineage();
                changed.copyLineage(lineage);
                this.props.onChange(changed);
                this.setState({ change_lineage: false });
              }}>
              {lineage.name}
            </Button>
          </Tooltip>
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
