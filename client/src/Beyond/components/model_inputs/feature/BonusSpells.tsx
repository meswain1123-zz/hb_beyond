import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
// import { RouteComponentProps } from 'react-router';
import {
  Grid, 
  Link
} from "@material-ui/core";
// import {
//   DeleteForever
// } from "@material-ui/icons";

import { 
  Spell, 
  // SpellList, 
  BonusSpells
} from "../../../models";
import { 
  // DAMAGE_TYPES, 
  // DURATIONS,
  // COMPONENTS,
  // CASTING_TIMES,
  // RESOURCES,
  SCHOOLS 
} from "../../../models/Constants";

import StringBox from "../../input/StringBox";
// import SelectBox from "../input/SelectBox";
import SelectStringBox from "../../input/SelectStringBox";
import CheckBox from "../../input/CheckBox";
import ToggleButtonBox from "../../input/ToggleButtonBox";

import SelectGameClassBox from "../select/SelectGameClassBox";

import API from "../../../utilities/smart_api";
import { APIClass } from "../../../utilities/smart_api_class";


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
  obj: BonusSpells;
  onChange: (changed: BonusSpells) => void; 
}

export interface State { 
  spells: Spell[] | null;
  page_num: number;
  start_letter: string;
  loading: boolean;
  level: string;
  school: string;
  search_string: string;
  on_list: boolean;
}

class BonusSpellsInput extends Component<Props, State> {
  // public static defaultProps = {
  //   choice_name: null
  // };
  constructor(props: Props) {
    super(props);
    this.state = {
      spells: null,
      page_num: 0,
      start_letter: "",
      loading: false,
      level: "ALL",
      school: "ALL",
      search_string: "",
      on_list: false
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects("spell").then((res: any) => {
        this.setState({ 
          spells: res,
          loading: false 
        });
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.spells === null) {
      this.load();
      return <span>Loading</span>;
    } else { 
      return (
        <Grid container spacing={1} direction="column">
          <Grid item>
            <CheckBox 
              name="Always Known/Prepared"
              value={this.props.obj.always_known}
              onChange={(value: boolean) => {
                const obj = this.props.obj;
                obj.always_known = value;
                this.props.onChange(obj);
              }}
            />
          </Grid>
          <Grid item>
            <SelectGameClassBox
              name="Count as Class Spells" 
              value={ this.props.obj.count_as_class_id } 
              onChange={(id: string) => {
                const obj = this.props.obj;
                obj.count_as_class_id = id;
                this.props.onChange(obj);
              }} 
            />
          </Grid>
          <Grid item>
            { this.renderSpells() }
          </Grid>
        </Grid>
      );
    }
  }

  // renderSpells() {
  //   const page_size = 7;
  //   const filtered: any[] = this.state.spells ? this.state.spells.filter(o => 
  //     (this.state.level === "ALL" || this.state.level === `${o.level}`) && 
  //     (this.state.school === "ALL" || this.state.school === `${o.school}`) && 
  //     (this.state.start_letter === "" || o.name.toUpperCase().startsWith(this.state.start_letter)) && 
  //     (this.state.search_string === "" || o.name.toLowerCase().includes(this.state.search_string.toLowerCase()) || o.description.toLowerCase().includes(this.state.search_string.toLowerCase()))).sort((a,b) => {return a.name.localeCompare(b.name)}) : [];
  //   const page_count = Math.ceil(filtered.length / page_size);
  //   const filtered_and_paged: any[] = filtered.slice(page_size * this.state.page_num, page_size * (this.state.page_num + 1));
  //   return ( 
  //     <Grid item container spacing={1} direction="column">
  //       <Grid item container spacing={1} direction="row">
  //         <Grid item xs={3}>
  //           <span className={"MuiTypography-root MuiListItemText-primary header"}>
  //             Spells
  //           </span>
  //         </Grid>
  //         <Grid item xs={3}>
  //           <StringBox
  //             name="Search"
  //             value={`${this.state.search_string}`}
  //             onBlur={(search_string: string) => {
  //               this.setState({ search_string });
  //             }}
  //           />
  //         </Grid>
  //         <Grid item xs={3}>
  //           <SelectStringBox
  //             name="Level"
  //             options={["ALL","0","1","2","3","4","5","6","7","8","9"]}
  //             value={this.state.level}
  //             onChange={(level: string) => {
  //               this.setState({ level });
  //             }}
  //           />
  //         </Grid>
  //         <Grid item xs={3}>
  //           <SelectStringBox
  //             name="School"
  //             options={["ALL",...SCHOOLS]}
  //             value={this.state.school}
  //             onChange={(school: string) => {
  //               this.setState({ school });
  //             }}
  //           />
  //         </Grid>
  //       </Grid>
  //       <Grid item>
  //         <Grid container spacing={1} direction="column">
  //           { filtered_and_paged.map((o, key) => {
  //             return (
  //               <Grid key={key} item>
  //                 <CheckBox 
  //                   name={o.name}
  //                   value={ this.props.obj.spell_ids.includes(o._id)}
  //                   onChange={(value: boolean) => {
  //                     if (this.state.spells) {
  //                       const obj = this.props.obj;
  //                       if (value) {
  //                         if (!obj.spell_ids.includes(o._id)) {
  //                           obj.spell_ids.push(o._id);
  //                           this.props.onChange(obj);
  //                         }
  //                       } else {
  //                         obj.spell_ids = obj.spell_ids.filter(s => s !== o._id);
  //                         this.props.onChange(obj);
  //                       }
  //                     }
  //                   }}
  //                 />
  //               </Grid>
  //             );
  //           }) }
  //           <Grid item>
  //             { this.renderPageLinks(page_count) }
  //           </Grid>
  //           <Grid item>
  //             { this.renderLetterLinks() }
  //           </Grid>
  //         </Grid>
  //       </Grid>
  //     </Grid>
  //   ); 
  // }

  renderSpells() {
    const page_size = 7;
    const filtered: any[] = this.state.spells ? this.state.spells.filter(o => 
      (this.state.level === "ALL" || this.state.level === `${o.level}`) && 
      (this.state.school === "ALL" || this.state.school === `${o.school}`) && 
      (!this.state.on_list || (this.props.obj && Object.keys(this.props.obj.spell_ids).includes(o._id))) && 
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
                <Grid key={key} item container spacing={1} direction="row">
                  <Grid item xs={6}>
                    <CheckBox 
                      name={o.name}
                      value={ Object.keys(this.props.obj.spell_ids).includes(o._id)}
                      onChange={(value: boolean) => {
                        if (this.state.spells) {
                          const obj = this.props.obj;
                          if (value) {
                            if (!Object.keys(obj.spell_ids).includes(o._id)) {
                              obj.spell_ids[o._id] = 1;
                              this.props.onChange(obj);
                            }
                          } else {
                            delete obj.spell_ids[o._id];
                            this.props.onChange(obj);
                          }
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    { Object.keys(this.props.obj.spell_ids).includes(o._id) &&
                      <SelectStringBox
                        name="Level"
                        value={`${this.props.obj.spell_ids[o._id]}`}
                        options={["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"]}
                        onChange={(changed: string) => {
                          const obj = this.props.obj;
                          obj.spell_ids[o._id] = +changed;
                          this.props.onChange(obj);
                        }}
                      />
                    }
                  </Grid>
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

export default connector(BonusSpellsInput);
