import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Redirect } from "react-router-dom";
import {
  Add, 
  Edit,
} from "@material-ui/icons";
import {
  Grid, 
  Button, 
  Tooltip, Fab,
  Link
} from "@material-ui/core";

import { Tool } from "../../models";

import StringBox from "../../components/input/StringBox";

import SelectToolTypeBox from "../../components/model_inputs/select/SelectToolTypeBox";

import API from "../../utilities/smart_api";
import { APIClass } from "../../utilities/smart_api_class";


interface AppState {
  tool_type: string;
  height: number;
  width: number;
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
  tool_type: state.app.tool_type,
  height: state.app.height,
  width: state.app.width
})

const mapDispatch = {
  setToolType: (type: string) => ({ type: 'SET', dataType: 'tool_type', payload: type })
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & { }

export interface State { 
  redirectTo: string | null;
  search_string: string;
  page_num: number;
  start_letter: string;
  tools: Tool[] | null;
  loading: boolean;
  type: string;
}

class ToolIndex extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirectTo: null,
      search_string: "",
      page_num: 0,
      start_letter: "",
      tools: null,
      loading: false,
      type: "Any"
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

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects("tool").then((res: any) => {
        if (res && !res.error) {
          this.setState({ tools: res, loading: false });
        }
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.tools === null) {
      this.load();
      return <span>Loading</span>;
    } else if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else {
      const page_size = 7;
      const filtered: any[] = this.state.tools ? this.state.tools.filter(o => 
        (this.props.tool_type === "Any" || o.type === this.props.tool_type) &&
        (this.state.start_letter === "" || o.name.toUpperCase().startsWith(this.state.start_letter)) && 
        (this.state.search_string === "" || o.name.toLowerCase().includes(this.state.search_string.toLowerCase()) || o.description.toLowerCase().includes(this.state.search_string.toLowerCase()))).sort((a,b) => {return a.name.localeCompare(b.name)}) : [];
      const page_count = Math.ceil(filtered.length / page_size);
      const filtered_and_paged: any[] = filtered.slice(page_size * this.state.page_num, page_size * (this.state.page_num + 1));
      return (
        <Grid container spacing={1} direction="column">
          <Grid item container spacing={1} direction="row">
            <Grid item xs={3}>
              <span className={"MuiTypography-root MuiListItemText-primary header"}>
                Tools
              </span>
              <Tooltip title={`Create New Tool`}>
                <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                  onClick={ () => {
                    this.setState({ redirectTo:`/beyond/tool/create` });
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
              <SelectToolTypeBox 
                name="Tool Type" 
                value={this.props.tool_type} 
                allowAny
                onChange={(value: string) => {
                  this.props.setToolType(value);
                  this.setState({ type: value });
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
                            this.setState({ redirectTo:`/beyond/tool/details/${o._id}` });
                          }}>
                            {o.name}
                        </Button>
                      </Tooltip>
                    </Grid>
                    <Grid item xs={1}>
                      <Tooltip title={`Edit ${o.name}`}>
                        <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                          onClick={ () => {
                            this.setState({ redirectTo:`/beyond/tool/edit/${o._id}` });
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

export default connector(ToolIndex);
