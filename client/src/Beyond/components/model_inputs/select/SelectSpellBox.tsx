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
  max_level: number;
  spell_list_id: string;
  spell_list_name: string;
  color: string;
  onChange: (id: string) => void;
}

export interface State {
  spells: Spell[] | null;
  spell_lists: SpellList[] | null;
  search_string: string;
  level: string;
  school: string;
  loading: boolean;
  count: number;
}

class SelectSpellBox extends Component<Props, State> {
  public static defaultProps = {
    spells: null,
    level: -1,
    max_level: -1,
    spell_list_id: "",
    spell_list_name: "",
    color: ""
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      spells: null,
      spell_lists: null,
      search_string: "",
      level: "ALL",
      school: "ALL",
      loading: false,
      count: 0
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  start_up() {
    this.setState({ loading: true }, () => {
      this.api.getSetOfObjects(["spell_list"]).then((res: any) => {
        this.setState({ 
          spell_lists: res.spell_list
        }, this.load);
      });
    });
  }

  load() {
    this.setState({ loading: true, spells: [] }, () => {
      const filter = this.get_filter();
      console.log(filter)
      this.api.getObjectCount("spell", filter).then((res: any) => {
        console.log(res);
        if (res && !res.error) {
          if (res.count <= 100) {
            this.setState({ count: res.count }, this.load_some);
          } else {
            this.setState({ count: res.count, loading: false });
          }
        } else if (res && res.error) {
          // this.setState({ error: res.error, loading: false });
        } else {
          this.setState({ loading: false });
        }
      });
    });
  }

  get_filter() {
    const filter: any = {};
    
    if (this.state.level !== "ALL") {
      filter.level = +this.state.level;
    }
    if (this.state.school !== "ALL") {
      filter.school = this.state.school;
    }
    if (this.state.search_string !== "") {
      filter.name = this.state.search_string;
    }
    let spell_list: SpellList | null = null;
    if (this.state.spell_lists) {
      const spell_list_finder = this.props.spell_list_id === "" ? 
        this.state.spell_lists.filter(o => o.name === this.props.spell_list_name) :
        this.state.spell_lists.filter(o => o._id === this.props.spell_list_id);
      if (spell_list_finder.length === 1) {
        spell_list = spell_list_finder[0];
      }
      if (spell_list) {
        filter._id = { $in : spell_list.spell_ids };
      }
    }
    if (this.props.max_level > -1) {
      filter.level = { $lte : this.props.max_level };
    }

    return filter;
  }

  load_some() {
    const filter = this.get_filter();
    console.log(filter);
    this.api.getObjects("spell", filter, 0, 100).then((res: any) => {
      console.log(res);
      if (res && !res.error) {
        let spells: Spell[] = this.state.spells ? this.state.spells : [];
        spells = [...spells, ...(res as Spell[])];
        this.setState({ spells, loading: false });
      }
    });
  }

  filter_change() {
    this.setState({ spells: [] }, this.load);
  }

  render() {
    if ((this.state.spells === null || this.state.spell_lists === null) && this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.spells === null || this.state.spell_lists === null) {
      this.start_up();
      return <span>Loading</span>;
    } else {
      const max_level = this.props.max_level;
      const filtered = this.state.spells;
      const levels = ["ALL"];
      for (let i = 0; i <= (max_level === -1 ? 9 : max_level); ++i) {
        levels.push(`${i}`);
      }
      return (
        <Grid container spacing={1} direction="row" style={{
          border: (this.props.color === "" ? "" : "1px solid #1C9AEF")
        }}>
          <Grid item xs={ this.props.level === -1 ? 3 : 6 }>
            <StringBox
              name="Search"
              value={`${this.state.search_string}`}
              onBlur={(search_string: string) => {
                this.setState({ search_string }, this.filter_change);
              }}
            />
          </Grid>
          { this.props.level === -1 &&
            <Grid item xs={3}>
              <SelectStringBox
                name="Level"
                options={levels}
                value={this.state.level}
                onChange={(level: string) => {
                  this.setState({ level }, this.filter_change);
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
                this.setState({ school }, this.filter_change);
              }}
            />
          </Grid>
          <Grid item xs={3}>
            { this.state.count > 50 ?
              <span>Too many spells { this.state.count }</span>
            : this.state.loading ?
              <span>Loading</span>
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
