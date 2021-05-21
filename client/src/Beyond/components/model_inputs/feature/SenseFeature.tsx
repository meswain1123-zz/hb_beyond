import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
  Grid, 
} from "@material-ui/core";

import { 
  SenseFeature, 
  Sense
} from "../../../models";

import StringBox from "../../input/StringBox";
import SelectObjectBox from "../../input/SelectObjectBox";

import API from "../../../utilities/smart_api";
import { APIClass } from "../../../utilities/smart_api_class";


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
  obj: SenseFeature;
  onChange: (changed: SenseFeature) => void; 
}

export interface State { 
  senses: Sense[] | null;
  loading: boolean;
}

class SenseFeatureInput extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      senses: null,
      loading: false
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
    this.load();
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects("sense").then((res: any) => {
        if (res && !res.error) {
          const senses: Sense[] = res;
          this.setState({ senses, loading: false });
        }
      });
    });
  }

  render() {
    if (this.state.loading || this.state.senses === null) {
      return <span>Loading</span>;
    } 
    else {
      return (
        <Grid container spacing={1} direction="column">
          <Grid item>
            <SelectObjectBox
              name="Sense"
              type="sense"
              value={this.props.obj.sense_id}
              onChange={(id: string) => {
                this.props.obj.sense_id = id;
                this.props.onChange(this.props.obj);
              }}
            />
          </Grid>
          <Grid item>
            <StringBox
              name="Range"
              value={`${this.props.obj.range}`}
              type="number"
              onBlur={(changed: string) => {
                this.props.obj.range = +changed;
                this.props.onChange(this.props.obj);
              }}
            />
          </Grid>
        </Grid>
      );
    }
  }
}

export default connector(SenseFeatureInput);
