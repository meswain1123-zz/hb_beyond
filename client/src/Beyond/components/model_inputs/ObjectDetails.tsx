import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Redirect } from "react-router-dom";
import {
  Edit,
  ArrowBack,
  DeleteForever
} from "@material-ui/icons";
import {
  Grid, 
  Tooltip, 
  Fab,
} from "@material-ui/core";

import { 
  ModelBase 
} from "../../models";

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

type Props = PropsFromRedux & { 
  obj: ModelBase;
  data_type: string;
  type_label: string;
}

export interface State {
  redirectTo: string | null;
}

class ObjectDetails extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirectTo: null,
    };
    this.api = API.getInstance();
  }

  api: APIClass;

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

  render() {
    if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else {
      return (
        <Grid container spacing={1} direction="column">
          <Grid item>
            <Tooltip title={`Back to ${this.props.type_label}`}>
              <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                onClick={ () => {
                  this.setState({ redirectTo:`/beyond/${this.props.data_type}` });
                }}>
                <ArrowBack/>
              </Fab>
            </Tooltip> 
            &nbsp;
            <Tooltip title={`Delete ${this.props.obj.name}`}>
              <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                onClick={ () => {
                  this.api.deleteObject(this.props.data_type, this.props.obj).then((res: any) => {
                    this.setState({ redirectTo:`/beyond/${this.props.data_type}` });
                  });
                }}>
                <DeleteForever/>
              </Fab>
            </Tooltip> 
          </Grid>
          <Grid item>
            <span className={"MuiTypography-root MuiListItemText-primary header"}>
              { this.props.obj.name }
            </span>
            <Tooltip title={`Edit ${this.props.obj.name}`}>
              <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                onClick={ () => {
                  this.setState({ redirectTo:`/beyond/${this.props.data_type}/edit/${this.props.obj._id}` });
                }}>
                <Edit/>
              </Fab>
            </Tooltip> 
          </Grid>
          <Grid item>
            <Grid container spacing={1} direction="row">
              <Grid item xs={3} className={"MuiTypography-root MuiListItemText-primary header"}>
                Description
              </Grid>
              <Grid item xs={9}>
                {this.props.obj.description} 
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      ); 
    } 
  }
}

export default connector(ObjectDetails);
