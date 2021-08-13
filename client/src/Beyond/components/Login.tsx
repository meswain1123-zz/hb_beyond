
import React, { Component } from "react";
import { connect, ConnectedProps } from 'react-redux';
import {
  FormControl,
  OutlinedInput,
  InputLabel,
  Button, Grid
} from "@material-ui/core";
import { User } from "../models";
import API from "../utilities/smart_api";
import { APIClass } from "../utilities/smart_api_class";


interface AppState {
  loginUser: User | null;
  loginOpen: boolean;
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
  loginUser: state.app.loginUser,
  loginOpen: state.app.loginOpen
})

const mapDispatch = {
  login: (user: User) => ({ type: 'SET', dataType: 'loginUser', payload: user }),
  toggleLogin: () => ({ type: 'TOGGLE_LOGIN' })
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
}

export interface State {
  email: string;
  password: string;
  username: string;
  confirm_password: string;
  processing: boolean;
  registering: boolean;
}
class Login extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      username: "",
      confirm_password: "",
      processing: false,
      registering: false
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {}

  renderHeader = () => {
    return (
      <div key="header"> 
        Welcome Adventurer!  Please login
      </div>
    );
  };

  login = () => {
    this.setState({
      processing: true
    }, () => {
      if (this.state.registering) {
        const userObj = {
          username: this.state.username,
          email: this.state.email,
          password: this.state.password
        };
        this.api.register(userObj).then((res: any) => {
          if (res !== undefined && res.error === undefined) {
            this.registerMode();
          } else {
            console.log(res);
          }
        });
      } else {
        const userObj = {
          email: this.state.email,
          password: this.state.password
        };
        this.api.login(userObj, true).then((res: any) => {
          if (res !== undefined && res.error === undefined && !res.message) {
            const newUser: User = new User(res);
            this.props.login(newUser);
            this.setState({ processing: false }, () => {
              this.props.toggleLogin();
            });
          } else {
            console.log(res);
          }
        });
      }
    });
  }

  registerMode = () => {
    this.setState({
      registering: !this.state.registering
    });
  }

  renderMain = () => {
    return (
      <Grid key="main" container spacing={1} direction="column">
        { this.state.registering && 
          <Grid item>
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="text_field_login_username">Username</InputLabel>
                <OutlinedInput
                  id={`text_field_login_username`}
                  name={`text_field_login_username`}
                  type="text"
                  autoComplete="Off"
                  // error={this.state.error !== ""}
                  value={this.state.username}
                  onChange={e => {
                    this.setState({ username: e.target.value });
                  }}
                  labelWidth={70}
                  fullWidth
                />
            </FormControl>
          </Grid>
        }
        <Grid item>
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="text_field_login_email">Email</InputLabel>
              <OutlinedInput
                id={`text_field_login_email`}
                name={`text_field_login_email`}
                type="text"
                autoComplete="Off"
                // error={this.state.error !== ""}
                value={this.state.email}
                onChange={e => {
                  this.setState({ email: e.target.value });
                }}
                onKeyDown={e => {
                  if (e.key === "Enter" && !this.state.registering && !this.state.processing && this.state.email !== "" && this.state.password !== "") {
                    this.login();
                  }
                }}
                labelWidth={40}
                fullWidth
              />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="text_field_login_password">Password</InputLabel>
              <OutlinedInput
                id={`text_field_login_password`}
                name={`text_field_login_password`}
                type="password"
                autoComplete="Off"
                // error={this.state.error !== ""}
                value={this.state.password}
                onChange={e => {
                  this.setState({ password: e.target.value });
                }}
                onKeyDown={e => {
                  if (e.key === "Enter" && !this.state.registering && !this.state.processing && this.state.email !== "" && this.state.password !== "") {
                    this.login();
                  }
                }}
                labelWidth={70}
                fullWidth
              />
          </FormControl>
        </Grid>
        { this.state.registering && 
          <Grid item>
            <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="text_field_login_confirm_password">Confirm Password</InputLabel>
              <OutlinedInput
                id={`text_field_login_confirm_password`}
                name={`text_field_login_confirm_password`}
                type="password"
                autoComplete="Off"
                // error={this.state.error !== ""}
                value={this.state.confirm_password}
                onChange={e => {
                  this.setState({ confirm_password: e.target.value });
                }}
                labelWidth={140}
                fullWidth
              />
          </FormControl>
          </Grid>
        }
        <Grid item>
          <Button disabled={ this.state.processing || this.state.email === "" || this.state.password === "" || (this.state.registering && (this.state.username === "" || this.state.password !== this.state.confirm_password)) } 
            onClick={this.login} 
            variant="contained" color="primary">
            Submit
          </Button>
        </Grid>
        <Grid item>
          <Button 
            onClick={this.registerMode} 
            variant="contained" color="primary">
            { this.state.registering ? "Cancel" : "Register" }
          </Button>
        </Grid>
      </Grid>
    );
  };

  render() {
    return [
      this.renderHeader(),
      this.renderMain()
    ];
  }
}

export default connector(Login);
