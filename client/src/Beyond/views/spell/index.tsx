import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Redirect } from "react-router-dom";
import {
  Add, 
  Edit,
  // GetApp,
  // ArrowBack
} from "@material-ui/icons";
import {
  Grid, 
  Button, 
  Tooltip, Fab,
  // Checkbox,
  Link
} from "@material-ui/core";

import { Spell } from "../../models";
import { 
  SCHOOLS 
} from "../../models/Constants";

import StringBox from "../../components/input/StringBox";
import SelectStringBox from "../../components/input/SelectStringBox";

import API from "../../utilities/smart_api";
import { APIClass } from "../../utilities/smart_api_class";


interface AppState {
  height: number;
  width: number;
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
  height: state.app.height,
  width: state.app.width
})

const mapDispatch = {
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & { }

export interface State { 
  redirectTo: string | null;
  search_string: string;
  level: string;
  school: string;
  // mode: string;
  // import_spells: any[] | null;
  // importing_pos: number;
  // import_checked: string[];
  // importing: string;
  page_num: number;
  start_letter: string;
  spells: Spell[] | null;
  loading: boolean;
  count: number;
  offset: number;
}

class SpellIndex extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirectTo: null,
      search_string: "",
      level: "ALL",
      school: "ALL",
      // mode: "index",
      // import_spells: null,
      // importing_pos: 0,
      // import_checked: [],
      // importing: "",
      page_num: 0,
      start_letter: "",
      spells: null,
      loading: false,
      count: 0,
      offset: 0
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
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

  // runImport() {
  //   if (this.state.import_checked.length > this.state.importing_pos) {
  //     this.setState({ importing: this.state.import_checked[this.state.importing_pos], importing_pos: this.state.importing_pos + 1 }, () => {
  //       // Get it from the API
  //       this.api.get5eObjectFromAPI(this.state.importing).then((res: any) => {
  //         // Translate it into a Spell object.
  //         const spell_obj = new Spell();
  //         spell_obj.copy5e(res);
  //         this.api.createObject(spell_obj).then((res: any) => {
  //           this.runImport();
  //         });
  //       });
  //     });
  //   } else {
  //     this.setState({ 
  //       importing: "", 
  //       importing_pos: 0, 
  //       import_checked: [] 
  //     }, () => {
  //       this.load();
  //     });
  //   }
  // }

  load() {
    this.setState({ loading: true, spells: [] }, () => {
      const filter = this.get_filter();
      this.api.getObjectCount("spell", filter).then((res: any) => {
        if (res && !res.error) {
          this.setState({ count: res.count }, this.load_some);
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
    if (this.state.start_letter !== "") {
      filter.start_letter = this.state.start_letter;
    }
    if (this.state.search_string !== "") {
      filter.name = this.state.search_string;
    }

    return filter;
  }

  load_some() {
    const filter = this.get_filter();
    this.api.getObjects("spell", filter, this.state.spells ? (this.state.spells.length + this.state.offset) : this.state.offset, 350).then((res: any) => {
      if (res && !res.error) {
        let spells: Spell[] = this.state.spells ? this.state.spells : [];
        spells = [...spells, ...(res as Spell[])];
        this.setState({ spells, loading: false });
      }
    });
  }

  filter_change() {
    this.setState({ spells: [], page_num: 0 }, this.load);
  }

  render() {
    if (this.state.spells === null && this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.spells === null) {
      this.load();
      return <span>Loading</span>;
    } else if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else { // if (this.state.mode === "index") 
      const page_size = 7;
      const filtered: any[] = this.state.spells ? this.state.spells : [];
      const page_count = Math.ceil(this.state.count / page_size);
      const filtered_and_paged: any[] = filtered.slice(page_size * this.state.page_num - this.state.offset, page_size * (this.state.page_num + 1) - this.state.offset);
      return (
        <Grid container spacing={1} direction="column">
          <Grid item container spacing={1} direction="row">
            <Grid item xs={3}>
              <span className={"MuiTypography-root MuiListItemText-primary header"}>
                Spells
              </span>
              <Tooltip title={`Create New Spell`}>
                <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                  onClick={ () => {
                    this.setState({ redirectTo:`/beyond/spell/create` });
                  }}>
                  <Add/>
                </Fab>
              </Tooltip> 
              {/* { true && 
                <Tooltip title={`Import Spells`}>
                  <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                    onClick={ () => {
                      this.setState({ mode: "import" }, () => {
                        if (this.state.import_spells === null) {
                          this.api.get5eObjects("spells").then((res: any) => {
                            this.setState({ 
                              import_spells: res.results,
                              page_num: 0 
                            });
                          });
                        }
                      });
                    }}>
                    <GetApp/>
                  </Fab>
                </Tooltip> 
              } */}
            </Grid>
            <Grid item xs={3}>
              <StringBox
                name="Search"
                value={`${this.state.search_string}`}
                onBlur={(search_string: string) => {
                  this.setState({ search_string }, this.filter_change);
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <SelectStringBox
                name="Level"
                options={["ALL","0","1","2","3","4","5","6","7","8","9"]}
                value={this.state.level}
                onChange={(level: string) => {
                  this.setState({ level }, this.filter_change);
                }}
              />
            </Grid>
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
          </Grid>
          <Grid item>
            <Grid container spacing={1} direction="column">
              { filtered_and_paged.map((o, key) => {
                return (
                  <Grid key={key} item container spacing={1} direction="row">
                    <Grid item xs={2}>
                      <Tooltip title={`View details for ${o.name}`}>
                        <Button 
                          fullWidth variant="contained" color="primary" 
                          onClick={ () => {
                            this.setState({ redirectTo:`/beyond/spell/details/${o._id}` });
                          }}>
                            {o.name}
                        </Button>
                      </Tooltip>
                    </Grid>
                    <Grid item xs={1}>
                      <Tooltip title={`Edit ${o.name}`}>
                        <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                          onClick={ () => {
                            this.setState({ redirectTo:`/beyond/spell/edit/${o._id}` });
                          }}>
                          <Edit/>
                        </Fab>
                      </Tooltip> 
                    </Grid>
                    <Grid item xs={9}>
                      <Tooltip title={o.description}>
                        <div style={this.descriptionStyle()}>
                          { o.description }
                        </div>
                      </Tooltip>
                    </Grid>
                  </Grid>
                );
              }) }
              { this.state.loading && 
                <Grid item>
                  Loading
                </Grid>
              }
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
    // else if (this.state.mode === "import") {
    //   const formHeight = this.props.height - (this.props.width > 600 ? 198 : 198);
    //   const page_size = 7;
    //   const filtered: any[] = this.state.import_spells ? this.state.import_spells.filter(o => 
    //     (this.state.start_letter === "" || o.name.toUpperCase().startsWith(this.state.start_letter)) && 
    //     (this.state.search_string === "" || o.name.toLowerCase().includes(this.state.search_string.toLowerCase()))) : [];
    //   const page_count = Math.ceil(filtered.length / page_size);
    //   const filtered_and_paged: any[] = filtered.slice(page_size * this.state.page_num, page_size * (this.state.page_num + 1));
    //   return (
    //     <Grid container spacing={1} direction="column">
    //       <Grid item container spacing={1} direction="row">
    //         <Grid item xs={3}>
    //           <span className={"MuiTypography-root MuiListItemText-primary header"}>
    //             Importing Spells
    //           </span>
    //           <Tooltip title={`Back`}>
    //             <Fab size="small" color="primary" style={{marginLeft: "8px"}}
    //               onClick={ () => {
    //                 this.setState({ 
    //                   mode: "index",
    //                   page_num: 0 
    //                 });
    //               }}>
    //               <ArrowBack/>
    //             </Fab>
    //           </Tooltip> 
    //         </Grid>
    //         <Grid item xs={9}>
    //           <StringBox
    //             name="Search"
    //             value={`${this.state.search_string}`}
    //             onBlur={(search_string: string) => {
    //               this.setState({ search_string });
    //             }}
    //           />
    //         </Grid>
    //       </Grid>
    //       <Grid item
    //         style={{ 
    //           height: `${formHeight}px`, 
    //           overflowY: "scroll", 
    //           overflowX: "hidden" 
    //         }}>
    //         <Grid container spacing={1} direction="column">
    //           <Grid item container spacing={1} direction="row">
    //             <Grid item xs={2}>
    //               Found
    //             </Grid>
    //             <Grid item xs={2}>
    //               <Button 
    //                 fullWidth variant="contained" color="primary" 
    //                 onClick={ () => {
    //                   if (this.state.import_spells) {
    //                     const import_checked: string[] = [];
    //                     if (this.state.import_spells.length !== this.state.import_checked.length) {
    //                       this.state.import_spells.forEach(s => {
    //                         if (this.state.spells && !this.state.spells.some(s2 => s2.name === s.name)) {
    //                           import_checked.push(s.url);
    //                         }
    //                       });
    //                     }
    //                     this.setState({ import_checked });
    //                   }
    //                 }}>
    //                   { (this.state.import_spells && this.state.import_spells.length === this.state.import_checked.length) ? "Deselect All" : "Select All" }
    //               </Button>
    //             </Grid>
    //             <Grid item xs={4}>
    //               Name
    //             </Grid>
    //             <Grid item xs={4}>
    //               Import Status
    //             </Grid>
    //           </Grid>
    //           { filtered_and_paged.map((o, key) => {
    //             return (
    //               <Grid key={key} item container spacing={1} direction="row">
    //                 <Grid item xs={2}>
    //                   <Checkbox 
    //                     checked={ this.state.spells ? (this.state.spells.some(s => s.name === o.name) || (this.state.import_checked.some(s => s === o.url) && !this.state.import_checked.slice(this.state.importing_pos === 0 ? 0 : (this.state.importing_pos - 1)).some(s => s === o.url))) : false } 
    //                     disabled={true}
    //                     color="primary" 
    //                   />
    //                 </Grid>
    //                 <Grid item xs={2}>
    //                   <Checkbox 
    //                     checked={ this.state.import_checked.some(s => s === o.url) } 
    //                     onChange={e => {
    //                       const import_checked = this.state.import_checked.filter(s => s !== o.url);
    //                       if (e.target.checked) {
    //                         import_checked.push(o.url);
    //                       }
    //                       this.setState({ import_checked });
    //                     }}
    //                     color="primary" 
    //                   />
    //                 </Grid>
    //                 <Grid item xs={4}>
    //                   { o.name }
    //                 </Grid>
    //                 <Grid item xs={4}>
    //                   { o.url === this.state.importing ? "Importing" : "" }
    //                 </Grid>
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
    //       <Grid item>
    //         <Button 
    //           fullWidth variant="contained" color="primary" 
    //           onClick={ () => {
    //             this.runImport();
    //           }}>
    //             Import Selected
    //         </Button>
    //       </Grid>
    //     </Grid>
    //   );
    // }
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
          this.page_change(0);
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
            this.page_change(i);
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
          this.page_change(page_count - 1);
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

  page_change(page_num: number) {
    if (this.state.spells) {
      if ((page_num + 1) * 7 <= this.state.offset) {
        const offset = Math.floor(page_num * 7 / 350) * 350;
        this.setState({ page_num, loading: true, offset, spells: [] }, this.load_some); 
      } else if ((page_num + 1) * 7 <= this.state.offset + this.state.spells.length) { 
        this.setState({ page_num });
      } else {
        const offset = Math.floor((page_num + 1) * 7 / 350) * 350;
        this.setState({ page_num, loading: true, offset, spells: [] }, this.load_some); 
      }
    }
  }

  renderLetterLinks() {
    const return_us: any[] = [];
    const alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
    let key = 0;
    alphabet.forEach(a => {
      return_us.push(
        <Link key={key} href="#" onClick={(event: React.SyntheticEvent) => {
          event.preventDefault();
          this.setState({ start_letter: a }, this.filter_change);
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
        this.setState({ start_letter: "" }, this.filter_change);
        }}>
        Clear
      </Link>
    );
    key++;
    return_us.push(<span key={key}>&nbsp;</span>);

    return return_us;
  }
}

export default connector(SpellIndex);
