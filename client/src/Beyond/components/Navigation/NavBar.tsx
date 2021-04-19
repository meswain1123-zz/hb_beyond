import React, { Component } from "react";
import {
  AppBar, 
  Toolbar, 
  ListItem, 
  ListItemText, 
  IconButton, 
  Grid
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import PersonIcon from '@material-ui/icons/Person';
import { connect, ConnectedProps } from 'react-redux';

import UserMenu from "./UserMenu";
import {
  User
} from "../../models";
import API from "../../utilities/smart_api";
import { APIClass } from "../../utilities/smart_api_class";


interface AppState {
  loginUser: User | null,
  menuOpen: boolean
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
  loginUser: state.app.loginUser
})

const mapDispatch = {
  login: (user: User) => ({ type: 'SET', dataType: 'loginUser', payload: user }),
  logout: () => ({ type: 'SET', dataType: 'loginUser', payload: {} }),
  toggleLogin: () => ({ type: 'TOGGLE_LOGIN' }),
  toggleMenu: () => ({ type: 'TOGGLE_MENU' }),
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & { }

export interface State { }

class NavBar extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  render() {
    return (
      <AppBar position="static">
        <Toolbar>
          <Grid container spacing={0}>
            <Grid item xs>
              <IconButton
                style={{ color: "white" }}
                aria-label="Menu"
                onClick={_ => {
                  this.props.toggleMenu();
                }}
              >
                <MenuIcon />
              </IconButton>
            </Grid>
            <Grid item xs>
              { this.props.loginUser === null ? 
                <span style={{cursor: "pointer"}} 
                  onClick={_ => {
                    this.props.toggleLogin();
                  }}
                  className="float-right blue whiteFont">
                  <ListItem className="curvedButton float-right">
                    <PersonIcon/>
                    <ListItemText primary=" Login/Register"/>
                  </ListItem>
                </span>
              : 
                <UserMenu />
              }
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    );
  }
}

export default connector(NavBar);
