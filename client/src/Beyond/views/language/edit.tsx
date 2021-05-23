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
} from "@material-ui/core";
import { 
  Language, 
} from "../../models";
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
  obj: Language;
  processing: boolean;
  languages: Language[] | null;
  loading: boolean;
}

class LanguageEdit extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirectTo: null,
      obj: new Language(),
      processing: false,
      languages: null,
      loading: false
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
    this.load();
  }

  submit() {
    this.setState({ processing: true }, () => {
      this.api.upsertObject("language", this.state.obj).then((res: any) => {
        this.setState({ processing: false, redirectTo: "/beyond/language" });
      });
    });
  }

  // Loads the editing obj into state
  load_object(id: string) {
    const objFinder = this.state.languages ? this.state.languages.filter(a => a._id === id) : [];
    if (objFinder.length === 1) {
      this.setState({ obj: objFinder[0].clone(), loading: false });
    }
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects("language").then((res: any) => {
        if (res && !res.error) {
          let { id } = this.props.match.params;
          if (id !== undefined && this.state.obj._id !== id) {
            this.setState({ languages: res }, () => {
              this.load_object(id);
            });
          } else {
            this.setState({ languages: res, loading: false });
          }
        }
      });
    });
  }

  render() {
    if (this.state.loading || this.state.languages === null) {
      return <span>Loading</span>;
    } else if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else { 
      const formHeight = this.props.height - (this.props.width > 600 ? 198 : 198);
      return (
        <Grid container spacing={1} direction="column">
          <Grid item>
            <Tooltip title={`Back to Languages`}>
              <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                onClick={ () => {
                  this.setState({ redirectTo:`/beyond/language` });
                }}>
                <ArrowBack/>
              </Fab>
            </Tooltip> 
          </Grid>
          <Grid item>
            <span className={"MuiTypography-root MuiListItemText-primary header"}>
              { this.state.obj._id === "" ? "Create Language" : `Edit ${this.state.obj.name}` }
            </span>
          </Grid>
          <Grid item 
            style={{ 
              height: `${formHeight}px`, 
              overflowY: "scroll", 
              overflowX: "hidden" 
            }}>
            <Grid container spacing={1} direction="column">
              <Grid item>
                <StringBox 
                  value={this.state.obj.name} 
                  message={this.state.obj.name.length > 0 ? "" : "Name Invalid"}
                  name="Name"
                  onBlur={(value: string) => {
                    const obj = this.state.obj;
                    obj.name = value;
                    this.setState({ obj });
                  }}
                />
              </Grid>
              <Grid item>
                <StringBox 
                  value={this.state.obj.description} 
                  name="Description"
                  multiline
                  onBlur={(value: string) => {
                    const obj = this.state.obj;
                    obj.description = value;
                    this.setState({ obj });
                  }}
                />
              </Grid>
              <Grid item>
                <SelectStringBox 
                  options={["Standard","Exotic","Special"]}
                  value={this.state.obj.type} 
                  name="Type"
                  onChange={(value: string) => {
                    const obj = this.state.obj;
                    obj.type = value;
                    this.setState({ obj });
                  }}
                />
              </Grid>
              <Grid item>
                <StringBox 
                  value={this.state.obj.script} 
                  name="Script"
                  onBlur={(value: string) => {
                    const obj = this.state.obj;
                    obj.script = value;
                    this.setState({ obj });
                  }}
                />
              </Grid>
              <Grid item>
                <StringBox 
                  value={this.state.obj.typical_speakers.join(",")} 
                  name="Typical Speakers"
                  multiline
                  onBlur={(value: string) => {
                    const obj = this.state.obj;
                    obj.typical_speakers = value.split(",");
                    this.setState({ obj });
                  }}
                />
              </Grid>
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
                this.setState({ redirectTo:`/beyond/language` });
              }}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      ); 
    }
  }
}

export default connector(LanguageEdit);
