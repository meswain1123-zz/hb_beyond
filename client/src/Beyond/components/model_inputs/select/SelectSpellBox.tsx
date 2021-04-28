import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
  Grid
} from "@material-ui/core";

import { 
  Spell,
  SpellList
} from "../../../models";
import { 
  SCHOOLS 
} from "../../../models/Constants";

import StringBox from "../../input/StringBox";
import SelectBox from "../../input/SelectBox";
import SelectStringBox from "../../input/SelectStringBox"; 

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
  name: string;
  value: string;
  spells: Spell[] | null;
  level: number;
  spell_list_id: string;
  onChange: (id: string) => void;
}

export interface State {
  spells: Spell[] | null;
  spell_lists: SpellList[] | null;
  search_string: string;
  level: string;
  school: string;
  loading: boolean;
}

class SelectSpellBox extends Component<Props, State> {
  public static defaultProps = {
    spells: null,
    level: -1,
    spell_list_id: ""
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      spells: null,
      spell_lists: null,
      search_string: "",
      level: "ALL",
      school: "ALL",
      loading: false
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getSetOfObjects(["spell","spell_list"]).then((res: any) => {
        this.setState({ 
          spells: res.spell,
          spell_lists: res.spell_list, 
          loading: false 
        });
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.spells === null || this.state.spell_lists === null) {
      this.load();
      return <span>Loading</span>;
    } else {
      const level = this.props.level === -1 ? this.state.level : `${this.props.level}`;
      const school = this.state.school;
      let spell_list: SpellList | null = null;
      const spell_list_finder = this.state.spell_lists.filter(o => o._id === this.props.spell_list_id);
      if (spell_list_finder.length === 1) {
        spell_list = spell_list_finder[0];
      }
      const filtered = this.state.spells.filter(o => 
        (!spell_list || spell_list.spell_ids.includes(o._id)) &&
        (level === "ALL" || level === `${o.level}`) && 
        (school === "ALL" || school === `${o.school}`) && 
        (this.state.search_string === "" || 
          o.name.toLowerCase().includes(this.state.search_string.toLowerCase()) || 
            o.description.toLowerCase().includes(this.state.search_string.toLowerCase())))
        .sort((a,b) => {return a.name.localeCompare(b.name)});
      
      return (
        <Grid container spacing={1} direction="row">
          <Grid item xs={ this.props.level === -1 ? 3 : 6 }>
            <StringBox
              name="Search"
              value={`${this.state.search_string}`}
              onBlur={(search_string: string) => {
                this.setState({ search_string });
              }}
            />
          </Grid>
          { this.props.level === -1 &&
            <Grid item xs={3}>
              <SelectStringBox
                name="Level"
                options={["ALL","0","1","2","3","4","5","6","7","8","9"]}
                value={this.state.level}
                onChange={(level: string) => {
                  this.setState({ level });
                }}
              />
            </Grid>
          }
          <Grid item xs={3}>
            <SelectStringBox
              name="School"
              options={["ALL",...SCHOOLS]}
              value={this.state.school}
              onChange={(school: string) => {
                this.setState({ school });
              }}
            />
          </Grid>
          <Grid item xs={3}>
            { filtered.length > 50 ?
              <span>Too many spells { filtered.length }</span>
            :
              <SelectBox 
                options={filtered}
                value={this.props.value} 
                name={this.props.name}
                onChange={(id: string) => {
                  const objFinder = this.state.spells ? this.state.spells.filter(o => o._id === id) : [];
                  if (objFinder.length === 1) {
                    this.props.onChange(objFinder[0]._id);
                  }
                }}
              />
            }
          </Grid>
        </Grid>
      );
    }
  }
}

export default connector(SelectSpellBox);
