import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Redirect } from "react-router-dom";
import {
  Add, 
} from "@material-ui/icons";
import {
  Grid,  
  Tooltip, Fab,
} from "@material-ui/core";
import {
  User
} from "../../models";

import StringBox from "../../components/input/StringBox";

import ObjectIndex from "../../components/Navigation/ObjectIndex";


interface AppState {
  loginUser: User | null;
  height: number;
  width: number;
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
  loginUser: state.app.loginUser,
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
  start_letter: string;
  logging_in: boolean;
}

class CharacterIndex extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirectTo: null,
      search_string: "",
      start_letter: "",
      logging_in: false
    };
  }

  componentDidMount() {
    if (this.props.loginUser === null) {
      const userObjStr = localStorage.getItem("loginUser");
      if (!userObjStr) {
        this.setState({ redirectTo: "/beyond" });
      } else {
        this.setState({ logging_in: true }, this.check_login);
      }
    }
  }

  check_login() {
    setTimeout(() => {
      if (this.props.loginUser === null) {
        this.check_login();
      } else {
        this.setState({ logging_in: false });
      }
    }, 1000);
  }

  get_filter() {
    const filter: any = {};
    
    if (this.state.search_string !== "") {
      filter.search_string = this.state.search_string;
    }
    filter.owner_id = this.props.loginUser ? this.props.loginUser._id : "No Login";

    return filter;
  }

  render() {
    if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else if (this.state.logging_in) {
      return (
        <span>Logging In</span>
      );
    } else {
      return (
        <Grid container spacing={1} direction="column">
          <Grid item container spacing={1} direction="row">
            <Grid item xs={3}>
              <span className={"MuiTypography-root MuiListItemText-primary header"}>
                My Characters
              </span>
              <Tooltip title={`Create New Character`}>
                <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                  onClick={ () => {
                    this.setState({ redirectTo:`/beyond/character/create` });
                  }}>
                  <Add/>
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
            <ObjectIndex 
              filter={this.get_filter()}
              data_type="character"
            />
          </Grid>
        </Grid>
      ); 
    } 
  }
}

export default connector(CharacterIndex);
