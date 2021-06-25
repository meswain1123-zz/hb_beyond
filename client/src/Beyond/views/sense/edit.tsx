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
  Sense, 
} from "../../models";

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
  obj: Sense;
  processing: boolean;
  senses: Sense[] | null;
  loading: boolean;
}

class SenseEdit extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirectTo: null,
      obj: new Sense(),
      processing: false,
      senses: null,
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
      this.api.upsertObject("sense", this.state.obj).then((res: any) => {
        this.setState({ processing: false, redirectTo: "/beyond/sense" });
      });
    });
  }

  // Loads the editing obj into state
  load_object(id: string) {
    const objFinder = this.state.senses ? this.state.senses.filter(a => a._id === id) : [];
    if (objFinder.length === 1) {
      this.setState({ obj: objFinder[0].clone(), loading: false });
    }
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects("sense").then((res: any) => {
        if (res && !res.error) {
          let { id } = this.props.match.params;
          if (id !== undefined && this.state.obj._id !== id) {
            this.setState({ senses: res }, () => {
              this.load_object(id);
            });
          } else {
            this.setState({ senses: res, loading: false });
          }
        }
      });
    });
  }

  render() {
    if (this.state.loading || this.state.senses === null) {
      return <span>Loading</span>;
    } else if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else { 
      const formHeight = this.props.height - (this.props.width > 600 ? 220 : 220);
      return (
        <Grid container spacing={1} direction="column">
          <Grid item>
            <Tooltip title={`Back to Senses`}>
              <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                onClick={ () => {
                  this.setState({ redirectTo:`/beyond/sense` });
                }}>
                <ArrowBack/>
              </Fab>
            </Tooltip> 
          </Grid>
          <Grid item>
            <span className={"MuiTypography-root MuiListItemText-primary header"}>
              { this.state.obj._id === "" ? "Create Sense" : `Edit ${this.state.obj.name}` }
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
                this.setState({ redirectTo:`/beyond/sense` });
              }}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      ); 
    }
  }
}

export default connector(SenseEdit);
