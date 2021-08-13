import React, { Component } from "react";
import "../../App.css";
import Skull from "../../assets/img/Skull.png";
import {
  List,
  ListItem,
  ListItemText,
  // Icon,
  Divider,
} from "@material-ui/core";
import { NavLink } from "react-router-dom";
import { connect, ConnectedProps } from 'react-redux';
import { User } from "../../models";

import Home from "@material-ui/icons/Home";

import menuRoutes from "./routes";

import API from "../../utilities/smart_api";
import { APIClass } from "../../utilities/smart_api_class";


interface AppState {
  loginUser: User | null;
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
  loginUser: state.app.loginUser
})

const mapDispatch = {
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  logoText: string
}

export interface State {
}
class Sidebar extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  brand() {
    return (
      <NavLink to={`/beyond/`} className="BlackTextButton" activeClassName="active">
        <ListItem style={{ height: "55px" }}>
          <img src={Skull} alt="logo" className="Skull-logo" />
          <ListItemText primary={this.props.logoText} />
        </ListItem>
      </NavLink>
    );
  }

  user_links() {
    if (this.props.loginUser) {
      return (
        menuRoutes.user.sort((a, b) => { return a.name.localeCompare(b.name) }).map((prop, key) => 
          <ListItem key={key} className="curvedButton">
            <NavLink to={prop.path} className="MyButton" activeClassName="active">
              <ListItem button>
                {/* { prop.icon === undefined ?
                  <span></span>
                : typeof prop.icon === "string" ? (
                  <Icon className="marginLeft">{prop.icon}</Icon>
                ) : (
                  <prop.icon className="marginLeft" />
                )}
                &nbsp; */}
                <ListItemText primary={prop.name} className="marginLeft" />
              </ListItem>
            </NavLink>
          </ListItem>
        )
      );
    } else return null;
  }

  admin_links() {
    if (this.props.loginUser && this.props.loginUser.admin) {
      return (
        menuRoutes.admin.sort((a, b) => { return a.name.localeCompare(b.name) }).map((prop, key) => 
          <ListItem key={key} className="curvedButton">
            <NavLink to={prop.path} className="MyButton" activeClassName="active">
              <ListItem button>
                {/* { prop.icon === undefined ?
                  <span></span>
                : typeof prop.icon === "string" ? (
                  <Icon className="marginLeft">{prop.icon}</Icon>
                ) : (
                  <prop.icon className="marginLeft" />
                )}
                &nbsp; */}
                <ListItemText primary={prop.name} className="marginLeft" />
              </ListItem>
            </NavLink>
          </ListItem>
        )
      );
    } else return null;
  }

  render() {
    return (
      <List>
        {this.brand()}
        
        <ListItem className="curvedButton">
          <NavLink to="/beyond/" className="MyButton" activeClassName="active">
            <ListItem button>
              <Home />
              <ListItemText primary="Home" className="marginLeft" />
            </ListItem>
          </NavLink>
        </ListItem>
        <Divider light />
        {this.user_links()}
        {this.admin_links()}
      </List>
    );
  }
}

export default connector(Sidebar);
