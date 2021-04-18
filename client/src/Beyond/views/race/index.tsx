import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Redirect } from "react-router-dom";
import {
  Add, 
  Edit,
  GetApp,
  ArrowBack,
  FileCopy
} from "@material-ui/icons";
import {
  Grid, 
  // List, ListItem, 
  Button, 
  Tooltip, Fab,
  Checkbox,
  Link
} from "@material-ui/core";
// import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
// import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { Race, Subrace, Language } from "../../models";
// import { 
//   SCHOOLS 
// } from "../../models/Constants";

import StringBox from "../../components/input/StringBox";
// import SelectBox from "../../components/input/SelectBox";
// import SelectStringBox from "../../components/input/SelectStringBox";
// import CheckBox from "../../components/input/CheckBox";

import API from "../../utilities/smart_api";
import { APIClass } from "../../utilities/smart_api_class";


interface AppState {
  // races: Race[] | null;
  height: number;
  width: number;
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
  // races: state.app.races,
  height: state.app.height,
  width: state.app.width
})

const mapDispatch = {
  // setRaces: (objects: Race[]) => ({ type: 'SET', dataType: 'races', payload: objects })
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & { }

export interface State { 
  redirectTo: string | null;
  search_string: string;
  mode: string;
  import_races: any[] | null;
  importing_pos: number;
  import_checked: string[];
  importing: string;
  importing_subrace_race_id: string;
  importing_subraces: string[];
  importing_subrace: string;
  importing_subrace_pos: number;
  page_num: number;
  start_letter: string;
  races: Race[] | null;
  subraces: Subrace[] | null;
  languages: Language[] | null;
  show_subraces: string;
  loading: boolean;
  processing: boolean;
}

class RaceIndex extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirectTo: null,
      search_string: "",
      mode: "index",
      import_races: null,
      importing_pos: 0,
      import_checked: [],
      importing: "",
      importing_subrace_race_id: "",
      importing_subraces: [],
      importing_subrace: "",
      importing_subrace_pos: 0,
      page_num: 0,
      start_letter: "",
      races: null,
      subraces: null,
      languages: null,
      show_subraces: "",
      loading: false,
      processing: false
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

  runImport() {
    if (this.state.import_checked.length > this.state.importing_pos) {
      this.setState({ importing: this.state.import_checked[this.state.importing_pos], importing_pos: this.state.importing_pos + 1 }, () => {
        // Get it from the API
        this.api.get5eObjectFromAPI(this.state.importing).then((res: any) => {
          // Translate it into a Race object.
          const race_obj = new Race();
          race_obj.copy5e(res, (this.state.languages ? this.state.languages : []));
          if (race_obj.name !== "") {
            this.api.createObject(race_obj).then((res2: any) => {
              if (res.subraces && res.subraces.length > 0) {
                const importing_subraces: string[] = [];
                res.subraces.forEach((s: any) => {
                  importing_subraces.push(s.url);
                });
                this.setState({
                  importing_subraces,
                  importing_subrace: "",
                  importing_subrace_pos: 0,
                  importing_subrace_race_id: res2.id
                }, () => {
                  this.runImportSubrace();
                });
              } else {
                this.runImport();
              }
            });
          }
        });
      });
    } else {
      this.setState({ 
        importing: "", 
        importing_pos: 0, 
        import_checked: [] 
      }, () => {
        this.load();
      });
    }
  }

  runImportSubrace() {
    if (this.state.importing_subraces.length > this.state.importing_subrace_pos) {
      this.setState({ importing_subrace: this.state.importing_subraces[this.state.importing_subrace_pos], importing_subrace_pos: this.state.importing_subrace_pos + 1 }, () => {
        // Get it from the API
        this.api.get5eObjectFromAPI(this.state.importing_subrace).then((res: any) => {
          // Translate it into a Subrace object.
          const race_obj = new Subrace();
          race_obj.copy5e(res, this.state.importing_subrace_race_id, (this.state.languages ? this.state.languages : []));
          if (race_obj.name !== "") {
            this.api.createObject(race_obj).then((res: any) => {
              this.runImportSubrace();
            });
          }
        });
      });
    } else {
      this.setState({ 
        importing_subrace_race_id: "", 
        importing_subrace_pos: 0, 
        importing_subraces: [] 
      }, () => {
        this.runImport();
      });
    }
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getSetOfObjects(["race","subrace","language"]).then((res: any) => {
        const races: Race[] = res.race;
        const subraces: Subrace[] = res.subrace;
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
        this.setState({ 
          races, 
          subraces,
          languages: res.language,
          loading: false 
        });
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.races === null) {
      this.load();
      return <span>Loading</span>;
    } else if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else if (this.state.mode === "index") {
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
          <Grid item container spacing={1} direction="row">
            <Grid item xs={3}>
              <span className={"MuiTypography-root MuiListItemText-primary header"}>
                Races
              </span>
              <Tooltip title={`Create New Race`}>
                <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                  onClick={ () => {
                    this.setState({ redirectTo:`/beyond/race/create` });
                  }}>
                  <Add/>
                </Fab>
              </Tooltip> 
              <Tooltip title={`Create New Subrace`}>
                <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                  onClick={ () => {
                    this.setState({ redirectTo:`/beyond/subrace/create` });
                  }}>
                  <Add/>
                </Fab>
              </Tooltip> 
              { true && 
                <Tooltip title={`Import Races and Subraces`}>
                  <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                    onClick={ () => {
                      this.setState({ mode: "import" }, () => {
                        if (this.state.import_races === null) {
                          this.api.get5eObjects("races").then((res: any) => {
                            this.setState({ 
                              import_races: res.results,
                              page_num: 0 
                            });
                          });
                        }
                      });
                    }}>
                    <GetApp/>
                  </Fab>
                </Tooltip> 
              }
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
    } else if (this.state.mode === "import") {
      const formHeight = this.props.height - (this.props.width > 600 ? 198 : 198);
      const page_size = 7;
      const filtered: any[] = this.state.import_races ? this.state.import_races.filter(o => 
        (this.state.start_letter === "" || o.name.toUpperCase().startsWith(this.state.start_letter)) && 
        (this.state.search_string === "" || o.name.toLowerCase().includes(this.state.search_string.toLowerCase()))) : [];
      const page_count = Math.ceil(filtered.length / page_size);
      const filtered_and_paged: any[] = filtered.slice(page_size * this.state.page_num, page_size * (this.state.page_num + 1));
      return (
        <Grid container spacing={1} direction="column">
          <Grid item container spacing={1} direction="row">
            <Grid item xs={3}>
              <span className={"MuiTypography-root MuiListItemText-primary header"}>
                Importing Races
              </span>
              <Tooltip title={`Back`}>
                <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                  onClick={ () => {
                    this.setState({ 
                      mode: "index",
                      page_num: 0 
                    });
                  }}>
                  <ArrowBack/>
                </Fab>
              </Tooltip> 
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
          <Grid item
            style={{ 
              height: `${formHeight}px`, 
              overflowY: "scroll", 
              overflowX: "hidden" 
            }}>
            <Grid container spacing={1} direction="column">
              <Grid item container spacing={1} direction="row">
                <Grid item xs={2}>
                  Found
                </Grid>
                <Grid item xs={2}>
                  <Button 
                    fullWidth variant="contained" color="primary" 
                    onClick={ () => {
                      if (this.state.import_races) {
                        const import_checked: string[] = [];
                        if (this.state.import_races.length !== this.state.import_checked.length) {
                          this.state.import_races.forEach(s => {
                            if (this.state.races && !this.state.races.some(s2 => s2.name === s.name)) {
                              import_checked.push(s.url);
                            }
                          });
                        }
                        this.setState({ import_checked });
                      }
                    }}>
                      { (this.state.import_races && this.state.import_races.length === this.state.import_checked.length) ? "Deselect All" : "Select All" }
                  </Button>
                </Grid>
                <Grid item xs={4}>
                  Name
                </Grid>
                <Grid item xs={4}>
                  Import Status
                </Grid>
              </Grid>
              { filtered_and_paged.map((o, key) => {
                return (
                  <Grid key={key} item container spacing={1} direction="row">
                    <Grid item xs={2}>
                      <Checkbox 
                        checked={ this.state.races ? (this.state.races.some(s => s.name === o.name) || (this.state.import_checked.some(s => s === o.url) && !this.state.import_checked.slice(this.state.importing_pos === 0 ? 0 : (this.state.importing_pos - 1)).some(s => s === o.url))) : false } 
                        disabled={true}
                        color="primary" 
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <Checkbox 
                        checked={ this.state.import_checked.some(s => s === o.url) } 
                        onChange={e => {
                          const import_checked = this.state.import_checked.filter(s => s !== o.url);
                          if (e.target.checked) {
                            import_checked.push(o.url);
                          }
                          this.setState({ import_checked });
                        }}
                        color="primary" 
                      />
                    </Grid>
                    <Grid item xs={4}>
                      { o.name }
                    </Grid>
                    <Grid item xs={4}>
                      { o.url === this.state.importing ? "Importing" : "" }
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
          <Grid item>
            <Button 
              fullWidth variant="contained" color="primary" 
              onClick={ () => {
                this.runImport();
              }}>
                Import Selected
            </Button>
          </Grid>
        </Grid>
      );
    }
  }

  renderRace(race: Race, key: number) {
    return (
      <Grid key={key} item container spacing={1} direction="row">
        <Grid item xs={2}>
          <Tooltip title={`View details for ${race.name}`}>
            <Button 
              fullWidth variant="contained"
              disabled={this.state.processing} 
              color="primary" 
              onClick={ () => {
                this.setState({ redirectTo:`/beyond/race/details/${race._id}` });
              }}>
                {race.name}
            </Button>
          </Tooltip>
        </Grid>
        <Grid item xs={1}>
          <Tooltip title={`Edit ${race.name}`}>
            <Fab size="small" color="primary"
              disabled={this.state.processing} 
              style={{marginLeft: "8px"}}
              onClick={ () => {
                this.setState({ redirectTo:`/beyond/race/edit/${race._id}` });
              }}>
              <Edit/>
            </Fab>
          </Tooltip> 
        </Grid>
        <Grid item xs={1}>
          <Tooltip title={`Copy ${race.name}`}>
            <Fab size="small" color="primary"
              disabled={this.state.processing} style={{marginLeft: "8px"}}
              onClick={ () => {
                this.setState({ processing: true }, () => {
                  const new_obj = new Race();
                  new_obj.copy(race);
                  new_obj.name = "Copy of " + new_obj.name;
                  new_obj._id = "";
                  this.api.createObject(new_obj).then((res: any) => {
                    this.setState({ processing: false, redirectTo: `/beyond/race/edit/${res.id}` });
                  });
                });
              }}>
              <FileCopy/>
            </Fab>
          </Tooltip> 
        </Grid>
        <Grid item xs={8}>
          { this.renderDescription(race) }
        </Grid>
        { this.state.show_subraces === race._id &&
          <Grid item xs={12} container spacing={1} direction="column">
            { race.subraces.map((o, key2) => {
              return this.renderSubrace(o, key2);
            })} 
          </Grid>
        }
      </Grid>
    );
  }

  renderSubrace(subrace: Subrace, key: number) {
    return (
      <Grid key={key} item container spacing={1} direction="row">
        <Grid item xs={1}></Grid>
        <Grid item xs={2}>
          <Tooltip title={`View details for ${subrace.name}`}>
            <Button 
              fullWidth variant="contained"
              disabled={this.state.processing} 
              color="primary" 
              onClick={ () => {
                this.setState({ redirectTo:`/beyond/subrace/details/${subrace._id}` });
              }}>
                {subrace.name}
            </Button>
          </Tooltip>
        </Grid>
        <Grid item xs={1}>
          <Tooltip title={`Edit ${subrace.name}`}>
            <Fab size="small"
              disabled={this.state.processing} 
              color="primary" style={{marginLeft: "8px"}}
              onClick={ () => {
                this.setState({ redirectTo:`/beyond/subrace/edit/${subrace._id}` });
              }}>
              <Edit/>
            </Fab>
          </Tooltip> 
        </Grid>
        <Grid item xs={1}>
          <Tooltip title={`Copy ${subrace.name}`}>
            <Fab size="small" color="primary"
              disabled={this.state.processing} style={{marginLeft: "8px"}}
              onClick={ () => {
                this.setState({ processing: true }, () => {
                  const new_obj = new Subrace();
                  new_obj.copy(subrace);
                  new_obj.name = "Copy of " + new_obj.name;
                  new_obj._id = "";
                  this.api.createObject(new_obj).then((res: any) => {
                    this.setState({ processing: false, redirectTo: `/beyond/subrace/edit/${res.id}` });
                  });
                });
              }}>
              <FileCopy/>
            </Fab>
          </Tooltip> 
        </Grid>
        <Grid item xs={7}>
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

export default connector(RaceIndex);
