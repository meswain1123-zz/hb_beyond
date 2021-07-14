import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Redirect } from "react-router-dom";
import {
  Add, 
  Edit,
  FileCopy
} from "@material-ui/icons";
import {
  Grid, 
  Tooltip, 
  Fab,
  Button, 
  Link
} from "@material-ui/core";
import { 
  Lineage,
  Subclass
} from "../../models";

import StringBox from "../../components/input/StringBox";

import SelectGameClassBox from "../../components/model_inputs/select/SelectGameClassBox";

// import ObjectIndex from "../../components/Navigation/ObjectIndex";
import LetterLinks from "../../components/Navigation/LetterLinks";

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
  game_class_id: string;
  start_letter: string;
  subclasses: Subclass[] | null;
  loading: boolean;
  processing: boolean;
  page_num: number;
}

class SubclassIndex extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirectTo: null,
      search_string: "",
      game_class_id: "ALL",
      start_letter: "",
      subclasses: null,
      loading: false,
      processing: false,
      page_num: 0
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
      this.api.getSetOfObjects(["subclass"]).then((res: any) => {
        const subclasses: Subclass[] = res.subclass;
        this.setState({ 
          subclasses,
          loading: false 
        });
      });
    });
  }

  get_filtered() {
    if (this.state.subclasses) {
      let filtered: Subclass[] = this.state.subclasses;

      if (this.state.game_class_id !== "ALL") {
        filtered = filtered.filter(o => o.game_class_id === this.state.game_class_id);
      }
      if (this.state.start_letter !== "") {
        filtered = filtered.filter(o => o.name.toUpperCase().startsWith(this.state.start_letter));
      }
      if (this.state.search_string !== "") {
        filtered = filtered.filter(o => o.name.toLowerCase().includes(this.state.search_string.toLowerCase()) || 
          o.description.toLowerCase().includes(this.state.search_string.toLowerCase()));
      }
      return filtered.sort((a,b) => {return a.name.localeCompare(b.name)});
    }
    return [];
  }

  render() {
    if (this.state.loading || this.state.subclasses === null) {
      return <span>Loading</span>;
    } else if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else {
      const page_size = 7;
      const filtered = this.get_filtered();
      const page_count = Math.ceil(filtered.length / page_size);
      const filtered_and_paged: any[] = filtered.slice(page_size * this.state.page_num, page_size * (this.state.page_num + 1));
      return (
        <Grid container spacing={1} direction="column">
          <Grid item container spacing={1} direction="row">
            <Grid item xs={3}>
              <span className={"MuiTypography-root MuiListItemText-primary header"}>
                Subclasses
              </span>
              <Tooltip title={`Create New Subclass`}>
                <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                  onClick={ () => {
                    this.setState({ redirectTo:`/beyond/subclass/create` });
                  }}>
                  <Add/>
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
              <SelectGameClassBox
                name="Classes" 
                allow_all
                value={ this.state.game_class_id } 
                onChange={(id: string) => {
                  this.setState({ game_class_id: id });
                }} 
              />
            </Grid>
          </Grid>
          <Grid item>
            <Grid container spacing={1} direction="column">
              { filtered_and_paged.map((o, key) => {
                return this.renderSubclass(o,key);
              }) }
              <Grid item>
                { this.renderPageLinks(page_count) }
              </Grid>
              <Grid item>
                <LetterLinks 
                  onChange={(start_letter: string) => {
                    this.setState({ start_letter });
                  }} 
                />
              </Grid>
            </Grid>
            {/* <ObjectIndex 
              filter={this.get_filter()}
              data_type="subclass"
            /> */}
          </Grid>
        </Grid>
      ); 
    } 
  }

  renderSubclass(subclass: Subclass, key: number) {
    return (
      <Grid key={key} item container spacing={1} direction="row">
        <Grid item xs={2}>
          <Tooltip title={`View details for ${subclass.name}`}>
            <Button 
              fullWidth variant="contained"
              disabled={this.state.processing} 
              color="primary" 
              onClick={ () => {
                this.setState({ redirectTo:`/beyond/subclass/details/${subclass._id}` });
              }}>
                {subclass.name}
            </Button>
          </Tooltip>
        </Grid>
        <Grid item xs={1}>
          <Tooltip title={`Edit ${subclass.name}`}>
            <Fab size="small" color="primary"
              disabled={this.state.processing} 
              style={{marginLeft: "8px"}}
              onClick={ () => {
                this.setState({ redirectTo:`/beyond/subclass/edit/${subclass._id}` });
              }}>
              <Edit/>
            </Fab>
          </Tooltip> 
        </Grid>
        <Grid item xs={1}>
          <Tooltip title={`Copy ${subclass.name}`}>
            <Fab size="small" color="primary"
              disabled={this.state.processing} style={{marginLeft: "8px"}}
              onClick={ () => {
                this.setState({ processing: true }, () => {
                  const new_obj = new Subclass();
                  new_obj.copy(subclass);
                  new_obj.name = "Copy of " + new_obj.name;
                  new_obj._id = "";
                  this.api.createObject("subclass", new_obj).then((res: any) => {
                    this.setState({ processing: false, redirectTo: `/beyond/subclass/edit/${res.id}` });
                  });
                });
              }}>
              <FileCopy/>
            </Fab>
          </Tooltip> 
        </Grid>
        <Grid item xs={1}>
          <Tooltip title={`Create Lineage Based on ${subclass.name}`}>
            <Fab size="small" color="primary"
              disabled={this.state.processing} style={{marginLeft: "8px"}}
              onClick={ () => {
                this.setState({ processing: true }, () => {
                  const new_obj = new Lineage();
                  new_obj.copySubclass(subclass);
                  new_obj.name = "Copy of " + new_obj.name;
                  new_obj._id = "";
                  this.api.createObject("lineage", new_obj).then((res: any) => {
                    this.setState({ processing: false, redirectTo: `/beyond/lineage/edit/${res.id}` });
                  });
                });
              }}>
              <FileCopy/>
            </Fab>
          </Tooltip> 
        </Grid>
        <Grid item xs={7}>
          { this.renderDescription(subclass) }
        </Grid>
      </Grid>
    );
  }

  renderDescription(subclass: Subclass) {
    return (
      <Tooltip title={subclass.description}>
        <div style={this.descriptionStyle()}>
          { subclass.description }
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
}

export default connector(SubclassIndex);
