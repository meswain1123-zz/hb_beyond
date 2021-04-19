import React, { Component } from "react";
import "../../App.css";
import Skull from "../../assets/img/Skull.png";
import {
  List,
  ListItem,
  ListItemText,
  Icon,
  Divider,
} from "@material-ui/core";
import { NavLink } from "react-router-dom";
import { connect, ConnectedProps } from 'react-redux';

import menuRoutes from "./routes";
import API from "../../utilities/smart_api";
import { APIClass } from "../../utilities/smart_api_class";


interface AppState {
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
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

  links() {
    return (
      menuRoutes.admin.map((prop, key) => 
        <ListItem key={key} className="curvedButton">
          <NavLink to={prop.path} className="MyButton" activeClassName="active">
            <ListItem button>
              { prop.icon === undefined ?
                <span></span>
              : typeof prop.icon === "string" ? (
                <Icon className="marginLeft">{prop.icon}</Icon>
              ) : (
                <prop.icon className="marginLeft" />
              )}
              &nbsp;
              <ListItemText primary={prop.name} className="marginLeft" />
            </ListItem>
          </NavLink>
        </ListItem>
      )
    );
  }

  render() {
    return (
      <List>
        {this.brand()}
        <Divider light />
        {this.links()}
      </List>
    );
  }
}

export default connector(Sidebar);
