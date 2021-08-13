
import React, { Component } from "react";
import "./assets/css/material-dashboard-react.css";
import {
  BrowserRouter as Router
} from "react-router-dom";
import { connect, ConnectedProps } from 'react-redux';
import NavBar from "./components/Navigation/NavBar";
import Sidebar from "./components/Navigation/Sidebar";
import MainPage from "./views/MainPage";
import { 
  Grid, 
  Box
} from "@material-ui/core";
import { User } from "./models";
import { Helmet } from 'react-helmet';
import "./assets/css/quill.snow.css";
import API from "./utilities/smart_api";
import { APIClass } from "./utilities/smart_api_class";

interface AppState {
  loginUser: User | null;
  menuOpen: boolean;
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
  loginUser: state.app.loginUser,
  menuOpen: state.app.menuOpen
})

const mapDispatch = {
  login: (user: User) => ({ type: 'SET', dataType: 'loginUser', payload: user }),
  toggleMenu: () => ({ type: 'TOGGLE_MENU' }),
  setHeight: (height: number) => ({ type: 'SET', dataType: 'height', payload: height }),
  setWidth: (width: number) => ({ type: 'SET', dataType: 'width', payload: width })
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & { }

interface State {
  version: string;
  width: number;
  innerWidth: number;
  marginLeft: number;
}

class AppLayout extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      version: "0",
      width: 0,
      innerWidth: 0,
      marginLeft: 220
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  props: any;

  componentDidMount() {
    if (!this.props.loginUser) {
      const userObjStr = localStorage.getItem("loginUser");
      if (userObjStr) {
        const userObj = JSON.parse(userObjStr);
        const user = userObj.body;
        this.api.login(user, true).then((res: any) => {
          if (res !== undefined && res.error === undefined && !res.message) {
            const newUser: User = new User(res);
            this.props.login(newUser);
          } else {
            console.log(res);
          }
        });
      }
    }
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  updateDimensions() {
    let w = window.innerWidth;
    this.props.setHeight(window.innerHeight);
    if (w >= 600) {
      w -= 200;
      this.props.setWidth(w);
    }
    else {
      this.props.setWidth(w);
    }
  }

  render() {
    return (
      <Router>
        <Helmet>
          <title>Homebrew Beyond</title>
        </Helmet>
        {this.props.menuOpen &&
          <Box display={{ xs: 'none', sm: 'inline' }} className="SidebarBeyond">
            <Sidebar logoText={"Homebrew Beyond"} />
          </Box>
        }
        <Grid container>
          <Grid item xs={12}
            style={{ 
              marginLeft: `${this.props.menuOpen ? this.state.marginLeft : 0}px`, 
              width: `${this.props.menuOpen ? this.state.width : this.state.innerWidth}px` 
            }}>
            <NavBar />
          </Grid>
          <Grid item xs={12}
            style={{ 
              marginLeft: `${this.props.menuOpen ? this.state.marginLeft + 10 : 10}px`, 
              width: `${this.props.menuOpen || !this.state.innerWidth ? this.state.width - 20 : this.state.innerWidth - 20}px`,
              marginRight: "10px",
              marginTop: "10px" 
            }}>
            <MainPage />
          </Grid>
        </Grid>
      </Router>
    );
  }
}

export default connector(AppLayout);
