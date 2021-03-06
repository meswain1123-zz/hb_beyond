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
  Tool
} from "../../models";

import StringBox from "../../components/input/StringBox";

import ModelBaseInput from "../../components/model_inputs/ModelBaseInput";

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

interface MatchParams {
  id: string;
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

type Props = PropsFromRedux & RouteComponentProps<MatchParams> & { }

export interface State { 
  redirectTo: string | null;
  obj: Tool;
  processing: boolean;
  tools: Tool[] | null;
  loading: boolean;
}

class ToolEdit extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirectTo: null,
      obj: new Tool(),
      processing: false,
      tools: null,
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
      this.api.upsertObject("tool", this.state.obj).then((res: any) => {
        this.setState({ processing: false, redirectTo: "/beyond/tool" });
      });
    });
  }

  // Loads the editing obj into state
  load_object(id: string) {
    const objFinder = this.state.tools ? this.state.tools.filter(a => a._id === id) : [];
    if (objFinder.length === 1) {
      this.setState({ obj: objFinder[0].clone(), loading: false });
    }
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects("tool").then((res: any) => {
        if (res && !res.error) {
          let { id } = this.props.match.params;
          if (id !== undefined && this.state.obj._id !== id) {
            this.setState({ tools: res }, () => {
              this.load_object(id);
            });
          } else {
            this.setState({ tools: res, loading: false });
          }
        }
      });
    });
  }

  render() {
    if (this.state.loading || this.state.tools === null) {
      return <span>Loading</span>;
    } else if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else { 
      const formHeight = this.props.height - (this.props.width > 600 ? 220 : 220);
      return (
        <Grid container spacing={1} direction="column">
          <Grid item>
            <Tooltip title={`Back to Tools`}>
              <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                onClick={ () => {
                  this.setState({ redirectTo:`/beyond/tool` });
                }}>
                <ArrowBack/>
              </Fab>
            </Tooltip> 
          </Grid>
          <Grid item>
            <span className={"MuiTypography-root MuiListItemText-primary header"}>
              { this.state.obj._id === "" ? "Create Tool" : `Edit ${this.state.obj.name}` }
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
              <Grid item>
                <StringBox 
                  value={this.state.obj.type} 
                  name="Type"
                  onBlur={(value: string) => {
                    const obj = this.state.obj;
                    obj.type = value;
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
              disabled={ this.state.processing || this.state.obj.name === "" || this.state.obj.type === "" }
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
                this.setState({ redirectTo:`/beyond/tool` });
              }}>
              Cancel
            </Button>
            { (this.state.obj.name === "" || this.state.obj.type === "") && 
              <span style={{ color: "red", marginLeft: "4px" }}>
                The Tool must have a name and a type.
              </span>
            }
          </Grid>
        </Grid>
      );
    }
  }
}

export default connector(ToolEdit);
