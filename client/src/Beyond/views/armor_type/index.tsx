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
  Tooltip, Fab
} from "@material-ui/core";
import { ArmorType } from "../../models";

import StringBox from "../../components/input/StringBox";

import API from "../../utilities/smart_api";
import { APIClass } from "../../utilities/smart_api_class";


interface AppState {
  width: number;
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
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
  mode: string;
  import_armor_types: any[] | null;
  armor_types: ArmorType[] | null;
  loading: boolean;
}

class ArmorTypeIndex extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirectTo: null,
      search_string: "",
      level: "ALL",
      school: "ALL",
      mode: "index",
      import_armor_types: null,
      armor_types: null,
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

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects("armor_type").then((res: any) => {
        if (res && !res.error) {
          this.setState({ armor_types: res, loading: false });
        }
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.armor_types === null) {
      this.load();
      return <span>Loading</span>;
    } else if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else if (this.state.mode === "index") {
      return (
        <Grid container spacing={1} direction="column">
          <Grid item container spacing={1} direction="row">
            <Grid item xs={3}>
              <span className={"MuiTypography-root MuiListItemText-primary header"}>
                Armor Types
              </span>
              <Tooltip title={`Create New Armor Type`}>
                <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                  onClick={ () => {
                    this.setState({ redirectTo:`/beyond/armor_type/create` });
                  }}>
                  <Add/>
                </Fab>
              </Tooltip> 
              { false && <Tooltip title={`Import ArmorTypes`}>
                <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                  onClick={ () => {
                    this.setState({ mode: "import" }, () => {
                      if (this.state.import_armor_types === null) {
                        this.api.get5eObjects("armor_types").then((res: any) => {
                          this.setState({ import_armor_types: res.results });
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
              { this.state.armor_types?.filter(o => 
                (this.state.search_string === "" || o.name.toLowerCase().includes(this.state.search_string.toLowerCase()) || o.description.toLowerCase().includes(this.state.search_string.toLowerCase()))).map((o, key) => {
                return (
                  <Grid key={key} item container spacing={1} direction="row">
                    <Grid item xs={2}>
                      <Tooltip title={`View details for ${o.name}`}>
                        <Button 
                          fullWidth variant="contained" color="primary" 
                          onClick={ () => {
                            this.setState({ redirectTo:`/beyond/armor_type/details/${o._id}` });
                          }}>
                            {o.name}
                        </Button>
                      </Tooltip>
                    </Grid>
                    <Grid item xs={1}>
                      <Tooltip title={`Edit ${o.name}`}>
                        <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                          onClick={ () => {
                            this.setState({ redirectTo:`/beyond/armor_type/edit/${o._id}` });
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
            </Grid>
          </Grid>
        </Grid>
      ); 
    } else if (this.state.mode === "import") {
      return (
        <Grid container spacing={1} direction="column">
          <Grid item container spacing={1} direction="row">
            <Grid item xs={3}>
              <span className={"MuiTypography-root MuiListItemText-primary header"}>
                Importing ArmorTypes
              </span>
              <Tooltip title={`Back`}>
                <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                  onClick={ () => {
                    this.setState({ mode: "index" });
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
          <Grid item>
            <Grid container spacing={1} direction="column">
              { this.state.import_armor_types?.filter(o => 
                (this.state.search_string === "" || o.name.toLowerCase().includes(this.state.search_string.toLowerCase()))).map((o, key) => {
                return (
                  <Grid key={key} item container spacing={1} direction="row">
                    <Grid item xs={2}>
                      <Tooltip title={`View details for ${o.name}`}>
                        <Button 
                          fullWidth variant="contained" color="primary" 
                          onClick={ () => {
                            this.setState({ redirectTo:`/beyond/armor_type/details/${o._id}` });
                          }}>
                            {o.name}
                        </Button>
                      </Tooltip>
                    </Grid>
                    <Grid item xs={1}>
                      <Tooltip title={`Edit ${o.name}`}>
                        <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                          onClick={ () => {
                            this.setState({ redirectTo:`/beyond/armor_type/edit/${o._id}` });
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
            </Grid>
          </Grid>
        </Grid>
      );
    }
  }
}

export default connector(ArmorTypeIndex);
