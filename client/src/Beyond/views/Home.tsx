import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect, ConnectedProps } from 'react-redux';
import {
  Grid
} from "@material-ui/core";


interface AppState {
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
});

const mapDispatch = {
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
}
export interface State {
  version: string;
  redirectTo: string | null;
}
class HomePage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      version: "0",
      redirectTo: null
    };
  }

  componentDidMount() {}

  render() {
    if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else {
      return (
        <div>
          <h3>Homebrew Beyond</h3>
          <p>
            This is my own version of D&amp;D Beyond.
          </p>
          <p>
            It will have pages and controls for Admins to do
            CRUD operations for things like Skills, Abilities, etc.
            One of the more interesting things, is I will make 
            it able to support different games that use the same basic
            ruleset.  The different games will be able to have different
            sets of things.  Different games will be able to be created
            using existing games as templates 
            (leaving out characters and campaigns).
          </p>
          <p>
            DMs will be able to define campaigns which players can 
            add their characters to.
          </p>
          <p>
            Other players will be able to create and modify their 
            characters, as well as join campaigns.
          </p>
          <Grid container spacing={1} direction="column">
            <Grid item>
              To do:
            </Grid>
          </Grid>
        </div>
      );
    }
  }
}

export default connector(HomePage);
