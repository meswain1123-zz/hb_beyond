import React, { Component } from "react";
import "../../App.css";
// import logo from "../../logo.svg";
// import logo from "../../assets/img/ANB.png";
import Skull from "../../assets/img/Skull.png";
import {
  // Button,
  // Grid,
  List,
  ListItem,
  ListItemText,
  Icon,
  Divider,
  // FormControl,
  // InputLabel,
  // OutlinedInput,
  // Fab,
  // Tooltip
} from "@material-ui/core";
// import { Add, Star, Search } from "@material-ui/icons";
// import StarBorderIcon from '@material-ui/icons/StarBorder';
import { NavLink } from "react-router-dom";
import { connect, ConnectedProps } from 'react-redux';

import menuRoutes from "./routes";
import API from "../../utilities/smart_api";
import { APIClass } from "../../utilities/smart_api_class";


interface AppState {
  // loginUser: User | null,
  // loginOpen: boolean
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
  // loginUser: state.app.loginUser,
  // loginOpen: state.app.loginOpen
})

const mapDispatch = {
  // login: (user: User) => ({ type: 'SET', dataType: 'loginUser', payload: user }),
  // toggleLogin: () => ({ type: 'TOGGLE_LOGIN' })
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  logoText: string
}

export interface State {
  // email: string;
  // password: string;
  // processing: boolean;
}
class Sidebar extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      // browse: false,
      // Filter: ""
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
    // this.api.getWorlds(true).then(res => {
    //   this.props.setPublicWorlds(res.publicWorlds.worlds);
    //   this.props.setTemplates(res.templates.templates);
    //   this.props.setAllUsers(res.allUsers);
      
    //   if (this.props.user !== null) {
    //     if (res.userWorlds.worlds === undefined) {
    //       this.props.logout();
    //     } else {
    //       this.props.setWorlds(res.userWorlds.worlds);
    //     }
    //   }
    // });
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
