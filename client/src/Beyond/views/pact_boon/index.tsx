import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Redirect } from "react-router-dom";
import {
  Add, 
  Edit,
  GetApp,
  ArrowBack
} from "@material-ui/icons";
import {
  Grid, 
  Button, 
  Tooltip, Fab,
  Checkbox,
  Link
} from "@material-ui/core";

import { PactBoon } from "../../models";

import StringBox from "../../components/input/StringBox";

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
  mode: string;
  import_pact_boons: any[] | null;
  importing_pos: number;
  import_checked: string[];
  importing: string;
  page_num: number;
  start_letter: string;
  pact_boons: PactBoon[] | null;
  loading: boolean;
}

class PactBoonIndex extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirectTo: null,
      search_string: "",
      mode: "index",
      import_pact_boons: null,
      importing_pos: 0,
      import_checked: [],
      importing: "",
      page_num: 0,
      start_letter: "",
      pact_boons: null,
      loading: false
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
          // Translate it into a Pact Boon object.
          const pact_boon_obj = new PactBoon();
          pact_boon_obj.copy5e(res);
          if (pact_boon_obj.name !== "") {
            this.api.createObject(pact_boon_obj).then((res: any) => {
              this.runImport();
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

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects("pact_boon").then((res: any) => {
        if (res && !res.error) {
          this.setState({ pact_boons: res, loading: false });
        }
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.pact_boons === null) {
      this.load();
      return <span>Loading</span>;
    } else if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else if (this.state.mode === "index") {
      const page_size = 7;
      const filtered: any[] = this.state.pact_boons ? this.state.pact_boons.filter(o => 
        (this.state.start_letter === "" || o.name.toUpperCase().startsWith(this.state.start_letter)) && 
        (this.state.search_string === "" || o.name.toLowerCase().includes(this.state.search_string.toLowerCase()) || o.description.toLowerCase().includes(this.state.search_string.toLowerCase()))).sort((a,b) => {return a.name.localeCompare(b.name)}) : [];
      const page_count = Math.ceil(filtered.length / page_size);
      const filtered_and_paged: any[] = filtered.slice(page_size * this.state.page_num, page_size * (this.state.page_num + 1));
      return (
        <Grid container spacing={1} direction="column">
          <Grid item container spacing={1} direction="row">
            <Grid item xs={3}>
              <span className={"MuiTypography-root MuiListItemText-primary header"}>
                Pact Boons
              </span>
              <Tooltip title={`Create New Pact Boon`}>
                <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                  onClick={ () => {
                    this.setState({ redirectTo:`/beyond/pact_boon/create` });
                  }}>
                  <Add/>
                </Fab>
              </Tooltip> 
              { true && <Tooltip title={`Import Pact Boons`}>
                <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                  onClick={ () => {
                    this.setState({ mode: "import" }, () => {
                      if (this.state.import_pact_boons === null) {
                        this.api.get5eObjects("features/choose-eldritch-invocations").then((res: any) => {
                          this.setState({ 
                            import_pact_boons: res.choice.from,
                            page_num: 0 
                          });
                        });
                      }
                    });
                  }}>
                  <GetApp/>
                </Fab>
              </Tooltip> }
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
                return (
                  <Grid key={key} item container spacing={1} direction="row">
                    <Grid item xs={2}>
                      <Tooltip title={`View details for ${o.name}`}>
                        <Button 
                          fullWidth variant="contained" color="primary" 
                          onClick={ () => {
                            this.setState({ redirectTo:`/beyond/pact_boon/details/${o._id}` });
                          }}>
                            {o.name}
                        </Button>
                      </Tooltip>
                    </Grid>
                    <Grid item xs={1}>
                      <Tooltip title={`Edit ${o.name}`}>
                        <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                          onClick={ () => {
                            this.setState({ redirectTo:`/beyond/pact_boon/edit/${o._id}` });
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
      const filtered: any[] = this.state.import_pact_boons ? this.state.import_pact_boons.filter(o => 
        (this.state.start_letter === "" || o.name.toUpperCase().startsWith(this.state.start_letter)) && 
        (this.state.search_string === "" || o.name.toLowerCase().includes(this.state.search_string.toLowerCase()))) : [];
      const page_count = Math.ceil(filtered.length / page_size);
      const filtered_and_paged: any[] = filtered.slice(page_size * this.state.page_num, page_size * (this.state.page_num + 1));
      return (
        <Grid container spacing={1} direction="column">
          <Grid item container spacing={1} direction="row">
            <Grid item xs={3}>
              <span className={"MuiTypography-root MuiListItemText-primary header"}>
                Importing Pact Boons
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
                      if (this.state.import_pact_boons) {
                        const import_checked: string[] = [];
                        if (this.state.import_pact_boons.length !== this.state.import_checked.length) {
                          this.state.import_pact_boons.forEach(s => {
                            if (this.state.pact_boons && !this.state.pact_boons.some(s2 => s2.name === s.name)) {
                              import_checked.push(s.url);
                            }
                          });
                        }
                        this.setState({ import_checked });
                      }
                    }}>
                      { (this.state.import_pact_boons && this.state.import_pact_boons.length === this.state.import_checked.length) ? "Deselect All" : "Select All" }
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
                        checked={ this.state.pact_boons ? (this.state.pact_boons.some(s => s.name === o.name) || (this.state.import_checked.some(s => s === o.url) && !this.state.import_checked.slice(this.state.importing_pos === 0 ? 0 : (this.state.importing_pos - 1)).some(s => s === o.url))) : false } 
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

export default connector(PactBoonIndex);
