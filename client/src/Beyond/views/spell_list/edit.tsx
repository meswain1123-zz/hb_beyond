import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Redirect } from "react-router-dom";
import {
  ArrowBack
} from "@material-ui/icons";
import {
  Grid, 
  Button, 
  Tooltip, Fab,
  Link,
} from "@material-ui/core";

import { 
  SpellList, 
  Spell
} from "../../models";
import { 
  SCHOOLS
} from "../../models/Constants";

import StringBox from "../../components/input/StringBox";
import SelectStringBox from "../../components/input/SelectStringBox";
import CheckBox from "../../components/input/CheckBox";
import ToggleButtonBox from "../../components/input/ToggleButtonBox";

import ModelBaseInput from "../../components/model_inputs/ModelBaseInput";

import API from "../../utilities/smart_api";
import { APIClass } from "../../utilities/smart_api_class";


interface AppState {
  height: number;
  width: number;
}

interface RootState {
  app: AppState
}

interface MatchParams {
  id: string;
}

const mapState = (state: RootState) => ({
  height: state.app.height,
  width: state.app.width
})

const mapDispatch = {
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & RouteComponentProps<MatchParams> & { }

export interface State { 
  redirectTo: string | null;
  obj: SpellList;
  processing: boolean;
  spell_lists: SpellList[] | null;
  spells: Spell[] | null;
  page_num: number;
  start_letter: string;
  loading: boolean;
  level: string;
  school: string;
  on_list: boolean;
  search_string: string;
}

class SpellListEdit extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirectTo: null,
      obj: new SpellList(),
      processing: false,
      spell_lists: null,
      spells: null,
      page_num: 0,
      start_letter: "",
      loading: false,
      level: "ALL",
      school: "ALL",
      on_list: false,
      search_string: ""
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
    this.load();
  }

  submit() {
    this.setState({ processing: true }, () => {
      this.api.upsertObject("spell_list", this.state.obj).then((res: any) => {
        this.setState({ processing: false, redirectTo: "/beyond/spell_list" });
      });
    });
  }

  // Loads the editing obj into state
  load_object(id: string) {
    const objFinder = this.state.spell_lists ? this.state.spell_lists.filter(a => a._id === id) : [];
    if (objFinder.length === 1) {
      this.setState({ obj: objFinder[0].clone(), loading: false });
    }
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects("spell_list").then((res: any) => {
        if (res && !res.error) {
          let { id } = this.props.match.params;
          if (id !== undefined && this.state.obj._id !== id) {
            this.setState({ spell_lists: res }, () => {
              this.load_object(id);
            });
          } else {
            this.setState({ spell_lists: res, loading: false });
          }
        }
      });
    });
  }

  render() {
    if (this.state.loading || this.state.spell_lists === null) {
      return <span>Loading</span>;
    } else if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else { 
      const formHeight = this.props.height - (this.props.width > 600 ? 220 : 220);
      return (
        <Grid container spacing={1} direction="column">
          <Grid item>
            <Tooltip title={`Back to SpellLists`}>
              <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                onClick={ () => {
                  this.setState({ redirectTo:`/beyond/spell_list` });
                }}>
                <ArrowBack/>
              </Fab>
            </Tooltip> 
          </Grid>
          <Grid item>
            <span className={"MuiTypography-root MuiListItemText-primary header"}>
              { this.state.obj._id === "" ? "Create SpellList" : `Edit ${this.state.obj.name}` }
            </span>
          </Grid>
          <Grid item 
            style={{ 
              height: `${formHeight}px`, 
              overflowY: "scroll", 
              overflowX: "hidden" 
            }}>
            <Grid container spacing={1} direction="column">
              <ModelBaseInput 
                obj={this.state.obj}
                onChange={() => {
                  const obj = this.state.obj;
                  this.setState({ obj });
                }}
              />
              { this.renderSpells() }
            </Grid>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              disabled={this.state.processing}
              onClick={ () => { 
                this.submit();
              }}>
              Submit
            </Button>
            <Button
              variant="contained"
              disabled={this.state.processing}
              style={{ marginLeft: "4px" }}
              onClick={ () => { 
                this.setState({ redirectTo:`/beyond/spell_list` });
              }}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      ); 
    }
  }

  renderSpells() {
    const page_size = 7;
    const filtered: any[] = this.state.spells ? this.state.spells.filter(o => 
      (this.state.level === "ALL" || this.state.level === `${o.level}`) && 
      (this.state.school === "ALL" || this.state.school === `${o.school}`) && 
      (!this.state.on_list || (this.state.obj && this.state.obj.spell_ids.includes(o._id))) && 
      (this.state.start_letter === "" || o.name.toUpperCase().startsWith(this.state.start_letter)) && 
      (this.state.search_string === "" || o.name.toLowerCase().includes(this.state.search_string.toLowerCase()) || o.description.toLowerCase().includes(this.state.search_string.toLowerCase()))).sort((a,b) => {return a.name.localeCompare(b.name)}) : [];
    const page_count = Math.ceil(filtered.length / page_size);
    const filtered_and_paged: any[] = filtered.slice(page_size * this.state.page_num, page_size * (this.state.page_num + 1));
    return ( 
      <Grid item container spacing={1} direction="column">
        <Grid item container spacing={1} direction="row">
          <Grid item xs={1}>
            <span className={"MuiTypography-root MuiListItemText-primary header"}>
              Spells
            </span>
          </Grid>
          <Grid item xs={3}>
            <StringBox
              name="Search"
              value={`${this.state.search_string}`}
              onBlur={(search_string: string) => {
                this.setState({ search_string });
              }}
            />
          </Grid>
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
          <Grid item xs={2}>
            <ToggleButtonBox
              name="On List"
              value={this.state.on_list}
              onToggle={() => {
                this.setState({ on_list: !this.state.on_list });
              }}
            />
          </Grid>
        </Grid>
        <Grid item>
          <Grid container spacing={1} direction="column">
            { filtered_and_paged.map((o, key) => {
              return (
                <Grid key={key} item>
                  <CheckBox 
                    name={o.name}
                    value={ this.state.obj && this.state.obj.spell_ids.includes(o._id)}
                    onChange={(value: boolean) => {
                      if (this.state.obj && this.state.spells) {
                        const obj = this.state.obj;
                        if (value) {
                          if (!obj.spell_ids.includes(o._id)) {
                            obj.spell_ids.push(o._id);
                            this.setState({ obj });
                          }
                        } else {
                          obj.spell_ids = obj.spell_ids.filter(s => s !== o._id);
                          this.setState({ obj });
                        }
                      }
                    }}
                  />
                </Grid>
              );
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

export default connector(SpellListEdit);
