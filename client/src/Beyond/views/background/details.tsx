import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Redirect } from "react-router-dom";

import {
  Grid, 
} from "@material-ui/core";

import { 
  Background, ModelBase
} from "../../models";

import ObjectDetails from "../../components/model_inputs/ObjectDetails";

import API from "../../utilities/smart_api";
import { APIClass } from "../../utilities/smart_api_class";


interface AppState {
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
  obj: Background;
  loading: boolean;
}

class BackgroundDetails extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirectTo: null,
      obj: new Background(),
      loading: false
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
    let { id } = this.props.match.params;
    if (id !== undefined && this.state.obj._id !== id) {
      this.load_object(id);
    }
  }

  // Loads the editing Background into state
  load_object(id: string) {
    this.setState({ loading: true }, () => {
      this.api.getFullObject("background", id).then((res: ModelBase | null) => {
        if (res) {
          this.setState({ obj: (res as Background).clone(), loading: false });
        }
      });
    });
  }

  render() {
    if (this.state.loading || this.state.obj === null) {
      return <span>Loading</span>;
    } else if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else { 
      return (
        <Grid container spacing={1} direction="column">
          <Grid item>
            <ObjectDetails 
              obj={this.state.obj}
              data_type="background"
              type_label="Backgrounds"
            />
          </Grid>
        </Grid>
      );
    }
  }
}

export default connector(BackgroundDetails);
