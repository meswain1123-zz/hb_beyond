import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Redirect } from "react-router-dom";
import {
  Add, 
  Edit,
  GetApp,
  ArrowBack,
  VpnKey
} from "@material-ui/icons";
import {
  Grid, 
  Button, 
  Tooltip, Fab,
  Checkbox,
  Link
} from "@material-ui/core";

import { 
  MagicItem, 
  BaseItem,
  MagicItemKeyword 
} from "../../models";
import { 
  ITEM_TYPES 
} from "../../models/Constants";

import StringBox from "../../components/input/StringBox";
import SelectStringBox from "../../components/input/SelectStringBox";

import API from "../../utilities/smart_api";
import { APIClass } from "../../utilities/smart_api_class";


interface AppState {
  item_type: string;
  height: number;
  width: number;
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
  item_type: state.app.item_type,
  height: state.app.height,
  width: state.app.width
})

const mapDispatch = {
  setItemType: (item_type: string) => ({ type: 'SET', dataType: 'item_type', payload: item_type })
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & { }

export interface State { 
  redirectTo: string | null;
  search_string: string;
  mode: string;
  import_magic_items: any[] | null;
  importing_pos: number;
  import_checked: string[];
  importing: string;
  page_num: number;
  start_letter: string;
  magic_items: MagicItem[] | null;
  base_items: BaseItem[] | null;
  loading: boolean;
  item_type: string;
}

class MagicItemIndex extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirectTo: null,
      search_string: "",
      mode: "index",
      import_magic_items: null,
      importing_pos: 0,
      import_checked: [],
      importing: "",
      page_num: 0,
      start_letter: "",
      magic_items: null,
      base_items: null,
      loading: false,
      item_type: "ALL"
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
          // Translate it into a MagicItem object.
          const magic_item_obj = new MagicItem();
          magic_item_obj.copy5e(res);
          if (magic_item_obj.name !== "") {
            this.api.createObject(magic_item_obj).then((res: any) => {
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
      this.api.getSetOfObjects(["magic_item","base_item"]).then((res: any) => {
        const magic_items: MagicItem[] = res.magic_item ? res.magic_item : [];
        const base_items: BaseItem[] = res.base_item ? res.base_item : [];

        magic_items.forEach(o => {
          if (o.base_item === null) {
            const objFinder = base_items.filter(b => b._id === o.base_item_id);
            if (objFinder.length === 1) {
              o.base_item = objFinder[0];
            }
          }
        });

        this.setState({ 
          magic_items,
          base_items, 
          loading: false 
        });
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.magic_items === null) {
      this.load();
      return <span>Loading</span>;
    } else if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else if (this.state.mode === "index") {
      const page_size = 7;
      const filtered: any[] = this.state.magic_items ? this.state.magic_items.filter(o => 
        (this.props.item_type === "ALL" || (o.base_item && o.base_item.item_type === this.props.item_type)) &&
        (this.state.start_letter === "" || o.name.toUpperCase().startsWith(this.state.start_letter)) && 
        (this.state.search_string === "" || o.name.toLowerCase().includes(this.state.search_string.toLowerCase()) || o.description.toLowerCase().includes(this.state.search_string.toLowerCase()))).sort((a,b) => {return a.name.localeCompare(b.name)}) : [];
      const page_count = Math.ceil(filtered.length / page_size);
      const filtered_and_paged: any[] = filtered.slice(page_size * this.state.page_num, page_size * (this.state.page_num + 1));
      return (
        <Grid container spacing={1} direction="column">
          <Grid item container spacing={1} direction="row">
            <Grid item xs={3}>
              <span className={"MuiTypography-root MuiListItemText-primary header"}>
                Magic Items
              </span>
              <Tooltip title={`Create New Magic Item`}>
                <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                  onClick={ () => {
                    this.setState({ redirectTo:`/beyond/magic_item/create` });
                  }}>
                  <Add/>
                </Fab>
              </Tooltip> 
              <Tooltip title={`Import Magic Items`}>
                <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                  onClick={ () => {
                    this.setState({ mode: "import" }, () => {
                      if (this.state.import_magic_items === null) {
                        this.api.get5eObjects("magic-items").then((res: any) => {
                          this.setState({ 
                            import_magic_items: res.results,
                            page_num: 0 
                          });
                        });
                      }
                    });
                  }}>
                  <GetApp/>
                </Fab>
              </Tooltip>
            </Grid>
            <Grid item xs={6}>
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
                name="Item Type"
                options={["ALL",...ITEM_TYPES]}
                value={this.props.item_type}
                onChange={(item_type: string) => {
                  this.props.setItemType(item_type);
                  this.setState({ item_type });
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
                            this.setState({ redirectTo:`/beyond/magic_item/details/${o._id}` });
                          }}>
                            {o.name}
                        </Button>
                      </Tooltip>
                    </Grid>
                    <Grid item xs={1}>
                      <Tooltip title={`Edit ${o.name}`}>
                        <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                          onClick={ () => {
                            this.setState({ redirectTo:`/beyond/magic_item/edit/${o._id}` });
                          }}>
                          <Edit/>
                        </Fab>
                      </Tooltip> 
                    </Grid>
                    <Grid item xs={1}>
                      <Tooltip title={`Convert ${o.name} to Magic Item Keyword`}>
                        <Fab size="small" color="primary" 
                          style={{marginLeft: "8px"}}
                          onClick={ () => {
                            const keyword = new MagicItemKeyword();
                            keyword.copyFromItem(o);
                            this.api.createObject(keyword).then((res: any) => {
                              if (res && res.id) {
                                this.api.deleteObject(o).then((res2: any) => {
                                  if (this.state.magic_items) {
                                    const magic_items = this.state.magic_items.filter(i => i._id !== o._id);
                                    this.setState({ magic_items });
                                  }
                                });
                              }
                            });
                          }}>
                          <VpnKey/>
                        </Fab>
                      </Tooltip> 
                    </Grid>
                    <Grid item xs={8}>
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
      const filtered: any[] = this.state.import_magic_items ? this.state.import_magic_items.filter(o => 
        (this.state.start_letter === "" || o.name.toUpperCase().startsWith(this.state.start_letter)) && 
        (this.state.search_string === "" || o.name.toLowerCase().includes(this.state.search_string.toLowerCase()))) : [];
      const page_count = Math.ceil(filtered.length / page_size);
      const filtered_and_paged: any[] = filtered.slice(page_size * this.state.page_num, page_size * (this.state.page_num + 1));
      return (
        <Grid container spacing={1} direction="column">
          <Grid item container spacing={1} direction="row">
            <Grid item xs={3}>
              <span className={"MuiTypography-root MuiListItemText-primary header"}>
                Importing Magic Items
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
                      if (this.state.import_magic_items) {
                        const import_checked: string[] = [];
                        if (this.state.import_magic_items.length !== this.state.import_checked.length) {
                          this.state.import_magic_items.forEach(s => {
                            if (this.state.magic_items && !this.state.magic_items.some(s2 => s2.name === s.name)) {
                              import_checked.push(s.url);
                            }
                          });
                        }
                        this.setState({ import_checked });
                      }
                    }}>
                      { (this.state.import_magic_items && this.state.import_magic_items.length === this.state.import_checked.length) ? "Deselect All" : "Select All" }
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
                        checked={ this.state.magic_items ? (this.state.magic_items.some(s => s.name === o.name) || (this.state.import_checked.some(s => s === o.url) && !this.state.import_checked.slice(this.state.importing_pos === 0 ? 0 : (this.state.importing_pos - 1)).some(s => s === o.url))) : false } 
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

export default connector(MagicItemIndex);
