import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  Menu, MenuItem,
  ListItem, ListItemText
} from '@material-ui/core';
import {
  Person
} from "@material-ui/icons";
import { User } from "../../models";


interface AppState {
  loginUser: User | null,
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
  loginUser: state.app.loginUser,
})

const mapDispatch = {
  logout: () => ({ type: 'SET', dataType: 'loginUser', payload: null }),
  toggleLogin: () => ({ type: 'TOGGLE_LOGIN' })
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
}

export interface State {
  email: string;
  password: string;
  processing: boolean;
  anchorEl: any;
  open: boolean;
}
class UserMenu extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      processing: false,
      anchorEl: null, 
      open: false
    };
  }

  render() {
    return (
      <span className="float-right blue whiteFont">
        <ListItem 
          aria-controls="user-menu" aria-haspopup="true"
          style={{cursor: "pointer"}} 
          onClick={(event: any) => {
            this.setState({
              anchorEl: event.currentTarget, open: true
            });
          }} 
          className="curvedButton float-right">
          <Person/>
          <ListItemText primary={` ${this.props.loginUser?.username}`}/>
        </ListItem>
        <Menu
          id="customized-menu"
          anchorEl={this.state.anchorEl}
          keepMounted
          open={Boolean(this.state.anchorEl)}
          onClose={() => {
            this.setState({
              anchorEl: null,
              open: false
            });
          }}
          elevation={0}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}>
          <MenuItem
            style={{
              color:"black"
            }} 
            onClick={_ => {
              this.props.logout();
              this.setState({
                anchorEl: null,
                open: false
              });
            }}>
            <ListItemText primary="Logout" />
          </MenuItem>
        </Menu>
      </span>
    );
  }
}

export default connector(UserMenu);
