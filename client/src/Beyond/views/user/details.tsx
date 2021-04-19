import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Redirect } from "react-router-dom";
import {
  Edit, ArrowBack
} from "@material-ui/icons";
import {
  Grid, 
  Tooltip, Fab,
} from "@material-ui/core";

import { 
  User
} from "../../models";

import API from "../../utilities/smart_api";
import { APIClass } from "../../utilities/smart_api_class";


interface AppState {
  users: User[] | null;
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
  objects: state.app.users,
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
  object: User;
}

class UserDetails extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirectTo: null,
      object: new User()
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  // Loads the editing User into state
  load(id: string) {
    const objectFinder = this.props.objects ? this.props.objects.filter(o => o._id === id) : [];
    if (objectFinder.length === 1) {
      this.setState({ object: objectFinder[0].clone() });
    }
  }

  render() {
    if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else { 
      let { id } = this.props.match.params;
      if (id !== undefined && this.state.object._id !== id) {
        this.load(id);
        return (<span>Loading...</span>);
      } else {
        const formHeight = this.props.height - (this.props.width > 600 ? 150 : 150);
        return (
          <Grid container spacing={1} direction="column">
            <Grid item>
              <Tooltip title={`Back to Users`}>
                <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                  onClick={ () => {
                    this.setState({ redirectTo:`/beyond/user` });
                  }}>
                  <ArrowBack/>
                </Fab>
              </Tooltip> 
            </Grid>
            <Grid item>
              <span className={"MuiTypography-root MuiListItemText-primary header"}>
                { this.state.object.name }
              </span>
              <Tooltip title={`Edit ${this.state.object.name}`}>
                <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                  onClick={ () => {
                    this.setState({ redirectTo:`/beyond/user/edit/${this.state.object._id}` });
                  }}>
                  <Edit/>
                </Fab>
              </Tooltip> 
            </Grid>
            <Grid item 
              style={{ 
                height: `${formHeight}px`, 
                overflowY: "scroll", 
                overflowX: "hidden" 
              }}>
              <Grid container spacing={1} direction="row">
                <Grid item xs={3} className={"MuiTypography-root MuiListItemText-primary header"}>
                  Description
                </Grid>
                <Grid item xs={9}>
                  {this.state.object.description} 
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        ); 
      }
    }
  }
}

export default connector(UserDetails);
